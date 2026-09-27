// Turns a measured cut-out mask (data/bottleMasks.js, public/bottle-masks)
// into what the shelf needs: the bottle's proportions, the mask that cuts it
// out of the white photo background, and how to position the photo so only the
// bottle shows.

import { BOTTLE_MASKS } from '../data/bottleMasks.js'

const cache = new Map()

/**
 * Cut-out info for a perfume id, or null when no photo was measured.
 * `aspect` is height ÷ width of the bottle itself (photo margins excluded).
 */
export function getBottleShape(id) {
  if (cache.has(id)) return cache.get(id)
  const box = BOTTLE_MASKS[id]
  let shape = null
  if (box) {
    const [x0, y0, x1, y1, photoW, photoH] = box
    const bw = x1 - x0
    const bh = y1 - y0
    shape = {
      aspect: bh / bw,
      mask: `url("${import.meta.env.BASE_URL}bottle-masks/${id}.png")`,
      // Photo size and offset relative to the bottle's box.
      image: {
        width: `${(photoW / bw) * 100}%`,
        height: `${(photoH / bh) * 100}%`,
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
