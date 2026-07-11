import { getSeasons, SEASON_META } from '../data/occasions.js'
import { TIME_META } from '../data/timeOfDay.js'

// Which corner each season is pinned to.
const CORNER = { Spring: 'tl', Summer: 'tr', Fall: 'bl', Winter: 'br' }

// Three high-contrast linear gradients from a season/time shade palette
// (light↔deep pairs), referenced by shapes via url(#prefix-n). objectBoundingBox
// (default) maps each gradient across each referencing shape's own box, so every
// petal/leaf/wave shows the full gradient. `prefix` must be unique on the page —
// each motif/icon type renders at most once per detail page, so a static prefix
// per type is safe.
function GradDefs({ prefix, shades }) {
  const pairs = [
    [shades[0], shades[2]],
    [shades[2], shades[1]],
    [shades[1], shades[0]],
  ]
  return (
    <defs>
      {pairs.map((p, i) => (
        <linearGradient key={i} id={`${prefix}-${i}`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={p[0]} />
          <stop offset="100%" stopColor={p[1]} />
        </linearGradient>
      ))}
    </defs>
  )
}

// --- Time-of-day icons (sun for Day, moon for Night), top-centre ---

function SunIcon({ shades }) {
  return (
    <svg viewBox="0 0 60 60" className="tod-svg" aria-hidden="true">
      <defs>
        <radialGradient id="sbsun-core" cx="0.4" cy="0.34" r="0.75">
          <stop offset="0%" stopColor={shades[0]} />
          <stop offset="100%" stopColor={shades[2]} />
        </radialGradient>
      </defs>
      <g transform="translate(30 30)">
        <g className="tod-rays" style={{ color: shades[2] }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="-17" x2="0" y2="-24" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r="11" className="tod-suncore" style={{ '--shape-fill': 'url(#sbsun-core)' }} />
      </g>
    </svg>
  )
}

function MoonIcon({ shades }) {
  return (
    <svg viewBox="0 0 60 60" className="tod-svg" aria-hidden="true">
      <defs>
        <linearGradient id="sbmoon-body" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={shades[0]} />
          <stop offset="100%" stopColor={shades[2]} />
        </linearGradient>
      </defs>
      {/* crescent */}
      <path className="tod-moonbody" style={{ '--shape-fill': 'url(#sbmoon-body)' }} d="M40 12 a20 20 0 1 0 0 36 a15 15 0 1 1 0 -36 z" />
      {/* twinkling star */}
      <g className="tod-star" style={{ color: shades[0] }} transform="translate(17 19)">
        <line x1="0" y1="-4.5" x2="0" y2="4.5" />
        <line x1="-4.5" y1="0" x2="4.5" y2="0" />
      </g>
    </svg>
  )
}

// --- Per-season SVG motifs ---

function SpringMotif({ shades }) {
  // Drifting blossom petals, each a light↔deep green gradient.
  return (
    <svg viewBox="0 0 100 100" className="motif motif-spring" aria-hidden="true">
      <GradDefs prefix="sbsp" shades={shades} />
      {[
        { x: 20, y: 18, d: 0 },
        { x: 52, y: 30, d: 1.6 },
        { x: 34, y: 54, d: 3.1 },
        { x: 68, y: 60, d: 2.2 },
        { x: 14, y: 74, d: 0.8 },
      ].map((p, i) => (
        <g
          key={i}
          className="petal"
          style={{ animationDelay: `${p.d}s`, '--shape-fill': `url(#sbsp-${i % 3})` }}
          transform={`translate(${p.x} ${p.y})`}
        >
          <g className="petal-spin">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5" rx="2.6" ry="5" transform={`rotate(${a})`} />
            ))}
            <circle r="1.8" className="petal-core" />
          </g>
        </g>
      ))}
    </svg>
  )
}

function SummerMotif({ shades }) {
  // Shimmering heat / sea waves (gradient stroke) — deliberately NOT a sun.
  return (
    <svg viewBox="0 0 100 100" className="motif motif-summer" aria-hidden="true">
      <GradDefs prefix="sbsu" shades={shades} />
      {[34, 50, 66].map((y, i) => (
        <path
          key={y}
          className="wave"
          style={{ animationDelay: `${i * 0.7}s`, '--shape-stroke': `url(#sbsu-${i % 3})` }}
          d={`M14 ${y} q 11 -7 22 0 t 22 0 t 22 0`}
        />
      ))}
    </svg>
  )
}

function FallMotif({ shades }) {
  // Swaying, falling leaves — each a gradient fill; vein keeps a solid tint.
  return (
    <svg viewBox="0 0 100 100" className="motif motif-fall" aria-hidden="true">
      <GradDefs prefix="sbfa" shades={shades} />
      {[
        { x: 24, y: 22, s: 1, d: 0 },
        { x: 58, y: 40, s: 0.8, d: 1.9 },
        { x: 36, y: 62, s: 1.1, d: 3.4 },
        { x: 70, y: 70, s: 0.75, d: 1.1 },
      ].map((l, i) => (
        <g
          key={i}
          className="leaf"
          style={{ animationDelay: `${l.d}s`, color: shades[i % 3], '--shape-fill': `url(#sbfa-${i % 3})` }}
          transform={`translate(${l.x} ${l.y}) scale(${l.s})`}
        >
          <path d="M0 -7 C5 -4 5 4 0 8 C-5 4 -5 -4 0 -7 Z" />
          <line x1="0" y1="-6" x2="0" y2="7" className="leaf-vein" />
        </g>
      ))}
    </svg>
  )
}

function WinterMotif({ shades }) {
  // Twinkling snowflakes — crisp lines in varied blue tints (flat, not gradient:
  // objectBoundingBox gradients don't render on zero-area axis-aligned lines).
  return (
    <svg viewBox="0 0 100 100" className="motif motif-winter" aria-hidden="true">
      {[
        { x: 28, y: 22, s: 1, d: 0 },
        { x: 62, y: 32, s: 0.7, d: 1.3 },
        { x: 40, y: 58, s: 1.15, d: 2.6 },
        { x: 72, y: 66, s: 0.8, d: 0.7 },
        { x: 18, y: 72, s: 0.6, d: 3.2 },
      ].map((f, i) => (
        <g key={i} className="flake" style={{ animationDelay: `${f.d}s`, color: shades[i % shades.length] }} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
          {[0, 60, 120].map((a) => (
            <line key={a} x1="-7" y1="0" x2="7" y2="0" transform={`rotate(${a})`} />
          ))}
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

// Fixed, ambient decoration layer for the detail page: one season-colored
// motif + glow per season the perfume suits (pinned to a corner), plus a
// top-centre sun (Day) and/or moon (Night) for its ideal time of day.
export default function SeasonalBackdrop({ occasions, times = [] }) {
  const seasons = getSeasons(occasions)
  if (seasons.length === 0 && times.length === 0) return null

  return (
    <div className="seasonal-backdrop" aria-hidden="true">
      {/* Time of day: sun on the left, moon on the right (top centre). */}
      {times.includes('Day') && (
        <span className="tod-icon tod-sun" style={{ '--tod-color': TIME_META.Day.color }}>
          <SunIcon shades={TIME_META.Day.shades} />
        </span>
      )}
      {times.includes('Night') && (
        <span className="tod-icon tod-moon" style={{ '--tod-color': TIME_META.Night.color }}>
          <MoonIcon shades={TIME_META.Night.shades} />
        </span>
      )}

      {/* Glowing screen-edge border per season, anchored to its corner. */}
      {seasons.map((season, i) => (
        <span
          key={`edge-${season}`}
          className={`seasonal-edge edge-${CORNER[season]}`}
          style={{
            '--season-color': SEASON_META[season].color,
            animationDelay: `${i * -1.6}s`,
          }}
        />
      ))}

      {/* Corner glow + animated motif per season. */}
      {seasons.map((season) => {
        const Motif = MOTIF[season]
        return (
          <div
            key={season}
            className={`seasonal-corner corner-${CORNER[season]}`}
            style={{ '--season-color': SEASON_META[season].color }}
          >
            <span className="seasonal-glow" />
            <Motif shades={SEASON_META[season].shades} />
          </div>
        )
      })}
    </div>
  )
}
