// Resolves the list of image URLs to show for a perfume.
//
// Priority:
//   1. An explicit `images` array on the perfume (e.g. your own photos in
//      public/images/... or any full URLs). Use this to supply the ideal
//      three shots — bottle+box, bottle only, box only — in that order.
//   2. Otherwise, the main product photo from Fragrantica's CDN, looked up via
//      the perfume's Fragrantica ID (a clean white-background bottle shot).
//
// When nothing is available the UI falls back to a generated bottle
// placeholder, so cards always look intentional.

import { FRAGRANTICA_IDS } from '../data/fragranticaIds.js'

export function fragranticaImage(id) {
  return `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`
}

export function getPerfumeImages(perfume) {
  if (Array.isArray(perfume.images) && perfume.images.length > 0) {
    return perfume.images
  }
  const fid = perfume.fragranticaId ?? FRAGRANTICA_IDS[perfume.id]
  if (fid) {
    return [fragranticaImage(fid)]
  }
  return []
}
