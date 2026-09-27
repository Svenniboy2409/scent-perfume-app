// Arranges bottles on shelves for the Shelfie view.
//
// Every bottle's size comes from its photo silhouette (see data/bottleShapes.js):
// the height:width ratio of the cut-out decides how tall it stands, so a slim
// Kouros towers over a squat Lost Cherry. Shelves then get two rows:
//
//   • a back row, set a little deeper on the plank (slightly smaller and higher,
//     for perspective), arranged as a pyramid with the tallest bottle centred;
//   • a front row, whose bottles stand in the gaps between back bottles.
//
// A bottle may only stand in front of others if it's short enough that the back
// bottles' caps and shoulders stay visible (MIN_VISIBLE). The shortest bottles
// are paired with the tallest, and each shelf tries every back-row size and
// keeps the arrangement that fits the most bottles — preferring more layering
// on a tie. Bottles are then spread evenly over the shelves.

export const BACK_SCALE = 0.86 // back row is drawn smaller: it stands further away
export const BACK_LIFT = 13 // …and higher up on the plank's top surface (px)
const GAP = 6 // minimum space between neighbouring back-row bottles (px)
const MAX_GAP = 30
const MIN_VISIBLE = 0.25 // share of a back bottle that must show above a front one
const MAX_FRONT_OVERLAP = 0.25 // front bottles may only just touch each other

/** Tallest front bottle allowed before a back bottle of height `h`. */
export function frontLimit(h) {
  const top = BACK_LIFT + h * BACK_SCALE
  return top - MIN_VISIBLE * h * BACK_SCALE
}

// Tallest in the middle, then alternating outwards: [3, 1, 0, 2, 4].
function pyramid(sortedDesc) {
  const row = []
  sortedDesc.forEach((b, i) => (i % 2 === 0 ? row.push(b) : row.unshift(b)))
  return row
}

function placeShelf(backs, rest, width, maxFront = Infinity) {
  const row = pyramid(backs)
  const bottlesWidth = row.reduce((s, b) => s + b.w * BACK_SCALE, 0)
  // On roomy shelves the back row spreads out a little (up to MAX_GAP), which
  // also leaves front bottles more of a gap to stand in.
  const gap =
    row.length > 1
      ? Math.min(MAX_GAP, Math.max(GAP, (width * 0.8 - bottlesWidth) / (row.length - 1)))
      : 0
  const rowWidth = bottlesWidth + gap * (row.length - 1)
  let x = (width - rowWidth) / 2
  const back = row.map((b) => {
    const w = b.w * BACK_SCALE
    const placed = { ...b, row: 'back', x, w, h: b.h * BACK_SCALE, bottom: BACK_LIFT }
    x += w + gap
    return placed
  })

  // Candidate spots for front bottles: the gaps between two back bottles
  // (best — they partly hide both), then half in front of the outer bottles.
  const slots = []
  for (let i = 0; i < back.length - 1; i++) {
    const a = back[i], b = back[i + 1]
    slots.push({
      center: (a.x + a.w + b.x) / 2,
      limit: Math.min(frontLimit(row[i].h), frontLimit(row[i + 1].h)),
      inner: true,
    })
  }
  if (back.length > 0) {
    const first = back[0], last = back[back.length - 1]
    slots.push({ center: first.x + first.w * 0.1, limit: frontLimit(row[0].h), inner: false })
    slots.push({
      center: last.x + last.w * 0.9,
      limit: frontLimit(row[row.length - 1].h),
      inner: false,
    })
  }
  slots.sort((a, b) => b.inner - a.inner || b.limit - a.limit)

  const front = []
  const remaining = [...rest]
  for (const slot of slots) {
    if (front.length >= maxFront) break
    // Shortest candidates first: pairing the smallest bottles with the tallest
    // ones leaves medium bottles for the back rows of lower shelves, so every
    // shelf gets its own tall-behind-short layering.
    const idx = remaining.findLastIndex((b) => {
      if (b.h > slot.limit || b.w > width) return false
      const left = Math.min(Math.max(slot.center - b.w / 2, 0), width - b.w)
      return front.every((f) => {
        const overlap = Math.min(left + b.w, f.x + f.w) - Math.max(left, f.x)
        return overlap <= MAX_FRONT_OVERLAP * Math.min(b.w, f.w)
      })
    })
    if (idx < 0) continue
    const b = remaining.splice(idx, 1)[0]
    const left = Math.min(Math.max(slot.center - b.w / 2, 0), width - b.w)
    front.push({ ...b, row: 'front', x: left, bottom: 0 })
  }
  return { back, front, remaining }
}

function fill(bottles, width, perShelf) {
  let pool = [...bottles].sort((a, b) => b.h - a.h)
  const shelves = []

  while (pool.length > 0) {
    // How many of the tallest bottles fit side by side in a back row?
    let maxBacks = 0
    let used = 0
    for (const b of pool) {
      const need = b.w * BACK_SCALE + (maxBacks > 0 ? GAP : 0)
      if (maxBacks > 0 && (used + need > width || maxBacks >= perShelf)) break
      used += need
      maxBacks++
    }

    // Try every back-row size; keep the one that shelves the most bottles,
    // preferring fewer backs (= more layering) on a tie.
    let best = null
    for (let n = 1; n <= maxBacks; n++) {
      const result = placeShelf(pool.slice(0, n), pool.slice(n), width, perShelf - n)
      const count = result.back.length + result.front.length
      if (!best || count > best.count) best = { ...result, count }
    }

    const placed = [...best.back, ...best.front]
    const height = Math.max(...placed.map((b) => b.bottom + b.h))
    shelves.push({ bottles: placed, height })
    pool = best.remaining
  }
  return shelves
}

/**
 * @param bottles  [{ id, h, w, … }] — natural (front-row) size in px
 * @param width    usable shelf width in px
 * @returns [{ bottles: [...placed], height }] — one entry per shelf, placed
 *          bottles carry x (left), bottom, w, h and row ('back' | 'front').
 */
export function layoutShelves(bottles, width) {
  const packed = fill(bottles, width, Infinity)
  if (packed.length < 2) return packed
  // Spread the bottles evenly over the same number of shelves, so the last
  // shelf isn't left half empty.
  const even = fill(bottles, width, Math.ceil(bottles.length / packed.length))
  return even.length === packed.length ? even : packed
}
