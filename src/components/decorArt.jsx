// The Shelfie's autumn decorations, drawn as inline SVG. Each piece's viewBox
// is its natural size in px at scale 1 (see ITEMS in ShelfDecor.jsx), so
// stroke widths stay consistent. Gradient/pattern ids are prefixed "sd-" and
// identical wherever they repeat, so duplicates on a page are harmless.

// ---------- Shared bits ----------

const MAPLE =
  'M10 1 L11.6 5.2 L14.6 3.8 L13.8 8 L18.4 7 L16 10.6 L18.6 12 L13.4 13.2 L13.8 16 ' +
  'L10.6 14.2 L10.6 19 L9.4 19 L9.4 14.2 L6.2 16 L6.6 13.2 L1.4 12 L4 10.6 L1.6 7 ' +
  'L6.2 8 L5.4 3.8 L8.4 5.2 Z'

const OAK =
  'M10 1 C12 2 11 4 13 4.5 C15 5 15.5 7 14 8 C16 8.5 17 10.5 15 11.5 C16.5 12.5 16 15 13.5 14.5 ' +
  'C13.5 16.5 11.5 17.5 10.6 16 L10.6 19 L9.4 19 L9.4 16 C8.5 17.5 6.5 16.5 6.5 14.5 ' +
  'C4 15 3.5 12.5 5 11.5 C3 10.5 4 8.5 6 8 C4.5 7 5 5 7 4.5 C9 4 8 2 10 1 Z'

export const LEAF_COLOURS = ['#d9582b', '#e8a33a', '#b8321f', '#c97a2a', '#e07b2e']

export function Leaf({ x = 0, y = 0, size = 20, rotate = 0, colour, flat = false, oak = false }) {
  const s = size / 20
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s} ${flat ? s * 0.45 : s}) translate(-10 -10)`}>
      <path d={oak ? OAK : MAPLE} fill={colour} />
      <path
        d="M10 18.5 V5 M10 12 L5.5 8 M10 12 L14.5 8 M10 8 L7.5 5.5 M10 8 L12.5 5.5"
        stroke="rgba(90,30,10,0.45)"
        strokeWidth="0.6"
        fill="none"
      />
    </g>
  )
}

// Cable-knit columns: little zigzags running down a strip of fabric.
function KnitLines({ x, y, w, h, step = 4, colour = 'rgba(70,35,12,0.28)' }) {
  const rows = Math.floor((h - 2) / 3)
  const zigzag = Array.from({ length: rows }, (_, i) => `q${i % 2 ? -1.2 : 1.2} 1.5 0 3`).join(' ')
  const d = []
  for (let cx = x + step / 2 + 1; cx < x + w - 1; cx += step) d.push(`M${cx} ${y + 1} ${zigzag}`)
  return <path d={d.join(' ')} stroke={colour} strokeWidth="0.9" fill="none" />
}

// Braided cables for chunky knits.
function Cables({ x, y, w, h, colour = 'rgba(60,25,8,0.3)' }) {
  const d = []
  for (let cx = x + 5; cx < x + w - 3; cx += 9) {
    for (let cy = y + 1; cy < y + h - 3; cy += 5) {
      d.push(`M${cx - 2.5} ${cy} q2.5 2.5 5 5 M${cx + 2.5} ${cy} q-2.5 2.5 -5 5`)
    }
  }
  return <path d={d.join(' ')} stroke={colour} strokeWidth="1.1" fill="none" strokeLinecap="round" />
}

const PUMPKIN_ORANGE = ['#f7ad58', '#e0712a', '#a9481a']
const PUMPKIN_CREAM = ['#fbf3e2', '#e8d6b4', '#b9a07a']

function Pumpkin({ x, y, s = 1, body = PUMPKIN_ORANGE, stem = '#5b3a1c', vine = true }) {
  const id = `sd-pk-${body[0].slice(1)}`
  const lobes = [
    [-13, 9, 10],
    [13, 9, 10],
    [-7, 10, 11],
    [7, 10, 11],
    [0, 11, 11.8],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={id} cx="0.4" cy="0.32" r="0.8">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="0.55" stopColor={body[1]} />
          <stop offset="1" stopColor={body[2]} />
        </radialGradient>
      </defs>
      {lobes.map(([cx, rx, ry]) => (
        <ellipse key={cx} cx={cx} cy="0" rx={rx} ry={ry} fill={`url(#${id})`} stroke={body[2]} strokeOpacity="0.35" strokeWidth="0.6" />
      ))}
      <ellipse cx="-4" cy="-5" rx="3" ry="4.5" fill="#fff" opacity="0.22" />
      <ellipse cx="9" cy="-4" rx="1.8" ry="3" fill="#fff" opacity="0.15" />
      <path d="M-1.5 -10 Q-0.5 -15.5 3.5 -17.5" stroke={stem} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M-0.5 -11 Q0 -15 3 -16.8" stroke="#8a6436" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      {vine && (
        <>
          <path d="M1 -12 q7 -3 8.5 2 q1 4 -3 4 q-2.5 -0.2 -1.8 -2.6" stroke="#6b7a34" strokeWidth="0.9" fill="none" />
          <path d="M2 -13 Q8 -19 13 -14.5 Q8 -12 2 -13 Z" fill="#7d8a3c" />
          <path d="M2.5 -13 Q8 -15 12 -14.6" stroke="#566227" strokeWidth="0.5" fill="none" />
        </>
      )}
    </g>
  )
}

function Acorn({ x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="4.2" ry="5.2" fill="#b0773f" />
      <ellipse cx="-1.3" cy="1" rx="1.2" ry="2.4" fill="rgba(255,230,190,0.4)" />
      <path d="M0 6.8 l0 1.2" stroke="#6b4524" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M-5 -1.5 Q0 -6.5 5 -1.5 Q0 0.5 -5 -1.5 Z" fill="#6b4524" />
      <path d="M-3 -2.5 l1 1 M0 -3.5 l1 1 M2.8 -2.6 l1 1 M-1.5 -3.2 l1 1 M1.5 -3.4 l1 1" stroke="#4a2e16" strokeWidth="0.6" />
      <path d="M0 -4.5 q0.5 -2.2 2 -2.8" stroke="#4a2e16" strokeWidth="1" strokeLinecap="round" fill="none" />
    </g>
  )
}

function Pinecone({ x, y, r = 0, s = 1 }) {
  const scales = []
  for (let row = 0; row < 6; row++) {
    const cy = -9 + row * 3.4
    const half = 3 + Math.sin(((row + 0.5) / 6) * Math.PI) * 3.6
    for (let cx = -half; cx <= half + 0.1; cx += 2.8) {
      scales.push(<path key={`${row}-${cx}`} d={`M${cx - 1.6} ${cy} q1.6 2.6 3.2 0`} />)
    }
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="7" ry="11" fill="#7a4f2a" />
      <g stroke="#4a2e16" strokeWidth="0.9" fill="#9a6a3c">
        {scales}
      </g>
      <path d="M0 -11 l0 -2.5" stroke="#4a2e16" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

// ---------- Shelf items ----------

export function Mug() {
  return (
    <>
      <span className="decor-steam" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <svg viewBox="0 0 64 56" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id="sd-mug" x1="0" x2="1">
            <stop offset="0" stopColor="#7e3320" />
            <stop offset="0.3" stopColor="#c8633a" />
            <stop offset="0.65" stopColor="#b24f2c" />
            <stop offset="1" stopColor="#6a2716" />
          </linearGradient>
        </defs>
        {/* Saucer with a cookie */}
        <ellipse cx="30" cy="52" rx="27" ry="4" fill="#bfae8e" />
        <ellipse cx="30" cy="50.6" rx="27" ry="4.4" fill="#efe3cc" />
        <ellipse cx="30" cy="50.3" rx="18" ry="2.4" fill="#e2d3b6" />
        <ellipse cx="52" cy="48.8" rx="8" ry="3" fill="#b8793e" />
        <ellipse cx="52" cy="48" rx="8" ry="2.6" fill="#d39a5a" />
        <circle cx="49" cy="47.6" r="0.9" fill="#4a2a14" />
        <circle cx="53.5" cy="48.6" r="0.9" fill="#4a2a14" />
        <circle cx="55.5" cy="47.3" r="0.7" fill="#4a2a14" />
        {/* Cinnamon stick */}
        <path d="M18 13 L11 1.5" stroke="#7d3f1a" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M17.2 12 L11.4 2.4" stroke="#a8622e" strokeWidth="1" strokeLinecap="round" />
        {/* Handle */}
        <path d="M44 19 h4.5 a8 8 0 0 1 0 16 h-4.5" fill="none" stroke="#8f3b23" strokeWidth="4.6" />
        <path d="M45 20.4 h3.5 a6.6 6.6 0 0 1 4.8 2.2" fill="none" stroke="#d8845a" strokeWidth="1" opacity="0.7" />
        {/* Body */}
        <path d="M12 12 h32 v28 a8 8 0 0 1 -8 8 h-16 a8 8 0 0 1 -8 -8 z" fill="url(#sd-mug)" />
        {/* Knitted sleeve with a wooden button */}
        <rect x="11.5" y="24" width="33" height="14" fill="#d9a441" />
        <KnitLines x={11.5} y={24} w={33} h={14} step={3.6} />
        <path d="M11.5 24.6 h33 M11.5 37.4 h33" stroke="#b07e2a" strokeWidth="1.2" />
        <circle cx="39.5" cy="31" r="2.6" fill="#8a5a2e" />
        <circle cx="39.5" cy="31" r="2.6" fill="none" stroke="#5e3b1c" strokeWidth="0.6" />
        <circle cx="38.8" cy="30.4" r="0.45" fill="#3a2410" />
        <circle cx="40.2" cy="31.6" r="0.45" fill="#3a2410" />
        {/* Rim, coffee and latte-art heart */}
        <ellipse cx="28" cy="12" rx="16" ry="3.3" fill="#8a3a22" />
        <ellipse cx="28" cy="12.3" rx="14" ry="2.5" fill="#3b1d0e" />
        <ellipse cx="28" cy="12.5" rx="12" ry="1.9" fill="#b98556" />
        <path d="M26.6 12.1 q-1.6 -1.3 -0.1 -1.6 q1.4 0 1.5 0.8 q0.1 -0.8 1.5 -0.8 q1.5 0.3 -0.1 1.6 l-1.4 1 z" fill="#f3e2c6" />
        <rect x="15" y="14.5" width="2.6" height="7.5" rx="1.3" fill="#fff" opacity="0.28" />
        <rect x="15" y="40" width="2.6" height="4" rx="1.3" fill="#fff" opacity="0.2" />
      </svg>
    </>
  )
}

export function Pumpkins() {
  return (
    <svg viewBox="0 0 84 54" width="100%" height="100%" overflow="visible">
      <Leaf x={16} y={51} size={14} rotate={-30} colour={LEAF_COLOURS[2]} flat />
      <Pumpkin x={30} y={34} s={1.55} />
      <Pumpkin x={62} y={43} s={0.82} body={PUMPKIN_CREAM} stem="#6b4a26" vine={false} />
      {/* A little striped gourd */}
      <g transform="translate(78 46) rotate(-20)">
        <path d="M-5 3 C-6 -2 -3 -5 -1 -9 C0 -11 2 -11 2 -9 C2 -5 6 -2 5 3 C4 7 -4 7 -5 3 Z" fill="#e8c24a" />
        <path d="M-2.5 5.5 C-3 0 -1.5 -4 0 -9 M2.5 5.5 C3 0 1.5 -4 0.8 -9" stroke="#6f8a34" strokeWidth="1.1" fill="none" />
        <path d="M0.5 -10.5 l0.5 -2" stroke="#5b3a1c" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <Leaf x={48} y={52} size={11} rotate={40} colour={LEAF_COLOURS[1]} flat />
    </svg>
  )
}

export function Books() {
  const book = (x, y, w, h, colour, band, title) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={colour} />
      <rect x={x} y={y} width={w} height={h * 0.35} rx="2" fill="#fff" opacity="0.1" />
      <rect x={x} y={y + h - 1.6} width={w} height="1.6" fill="#000" opacity="0.2" />
      <path d={`M${x + 7} ${y} v${h} M${x + 9.5} ${y} v${h} M${x + w - 7} ${y} v${h} M${x + w - 9.5} ${y} v${h}`} stroke={band} strokeWidth="0.9" />
      <rect x={x + w / 2 - title / 2} y={y + h / 2 - 1.4} width={title} height="2.8" rx="0.8" fill={band} opacity="0.9" />
    </g>
  )
  return (
    <svg viewBox="0 0 92 70" width="100%" height="100%" overflow="visible">
      {book(2, 54, 88, 15, '#2f4a36', '#d0ad5e', 26)}
      {book(8, 42.5, 76, 12, '#8e2f25', '#e0bd6e', 22)}
      {/* Ribbon bookmark hanging out of the middle book */}
      <path d="M62 52 l-0.6 15 l2 -2.4 l2 2.4 l0.6 -15 z" fill="#c0392b" />
      {book(4, 31.5, 70, 11.5, '#c9933a', '#6b3d17', 18)}
      {/* Reading glasses */}
      <g transform="translate(60 27.5)" stroke="#b08a3a" strokeWidth="1.1" fill="rgba(220,236,245,0.1)">
        <ellipse cx="0" cy="0" rx="5" ry="3.6" />
        <ellipse cx="12" cy="0" rx="5" ry="3.6" />
        <path d="M5 -0.5 q1 -1.6 2 0" fill="none" />
        <path d="M-5 -0.8 l-4 3.5 M17 -0.8 l4 3.5" fill="none" />
        <path d="M-2.6 -1.6 l2.2 -0.8 M9.4 -1.6 l2.2 -0.8" stroke="#fff" strokeWidth="0.7" opacity="0.8" />
      </g>
      <Pumpkin x={28} y={21} s={0.72} />
    </svg>
  )
}

export function Candle() {
  return (
    <>
      <span className="decor-glow" aria-hidden="true" />
      <svg viewBox="0 0 42 62" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id="sd-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#e8641c" />
            <stop offset="0.45" stopColor="#ffb347" />
            <stop offset="1" stopColor="#fff6d0" />
          </linearGradient>
          <linearGradient id="sd-wax" x1="0" x2="1">
            <stop offset="0" stopColor="#e9d9b8" />
            <stop offset="0.5" stopColor="#fbf1dc" />
            <stop offset="1" stopColor="#e0cda8" />
          </linearGradient>
        </defs>
        {/* Wax, wick and flame */}
        <rect x="10.5" y="28" width="21" height="31" rx="2" fill="url(#sd-wax)" />
        <ellipse cx="21" cy="28" rx="10.5" ry="2.4" fill="#fbf3e1" />
        <ellipse cx="21" cy="28.3" rx="4.5" ry="1" fill="#f0dfbd" />
        <path d="M21 28 v-4" stroke="#2e2014" strokeWidth="1" />
        <g className="decor-flame">
          <path d="M21 9 C25.5 15 26 19.5 21 24.5 C16 19.5 16.5 15 21 9 Z" fill="url(#sd-flame)" />
          <path d="M21 17 C22.6 19.5 22.7 21.5 21 23.3 C19.3 21.5 19.4 19.5 21 17 Z" fill="#fffbe8" />
          <ellipse cx="21" cy="23.6" rx="1.2" ry="0.9" fill="#6fa8dc" opacity="0.7" />
        </g>
        {/* Jar */}
        <rect x="8" y="22" width="26" height="38.5" rx="3" fill="rgba(255,236,210,0.14)" stroke="rgba(255,236,210,0.45)" strokeWidth="0.9" />
        <path d="M10.5 25 v33" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M31 27 v8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
        {/* Kraft label with a leaf stamp */}
        <rect x="8" y="41" width="26" height="10" fill="#b98a55" />
        <path d="M8 41.6 h26 M8 50.4 h26" stroke="#8f6636" strokeWidth="0.6" strokeDasharray="1.4 1" />
        <Leaf x={21} y={46} size={7} colour="#6b3d17" />
        {/* Twine bow */}
        <path d="M8 26 h26" stroke="#c2a06a" strokeWidth="1.3" />
        <path d="M27 26 q-4 -4 -4.5 0 q0.5 4 4.5 0 q4 -4 4.5 0 q-0.5 4 -4.5 0" fill="none" stroke="#c2a06a" strokeWidth="1.1" />
        <path d="M27 26 l-2 6 M27 26 l2.5 5.5" stroke="#c2a06a" strokeWidth="1" strokeLinecap="round" />
        {/* Dried orange slice leaning on the jar */}
        <g transform="translate(5 54) rotate(-12)">
          <circle r="7.5" fill="#d9772b" />
          <circle r="6.3" fill="#f0a45a" />
          <path d="M0 0 L0 -6 M0 0 L5.2 -3 M0 0 L5.2 3 M0 0 L0 6 M0 0 L-5.2 3 M0 0 L-5.2 -3" stroke="#fbe0b4" strokeWidth="0.9" />
          <circle r="1.2" fill="#fbe0b4" />
        </g>
        {/* Cinnamon sticks tied with twine */}
        <g transform="translate(34 58)">
          <rect x="-8" y="-2.8" width="16" height="2.6" rx="1.3" fill="#7d3f1a" />
          <rect x="-7" y="-0.4" width="16" height="2.6" rx="1.3" fill="#95502a" />
          <path d="M0 -3.2 v5.8" stroke="#c2a06a" strokeWidth="1.2" />
        </g>
      </svg>
    </>
  )
}

// A plaid cushion lying flat on the shelf, seen from slightly above: its
// plump top face, the thickness of its front side and piping along the seam.
export function Cushion() {
  const top = 'M9 9 Q43 2 77 8 Q85 15 79 23 Q43 28 7 23 Q0 16 9 9 Z'
  const side = 'M7 23 Q43 28 79 23 Q83 28 77 33 Q43 37 9 33 Q3 28 7 23 Z'
  return (
    <svg viewBox="0 0 86 38" width="100%" height="100%" overflow="visible">
      <defs>
        <pattern id="sd-plaid" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#c98a36" />
          <rect width="12" height="3.4" y="4.2" fill="rgba(140,48,28,0.55)" />
          <rect width="3.4" height="12" x="4.2" fill="rgba(140,48,28,0.55)" />
          <rect width="12" height="0.8" y="10" fill="rgba(255,238,205,0.45)" />
          <rect width="0.8" height="12" x="10" fill="rgba(255,238,205,0.45)" />
          <rect width="12" height="0.6" y="1.6" fill="rgba(70,30,10,0.3)" />
          <rect width="0.6" height="12" x="1.6" fill="rgba(70,30,10,0.3)" />
        </pattern>
        {/* The plaid seen at a low angle: squashed vertically on the top face. */}
        <pattern id="sd-plaid-top" width="12" height="5" patternUnits="userSpaceOnUse" patternTransform="skewX(-12)">
          <rect width="12" height="5" fill="#d39440" />
          <rect width="12" height="1.4" y="1.8" fill="rgba(140,48,28,0.5)" />
          <rect width="3.4" height="5" x="4.2" fill="rgba(140,48,28,0.5)" />
          <rect width="12" height="0.4" y="4.2" fill="rgba(255,238,205,0.45)" />
          <rect width="0.8" height="5" x="10" fill="rgba(255,238,205,0.45)" />
        </pattern>
        <radialGradient id="sd-cushion-top" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1206" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="sd-cushion-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#1a0802" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Front side */}
      <path d={side} fill="url(#sd-plaid)" />
      <path d={side} fill="url(#sd-cushion-side)" />
      {/* Top face */}
      <path d={top} fill="url(#sd-plaid-top)" />
      <path d={top} fill="url(#sd-cushion-top)" />
      {/* Soft dips towards the centre */}
      <path d="M43 15.5 L16 10.5 M43 15.5 L70 10 M43 15.5 L14 21 M43 15.5 L72 20.5" stroke="rgba(60,20,8,0.2)" strokeWidth="0.9" />
      {/* Piping along the seams */}
      <path d={top} fill="none" stroke="#7a2e1a" strokeWidth="1.8" />
      <path d="M9 33 Q43 37 77 33" fill="none" stroke="#6a2616" strokeWidth="1.4" />
      {/* Embroidered leaf patch on top */}
      <ellipse cx="43" cy="15.5" rx="10.5" ry="5.2" fill="#efe2c6" />
      <ellipse cx="43" cy="15.5" rx="9" ry="4.2" fill="none" stroke="#b0512e" strokeWidth="0.7" strokeDasharray="1.5 1.1" />
      <Leaf x={43} y={15.5} size={11} rotate={-8} colour="#c2512b" flat />
      {/* Corner tassels */}
      {[
        [9, 9, -150],
        [77, 8, -30],
        [7, 23, 160],
        [79, 23, 20],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r})`} stroke="#8a3a1e" strokeWidth="1" strokeLinecap="round">
          <path d="M0 0 l6 -1.5 M0 0 l6.5 0 M0 0 l6 1.5" />
          <circle cx="1.5" cy="0" r="1.4" fill="#8a3a1e" />
        </g>
      ))}
    </svg>
  )
}

export function Blanket() {
  return (
    <svg viewBox="0 0 84 44" width="100%" height="100%" overflow="visible">
      {/* Three folds: cream, rust (cable knit), mustard */}
      <rect x="1" y="29" width="80" height="14" rx="5.5" fill="#eadcc2" />
      <KnitLines x={1} y={29} w={80} h={14} />
      <rect x="1" y="34.5" width="80" height="2.6" fill="#b0512e" opacity="0.85" />
      <rect x="3" y="16" width="76" height="13.5" rx="5.5" fill="#b0512e" />
      <Cables x={3} y={16} w={76} h={13.5} />
      <rect x="5" y="4" width="70" height="12.5" rx="5.5" fill="#d7a44a" />
      <KnitLines x={5} y={4} w={70} h={12.5} colour="rgba(90,50,10,0.3)" />
      <path d="M5 8 h70 M3 20 h76" stroke="rgba(255,240,215,0.25)" strokeWidth="1" />
      {/* Fringe on the bottom fold */}
      <g stroke="#d9c7a3" strokeWidth="1.2" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${80 + (i % 2)} ${30 + i * 1.6} l3 ${0.6 - (i % 3) * 0.3}`} />
        ))}
      </g>
      <Pinecone x={60} y={-2} r={70} s={0.75} />
    </svg>
  )
}

export function Acorns() {
  return (
    <svg viewBox="0 0 58 30" width="100%" height="100%" overflow="visible">
      <Leaf x={24} y={25} size={26} rotate={-75} colour="#b8742c" flat oak />
      <Pinecone x={15} y={20} r={-72} s={0.95} />
      <Acorn x={38} y={20} r={-12} s={1.25} />
      <Acorn x={50} y={23} r={70} s={1.1} />
      <Leaf x={46} y={28} size={12} rotate={20} colour={LEAF_COLOURS[0]} flat />
    </svg>
  )
}

export function Leaves() {
  return (
    <svg viewBox="0 0 70 18" width="100%" height="100%" overflow="visible">
      <path d="M8 13 Q28 9 48 12 M30 10 l5 -4 M40 11 l4 3" stroke="#5a3a1c" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <Leaf x={9} y={11} size={18} rotate={-20} colour={LEAF_COLOURS[0]} flat />
      <Leaf x={22} y={13} size={14} rotate={35} colour={LEAF_COLOURS[1]} flat oak />
      <Leaf x={35} y={10} size={19} rotate={-60} colour={LEAF_COLOURS[2]} flat />
      <Leaf x={48} y={13.5} size={13} rotate={15} colour={LEAF_COLOURS[3]} flat />
      <Leaf x={60} y={11} size={16} rotate={70} colour={LEAF_COLOURS[4]} flat oak />
    </svg>
  )
}

export function Lantern() {
  return (
    <>
      <span className="decor-glow is-lantern" aria-hidden="true" />
      <svg viewBox="0 0 40 74" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id="sd-brass" x1="0" x2="1">
            <stop offset="0" stopColor="#7a5a24" />
            <stop offset="0.35" stopColor="#e3c47a" />
            <stop offset="0.7" stopColor="#b08a3a" />
            <stop offset="1" stopColor="#5e4418" />
          </linearGradient>
          <linearGradient id="sd-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#e8641c" />
            <stop offset="0.45" stopColor="#ffb347" />
            <stop offset="1" stopColor="#fff6d0" />
          </linearGradient>
          <radialGradient id="sd-lantern-light" cx="0.5" cy="0.55" r="0.6">
            <stop offset="0" stopColor="#ffd98c" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffb24a" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        {/* Ring and cap */}
        <circle cx="20" cy="5" r="4" fill="none" stroke="url(#sd-brass)" strokeWidth="1.8" />
        <path d="M9 17 L20 8 L31 17 Z" fill="url(#sd-brass)" />
        <rect x="7" y="16" width="26" height="3.5" rx="1" fill="url(#sd-brass)" />
        {/* Glass with the candle inside */}
        <rect x="9" y="19.5" width="22" height="40" fill="url(#sd-lantern-light)" />
        <rect x="16" y="42" width="8" height="17" rx="1" fill="#f6ead0" />
        <path d="M20 42 v-2.5" stroke="#2e2014" strokeWidth="0.8" />
        <g className="decor-flame">
          <path d="M20 30 C23 34 23.3 37 20 40 C16.7 37 17 34 20 30 Z" fill="url(#sd-flame)" />
          <path d="M20 35 C21 36.6 21 37.8 20 39 C19 37.8 19 36.6 20 35 Z" fill="#fffbe8" />
        </g>
        {/* Frame bars */}
        <path d="M9 19.5 v40 M31 19.5 v40 M20 19.5 v40 M9 39.5 h22" stroke="url(#sd-brass)" strokeWidth="1.8" />
        <path d="M11 22 v35" stroke="#fff" strokeWidth="0.8" opacity="0.35" />
        {/* Base */}
        <rect x="6" y="59.5" width="28" height="4.5" rx="1" fill="url(#sd-brass)" />
        <rect x="8" y="64" width="24" height="8" rx="1.5" fill="url(#sd-brass)" />
        <path d="M8 66 h24" stroke="#fff" strokeWidth="0.6" opacity="0.3" />
      </svg>
    </>
  )
}

// ---------- Plank-edge items ----------

export function Drape() {
  return (
    <svg viewBox="0 0 72 52" width="100%" height="100%" overflow="visible">
      <defs>
        <pattern id="sd-drape" width="12" height="52" patternUnits="userSpaceOnUse">
          <rect width="12" height="52" fill="#d7a44a" />
          <rect width="12" height="6" y="26" fill="#9e3f22" />
          <rect width="12" height="2.2" y="35" fill="#efe2c6" />
          <rect width="12" height="2.2" y="17" fill="#efe2c6" />
          <path
            d="M6 0 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4 q1.6 2.2 0 4.4 q-1.6 2.2 0 4.4"
            stroke="rgba(80,40,10,0.3)"
            strokeWidth="1.1"
            fill="none"
          />
        </pattern>
        <linearGradient id="sd-drape-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0a02" stopOpacity="0.38" />
        </linearGradient>
      </defs>
      <path d="M2 0 H70 Q73 22 67 44 Q36 49 5 44 Q-1 22 2 0 Z" fill="url(#sd-drape)" />
      <path d="M2 0 H70 Q73 22 67 44 Q36 49 5 44 Q-1 22 2 0 Z" fill="url(#sd-drape-shade)" />
      <path d="M15 2 Q18 24 15 45 M36 2 Q37 25 36 47 M57 2 Q55 24 58 45" stroke="rgba(40,18,4,0.25)" strokeWidth="1.5" fill="none" />
      <g stroke="#b56a2c" strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: 16 }, (_, i) => {
          const x = 7 + i * 3.8
          const y = 44.5 + Math.sin((x / 70) * Math.PI) * 3
          return <path key={i} d={`M${x} ${y} l${(i % 2) - 0.5} 5`} />
        })}
      </g>
    </svg>
  )
}

export function Garland() {
  const parts = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const x = 4 + t * 112
    const y = 3 + Math.sin(t * Math.PI) * 13
    parts.push(
      i % 3 === 2 ? (
        <Pinecone key={i} x={x} y={y + 6} s={0.5} r={(i % 2 ? 1 : -1) * 12} />
      ) : (
        <Leaf key={i} x={x} y={y + 5} size={i % 2 ? 11 : 13} rotate={(i % 2 ? 1 : -1) * (15 + i * 7)} colour={LEAF_COLOURS[i % LEAF_COLOURS.length]} oak={i % 4 === 1} />
      ),
    )
  }
  const beads = [0.12, 0.3, 0.5, 0.7, 0.88].map((t) => [4 + t * 112, 3 + Math.sin(t * Math.PI) * 13])
  return (
    <svg viewBox="0 0 120 32" width="100%" height="100%" overflow="visible">
      <path d="M2 2 Q60 30 118 2" stroke="#a8875a" strokeWidth="1" fill="none" />
      {parts}
      {beads.map(([x, y]) => (
        <circle key={x} cx={x + 5} cy={y + 1} r="1.6" fill="#c9a06a" stroke="#8a6436" strokeWidth="0.4" />
      ))}
      <circle cx="2" cy="2" r="1.8" fill="#c9a456" />
      <circle cx="118" cy="2" r="1.8" fill="#c9a456" />
    </svg>
  )
}

// ---------- The cat ----------

export function CatArt() {
  return (
    <svg viewBox="0 0 84 48" width="84" height="48" overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id="sd-cat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8a15c" />
          <stop offset="1" stopColor="#b8652b" />
        </linearGradient>
      </defs>
      {/* Its own little knitted blanket */}
      <path d="M2 40 Q42 36 82 40 L80 47 Q42 45 4 47 Z" fill="#9e3f22" />
      <path d="M2 40 Q42 36 82 40" stroke="#c46a3e" strokeWidth="1.2" fill="none" />
      <KnitLines x={4} y={39} w={76} h={8} colour="rgba(40,12,2,0.35)" />
      <g stroke="#d9c7a3" strokeWidth="1" strokeLinecap="round">
        <path d="M5 46.5 l-1 2.5 M9 46.3 l-0.6 2.5 M75 46.3 l0.6 2.5 M79 46.5 l1 2.5" />
      </g>
      <g transform="translate(6 3)">
        <g className="cat-tail">
          <path d="M60 34 C71 33 70 23 64 20" stroke="url(#sd-cat)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65.5 25 q2.4 0.2 3 1.8 M66 29.5 q2.2 -0.6 2.6 0.6" stroke="#a5531f" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M64.6 21.5 C63.9 20.6 63.4 20.2 63 20" stroke="#f3d2a8" strokeWidth="5.4" strokeLinecap="round" />
        </g>
        <g className="cat-body">
          <path d="M9 36 C5 23 15 11 34 11 C52 11 64 19 63 36 Z" fill="url(#sd-cat)" />
          <path d="M36 12.5 q-3 6 0 11 M45 14 q-3 6 0 11 M53 18 q-2.5 5 0 9 M28 13 q-2 4 0 7" stroke="#a5531f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M20 16 Q32 12 46 14" stroke="#f6c992" strokeWidth="1.2" fill="none" opacity="0.6" />
          <ellipse cx="24" cy="35" rx="4.8" ry="2.5" fill="#f3d2a8" />
          <ellipse cx="32.5" cy="35.5" rx="4.8" ry="2.4" fill="#f3d2a8" />
          <path d="M22 35.5 v1.3 M24.5 35.6 v1.3 M30.5 36 v1.3 M33 36.1 v1.3" stroke="#d4a67a" strokeWidth="0.6" />
        </g>
        <g className="cat-head">
          <path d="M6 20 L8.5 8 L15.5 15 Z" fill="#c9733a" />
          <path d="M20 14.5 L26.5 8 L28 20 Z" fill="#c9733a" />
          <path d="M8.3 17 L9.3 11 L13 15 Z M22.5 14.5 L25.8 11 L26.2 17 Z" fill="#e9a28f" />
          <path d="M9.6 13.5 l1.6 1 M24 13 l-1.4 1.2" stroke="#fff3e0" strokeWidth="0.5" opacity="0.8" />
          <ellipse cx="17" cy="24" rx="12" ry="10.5" fill="url(#sd-cat)" />
          <path d="M12 15.5 q1 2.5 0 4 M17 14 q0.8 2.5 0 4.5 M22 15.5 q-1 2.5 0 4" stroke="#a5531f" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M6 25 q2 -1 3.5 0 M28 25 q-2 -1 -3.5 0" stroke="#a5531f" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
          <ellipse cx="17" cy="29.2" rx="6" ry="4" fill="#f3d2a8" />
          <path d="M10.5 24.5 q2.5 2.2 5 0 M18.5 24.5 q2.5 2.2 5 0" stroke="#4a220b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M11 25.2 l-0.8 0.9 M23 25.2 l0.8 0.9" stroke="#4a220b" strokeWidth="0.6" strokeLinecap="round" />
          <path d="M15.8 27.5 h2.4 l-1.2 1.4 z" fill="#d9786a" />
          <path d="M17 28.9 v1 M17 29.9 q-1.2 1 -2.2 0.3 M17 29.9 q1.2 1 2.2 0.3" stroke="#8a4a30" strokeWidth="0.55" fill="none" strokeLinecap="round" />
          <ellipse cx="11.5" cy="27.5" rx="2" ry="1.1" fill="#f08c7a" opacity="0.35" />
          <ellipse cx="22.5" cy="27.5" rx="2" ry="1.1" fill="#f08c7a" opacity="0.35" />
          <path d="M11 28.5 l-8 -1.2 M11 29.5 l-8 1 M23 28.5 l8 -1.2 M23 29.5 l8 1" stroke="rgba(255,244,228,0.75)" strokeWidth="0.5" />
        </g>
      </g>
    </svg>
  )
}

// ---------- More shelf items ----------

export function Pinecones() {
  return (
    <svg viewBox="0 0 60 32" width="100%" height="100%" overflow="visible">
      {/* A sprig of pine behind them */}
      <g stroke="#3f5a2e" strokeWidth="0.9" strokeLinecap="round">
        <path d="M4 26 Q28 18 56 22" stroke="#5b3a1c" strokeWidth="1.4" fill="none" />
        {Array.from({ length: 13 }, (_, i) => {
          const x = 8 + i * 3.6
          const y = 24.5 - Math.sin((i / 12) * Math.PI) * 3.2
          return <path key={i} d={`M${x} ${y} l${-3 + (i % 3)} -9 M${x} ${y} l${3.5 - (i % 2)} -8.5 M${x} ${y} l${-4.5 + (i % 2)} -6`} stroke={i % 2 ? '#7a9a4a' : '#5f8038'} strokeWidth="1.1" />
        })}
      </g>
      <Pinecone x={16} y={20} r={-8} s={1.05} />
      <Pinecone x={44} y={22} r={78} s={0.95} />
      <Pinecone x={30} y={25} r={-70} s={0.75} />
    </svg>
  )
}

export function JackOLantern() {
  return (
    <>
      <span className="decor-glow is-jack" aria-hidden="true" />
      <svg viewBox="0 0 54 50" width="100%" height="100%" overflow="visible">
        <defs>
          <radialGradient id="sd-jack-light" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#fff2b0" />
            <stop offset="0.6" stopColor="#ffc54a" />
            <stop offset="1" stopColor="#e8791c" />
          </radialGradient>
        </defs>
        <Pumpkin x={27} y={32} s={1.5} vine={false} />
        <g className="decor-jack-face" fill="url(#sd-jack-light)" stroke="#7a3410" strokeWidth="0.6">
          <path d="M13 27 L19 20 L22.5 28 Z" />
          <path d="M41 27 L35 20 L31.5 28 Z" />
          <path d="M25 31 L27 27.5 L29 31 Z" />
          <path d="M11 34 Q27 46 43 34 L39.5 37.5 L37 35 L33.5 39.5 L30.5 36.5 L27 40.5 L23.5 36.5 L20.5 39.5 L17 35 L14.5 37.5 Z" />
        </g>
        <Leaf x={48} y={47} size={11} rotate={30} colour={LEAF_COLOURS[2]} flat />
      </svg>
    </>
  )
}

export function Apples() {
  const apple = (x, y, r, colour, leaf) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
      <path d={`M0 ${-r * 0.7} C${r} ${-r * 1.3} ${r * 1.3} ${r * 0.4} ${r * 0.35} ${r * 0.95} Q0 ${r * 0.8} ${-r * 0.35} ${r * 0.95} C${-r * 1.3} ${r * 0.4} ${-r} ${-r * 1.3} 0 ${-r * 0.7} Z`} fill={colour} />
      <ellipse cx={-r * 0.4} cy={-r * 0.2} rx={r * 0.22} ry={r * 0.35} fill="#fff" opacity="0.35" />
      <path d={`M0 ${-r * 0.65} q0.5 ${-r * 0.4} 1.6 ${-r * 0.6}`} stroke="#5b3a1c" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {leaf && <path d={`M1 ${-r * 0.9} q5 -4 8 0 q-4 2 -8 0 z`} fill="#6f8a34" />}
    </g>
  )
  return (
    <svg viewBox="0 0 72 52" width="100%" height="100%" overflow="visible">
      <defs>
        <linearGradient id="sd-wicker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a5c" />
          <stop offset="1" stopColor="#8a6030" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <path d="M10 26 Q36 -6 62 26" stroke="#8a6030" strokeWidth="3.4" fill="none" />
      <path d="M10 26 Q36 -6 62 26" stroke="#c99a5c" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
      {/* Apples */}
      {apple(22, 24, 8.5, '#c0392b', true)}
      {apple(48, 23, 8, '#a8b83a', false)}
      {apple(35, 21, 9, '#d6452b', true)}
      {/* Checked cloth peeking over the rim */}
      <path d="M44 27 L60 23 L56 33 Z" fill="#efe2c6" />
      <path d="M47 26.2 L55.5 32 M51 25.2 L57.4 29 M44.5 29 L58 25.5" stroke="#b0512e" strokeWidth="1.3" opacity="0.8" />
      {/* Basket */}
      <path d="M6 28 H66 L60 50 H12 Z" fill="url(#sd-wicker)" />
      <g stroke="#6e4a22" strokeWidth="0.8" opacity="0.8">
        {Array.from({ length: 11 }, (_, i) => (
          <path key={`v${i}`} d={`M${11 + i * 5} 28 L${13.5 + i * 4.3} 50`} />
        ))}
        <path d="M7.5 33.5 H64.5 M9 39 H63 M10.5 44.5 H61.5" />
      </g>
      <g stroke="#e0bd82" strokeWidth="0.6" opacity="0.5">
        <path d="M7.2 35 H64.8 M8.7 40.5 H63.3 M10.2 46 H61.8" />
      </g>
      <rect x="4.5" y="26.5" width="63" height="3.6" rx="1.8" fill="#a8783f" />
      <path d="M5 27.4 H67" stroke="#dcb47a" strokeWidth="0.8" />
    </svg>
  )
}

export function Mushrooms() {
  return (
    <svg viewBox="0 0 48 36" width="100%" height="100%" overflow="visible">
      {/* Moss */}
      <path d="M2 34 Q6 27 12 30 Q17 25 24 29 Q31 25 37 29 Q43 27 46 34 Z" fill="#5f7a34" />
      <path d="M5 33 q2 -3 4 -1 M15 31 q2 -3 4 -1 M29 31 q2 -3 4 -1 M38 32 q2 -3 4 0" stroke="#86a24a" strokeWidth="1" fill="none" />
      {/* Brown cap */}
      <path d="M33 30 Q32.5 22 34 18 H38 Q39.5 22 39 30 Z" fill="#efe3cc" />
      <path d="M26 19 Q36 6 46 19 Q36 22 26 19 Z" fill="#9a5a2a" />
      <path d="M29 16 Q36 9 43 16" stroke="#c07a42" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Red toadstool */}
      <path d="M14 31 Q13 20 15 13 H20 Q22 20 21 31 Z" fill="#f4ead8" />
      <path d="M15.5 21 Q17.5 22.5 19.8 21" stroke="#d8c7a6" strokeWidth="1" fill="none" />
      <path d="M4 14 Q17.5 -4 31 14 Q17.5 18 4 14 Z" fill="#c8321f" />
      <path d="M8 10 Q17.5 0 27 10" stroke="#e8634a" strokeWidth="1.4" fill="none" opacity="0.6" />
      <circle cx="11" cy="10" r="1.6" fill="#fbf2e2" />
      <circle cx="17" cy="5.5" r="1.9" fill="#fbf2e2" />
      <circle cx="23.5" cy="9" r="1.5" fill="#fbf2e2" />
      <circle cx="15" cy="12" r="1.1" fill="#fbf2e2" />
      <circle cx="21" cy="12.5" r="1" fill="#fbf2e2" />
      {/* A tiny one */}
      <path d="M7.5 32 v-4 h2 v4 z" fill="#efe3cc" />
      <path d="M5.5 28.4 Q8.5 23.5 11.5 28.4 Q8.5 29.4 5.5 28.4 Z" fill="#b8742c" />
    </svg>
  )
}

export function Owl() {
  return (
    <svg viewBox="0 0 36 50" width="100%" height="100%" overflow="visible">
      <defs>
        <radialGradient id="sd-owl" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#c98a4a" />
          <stop offset="1" stopColor="#7a4a22" />
        </radialGradient>
      </defs>
      {/* Body with ear tufts */}
      <path d="M6 10 L9 2 L13 8 Q18 6 23 8 L27 2 L30 10 Q35 22 33 36 Q30 48 18 48 Q6 48 3 36 Q1 22 6 10 Z" fill="url(#sd-owl)" />
      {/* Wings */}
      <path d="M4 24 Q1 36 8 44 Q10 34 8 24 Z M32 24 Q35 36 28 44 Q26 34 28 24 Z" fill="#6a3e1c" />
      {/* Belly with scalloped feathers */}
      <ellipse cx="18" cy="35" rx="9.5" ry="11" fill="#e8c79a" />
      <g stroke="#b88a52" strokeWidth="0.8" fill="none">
        <path d="M11.5 30 q2 2 4 0 q2 2 4 0 q2 2 4 0 M11 35 q2 2 4 0 q2 2 4 0 q2 2 4 0 q1.5 1.5 2.5 0 M12 40 q2 2 4 0 q2 2 4 0 q2 2 4 0" />
      </g>
      {/* Eyes (they blink) */}
      <circle cx="12" cy="17" r="6.2" fill="#f3e2c2" />
      <circle cx="24" cy="17" r="6.2" fill="#f3e2c2" />
      <g className="decor-owl-eyes">
        <circle cx="12" cy="17" r="3.6" fill="#e8a33a" />
        <circle cx="24" cy="17" r="3.6" fill="#e8a33a" />
        <circle cx="12" cy="17" r="2" fill="#2a1608" />
        <circle cx="24" cy="17" r="2" fill="#2a1608" />
        <circle cx="12.8" cy="16.2" r="0.7" fill="#fff" />
        <circle cx="24.8" cy="16.2" r="0.7" fill="#fff" />
      </g>
      <path d="M16.5 21 L19.5 21 L18 25 Z" fill="#d98a2a" />
      {/* Feet on a little branch */}
      <path d="M4 48.5 H32" stroke="#5b3a1c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13 46 v3 M15 46 v3 M21 46 v3 M23 46 v3" stroke="#d98a2a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ---------- Up high in a compartment ----------

// A cobweb in a top corner (drawn for the top-left; mirrored for the right),
// with a little spider bobbing on its thread.
export function Cobweb() {
  const spokes = [4, 22, 45, 68, 86].map((deg) => (deg * Math.PI) / 180)
  const radii = [10, 19, 29, 40, 52]
  const point = (a, r) => [Math.cos(a) * r, Math.sin(a) * r]
  const rings = radii.map((r, ri) => {
    let d = ''
    spokes.forEach((a, i) => {
      const [x, y] = point(a, r * (1 + (i % 2) * 0.05))
      if (i === 0) d += `M${x} ${y}`
      else {
        const mid = (a + spokes[i - 1]) / 2
        const [cx, cy] = point(mid, r * 0.8)
        d += ` Q${cx} ${cy} ${x} ${y}`
      }
    })
    return <path key={ri} d={d} />
  })
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible">
      <g stroke="rgba(242,236,224,0.55)" strokeWidth="0.6" fill="none">
        {spokes.map((a, i) => {
          const [x, y] = point(a, 60)
          return <path key={i} d={`M0 0 L${x} ${y}`} />
        })}
        {rings}
      </g>
      <g className="decor-spider">
        <path d="M34 26 V40" stroke="rgba(242,236,224,0.6)" strokeWidth="0.5" />
        <g transform="translate(34 42)">
          <g stroke="#1e140e" strokeWidth="0.8" strokeLinecap="round" fill="none">
            <path d="M-1.5 -0.5 l-3.5 -2.5 l-1 -2 M-1.5 0.5 l-4 -0.5 l-1.5 1.5 M-1.5 1.5 l-3.5 2 l-0.5 2 M1.5 -0.5 l3.5 -2.5 l1 -2 M1.5 0.5 l4 -0.5 l1.5 1.5 M1.5 1.5 l3.5 2 l0.5 2" />
          </g>
          <ellipse cx="0" cy="1" rx="2.4" ry="3" fill="#2a1c14" />
          <circle cx="0" cy="-2" r="1.6" fill="#2a1c14" />
          <circle cx="-0.6" cy="-2.3" r="0.35" fill="#fff" />
          <circle cx="0.6" cy="-2.3" r="0.35" fill="#fff" />
        </g>
      </g>
    </svg>
  )
}

// A friendly little ghost.
export function Ghost() {
  return (
    <svg viewBox="0 0 40 48" width="100%" height="100%" overflow="visible">
      <defs>
        <radialGradient id="sd-ghost" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f3eee6" />
          <stop offset="1" stopColor="#d9d0c2" />
        </radialGradient>
      </defs>
      <path
        d="M20 3 C31 3 36 12 36 23 L36 40 Q33 45 30 40 Q27 45 24 40 Q21 45 18 40 Q15 45 12 40 Q9 45 6 40 L4 23 C4 12 9 3 20 3 Z"
        fill="url(#sd-ghost)"
        opacity="0.93"
      />
      {/* Little arms */}
      <path d="M5 26 Q0 25 1 20 Q4 22 6 22 Z M35 26 Q40 25 39 20 Q36 22 34 22 Z" fill="#f3eee6" opacity="0.93" />
      <ellipse cx="14.5" cy="19" rx="2.3" ry="3" fill="#2a1c14" />
      <ellipse cx="25.5" cy="19" rx="2.3" ry="3" fill="#2a1c14" />
      <circle cx="15.2" cy="18" r="0.8" fill="#fff" />
      <circle cx="26.2" cy="18" r="0.8" fill="#fff" />
      <ellipse cx="20" cy="26" rx="2" ry="2.4" fill="#2a1c14" />
      <ellipse cx="11" cy="24" rx="2.4" ry="1.3" fill="#f2a08e" opacity="0.6" />
      <ellipse cx="29" cy="24" rx="2.4" ry="1.3" fill="#f2a08e" opacity="0.6" />
    </svg>
  )
}

// A little bat hanging upside down from the plank above, wings folded.
export function Bat() {
  return (
    <svg viewBox="0 0 30 40" width="100%" height="100%" overflow="visible">
      {/* Feet hooked on the plank */}
      <path d="M12 0 v5 M18 0 v5" stroke="#2a1c22" strokeWidth="1.3" strokeLinecap="round" />
      <g className="decor-bat-body">
        {/* Folded wings wrapped around the body */}
        <path d="M15 4 C4 6 2 20 6 30 Q10 26 12 31 Q13.5 27 15 32 Q16.5 27 18 31 Q20 26 24 30 C28 20 26 6 15 4 Z" fill="#4a3542" stroke="#8a6a7a" strokeWidth="0.7" />
        <path d="M15 5 C8 8 7 19 10 28 M15 5 C22 8 23 19 20 28" stroke="#6e5462" strokeWidth="0.9" fill="none" />
        <path d="M8 12 Q6 20 8 26" stroke="#b08a9a" strokeWidth="0.8" fill="none" opacity="0.6" />
        {/* Upside-down head: ears point down */}
        <circle cx="15" cy="31" r="5" fill="#5a4250" stroke="#8a6a7a" strokeWidth="0.6" />
        <path d="M11 34 L10 39 L13.5 35.5 Z M19 34 L20 39 L16.5 35.5 Z" fill="#5a4250" />
        <path d="M11.2 35 L10.8 37.5 L12.6 35.8 Z M18.8 35 L19.2 37.5 L17.4 35.8 Z" fill="#c98a9a" />
        <circle cx="13" cy="30" r="1.2" fill="#ffd36b" />
        <circle cx="17" cy="30" r="1.2" fill="#ffd36b" />
        <circle cx="13" cy="30.2" r="0.5" fill="#2a1608" />
        <circle cx="17" cy="30.2" r="0.5" fill="#2a1608" />
        <path d="M14 27 q1 -0.8 2 0" stroke="#f2a08e" strokeWidth="0.7" fill="none" />
      </g>
    </svg>
  )
}
