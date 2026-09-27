"""Measures an exact cut-out mask for every perfume photo.

For each Fragrantica product photo (a bottle on a white backdrop) this writes
public/bottle-masks/<id>.png: a mask the size of the bottle's bounding box
whose alpha says, per photo pixel, how much of it is bottle. The Shelfie view
lays it over the photo (CSS mask-image), so every bottle is cut out along its
real outline, however round. Only the masks are stored — the photos themselves
keep loading from Fragrantica. The bounding boxes go to
src/data/bottleMasks.js.

How a mask is made:
  1. Background = the near-white pixels connected to the photo's border (a
     flood fill), so white labels and caps inside the bottle stay. The flood
     may not pass the coarse silhouette from silhouettes.js shrunk by 8px, so
     a white label or clear glass reaching the bottle's edge is at most
     nibbled at, never carved out. Nor may it cross the bottle's outline (a
     brightness step), which keeps white and silver bottles whole. Where a
     white bottle's edge vanishes entirely, a symmetric bottle's missing
     chunk is filled from its mirrored other half.
  2. Along the outline, alpha follows how far a pixel is from white, so the
     light anti-aliased pixels that are half bottle, half backdrop fade out.
  3. The mask is then eroded by one photo pixel, which removes the last
     whitish fringe row entirely.

Run from the repo root: python scripts/bottle-masks/make_masks.py
(needs node, numpy, scipy and Pillow).
"""

import io
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "bottle-masks"
DATA_FILE = ROOT / "src" / "data" / "bottleMasks.js"

BACKDROP = 0.025  # backdrop white: every channel within 2.5% of white (clear glass is a touch darker)
EDGE_SOFT = 0.25  # along the outline, alpha reaches 1 at this distance from white
EDGE_BAND = 5  # px from the backdrop in which alpha is softened
OUTLINE = 0.05  # brightness step that counts as the bottle's outline
OUTLINE_GAP = 2  # gaps in the outline up to twice this (px) are closed
MIN_ALPHA = 0.04
CORE_INSET = 8  # px the coarse silhouette is shrunk by to be surely bottle


def silhouette_core(code, width, height):
    """Rasterises a silhouettes.js entry, keeping each band to the width it
    shares with its neighbours, then shrinks it by CORE_INSET."""
    box, bands = code.split("|")
    x0, y0, x1, y1 = (int(v) / 1000 for v in box.split(","))
    bands = [[tuple(map(int, run.split("-"))) for run in band.split(",")] for band in bands.split(";")]
    left, top = x0 * width, y0 * height
    box_w, band_h = (x1 - x0) * width, (y1 - y0) * height / len(bands)
    core = np.zeros((height, width), bool)

    def shared(run, neighbours):
        a, b = run
        overlaps = [r for r in neighbours if r[0] < b and r[1] > a]
        if not overlaps:
            return None
        return max(a, min(r[0] for r in overlaps)), min(b, max(r[1] for r in overlaps))

    for k, runs in enumerate(bands):
        for run in runs:
            a, b = run
            for neighbours in (bands[k - 1] if k > 0 else None, bands[k + 1] if k + 1 < len(bands) else None):
                if neighbours is None:
                    continue
                edge = shared((a, b), neighbours)
                if edge is None:
                    a = b
                    break
                a, b = max(a, edge[0]), min(b, edge[1])
            if b <= a:
                continue
            ys = slice(int(round(top + k * band_h)), int(round(top + (k + 1) * band_h)))
            xs = slice(int(np.ceil(left + a / 100 * box_w)), int(left + b / 100 * box_w))
            core[ys, xs] = True
    return ndimage.binary_erosion(core, iterations=CORE_INSET)


def fetch(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/128.0 Safari/537.36",
            "Referer": "https://www.fragrantica.com/",
        },
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001 — retried, then reported
            if attempt == 3:
                raise
            print(f"  retry after {error}", file=sys.stderr)
            time.sleep(2 * (attempt + 1))


MIRRORED = []  # pixels filled from the mirror image, per call that filled any


def fill_from_mirror(alpha):
    """Where a white bottle's edge vanishes into the white backdrop, the flood
    bites a chunk out of it. Most bottles are symmetric: if this one is,
    apart from such a bite, fill the bite from the mirrored other half."""
    solid = alpha > 0.5
    rows = np.nonzero(solid.any(axis=1))[0]
    if len(rows) == 0:
        return alpha
    lefts, rights = [], []
    for y in rows:
        xs = np.nonzero(solid[y])[0]
        lefts.append(xs[0])
        rights.append(xs[-1])
    lefts, rights = np.array(lefts), np.array(rights)
    widths = rights - lefts
    axis = np.median(((lefts + rights) / 2)[widths >= widths.max() * 0.5])
    # Symmetric: on most rows both sides are equally far from the axis (a bite
    # only affects some rows, so the median ignores it).
    skew = np.median(np.abs((axis - lefts) - (rights - axis)))
    if skew > widths.max() * 0.03:
        return alpha
    xs = np.arange(alpha.shape[1])
    mirror_x = np.round(2 * axis - xs).astype(int)
    valid = (mirror_x >= 0) & (mirror_x < alpha.shape[1])
    mirrored = np.zeros_like(solid)
    mirrored[:, valid] = solid[:, mirror_x[valid]]
    # Thin slivers are just lighting or a slight tilt; only real bites count.
    bite = ndimage.binary_opening(mirrored & ~solid, iterations=3)
    labels, count = ndimage.label(bite)
    if count == 0:
        return alpha
    sizes = ndimage.sum(bite, labels, range(1, count + 1))
    big = np.isin(labels, np.nonzero(sizes >= solid.sum() * 0.01)[0] + 1)
    if not big.any():
        return alpha
    # Grow the fill 1px so it meets the rest of the bottle seamlessly, but
    # never past the mirrored outline.
    big = ndimage.binary_dilation(big, iterations=1) & mirrored
    MIRRORED.append(int(big.sum()))
    return np.maximum(alpha, big.astype(float))


def make_mask(rgb, core=None):
    """rgb: H×W×3 floats in 0..1 → H×W alpha in 0..1. `core`: H×W bool of
    pixels that are surely bottle."""
    # Distance from white: how far the darkest channel is from 1.
    dist = 1.0 - rgb.min(axis=2)
    near_white = dist < BACKDROP
    if core is not None:
        near_white &= ~core
    # A white or silver bottle is as white as the backdrop; what separates
    # them is the thin outline around the bottle. The flood may not cross it,
    # nor slip through small gaps in it.
    lum = rgb.mean(axis=2)
    step = np.hypot(ndimage.sobel(lum, 0), ndimage.sobel(lum, 1)) / 4
    outline = ndimage.binary_dilation(step > OUTLINE, iterations=OUTLINE_GAP)
    near_white &= ~outline

    labels, _ = ndimage.label(near_white)
    border = np.unique(
        np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    )
    border = border[border > 0]
    backdrop = np.isin(labels, border)

    alpha = (~backdrop).astype(float)
    # Soften the pixels near the backdrop by how white they are.
    near = ndimage.distance_transform_edt(~backdrop) <= EDGE_BAND
    soft = np.clip((dist - BACKDROP) / (EDGE_SOFT - BACKDROP), 0, 1)
    alpha = np.where(near & ~backdrop, soft, alpha)

    alpha = fill_from_mirror(alpha)

    # Smooth the outline a touch (no ragged steps), then drop the outermost
    # pixel row: whatever is left of the fringe goes.
    alpha = ndimage.gaussian_filter(alpha, 0.5)
    alpha = ndimage.grey_erosion(alpha, size=(3, 3))
    # Specks (dust, stray shadow pixels) away from the bottle.
    solid = alpha > 0.5
    labels, count = ndimage.label(solid)
    if count > 1:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        keep = np.isin(labels, np.nonzero(sizes >= max(40, sizes.max() * 0.004))[0] + 1)
        near_keep = ndimage.binary_dilation(keep, iterations=3)
        alpha = np.where(near_keep, alpha, 0)
    alpha[alpha < MIN_ALPHA] = 0
    return alpha


def edge_report(rgb, alpha):
    """Opaque pixels on the outline that are still whitish — what would show
    as a light edge on the dark shelf. Returns (count, outline length)."""
    solid = alpha > 0.35
    outline = solid & ~ndimage.binary_erosion(solid, iterations=2)
    whitish = rgb.min(axis=2) > 0.82
    return int((outline & whitish).sum()), int(outline.sum())


def preview(rgb, alpha, path):
    """The cut-out on the shelf's wall colour, 2× — for checking by eye."""
    wall = np.array([0.23, 0.16, 0.12])
    out = rgb * alpha[..., None] + wall * (1 - alpha[..., None])
    image = Image.fromarray((out * 255).round().astype(np.uint8))
    image.resize((image.width * 2, image.height * 2), Image.NEAREST).save(path)


def main():
    photos = json.loads(
        subprocess.check_output(
            ["node", str(ROOT / "scripts" / "bottle-masks" / "list-photos.mjs")], text=True
        )
    )
    args = sys.argv[1:]
    preview_dir = None
    if "--preview" in args:
        i = args.index("--preview")
        preview_dir = Path(args[i + 1])
        preview_dir.mkdir(parents=True, exist_ok=True)
        del args[i : i + 2]
    dump = []
    if "--dump" in args:
        i = args.index("--dump")
        dump = args[i + 1].split(",")
        del args[i : i + 2]
    only = set(args)
    reports = []
    dumped = []
    mirrored_ids = []
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    boxes = {}
    failed = []
    for i, (pid, photo) in enumerate(sorted(photos.items())):
        url = photo["url"]
        if only and pid not in only:
            continue
        try:
            image = Image.open(io.BytesIO(fetch(url))).convert("RGB")
        except Exception as error:  # noqa: BLE001
            print(f"{pid}: could not load {url}: {error}", file=sys.stderr)
            failed.append(pid)
            continue
        rgb = np.asarray(image, dtype=float) / 255.0
        core = None
        if photo["silhouette"]:
            core = silhouette_core(photo["silhouette"], image.width, image.height)
        before = len(MIRRORED)
        alpha = make_mask(rgb, core)
        if len(MIRRORED) > before:
            print(f"{pid}: filled {MIRRORED[-1]} px from the mirror image")
            mirrored_ids.append(pid)
        ys, xs = np.nonzero(alpha)
        if len(xs) == 0:
            print(f"{pid}: nothing found", file=sys.stderr)
            failed.append(pid)
            continue
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        crop = (alpha[y0:y1, x0:x1] * 255).round().astype(np.uint8)
        # Black with the mask as alpha: tiny PNGs, used as alpha masks.
        mask = Image.merge("LA", (Image.new("L", (crop.shape[1], crop.shape[0]), 0), Image.fromarray(crop)))
        mask.save(OUT_DIR / f"{pid}.png", optimize=True)
        boxes[pid] = [int(x0), int(y0), int(x1), int(y1), image.width, image.height]
        white, length = edge_report(rgb, alpha)
        reports.append((white / max(length, 1), white, pid))
        if pid in dump or (dump and pid in mirrored_ids):
            wall = np.array([0.23, 0.16, 0.12])
            out = rgb * alpha[..., None] + wall * (1 - alpha[..., None])
            crop = out[max(0, y0 - 4) : y1 + 4, max(0, x0 - 4) : x1 + 4]
            dumped.append(np.kron(crop, np.ones((2, 2, 1))))  # 2×, pixels kept sharp
        print(f"{i + 1}/{len(photos)} {pid} {boxes[pid]} whitish edge px: {white}/{length}")
        time.sleep(0.15)

    if only and DATA_FILE.exists():
        # Partial run: keep the boxes measured before.
        text = DATA_FILE.read_text()
        previous = json.loads(text[text.index("{") : text.rindex("}") + 1])
        boxes = {**previous, **boxes}

    lines = ",\n".join(f"  {json.dumps(k)}: {json.dumps(v)}" for k, v in sorted(boxes.items()))
    DATA_FILE.write_text(
        "// Cut-out masks measured from each perfume's Fragrantica photo\n"
        "// (generated by scripts/bottle-masks/make_masks.py — do not edit by hand).\n"
        "// Per perfume id: [x0, y0, x1, y1, photoWidth, photoHeight] — the bottle's\n"
        "// bounding box in photo pixels; the mask itself is public/bottle-masks/<id>.png.\n"
        f"export const BOTTLE_MASKS = {{\n{lines},\n}}\n"
    )
    if dumped:
        # The requested cut-outs side by side, at photo resolution.
        height = max(d.shape[0] for d in dumped)
        strip = np.concatenate(
            [np.pad(d, ((height - d.shape[0], 0), (0, 0), (0, 0)), constant_values=0.2) for d in dumped], axis=1
        )
        Image.fromarray((strip * 255).round().astype(np.uint8)).save(preview_dir / "strip.png")
    print(f"filled from the mirror image: {mirrored_ids}")
    print("most whitish outlines:")
    for share, white, pid in sorted(reports, reverse=True)[:25]:
        print(f"  {pid}: {white} px ({share:.1%})")
    print(f"done: {len(boxes)} masks, {len(failed)} failed {failed}")


if __name__ == "__main__":
    main()
