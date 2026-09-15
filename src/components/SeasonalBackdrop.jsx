import { getSeasons, SEASON_META } from '../data/occasions.js'
import { TIME_META } from '../data/timeOfDay.js'
import '../styles/seasonal.css'

// Which screen corner each season grows from. Every motif is drawn for its own
// corner, so branches, fronds, leaves and frost all reach in from the edge.
const CORNER = { Spring: 'tl', Summer: 'tr', Fall: 'bl', Winter: 'br' }

// Five tints per season, light → deep. The deeper steps sit on the season's
// own colour; the lighter ones give petals, veins and highlights room to glow.
const TINTS = {
  Spring: ['#e8f6e3', '#b9e2b2', '#80c88c', '#4f9d69', '#2d6a44'],
  Summer: ['#fdedc8', '#f8d083', '#eeab48', '#d4862a', '#985b17'],
  Fall: ['#fcdcb8', '#f1a968', '#dd7539', '#b3502a', '#773316'],
  Winter: ['#eaf3fd', '#bfdaf4', '#84b5e4', '#4a83c4', '#2c5b92'],
}

// Evenly spaced gradient stops.
function Stops({ colors }) {
  return colors.map((color, i) => (
    <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={color} />
  ))
}

// Four-point sparkle, shared by the summer glints and the night stars.
const GLINT = 'M0 -4 C0.5 -1 1 -0.5 4 0 C1 0.5 0.5 1 0 4 C-0.5 1 -1 0.5 -4 0 C-1 -0.5 -0.5 -1 0 -4 Z'

// --- Spring: a blossom branch reaching in from the top-left ------------------

// Notched blossom petal, pointing up from the flower's centre at (0, 0).
const PETAL = 'M0 0 C-3.3 -2.3 -3.8 -6.8 -1.5 -8.6 L0 -7.5 L1.5 -8.6 C3.8 -6.8 3.3 -2.3 0 0 Z'
const LEAF = 'M0 0 C2.6 -2.7 7.6 -2.9 11 0 C7.6 2.9 2.6 2.7 0 0 Z'

function Blossom({ t, x, y, s = 1, r = 0, delay = 0 }) {
  const stamens = Array.from({ length: 7 }, (_, i) => (i * 360) / 7)
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="bloom" style={{ animationDelay: `${delay}s` }}>
        <g fill="url(#sp-petal)" stroke={t[2]} strokeWidth="0.25" strokeOpacity="0.6">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d={PETAL} transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="2.2" fill="url(#sp-heart)" />
        <g stroke={t[3]} strokeWidth="0.35" strokeLinecap="round">
          {stamens.map((a) => (
            <line key={a} x1="0" y1="-0.9" x2="0" y2="-3.6" transform={`rotate(${a})`} />
          ))}
        </g>
        <g fill={t[4]}>
          {stamens.map((a) => (
            <circle key={a} cx="0" cy="-3.7" r="0.48" transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    </g>
  )
}

function Bud({ t, x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C-1.8 -1.2 -2.2 -4.2 0 -6.2 C2.2 -4.2 1.8 -1.2 0 0 Z" fill="url(#sp-petal)" />
      <path d="M0 0.4 C-1.6 -0.4 -1.9 -1.9 -1.2 -2.6 L0 -1.4 L1.2 -2.6 C1.9 -1.9 1.6 -0.4 0 0.4 Z" fill={t[3]} />
    </g>
  )
}

function SpringLeaf({ t, x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={LEAF} fill="url(#sp-leaf)" />
      <line x1="0.6" y1="0" x2="10" y2="0" stroke={t[0]} strokeWidth="0.35" strokeOpacity="0.8" />
    </g>
  )
}

function SpringMotif({ t }) {
  return (
    <svg viewBox="0 0 100 100" className="motif motif-spring" aria-hidden="true">
      <defs>
        <linearGradient id="sp-petal" x1="0.5" y1="1" x2="0.5" y2="0">
          <Stops colors={[t[2], t[1], t[0]]} />
        </linearGradient>
        <radialGradient id="sp-heart">
          <Stops colors={[t[0], t[2], t[3]]} />
        </radialGradient>
        <linearGradient id="sp-leaf" x1="0" y1="0" x2="1" y2="0">
          <Stops colors={[t[4], t[3], t[2]]} />
        </linearGradient>
        <linearGradient id="sp-bark" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="80" y2="50">
          <Stops colors={[t[4], t[3]]} />
        </linearGradient>
      </defs>

      <g className="sway-tl">
        {/* Branch and twigs, tapering away from the corner. */}
        <g fill="url(#sp-bark)">
          <path d="M-6 4 C16 8 40 18 62 33 C70 38 76 43 82 48 C74 45 66 41 58 37 C38 26 17 17 -6 13 Z" />
          <path d="M27 14 C33 9 39 5 48 2 C41 7 36 11 31 17 Z" />
          <path d="M47 28 C52 36 54 44 55 54 C52 46 49 39 44 31 Z" />
          <path d="M12 10 C12 18 10 24 6 30 C9 23 10 17 9 11 Z" />
        </g>
        <SpringLeaf t={t} x={33} y={20} r={62} s={0.9} />
        <SpringLeaf t={t} x={52} y={30} r={-38} />
        <SpringLeaf t={t} x={70} y={42} r={48} s={0.8} />
        <SpringLeaf t={t} x={16} y={12} r={-70} s={0.75} />
        <SpringLeaf t={t} x={54} y={48} r={120} s={0.7} />
        <Bud t={t} x={46} y={3} r={40} s={0.9} />
        <Bud t={t} x={82} y={48} r={115} s={0.8} />
        <Bud t={t} x={7} y={30} r={200} s={0.8} />
        <Blossom t={t} x={22} y={14} s={1.2} r={10} delay={0} />
        <Blossom t={t} x={42} y={23} s={1.45} r={-12} delay={1.4} />
        <Blossom t={t} x={63} y={35} s={1.05} r={25} delay={2.6} />
        <Blossom t={t} x={37} y={8} s={0.75} r={40} delay={3.5} />
        <Blossom t={t} x={55} y={50} s={0.85} r={-30} delay={2} />
        <Blossom t={t} x={9} y={25} s={0.7} r={15} delay={4.2} />
      </g>

      {/* Loose petals drifting away from the branch. */}
      {[
        { x: 30, y: 40, r: 30, s: 0.7, d: 0 },
        { x: 70, y: 60, r: -40, s: 0.6, d: 3 },
        { x: 18, y: 52, r: 75, s: 0.55, d: 6 },
        { x: 82, y: 26, r: 10, s: 0.5, d: 4.5 },
      ].map((p, i) => (
        <g key={i} className="drift" style={{ animationDelay: `${p.d}s` }}>
          <g transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})`}>
            <path d={PETAL} fill="url(#sp-petal)" className="drift-spin" />
          </g>
        </g>
      ))}
    </svg>
  )
}

// --- Summer: tropical fronds, a hibiscus and sunlit glints (top-right) -------
// Deliberately no sun here, so it never clashes with the Day icon.

// Point and tangent angle on a quadratic Bézier at t.
function quad(p0, p1, p2, t) {
  const mt = 1 - t
  const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0]
  const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]
  const dx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
  const dy = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI }
}

// A slender leaflet pointing along +x.
function blade(length, width) {
  const f = (n) => n.toFixed(2)
  return (
    `M0 0 C${f(length * 0.3)} ${f(-width)} ${f(length * 0.72)} ${f(-width * 0.55)} ${f(length)} 0 ` +
    `C${f(length * 0.72)} ${f(width * 0.3)} ${f(length * 0.3)} ${f(width * 0.4)} 0 0 Z`
  )
}

// A palm frond: leaflets on both sides of a curved midrib, shortening toward the tip.
function Frond({ p0, p1, p2, length, count, bladeFill }) {
  const blades = []
  for (let i = 1; i <= count; i++) {
    const tt = i / (count + 0.8)
    const { x, y, angle } = quad(p0, p1, p2, tt)
    const l = length * (1 - tt * 0.6)
    for (const side of [-1, 1]) {
      blades.push(
        <path
          key={`${i}:${side}`}
          d={blade(l, l * 0.17)}
          transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(angle + side * 56).toFixed(1)})`}
        />,
      )
    }
  }
  return (
    <g>
      <g fill={bladeFill}>{blades}</g>
      <path
        d={`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`}
        fill="none"
        stroke="url(#su-rachis)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  )
}

const HIBISCUS_PETAL =
  'M0 0 C-5 -2 -8.2 -8 -6.2 -12 C-4.6 -13.6 -2.6 -12.5 -1.6 -13.7 C-0.5 -14.8 0.9 -14.8 1.7 -13.7 ' +
  'C2.9 -12.4 4.9 -13.6 6.3 -12 C8.2 -8 5 -2 0 0 Z'

function Hibiscus({ t, x, y, s, r }) {
  const angles = [0, 72, 144, 216, 288]
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="bloom">
        <g fill="url(#su-hibiscus)" stroke={t[3]} strokeWidth="0.3" strokeOpacity="0.5">
          {angles.map((a) => (
            <path key={a} d={HIBISCUS_PETAL} transform={`rotate(${a})`} />
          ))}
        </g>
        <g fill="none" stroke={t[4]} strokeWidth="0.3" strokeOpacity="0.45">
          {angles.map((a) => (
            <path key={a} d="M0 -1.5 L0 -10 M0 -5 L-2.6 -9.5 M0 -5 L2.6 -9.5" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="2.6" fill={t[4]} />
        {/* Stamen column with pollen. */}
        <line x1="0" y1="0" x2="6.5" y2="-9" stroke={t[0]} strokeWidth="0.9" strokeLinecap="round" />
        <g fill={t[0]}>
          <circle cx="6.8" cy="-9.4" r="0.8" />
          <circle cx="5.2" cy="-8.6" r="0.6" />
          <circle cx="7.4" cy="-7.8" r="0.6" />
          <circle cx="6" cy="-10.6" r="0.55" />
        </g>
      </g>
    </g>
  )
}

function SummerMotif({ t }) {
  return (
    <svg viewBox="0 0 100 100" className="motif motif-summer" aria-hidden="true">
      <defs>
        <linearGradient id="su-blade" x1="0" y1="0" x2="1" y2="0">
          <Stops colors={[t[4], t[3], t[1]]} />
        </linearGradient>
        <linearGradient id="su-blade-light" x1="0" y1="0" x2="1" y2="0">
          <Stops colors={[t[3], t[2], t[0]]} />
        </linearGradient>
        <linearGradient id="su-rachis" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="30" y2="60">
          <Stops colors={[t[4], t[3]]} />
        </linearGradient>
        <radialGradient id="su-hibiscus" cx="0.5" cy="1" r="1">
          <Stops colors={[t[4], t[2], t[1], t[0]]} />
        </radialGradient>
      </defs>

      <g className="sway-tr">
        <Frond p0={[104, -4]} p1={[70, 6]} p2={[34, 34]} length={15} count={13} bladeFill="url(#su-blade)" />
        <Frond p0={[104, -2]} p1={[86, 30]} p2={[64, 70]} length={13} count={11} bladeFill="url(#su-blade-light)" />
        <Frond p0={[102, -4]} p1={[92, 12]} p2={[74, 26]} length={8} count={7} bladeFill="url(#su-blade-light)" />
      </g>

      <Hibiscus t={t} x={84} y={16} s={1.15} r={-18} />

      {/* Sunlight glinting like light on water. */}
      {[
        { x: 52, y: 52, s: 0.9, d: 0 },
        { x: 30, y: 18, s: 0.6, d: 1.1 },
        { x: 78, y: 48, s: 0.7, d: 2 },
        { x: 62, y: 14, s: 0.5, d: 0.6 },
        { x: 40, y: 64, s: 0.45, d: 1.6 },
      ].map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y}) scale(${g.s})`}>
          <path
            d={GLINT}
            fill={t[0]}
            stroke={t[1]}
            strokeWidth="0.3"
            className="glint"
            style={{ animationDelay: `${g.d}s` }}
          />
        </g>
      ))}
    </svg>
  )
}

// --- Fall: maple and oak leaves with acorns (bottom-left) --------------------

const MAPLE =
  'M0 -10 L2 -6.2 L5.2 -7.4 L4.2 -3.2 L9.2 -4.2 L7.2 -1 L10 1.2 L5.2 2.2 L6.2 5.4 L2.2 3.6 L0.7 5.2 ' +
  'L0.7 9.4 L-0.7 9.4 L-0.7 5.2 L-2.2 3.6 L-6.2 5.4 L-5.2 2.2 L-10 1.2 L-7.2 -1 L-9.2 -4.2 L-4.2 -3.2 ' +
  'L-5.2 -7.4 L-2 -6.2 Z'
const MAPLE_VEINS =
  'M0 4.6 L0 -8.6 M0 2.2 L7.2 -2.6 M0 2.2 L-7.2 -2.6 M0 3.4 L4.6 4.4 M0 3.4 L-4.6 4.4 ' +
  'M0 -2 L3.2 -5.6 M0 -2 L-3.2 -5.6'
const OAK =
  'M0 -11 C2 -10 3 -8 2.2 -7 C4 -7 5 -5 3.4 -4 C5.4 -3.6 6 -1 4 0 C6 1 6 3.5 3.6 3.6 C4.4 5.5 3 7 1 6.4 ' +
  'L0.5 10 L-0.5 10 L-1 6.4 C-3 7 -4.4 5.5 -3.6 3.6 C-6 3.5 -6 1 -4 0 C-6 -1 -5.4 -3.6 -3.4 -4 ' +
  'C-5 -5 -4 -7 -2.2 -7 C-3 -8 -2 -10 0 -11 Z'
const OAK_VEINS =
  'M0 9 L0 -10 M0 -6 L2.6 -7.4 M0 -6 L-2.6 -7.4 M0 -2.4 L4 -3.6 M0 -2.4 L-4 -3.6 ' +
  'M0 1.2 L4.6 0.4 M0 1.2 L-4.6 0.4 M0 4.2 L3.4 4.6 M0 4.2 L-3.4 4.6'

function FallLeaf({ t, shape, veins, fill, x, y, r, s, delay, falling = false }) {
  const leaf = (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="leaf" style={{ animationDelay: `${delay}s` }}>
        <path d={shape} fill={fill} stroke={t[4]} strokeWidth="0.35" strokeLinejoin="round" strokeOpacity="0.55" />
        <path d={veins} fill="none" stroke={t[0]} strokeWidth="0.45" strokeLinecap="round" strokeOpacity="0.6" />
      </g>
    </g>
  )
  return falling ? (
    <g className="leaf-fall" style={{ animationDelay: `${delay}s` }}>
      {leaf}
    </g>
  ) : (
    leaf
  )
}

function Acorn({ t, x, y, r, s }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx="0" cy="2.4" rx="3" ry="3.8" fill="url(#fa-nut)" />
      <ellipse cx="-1" cy="2" rx="0.7" ry="1.6" fill={t[0]} opacity="0.35" />
      <path d="M-3.9 0.3 C-3.9 -3.5 3.9 -3.5 3.9 0.3 C2 1.1 -2 1.1 -3.9 0.3 Z" fill={t[4]} />
      <g fill={t[3]}>
        <circle cx="-2" cy="-0.9" r="0.45" />
        <circle cx="0" cy="-1.6" r="0.45" />
        <circle cx="2" cy="-0.9" r="0.45" />
        <circle cx="-1" cy="0.1" r="0.4" />
        <circle cx="1" cy="0.1" r="0.4" />
      </g>
      <path d="M0 -2.6 C0.3 -3.6 0.9 -4.2 1.6 -4.6" fill="none" stroke={t[4]} strokeWidth="0.8" strokeLinecap="round" />
    </g>
  )
}

function FallMotif({ t }) {
  return (
    <svg viewBox="0 0 100 100" className="motif motif-fall" aria-hidden="true">
      <defs>
        <linearGradient id="fa-g0" x1="0" y1="0" x2="0.9" y2="1">
          <Stops colors={[t[1], t[2], t[3]]} />
        </linearGradient>
        <linearGradient id="fa-g1" x1="0.1" y1="0" x2="0.8" y2="1">
          <Stops colors={[t[2], t[3], t[4]]} />
        </linearGradient>
        <linearGradient id="fa-g2" x1="0" y1="0.1" x2="1" y2="0.9">
          <Stops colors={[t[0], t[1], t[2]]} />
        </linearGradient>
        <linearGradient id="fa-nut" x1="0" y1="0" x2="1" y2="1">
          <Stops colors={[t[2], t[3], t[4]]} />
        </linearGradient>
      </defs>

      <g className="sway-bl">
        <FallLeaf t={t} shape={OAK} veins={OAK_VEINS} fill="url(#fa-g1)" x={42} y={88} r={58} s={1.35} delay={1.2} />
        <FallLeaf t={t} shape={MAPLE} veins={MAPLE_VEINS} fill="url(#fa-g0)" x={18} y={80} r={-22} s={1.7} delay={0} />
        <FallLeaf t={t} shape={MAPLE} veins={MAPLE_VEINS} fill="url(#fa-g2)" x={12} y={52} r={18} s={1.05} delay={2.4} />
        <FallLeaf t={t} shape={OAK} veins={OAK_VEINS} fill="url(#fa-g0)" x={32} y={62} r={-35} s={0.85} delay={3.1} />
        <Acorn t={t} x={56} y={90} r={-18} s={1.1} />
        <Acorn t={t} x={64} y={94} r={22} s={0.85} />
      </g>

      {/* A few leaves tumbling loose. */}
      <FallLeaf t={t} shape={MAPLE} veins={MAPLE_VEINS} fill="url(#fa-g1)" x={52} y={58} r={-40} s={0.7} delay={0.8} falling />
      <FallLeaf t={t} shape={MAPLE} veins={MAPLE_VEINS} fill="url(#fa-g2)" x={30} y={30} r={25} s={0.55} delay={4} falling />
      <FallLeaf t={t} shape={OAK} veins={OAK_VEINS} fill="url(#fa-g1)" x={70} y={74} r={80} s={0.55} delay={6.5} falling />
    </svg>
  )
}

// --- Winter: crystal snowflakes, frost ferns and falling snow (bottom-right) --

// One dendritic arm along -y; rotated six times it forms the flake.
const FLAKE_ARM =
  'M0 -1.8 V-10 M0 -3.4 L2.7 -5.4 M0 -3.4 L-2.7 -5.4 M0 -6.3 L2.2 -8 M0 -6.3 L-2.2 -8 ' +
  'M0 -8.7 L1.1 -9.7 M0 -8.7 L-1.1 -9.7'
const HEX = 'M0 -1.8 L1.56 -0.9 L1.56 0.9 L0 1.8 L-1.56 0.9 L-1.56 -0.9 Z'

// A fern of ice crystals growing from (x0, y0) in the given direction.
function frostPath(x0, y0, angleDeg, length, tickEvery = 3.2) {
  const a = (angleDeg * Math.PI) / 180
  const f = (n) => n.toFixed(2)
  let d = `M${x0} ${y0} L${f(x0 + Math.cos(a) * length)} ${f(y0 + Math.sin(a) * length)}`
  for (let s = tickEvery; s < length - 1; s += tickEvery) {
    const px = x0 + Math.cos(a) * s
    const py = y0 + Math.sin(a) * s
    const tick = (length - s) * 0.22 + 0.8
    for (const side of [-1, 1]) {
      const ta = a + side * 0.72
      d += ` M${f(px)} ${f(py)} L${f(px + Math.cos(ta) * tick)} ${f(py + Math.sin(ta) * tick)}`
    }
  }
  return d
}

const FROST = [frostPath(102, 102, 200, 40), frostPath(102, 102, 224, 46), frostPath(102, 102, 248, 38)].join(' ')

function Snowflake({ t, x, y, s, delay }) {
  const arms = [0, 60, 120, 180, 240, 300].map((a) => <path key={a} d={FLAKE_ARM} transform={`rotate(${a})`} />)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="flake" style={{ animationDelay: `${-delay * 3}s` }}>
        <g
          className="flake-glow"
          fill="none"
          stroke={t[0]}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeOpacity="0.55"
          style={{ animationDelay: `${delay}s` }}
        >
          {arms}
        </g>
        <g fill="none" stroke="url(#wi-ice)" strokeWidth="1" strokeLinecap="round">
          {arms}
        </g>
        <path d={HEX} fill={t[1]} stroke={t[3]} strokeWidth="0.35" />
        <circle r="0.55" fill={t[0]} />
      </g>
    </g>
  )
}

function WinterMotif({ t }) {
  return (
    <svg viewBox="0 0 100 100" className="motif motif-winter" aria-hidden="true">
      <defs>
        {/* User-space gradient along each arm (deep at the centre, icy at the tip);
            unlike bounding-box gradients it also renders on straight strokes. */}
        <linearGradient id="wi-ice" gradientUnits="userSpaceOnUse" x1="0" y1="-1.8" x2="0" y2="-10">
          <Stops colors={[t[4], t[3], t[1]]} />
        </linearGradient>
      </defs>

      <g fill="none" strokeLinecap="round">
        <path d={FROST} stroke={t[0]} strokeWidth="1.8" strokeOpacity="0.35" />
        <path d={FROST} stroke={t[2]} strokeWidth="0.6" strokeOpacity="0.75" />
      </g>

      <Snowflake t={t} x={72} y={72} s={1.7} delay={0} />
      <Snowflake t={t} x={44} y={86} s={1} delay={1.3} />
      <Snowflake t={t} x={87} y={42} s={1.05} delay={2.1} />
      <Snowflake t={t} x={56} y={50} s={0.6} delay={0.7} />
      <Snowflake t={t} x={26} y={72} s={0.5} delay={2.8} />
      <Snowflake t={t} x={78} y={18} s={0.45} delay={1.8} />

      {[
        [40, 40, 0.9, 0],
        [62, 30, 0.7, 1.5],
        [24, 58, 1.1, 3],
        [80, 56, 0.6, 0.8],
        [50, 64, 0.8, 2.2],
        [70, 86, 0.7, 4],
        [34, 84, 0.6, 1.2],
        [88, 30, 0.8, 2.8],
      ].map(([cx, cy, r, d], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={t[0]}
          stroke={t[2]}
          strokeWidth="0.25"
          className="snow"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </svg>
  )
}

// --- Time of day: sun (Day) and moon (Night), top-centre ---------------------

function SunIcon({ shades }) {
  return (
    <svg viewBox="0 0 60 60" className="tod-svg" aria-hidden="true">
      <defs>
        <radialGradient id="sbsun-core" cx="0.38" cy="0.34" r="0.78">
          <Stops colors={['#fff6d8', shades[0], shades[2]]} />
        </radialGradient>
        <radialGradient id="sbsun-halo">
          <stop offset="0%" stopColor={shades[0]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={shades[0]} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sbsun-ray" gradientUnits="userSpaceOnUse" x1="0" y1="-15" x2="0" y2="-27">
          <Stops colors={[shades[2], shades[0]]} />
        </linearGradient>
      </defs>
      <g transform="translate(30 30)">
        <circle r="24" fill="url(#sbsun-halo)" className="tod-halo" />
        <g className="tod-rays" stroke="url(#sbsun-ray)" strokeLinecap="round">
          {Array.from({ length: 16 }, (_, i) => (
            <line
              key={i}
              x1="0"
              y1="-15.5"
              x2="0"
              y2={i % 2 ? -21 : -26}
              strokeWidth={i % 2 ? 1.6 : 2.4}
              transform={`rotate(${i * 22.5})`}
            />
          ))}
        </g>
        <circle r="11.5" fill="url(#sbsun-core)" className="tod-suncore" />
        <circle r="11.5" fill="none" stroke="#fff6d8" strokeOpacity="0.55" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

function MoonIcon({ shades }) {
  return (
    <svg viewBox="0 0 60 60" className="tod-svg" aria-hidden="true">
      <defs>
        <linearGradient id="sbmoon-body" x1="0" y1="0" x2="0.6" y2="1">
          <Stops colors={['#eceaff', shades[0], shades[2]]} />
        </linearGradient>
        <radialGradient id="sbmoon-halo" cx="0.45" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={shades[0]} stopOpacity="0.45" />
          <stop offset="100%" stopColor={shades[0]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="30" r="27" fill="url(#sbmoon-halo)" />
      <path d="M40 12 a20 20 0 1 0 0 36 a15 15 0 1 1 0 -36 z" fill="url(#sbmoon-body)" />
      {/* Craters, placed inside the crescent. */}
      <g fill={shades[2]} fillOpacity="0.3">
        <circle cx="16" cy="30" r="1.8" />
        <circle cx="19.5" cy="21.5" r="1.1" />
        <circle cx="21" cy="39" r="1.4" />
      </g>
      {[
        { x: 48, y: 15, s: 1 },
        { x: 53, y: 38, s: 0.65 },
        { x: 10, y: 10, s: 0.55 },
      ].map((star, i) => (
        <g key={i} transform={`translate(${star.x} ${star.y}) scale(${star.s})`}>
          <path d={GLINT} fill={shades[0]} className="tod-star" style={{ animationDelay: `${i * 0.9}s` }} />
        </g>
      ))}
    </svg>
  )
}

const MOTIF = {
  Spring: SpringMotif,
  Summer: SummerMotif,
  Fall: FallMotif,
  Winter: WinterMotif,
}

// The season's tints as CSS custom properties, for the glow and edge styles.
function tintVars(season) {
  const t = TINTS[season]
  return {
    '--season-color': SEASON_META[season].color,
    '--t0': t[0],
    '--t1': t[1],
    '--t2': t[2],
    '--t3': t[3],
    '--t4': t[4],
  }
}

// Fixed, ambient decoration layer for the detail page: a detailed, animated
// motif and glow per season the perfume suits (each pinned to its own corner),
// plus a top-centre sun (Day) and/or moon (Night) for its ideal time of day.
export default function SeasonalBackdrop({ occasions, times = [] }) {
  const seasons = getSeasons(occasions)
  if (seasons.length === 0 && times.length === 0) return null

  return (
    <div className="seasonal-backdrop" aria-hidden="true">
      {times.includes('Day') && (
        <span className="tod-icon tod-sun">
          <SunIcon shades={TIME_META.Day.shades} />
        </span>
      )}
      {times.includes('Night') && (
        <span className="tod-icon tod-moon">
          <MoonIcon shades={TIME_META.Night.shades} />
        </span>
      )}

      {/* Glowing screen-edge border per season, anchored to its corner. */}
      {seasons.map((season, i) => (
        <span
          key={`edge-${season}`}
          className={`seasonal-edge edge-${CORNER[season]}`}
          style={{ ...tintVars(season), animationDelay: `${i * -1.6}s` }}
        />
      ))}

      {/* Corner glow + animated motif per season. */}
      {seasons.map((season) => {
        const Motif = MOTIF[season]
        return (
          <div key={season} className={`seasonal-corner corner-${CORNER[season]}`} style={tintVars(season)}>
            <span className="seasonal-glow" />
            <Motif t={TINTS[season]} />
          </div>
        )
      })}
    </div>
  )
}
