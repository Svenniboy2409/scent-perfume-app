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
     flood fill), so white labels and caps inside the bottle stay. The coarse
     silhouette in silhouettes.js, shrunk a few pixels, marks what is surely
     bottle, so a white label or clear glass reaching the bottle's edge is
     never taken for backdrop.
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

BACKDROP = 0.075  # "near white": every channel within 7.5% of white
EDGE_SOFT = 0.30  # along the outline, alpha reaches 1 at this distance from white
EDGE_BAND = 3  # px from the backdrop in which alpha is softened
MIN_ALPHA = 0.04
CORE_INSET = 3  # px the coarse silhouette is shrunk by to be surely bottle


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


def make_mask(rgb, core=None):
    """rgb: H×W×3 floats in 0..1 → H×W alpha in 0..1. `core`: H×W bool of
    pixels that are surely bottle."""
    # Distance from white: how far the darkest channel is from 1.
    dist = 1.0 - rgb.min(axis=2)
    near_white = dist < BACKDROP
    if core is not None:
        near_white &= ~core

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

    # Drop the outermost pixel row: whatever is left of the fringe goes.
    alpha = ndimage.grey_erosion(alpha, size=(3, 3))
    # Specks (dust, stray shadow pixels) away from the bottle.
    solid = alpha > 0.5
    labels, count = ndimage.label(solid)
    if count > 1:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        keep = np.isin(labels, np.nonzero(sizes >= max(40, sizes.max() * 0.004))[0] + 1)
        near_keep = ndimage.binary_dilation(keep, iterations=3)
        alpha = np.where(near_keep, alpha, 0)
    if core is not None:
        alpha = np.maximum(alpha, core)
    alpha[alpha < MIN_ALPHA] = 0
    return alpha


def main():
    photos = json.loads(
        subprocess.check_output(
            ["node", str(ROOT / "scripts" / "bottle-masks" / "list-photos.mjs")], text=True
        )
    )
    only = set(sys.argv[1:])
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
        alpha = make_mask(rgb, core)
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
        print(f"{i + 1}/{len(photos)} {pid} {boxes[pid]}")
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
    print(f"done: {len(boxes)} masks, {len(failed)} failed {failed}")


if __name__ == "__main__":
    main()
