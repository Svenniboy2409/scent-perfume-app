// The "Scent" brand logo — an elegant SVG flacon emblem above a serif wordmark
// with a fine rule and small uppercase tagline. Uses the app's palette so it
// blends into the boutique aesthetic. Colors are inherited via currentColor /
// CSS variables where possible.
export default function Logo() {
  return (
    <div className="logo">
      <svg
        className="logo-emblem"
        viewBox="0 0 80 96"
        width="72"
        height="86"
        role="img"
        aria-label="Scent"
      >
        <defs>
          <linearGradient id="logo-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#caa25a" />
            <stop offset="100%" stopColor="#9c7526" />
          </linearGradient>
        </defs>
        {/* cap */}
        <rect x="33" y="6" width="14" height="12" rx="2" fill="#b89042" />
        {/* neck */}
        <rect x="35.5" y="17" width="9" height="8" fill="#a07f38" />
        {/* flacon body */}
        <path
          d="M22 34 Q22 26 30 25 L50 25 Q58 26 58 34 L58 78 Q58 88 48 88 L32 88 Q22 88 22 78 Z"
          fill="url(#logo-glass)"
          stroke="#8a6a24"
          strokeWidth="1.5"
        />
        {/* highlight */}
        <path
          d="M28 34 Q28 30 32 30 L34 30 L34 82 Q30 82 28 76 Z"
          fill="#ffffff"
          opacity="0.18"
        />
        {/* engraved 'S' */}
        <text
          x="40"
          y="66"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="34"
          fontWeight="700"
          fill="#fbf7ee"
        >
          S
        </text>
        {/* rising scent drop */}
        <circle cx="40" cy="3.5" r="2.4" fill="#caa25a" />
      </svg>

      <h1 className="logo-wordmark">Scent</h1>
      <div className="logo-rule" aria-hidden="true" />
      <p className="logo-tagline">Perfume Collection</p>
    </div>
  )
}
