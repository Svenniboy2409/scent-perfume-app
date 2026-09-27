// Turns a measured silhouette (data/bottleShapes.js) into what the shelf needs:
// the bottle's proportions, a CSS clip path that cuts it out of the white photo
// background, and how to position the photo so only the bottle shows.

import { BOTTLE_SHAPES } from '../data/bottleShapes.js'

const PHOTO_W = 375
const PHOTO_H = 500
const EDGE_INSET = 1.4 // px — trims the light anti-aliased halo around the bottle

function parse(code) {
  const [boxPart, bandsPart] = code.split('|')
  const [x0, y0, x1, y1] = boxPart.split(',').map(Number)
  const bands = bandsPart
    .split(';')
    .map((band) => band.split(',').map((run) => run.split('-').map(Number)))
  return { x0, y0, x1, y1, bands }
}

/**
 * Clip path for a bottle drawn at w × h px: one rectangle per run per band,
 * which together trace the silhouette (including gaps like the space beside
 * a cap that sits off to one side). path() needs pixels, hence the size.
 */
export function clipPathFor(shape, w, h) {
  const n = shape.bands.length
  const bandH = h / n
  const parts = []
  shape.bands.forEach((runs, k) => {
    // Overlap bands by a hair so no seams show between them; trim the very
    // top and bottom like the sides.
    const top = (k === 0 ? EDGE_INSET : k * bandH).toFixed(1)
    const bottom = (k === n - 1 ? h - EDGE_INSET : Math.min(h, (k + 1) * bandH + 0.6)).toFixed(1)
    for (const [a, b] of runs) {
      let l = (a / 100) * w
      let r = (b / 100) * w
      if (r - l > 4 * EDGE_INSET) {
        l += EDGE_INSET
        r -= EDGE_INSET
      }
      parts.push(`M${l.toFixed(1)} ${top}H${r.toFixed(1)}V${bottom}H${l.toFixed(1)}Z`)
    }
  })
  return `path('${parts.join('')}')`
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
