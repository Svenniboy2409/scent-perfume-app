import { useEffect, useRef, useState } from 'react'
import {
  Acorns,
  Blanket,
  Books,
  Candle,
  CatArt,
  Cushion,
  Drape,
  Garland,
  LEAF_COLOURS,
  Leaf,
  Lantern,
  Leaves,
  Mug,
  Pumpkins,
} from './decorArt.jsx'
import '../styles/shelf-decor.css'

// Autumn decorations for the Shelfie cabinet: a mug of coffee, pumpkins,
// books, a candle, a cushion, a folded blanket, acorns and fallen leaves on the
// shelves; a blanket or a leaf garland over a plank's edge when a shelf is
// full; a sleeping cat on top of the cabinet and the odd leaf drifting down.
// The drawings themselves live in decorArt.jsx; this file decides what goes
// where.

const ART = { mug: Mug, pumpkins: Pumpkins, books: Books, candle: Candle, cushion: Cushion, blanket: Blanket, acorns: Acorns, leaves: Leaves, lantern: Lantern, drape: Drape, garland: Garland }

// Natural size (px) and how far back each stands (lift: px up the plank's top
// face). Shelf items stand behind the bottles (z 1) and may tuck in behind
// the outermost ones by up to TUCK of their width, so they never hide a
// perfume; flat leaves lie at the very front.
const ITEMS = {
  mug: { w: 64, h: 56, lift: 1 },
  pumpkins: { w: 84, h: 54, lift: 0 },
  books: { w: 92, h: 70, lift: 3 },
  candle: { w: 42, h: 62, lift: 2 },
  cushion: { w: 86, h: 38, lift: 2 },
  blanket: { w: 84, h: 44, lift: 3 },
  acorns: { w: 58, h: 30, lift: 0 },
  leaves: { w: 70, h: 18, lift: -4, z: 3 },
  lantern: { w: 40, h: 74, lift: 2 },
}
const TUCK = 0.3
const SMALL = ['acorns', 'candle', 'leaves', 'lantern']

// Deterministic randomness, so a shelf keeps its decorations between visits.
function random(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Picks 1–2 decorations per shelf and places them in the free space beside
 * the bottles. A shelf never repeats what the shelf above it has; when there
 * is no room at all, a blanket or leaf garland goes over the plank's edge.
 * Returns per shelf { items: [{ type, x, w, h, lift, z }], edge: {type, side} | null }.
 */
export function planDecor(shelves, width, scale = 1) {
  let previous = []
  let garlands = 0
  const usage = {}
  return shelves.map((shelf, s) => {
    const rand = random(s * 7919 + 17)
    const left = Math.min(...shelf.bottles.map((b) => b.x))
    const right = Math.max(...shelf.bottles.map((b) => b.x + b.w))
    const room = { left: left - 6, right: width - right - 6 }
    const used = { left: 0, right: 0 }
    const wanted = rand() < 0.45 ? 2 : 1
    // Least-used items first (random among equals), so the whole cabinet
    // gets a good mix rather than the same few things again and again.
    const pool = Object.keys(ITEMS)
      .filter((type) => !previous.includes(type))
      .map((type) => ({ type, order: (usage[type] ?? 0) + rand() }))
      .sort((a, b) => a.order - b.order)
      .map(({ type }) => type)
    const items = []

    const tryPlace = (type) => {
      const item = ITEMS[type]
      const side = room.left - used.left >= room.right - used.right ? 'left' : 'right'
      // The first item at an end may tuck in behind the bottles a little.
      const free = room[side] - used[side]
      const tuck = used[side] === 0 ? 1 / (1 - TUCK) : 1
      const k = Math.min(scale, (free * tuck) / item.w)
      if (k < scale * 0.6) return false
      const w = item.w * k
      const x = side === 'left' ? 2 + used.left : width - 2 - used[side] - w
      used[side] += w + 4
      items.push({ type, x, w, h: item.h * k, lift: item.lift * k, z: item.z ?? 1 })
      return true
    }

    for (const type of pool) {
      if (items.length >= wanted) break
      tryPlace(type)
    }
    if (items.length === 0) {
      for (const type of SMALL.filter((t) => !previous.includes(t))) if (tryPlace(type)) break
    }

    let edge = null
    if (items.length === 0 || rand() < 0.35) {
      // A blanket hangs at an end with nothing standing there; a garland
      // hangs lower, clear of whatever stands on the plank.
      const freeSides = ['left', 'right'].filter((side) => used[side] === 0)
      const type = !freeSides.length || (garlands <= s / 3 && rand() < 0.55) ? 'garland' : 'drape'
      if (type === 'garland') garlands++
      const sides = type === 'drape' ? freeSides : ['left', 'right']
      edge = { type, side: sides[Math.floor(rand() * sides.length)] }
    }
    previous = [...items.map((i) => i.type), edge?.type].filter(Boolean)
    for (const type of previous) usage[type] = (usage[type] ?? 0) + 1
    return { items, edge }
  })
}

export function DecorItem({ item, floor }) {
  const Art = ART[item.type]
  return (
    <span
      className={`shelfie-decor is-${item.type}`}
      style={{ left: item.x, bottom: floor + item.lift, width: item.w, height: item.h, zIndex: item.z }}
      aria-hidden="true"
    >
      <Art />
    </span>
  )
}

export function EdgeDecor({ edge }) {
  const Art = ART[edge.type]
  return (
    <span className={`shelfie-edge is-${edge.type} on-${edge.side}`} aria-hidden="true">
      <Art />
    </span>
  )
}

// ---------- Cabinet-wide details ----------

/** A sleeping ginger cat curled up on top of the cabinet. Tap it: it purrs. */
export function SleepingCat({ label }) {
  const [purring, setPurring] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const pet = () => {
    setPurring(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPurring(false), 2200)
  }
  return (
    <button type="button" className={`shelfie-cat ${purring ? 'is-purring' : ''}`} onClick={pet} aria-label={label}>
      <span className="cat-zzz" aria-hidden="true">
        <i>z</i>
        <i>z</i>
        <i>z</i>
      </span>
      <span className="cat-hearts" aria-hidden="true">
        <i>♥</i>
        <i>♥</i>
        <i>♥</i>
      </span>
      <CatArt />
    </button>
  )
}

/** Now and then a leaf drifts down through the cabinet. */
export function FallingLeaves({ height }) {
  const leaves = [
    { left: '18%', delay: '2s', duration: '15s', colour: LEAF_COLOURS[0], sway: '26px' },
    { left: '64%', delay: '9s', duration: '17s', colour: LEAF_COLOURS[1], sway: '-22px' },
    { left: '40%', delay: '16s', duration: '16s', colour: LEAF_COLOURS[2], sway: '18px' },
  ]
  return (
    <div className="shelfie-falling" aria-hidden="true" style={{ '--fall': `${height}px` }}>
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="falling-leaf"
          style={{ left: leaf.left, '--delay': leaf.delay, '--duration': leaf.duration, '--sway': leaf.sway }}
        >
          <svg viewBox="0 0 20 20" width="13" height="13">
            <Leaf x={10} y={10} size={20} colour={leaf.colour} />
          </svg>
        </span>
      ))}
    </div>
  )
}
