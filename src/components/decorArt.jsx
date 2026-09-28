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

export function Cushion() {
  const shape = 'M6 9 Q38 1 70 7 Q76 36 70 64 Q38 71 7 64 Q1 36 6 9 Z'
  return (
    <svg viewBox="0 0 76 72" width="100%" height="100%" overflow="visible">
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
        <radialGradient id="sd-cushion-shade" cx="0.42" cy="0.38" r="0.72">
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1206" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <path d={shape} fill="url(#sd-plaid)" />
      <path d={shape} fill="url(#sd-cushion-shade)" />
      <path d={shape} fill="none" stroke="#7a2e1a" strokeWidth="2.2" />
      {/* Soft creases towards the button */}
      <path d="M38 36 L20 20 M38 36 L57 19 M38 36 L21 53 M38 36 L56 53" stroke="rgba(60,20,8,0.22)" strokeWidth="1" />
      {/* Embroidered leaf patch */}
      <circle cx="38" cy="36" r="10.5" fill="#efe2c6" />
      <circle cx="38" cy="36" r="9" fill="none" stroke="#b0512e" strokeWidth="0.8" strokeDasharray="1.6 1.2" />
      <Leaf x={38} y={36} size={13} rotate={-10} colour="#c2512b" />
      {/* Corner tassels */}
      {[
        [6, 9, -135],
        [70, 7, -45],
        [7, 64, 135],
        [70, 64, 45],
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
