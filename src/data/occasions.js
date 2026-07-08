// Use-scenario vocabulary. Seasons are kept separate from "occasions" so they
// can be filtered and displayed independently across the app.

// Non-season occasions — used for the occasion filter chips and the "Best For"
// section on the detail page.
export const OCCASIONS = ['Daily', 'Office', 'Evening', 'Date', 'Sport', 'Special']

export const GENDERS = ['Masculine', 'Feminine', 'Unisex']

// Per-gender emoji + color, so each gender is instantly recognisable
// wherever it's shown (filter chips, cards, detail page).
export const GENDER_META = {
  Masculine: { emoji: '♂', color: '#3f77b0' },
  Feminine: { emoji: '♀', color: '#c0506a' },
  Unisex: { emoji: '⚥', color: '#8a63b5' },
}

// Seasons in canonical display order (Spring → Summer → Fall → Winter).
// This order is used everywhere a perfume's seasons are shown.
export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter']

// Per-season emoji + primary color, plus a small palette of tonal shades
// (light → deep, all of the same hue) used to add lively variation across the
// decorative motifs, sun/moon and tags. `color` stays the single primary used
// where one color is needed (chips, edge glow).
export const SEASON_META = {
  Spring: { emoji: '🌸', color: '#4f9d69', shades: ['#86c48f', '#4f9d69', '#2f7d4e'] },
  Summer: { emoji: '☀️', color: '#e0902d', shades: ['#f0b95a', '#e0902d', '#b96d1c'] },
  Fall: { emoji: '🍂', color: '#c25a2b', shades: ['#e08a4a', '#c25a2b', '#8f3f1c'] },
  Winter: { emoji: '❄️', color: '#4a83c4', shades: ['#7db0e0', '#4a83c4', '#345f92'] },
}

// A perfume stores seasons and occasions together in its `occasions` array.
// These helpers pull them apart while preserving the canonical season order.
export function getSeasons(occasions = []) {
  return SEASONS.filter((s) => occasions.includes(s))
}

export function getOccasions(occasions = []) {
  return occasions.filter((o) => !SEASONS.includes(o))
}
