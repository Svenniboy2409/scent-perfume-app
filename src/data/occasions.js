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

// Per-season emoji + color, so each season is instantly recognisable.
export const SEASON_META = {
  Spring: { emoji: '🌸', color: '#4f9d69' },
  Summer: { emoji: '☀️', color: '#e0902d' },
  Fall: { emoji: '🍂', color: '#c25a2b' },
  Winter: { emoji: '❄️', color: '#4a83c4' },
}

// A perfume stores seasons and occasions together in its `occasions` array.
// These helpers pull them apart while preserving the canonical season order.
export function getSeasons(occasions = []) {
  return SEASONS.filter((s) => occasions.includes(s))
}

export function getOccasions(occasions = []) {
  return occasions.filter((o) => !SEASONS.includes(o))
}
