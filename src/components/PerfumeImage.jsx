import { useState, useEffect } from 'react'

// Deterministic pleasant hue from a string (brand/name), so each perfume gets
// a consistent, distinct color for its illustrated bottle placeholder.
function hueFromString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function initials(name) {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// Elegant illustrated-bottle placeholder — always renders, always looks
// intentional. Used when a perfume has no image or the remote image fails.
function BottlePlaceholder({ perfume }) {
  const hue = hueFromString(perfume.brand + perfume.name)
  const c1 = `hsl(${hue} 45% 42%)`
  const c2 = `hsl(${(hue + 40) % 360} 50% 24%)`
  const cap = `hsl(${hue} 25% 88%)`
  const gradId = `g-${perfume.id}`

  return (
    <div className="perfume-image placeholder" aria-hidden="true">
      <svg viewBox="0 0 120 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        {/* cap */}
        <rect x="50" y="14" width="20" height="16" rx="3" fill={cap} />
        {/* neck */}
        <rect x="53" y="28" width="14" height="10" fill={c2} opacity="0.85" />
        {/* body */}
        <rect x="30" y="38" width="60" height="98" rx="12" fill={`url(#${gradId})`} />
        {/* label */}
        <rect x="42" y="70" width="36" height="42" rx="4" fill="#fbf7ef" opacity="0.92" />
        <text
          x="60"
          y="97"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="20"
          fontWeight="700"
          fill={c2}
        >
          {initials(perfume.brand)}
        </text>
        {/* subtle highlight */}
        <rect x="36" y="44" width="10" height="86" rx="5" fill="#ffffff" opacity="0.12" />
      </svg>
    </div>
  )
}

// Renders `src` as a photo, falling back to the illustrated placeholder if the
// image is missing or fails to load. When no `src` is given, shows the
// placeholder immediately.
export default function PerfumeImage({ perfume, src, contain = false }) {
  const [errored, setErrored] = useState(false)

  // Reset the error state when the source changes (e.g. gallery navigation).
  useEffect(() => {
    setErrored(false)
  }, [src])

  if (!src || errored) {
    return <BottlePlaceholder perfume={perfume} />
  }

  return (
    <div className={`perfume-image ${contain ? 'contain' : ''}`}>
      <img
        src={src}
        alt={`${perfume.brand} ${perfume.name}`}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    </div>
  )
}
