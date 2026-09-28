import { useEffect, useRef, useState } from 'react'
import '../styles/shelf-decor.css'

// Autumn decorations for the Shelfie cabinet: a mug of coffee, pumpkins,
// books, a candle, a cushion, a folded blanket, acorns and fallen leaves on the
// shelves; a blanket or a leaf garland over a plank's edge when a shelf is
// full; a sleeping cat on top of the cabinet and the odd leaf drifting down.
// Everything is inline SVG, sized in px at scale 1.

// ---------- Shared bits ----------

const MAPLE =
  'M10 1 L11.6 5.2 L14.6 3.8 L13.8 8 L18.4 7 L16 10.6 L18.6 12 L13.4 13.2 L13.8 16 ' +
  'L10.6 14.2 L10.6 19 L9.4 19 L9.4 14.2 L6.2 16 L6.6 13.2 L1.4 12 L4 10.6 L1.6 7 ' +
  'L6.2 8 L5.4 3.8 L8.4 5.2 Z'

const LEAF_COLOURS = ['#d9582b', '#e8a33a', '#b8321f', '#c97a2a', '#e07b2e']

function Leaf({ x = 0, y = 0, size = 20, rotate = 0, colour, flat = false }) {
  const s = size / 20
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s} ${flat ? s * 0.45 : s}) translate(-10 -10)`}>
      <path d={MAPLE} fill={colour} />
      <path d="M10 18.5 V6 M10 11 L5 7.5 M10 11 L15 7.5" stroke="rgba(90,30,10,0.45)" strokeWidth="0.7" fill="none" />
    </g>
  )
}

function Pumpkin({ x, y, s = 1, body = ['#f4a04a', '#d8661f', '#a9481a'], stem = '#5b3a1c' }) {
  const id = `sd-pk-${body[0].slice(1)}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={id} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="0.6" stopColor={body[1]} />
          <stop offset="1" stopColor={body[2]} />
        </radialGradient>
      </defs>
      <ellipse cx="-8" cy="0" rx="8.5" ry="9.5" fill={`url(#${id})`} />
      <ellipse cx="8" cy="0" rx="8.5" ry="9.5" fill={`url(#${id})`} />
      <ellipse cx="0" cy="0" rx="9.5" ry="10.2" fill={`url(#${id})`} />
      <path d="M-4 -9 Q-7 0 -4 9.5 M4 -9 Q7 0 4 9.5" stroke={body[2]} strokeWidth="0.9" fill="none" opacity="0.7" />
      <path d="M-0.5 -9 Q0.5 -13 3.5 -15" stroke={stem} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M2 -12 Q7 -16 10 -12 Q6 -10.5 2 -12 Z" fill="#7d8a3c" />
    </g>
  )
}

// ---------- Shelf items ----------

function Mug() {
  return (
    <>
      <span className="decor-steam" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <svg viewBox="0 0 34 30" width="100%" height="100%">
        <defs>
          <linearGradient id="sd-mug" x1="0" x2="1">
            <stop offset="0" stopColor="#7e3320" />
            <stop offset="0.35" stopColor="#c8633a" />
            <stop offset="0.7" stopColor="#b24f2c" />
            <stop offset="1" stopColor="#6e2a18" />
          </linearGradient>
        </defs>
        <path d="M24 10 h3 a6 6 0 0 1 0 12 h-3" fill="none" stroke="#8f3b23" strokeWidth="3" />
        <path d="M3 6 h22 v19 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 z" fill="url(#sd-mug)" />
        <ellipse cx="14" cy="6" rx="11" ry="2.4" fill="#5a2a14" />
        <ellipse cx="14" cy="6.4" rx="9.4" ry="1.6" fill="#2e160a" />
        <path d="M3.5 14 h21" stroke="#efd9b8" strokeWidth="1.6" opacity="0.8" />
        <Leaf x={14} y={21} size={9} colour="#efd9b8" />
      </svg>
    </>
  )
}

function Pumpkins() {
  return (
    <svg viewBox="0 0 46 30" width="100%" height="100%" overflow="visible">
      <Pumpkin x={17} y={19} />
      <Pumpkin x={37.5} y={23.5} s={0.6} body={['#f6ecd8', '#e4d2b0', '#b9a07a']} stem="#6b4a26" />
    </svg>
  )
}

function Books() {
  return (
    <svg viewBox="0 0 52 40" width="100%" height="100%" overflow="visible">
      <rect x="1" y="30" width="50" height="9.5" rx="1.6" fill="#2f4a36" />
      <path d="M8 30 v9.5 M44 30 v9.5" stroke="#c9a456" strokeWidth="1.2" />
      <rect x="18" y="33.5" width="16" height="2.2" rx="0.6" fill="#c9a456" opacity="0.85" />
      <rect x="5" y="22" width="42" height="8.2" rx="1.6" fill="#8e2f25" />
      <path d="M11 22 v8.2 M41 22 v8.2" stroke="#d8b366" strokeWidth="1" />
      <rect x="3" y="15" width="38" height="7.2" rx="1.6" fill="#c9933a" />
      <rect x="15" y="17.5" width="14" height="1.8" rx="0.5" fill="#6b3d17" opacity="0.7" />
      <path d="M1.5 31 h49 M5.5 23 h41 M3.5 16 h37" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
      <Pumpkin x={29} y={8.5} s={0.52} />
    </svg>
  )
}

function Candle() {
  return (
    <>
      <span className="decor-glow" aria-hidden="true" />
      <svg viewBox="0 0 22 34" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id="sd-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#e8641c" />
            <stop offset="0.45" stopColor="#ffb347" />
            <stop offset="1" stopColor="#fff6d0" />
          </linearGradient>
        </defs>
        <rect x="4.5" y="15" width="13" height="18" rx="1.5" fill="#efe2c8" />
        <ellipse cx="11" cy="15" rx="6.5" ry="1.6" fill="#f7eedb" />
        <path d="M11 15 v-3" stroke="#3a2a1a" strokeWidth="0.9" />
        <g className="decor-flame">
          <path d="M11 2.5 C13.8 6.5 14.2 9.2 11 12.4 C7.8 9.2 8.2 6.5 11 2.5 Z" fill="url(#sd-flame)" />
        </g>
        <rect x="3" y="10" width="16" height="23.5" rx="2" fill="rgba(255,236,210,0.16)" stroke="rgba(255,236,210,0.4)" strokeWidth="0.8" />
        <rect x="3" y="22" width="16" height="5.5" fill="#b98a55" />
        <path d="M5 13 v17" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </svg>
    </>
  )
}

function Cushion() {
  return (
    <svg viewBox="0 0 46 42" width="100%" height="100%" overflow="visible">
      <defs>
        <pattern id="sd-plaid" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#c98a36" />
          <rect width="8" height="2.4" y="2.8" fill="rgba(140,48,28,0.55)" />
          <rect width="2.4" height="8" x="2.8" fill="rgba(140,48,28,0.55)" />
          <rect width="8" height="0.7" y="6.6" fill="rgba(255,238,205,0.4)" />
          <rect width="0.7" height="8" x="6.6" fill="rgba(255,238,205,0.4)" />
        </pattern>
        <radialGradient id="sd-cushion-shade" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1206" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <path d="M4 6 Q23 1 42 5 Q46 21 42 38 Q23 42 5 38 Q1 21 4 6 Z" fill="url(#sd-plaid)" />
      <path d="M4 6 Q23 1 42 5 Q46 21 42 38 Q23 42 5 38 Q1 21 4 6 Z" fill="url(#sd-cushion-shade)" />
      <circle cx="23" cy="21" r="1.8" fill="#7a2e1a" />
      <path d="M23 21 L14 12 M23 21 L33 12 M23 21 L14 31 M23 21 L32 31" stroke="rgba(60,20,8,0.25)" strokeWidth="0.8" />
      <path d="M4 6 l-2.5 -2.5 M42 5 l2.5 -2.5 M5 38 l-2.5 2.5 M42 38 l2.5 2.5" stroke="#8a3a1e" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Knit({ x, y, w, h, colour }) {
  // Cable-knit columns: little zigzags running down the fold.
  const steps = Math.floor((h - 2) / 3)
  const zigzag = Array.from({ length: steps }, (_, i) => `q${i % 2 ? -1.2 : 1.2} 1.5 0 3`).join(' ')
  const columns = []
  for (let cx = x + 3; cx < x + w - 1; cx += 4) columns.push(`M${cx} ${y + 1} ${zigzag}`)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2.6} fill={colour} />
      <path d={columns.join(' ')} stroke="rgba(70,35,12,0.28)" strokeWidth="0.9" fill="none" />
    </g>
  )
}

function Blanket() {
  return (
    <svg viewBox="0 0 48 24" width="100%" height="100%" overflow="hidden">
      <Knit x={1} y={12} w={46} h={11.5} colour="#eadcc2" />
      <Knit x={3} y={2.5} w={42} h={10.5} colour="#b0512e" />
      <path d="M3 7.5 h42" stroke="rgba(255,235,205,0.25)" strokeWidth="0.8" />
    </svg>
  )
}

function Acorn({ x, y, r = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <ellipse cx="0" cy="2" rx="4.2" ry="5.2" fill="#b0773f" />
      <ellipse cx="-1.3" cy="1" rx="1.2" ry="2.4" fill="rgba(255,230,190,0.35)" />
      <path d="M-5 -1.5 Q0 -6.5 5 -1.5 Q0 0.5 -5 -1.5 Z" fill="#6b4524" />
      <path d="M-3 -2.5 l1 1 M0 -3.5 l1 1 M2.8 -2.6 l1 1" stroke="#4a2e16" strokeWidth="0.6" />
      <path d="M0 -4.5 q0.5 -2.2 2 -2.8" stroke="#4a2e16" strokeWidth="1" strokeLinecap="round" fill="none" />
    </g>
  )
}

function Acorns() {
  return (
    <svg viewBox="0 0 26 16" width="100%" height="100%" overflow="visible">
      <Acorn x={7} y={9} r={-12} />
      <Acorn x={18} y={10} r={70} />
    </svg>
  )
}

function Leaves() {
  return (
    <svg viewBox="0 0 40 10" width="100%" height="100%" overflow="visible">
      <Leaf x={7} y={6} size={12} rotate={-20} colour={LEAF_COLOURS[0]} flat />
      <Leaf x={17} y={7} size={10} rotate={35} colour={LEAF_COLOURS[1]} flat />
      <Leaf x={27} y={5.5} size={13} rotate={-60} colour={LEAF_COLOURS[2]} flat />
      <Leaf x={35} y={7.5} size={8} rotate={15} colour={LEAF_COLOURS[3]} flat />
    </svg>
  )
}

// ---------- Plank-edge items ----------

// A knitted blanket thrown over the front of a plank.
function Drape() {
  return (
    <svg viewBox="0 0 54 40" width="100%" height="100%" overflow="visible">
      <defs>
        <pattern id="sd-drape" width="10" height="40" patternUnits="userSpaceOnUse">
          <rect width="10" height="40" fill="#d7a44a" />
          <rect width="10" height="5" y="22" fill="#9e3f22" />
          <rect width="10" height="2" y="29" fill="#efe2c6" />
          <path d="M5 0 q1.4 2 0 4 q-1.4 2 0 4 q1.4 2 0 4 q-1.4 2 0 4 q1.4 2 0 4 q-1.4 2 0 4 q1.4 2 0 4 q-1.4 2 0 4 q1.4 2 0 4 q-1.4 2 0 4" stroke="rgba(80,40,10,0.3)" strokeWidth="1" fill="none" />
        </pattern>
        <linearGradient id="sd-drape-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0a02" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M2 0 H52 Q54 18 50 34 Q27 38 4 34 Q0 18 2 0 Z" fill="url(#sd-drape)" />
      <path d="M2 0 H52 Q54 18 50 34 Q27 38 4 34 Q0 18 2 0 Z" fill="url(#sd-drape-shade)" />
      <path d="M11 2 Q13 18 11 35 M27 2 Q28 20 27 36.5 M43 2 Q42 18 44 35" stroke="rgba(40,18,4,0.25)" strokeWidth="1.2" fill="none" />
      <g stroke="#b56a2c" strokeWidth="1.3" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const x = 6 + i * 3.8
          const y = 34.5 + Math.sin((x / 50) * Math.PI) * 2.2
          return <path key={i} d={`M${x} ${y} l${(i % 2) - 0.5} 4`} />
        })}
      </g>
    </svg>
  )
}

// A twine swag of leaves hanging under a plank.
function Garland() {
  const leaves = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8
    const x = 4 + t * 112
    const y = 3 + Math.sin(t * Math.PI) * 13
    leaves.push(
      <Leaf key={i} x={x} y={y + 5} size={i % 3 === 1 ? 11 : 13} rotate={(i % 2 ? 1 : -1) * (15 + i * 7)} colour={LEAF_COLOURS[i % LEAF_COLOURS.length]} />,
    )
  }
  return (
    <svg viewBox="0 0 120 30" width="100%" height="100%" overflow="visible">
      <path d="M2 2 Q60 30 118 2" stroke="#a8875a" strokeWidth="1" fill="none" />
      {leaves}
      <circle cx="2" cy="2" r="1.6" fill="#c9a456" />
      <circle cx="118" cy="2" r="1.6" fill="#c9a456" />
    </svg>
  )
}

const ART = { mug: Mug, pumpkins: Pumpkins, books: Books, candle: Candle, cushion: Cushion, blanket: Blanket, acorns: Acorns, leaves: Leaves, drape: Drape, garland: Garland }

// Natural size (px), how far back it stands (lift, px up the plank's top face;
// back = behind the front row of bottles) and whether it can shrink a bit.
const ITEMS = {
  mug: { w: 46, h: 40, lift: 1, z: 3 },
  pumpkins: { w: 62, h: 40, lift: 0, z: 3 },
  books: { w: 70, h: 54, lift: 5, z: 2 },
  candle: { w: 30, h: 46, lift: 3, z: 3 },
  cushion: { w: 59, h: 57, lift: 7, z: 1 },
  blanket: { w: 65, h: 32, lift: 5, z: 2 },
  acorns: { w: 35, h: 22, lift: -1, z: 3 },
  leaves: { w: 54, h: 14, lift: -4, z: 3 },
}
const SMALL = ['acorns', 'candle', 'leaves']

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
      const free = room[side] - used[side]
      const k = Math.min(scale, free / item.w)
      if (k < scale * 0.6) return false
      const w = item.w * k
      const x = side === 'left' ? 4 + used.left : width - 4 - used[side] - w
      used[side] += w + 4
      items.push({ type, x, w, h: item.h * k, lift: item.lift * k, z: item.z })
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
      <svg viewBox="0 0 72 38" width="72" height="38" overflow="visible" aria-hidden="true">
        <defs>
          <linearGradient id="sd-cat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e39a55" />
            <stop offset="1" stopColor="#b8652b" />
          </linearGradient>
        </defs>
        <g className="cat-tail">
          <path d="M60 34 C70 33 69 24 64 21" stroke="url(#sd-cat)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <path d="M64.5 22.5 C63.8 21.6 63.4 21.2 63 21" stroke="#f3d2a8" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="cat-body">
          <path d="M9 36 C5 23 15 11 34 11 C52 11 64 19 63 36 Z" fill="url(#sd-cat)" />
          <path d="M36 12.5 q-3 6 0 11 M45 14 q-3 6 0 11 M53 18 q-2.5 5 0 9" stroke="#a5531f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <ellipse cx="24" cy="35" rx="4.5" ry="2.4" fill="#f3d2a8" />
          <ellipse cx="32" cy="35.5" rx="4.5" ry="2.3" fill="#f3d2a8" />
        </g>
        <g className="cat-head">
          <path d="M6 20 L8.5 8 L15.5 15 Z" fill="#c9733a" />
          <path d="M20 14.5 L26.5 8 L28 20 Z" fill="#c9733a" />
          <path d="M8.3 17 L9.3 11 L13 15 Z M22.5 14.5 L25.8 11 L26.2 17 Z" fill="#e9a28f" />
          <ellipse cx="17" cy="24" rx="12" ry="10.5" fill="url(#sd-cat)" />
          <path d="M12 15.5 q1 2.5 0 4 M17 14 q0.8 2.5 0 4.5 M22 15.5 q-1 2.5 0 4" stroke="#a5531f" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
          <ellipse cx="17" cy="29" rx="5.5" ry="3.8" fill="#f3d2a8" />
          <path d="M10.5 24.5 q2.5 2.2 5 0 M18.5 24.5 q2.5 2.2 5 0" stroke="#4a220b" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M15.8 27.5 h2.4 l-1.2 1.4 z" fill="#d9786a" />
          <path d="M11 28.5 l-7 -1 M11 29.5 l-7 1 M23 28.5 l7 -1 M23 29.5 l7 1" stroke="rgba(255,240,220,0.6)" strokeWidth="0.5" />
        </g>
      </svg>
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
