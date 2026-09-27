// Turns a measured silhouette (data/bottleShapes.js) into what the shelf needs:
// the bottle's proportions, a mask that cuts it out of the white photo
// background, and how to position the photo so only the bottle shows.

import { BOTTLE_SHAPES } from '../data/bottleShapes.js'

const PHOTO_W = 375
const PHOTO_H = 500
// The cut-out is made of two layers of the same photo (see PerfumeShelf):
//   • the core — the silhouette shrunk well inside the bottle, shown as is, so
//     white labels, caps and highlights inside the bottle are kept;
//   • the edge — the silhouette grown a little, where a filter turns the
//     photo's own white background pixels transparent. That edge follows the
//     real outline pixel for pixel, however round the bottle is.
const CORE_INSET = 4 // px
const EDGE_OUTSET = 3 // px

function parse(code) {
  const [boxPart, bandsPart] = code.split('|')
  const [x0, y0, x1, y1] = boxPart.split(',').map(Number)
  const bands = bandsPart
    .split(';')
    .map((band) => band.split(',').map((run) => run.split('-').map(Number)))
  return { x0, y0, x1, y1, bands }
}

const overlapping = (runs, [a, b]) => (runs ?? []).filter(([c, d]) => c < b && d > a)
const f = (n) => Math.round(n * 100) / 100

/**
 * SVG path tracing the silhouette at w × h px, shrunk inwards by `inset`
 * (a negative inset grows it). `strict` keeps each band to the width it shares
 * with both neighbours, so it never pokes past a curving edge.
 *
 * Each run of each band becomes a hexagon: its measured width at the middle of
 * the band, and at the band's top and bottom edge only the width it shares with
 * the neighbouring band. Sloped edges (shoulders, rounded caps, tapering
 * bodies) are thus followed with diagonals rather than stair steps, and every
 * step is cut on its inner side, so no white corners of the photo remain.
 */
function silhouettePath(shape, w, h, inset, strict = false) {
  const { bands } = shape
  const n = bands.length
  const bandH = h / n
  const parts = []
  bands.forEach((runs, k) => {
    const yTop = k * bandH
    const yBottom = (k + 1) * bandH
    for (const run of runs) {
      const above = overlapping(bands[k - 1], run)
      const below = overlapping(bands[k + 1], run)
      const [a, b] = run
      const edge = (neighbours) =>
        neighbours.length
          ? [Math.max(a, Math.min(...neighbours.map((r) => r[0]))), Math.min(b, Math.max(...neighbours.map((r) => r[1])))]
          : [a, b]
      const top = edge(above)
      const bottom = edge(below)
      // Only the silhouette's outer top/bottom edges are trimmed; between
      // bands the pieces overlap a hair so no seams show.
      const y0 = above.length ? yTop - 0.3 : yTop + inset
      const y1 = below.length ? yBottom + 0.3 : yBottom - inset
      if (y1 - y0 < 0.5) continue
      const span = ([l, r]) => {
        let left = (l / 100) * w + inset
        let right = (r / 100) * w - inset
        if (right < left) left = right = (left + right) / 2
        return [left, right]
      }
      const [tl, tr] = span(top)
      const [bl, br] = span(bottom)
      let [ml, mr] = span(run)
      if (strict) {
        ml = Math.max(ml, tl, bl)
        mr = Math.min(mr, tr, br)
      }
      if (mr - ml < 0.5) continue
      const ym = (yTop + yBottom) / 2
      parts.push(
        `M${f(tl)} ${f(y0)}L${f(tr)} ${f(y0)}L${f(mr)} ${f(ym)}L${f(br)} ${f(y1)}` +
          `L${f(bl)} ${f(y1)}L${f(ml)} ${f(ym)}Z`,
      )
    }
  })
  return parts.join('')
}

const svgUrl = (w, h, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}">${body}</svg>`,
  )}")`

/**
 * CSS mask images for a bottle drawn at w × h px (sizes are needed because the
 * insets are in pixels): `core` and `edge`, as described at the top.
 */
export function cutoutFor(shape, w, h) {
  return {
    core: svgUrl(w, h, `<path d="${silhouettePath(shape, w, h, CORE_INSET, true)}"/>`),
    edge: svgUrl(w, h, `<path d="${silhouettePath(shape, w, h, -EDGE_OUTSET)}"/>`),
  }
}

const cache = new Map()

/**
 * Silhouette info for a perfume id, or null when no photo was measured.
 * `aspect` is height ÷ width of the bottle itself (photo margins excluded).
 */
export function getBottleShape(id) {
  if (cache.has(id)) return cache.get(id)
  const code = BOTTLE_SHAPES[id]
  let shape = null
  if (code) {
    const { x0, y0, x1, y1, bands } = parse(code)
    const bw = x1 - x0
    const bh = y1 - y0
    shape = {
      aspect: (bh * PHOTO_H) / (bw * PHOTO_W),
      bands,
      // Photo size and offset relative to the bottle's box.
      image: {
        width: `${(1000 / bw) * 100}%`,
        height: `${(1000 / bh) * 100}%`,
        left: `${(-x0 / bw) * 100}%`,
        top: `${(-y0 / bh) * 100}%`,
      },
    }
  }
  cache.set(id, shape)
  return shape
}

// Typical 100 ml bottles run from squat (~1:1) to slim (~3:1). Taller-looking
// silhouettes stand taller, but never so much that the shelf gets silly.
export function bottleSize(aspect, scale = 1) {
  let h = Math.min(190, Math.max(84, 36 + 56 * aspect)) * scale
  let w = h / aspect
  const maxW = 128 * scale
  if (w > maxW) {
    w = maxW
    h = w * aspect
  }
  return { h: Math.round(h), w: Math.round(w) }
}
