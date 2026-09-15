// The "Scent" brand mark: a faceted crystal flacon with a fluted gold cap,
// amber juice and an engraved monogram medallion, crowned by rising scent
// wisps — above a serif wordmark, a gold flourish and a small tagline.
// The app icon (public/logo.svg) uses the same drawing on a dark ground, so
// keep the two in step when changing the flacon.
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Logo() {
  const { t } = useLanguage()

  return (
    <div className="logo">
      <svg className="logo-emblem" viewBox="0 0 100 120" width="76" height="91" role="img" aria-label="Scent">
        <defs>
          {/* Brushed gold: bright bands between darker edges, like a lit metal cap. */}
          <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6a24" />
            <stop offset="28%" stopColor="#e9cf8a" />
            <stop offset="50%" stopColor="#c49a48" />
            <stop offset="78%" stopColor="#f3dea0" />
            <stop offset="100%" stopColor="#7d5e1f" />
          </linearGradient>
          <linearGradient id="lg-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1d894" />
            <stop offset="55%" stopColor="#b8903f" />
            <stop offset="100%" stopColor="#7d5e1f" />
          </linearGradient>
          <linearGradient id="lg-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="55%" stopColor="#f4e6c8" />
            <stop offset="100%" stopColor="#e2c690" />
          </linearGradient>
          <linearGradient id="lg-juice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c878" />
            <stop offset="55%" stopColor="#d59a3c" />
            <stop offset="100%" stopColor="#9c6a1c" />
          </linearGradient>
          <radialGradient id="lg-medal" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0%" stopColor="#fbe7b0" />
            <stop offset="55%" stopColor="#d6ad5a" />
            <stop offset="100%" stopColor="#9a7425" />
          </radialGradient>
          <linearGradient id="lg-wisp" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#c49a48" />
            <stop offset="100%" stopColor="#e9cf8a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rising scent wisps. */}
        <g className="logo-wisps" fill="none" stroke="url(#lg-wisp)" strokeLinecap="round">
          <path d="M50 26 C45 21 55 16 50 10 C46 6 51 3 50 1" strokeWidth="1.6" />
          <path d="M44 26 C38 22 44 16 39 11" strokeWidth="1.1" />
          <path d="M56 26 C62 22 56 16 61 11" strokeWidth="1.1" />
        </g>

        {/* Fluted gold cap with a top highlight, collar and glass neck. */}
        <rect x="37" y="27" width="26" height="17" rx="3" fill="url(#lg-gold)" />
        <g stroke="#6f5219" strokeOpacity="0.35" strokeWidth="0.7">
          {[41, 45.5, 50, 54.5, 59].map((x) => (
            <line key={x} x1={x} y1="29.5" x2={x} y2="42" />
          ))}
        </g>
        <rect x="37" y="27" width="26" height="3.2" rx="1.6" fill="#fff4d2" opacity="0.55" />
        <rect x="33" y="43" width="34" height="5.5" rx="2" fill="url(#lg-gold-v)" />
        <rect x="42" y="48" width="16" height="6" fill="url(#lg-glass)" stroke="#b08640" strokeWidth="0.8" />

        {/* Faceted crystal body with amber juice and a meniscus highlight. */}
        <path
          d="M22 66 L33 55 L67 55 L78 66 L78 104 L67 115 L33 115 L22 104 Z"
          fill="url(#lg-glass)"
          stroke="#a67c33"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M26.5 74 Q50 69 73.5 74 L73.5 102.2 L65.2 110.5 L34.8 110.5 L26.5 102.2 Z" fill="url(#lg-juice)" />
        <path d="M27.5 74 Q50 69.6 72.5 74" fill="none" stroke="#fff1c9" strokeOpacity="0.8" strokeWidth="0.9" />
        <path
          d="M27 67.5 L35 59.5 L65 59.5 L73 67.5 L73 102.5 L65 110.5 L35 110.5 L27 102.5 Z"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />
        <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8">
          <line x1="33" y1="55" x2="35" y2="59.5" />
          <line x1="67" y1="55" x2="65" y2="59.5" />
          <line x1="22" y1="66" x2="27" y2="67.5" />
          <line x1="78" y1="66" x2="73" y2="67.5" />
          <line x1="22" y1="104" x2="27" y2="102.5" />
          <line x1="78" y1="104" x2="73" y2="102.5" />
          <line x1="33" y1="115" x2="35" y2="110.5" />
          <line x1="67" y1="115" x2="65" y2="110.5" />
        </g>
        <path d="M29.5 70 L33 66.5 L33 99 L29.5 101.5 Z" fill="#ffffff" opacity="0.45" />

        {/* Engraved monogram medallion. */}
        <circle cx="50" cy="91" r="12.5" fill="url(#lg-medal)" stroke="#8a6a24" strokeWidth="0.8" />
        <circle cx="50" cy="91" r="10.4" fill="none" stroke="#fff4d6" strokeOpacity="0.75" strokeWidth="0.6" />
        <text
          x="50"
          y="97.8"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="17"
          fontWeight="700"
          fill="#7d5e1f"
          opacity="0.45"
        >
          S
        </text>
        <text
          x="50"
          y="97.2"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="17"
          fontWeight="700"
          fill="#fffaf0"
        >
          S
        </text>

        {/* A glint on the glass and a soft ground shadow. */}
        <path
          className="logo-sparkle"
          d="M69 59 C69.5 62 70 62.5 73 63 C70 63.5 69.5 64 69 67 C68.5 64 68 63.5 65 63 C68 62.5 68.5 62 69 59 Z"
          fill="#ffffff"
        />
        <ellipse cx="50" cy="117.5" rx="24" ry="2.2" fill="#6f5219" opacity="0.16" />
      </svg>

      <h1 className="logo-wordmark">Scent</h1>
      <svg className="logo-flourish" viewBox="0 0 132 12" aria-hidden="true">
        <defs>
          <linearGradient id="lg-flourish-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b08640" stopOpacity="0" />
            <stop offset="100%" stopColor="#b08640" />
          </linearGradient>
          <linearGradient id="lg-flourish-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b08640" />
            <stop offset="100%" stopColor="#b08640" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="2" y="5.4" width="50" height="1.2" rx="0.6" fill="url(#lg-flourish-l)" />
        <rect x="80" y="5.4" width="50" height="1.2" rx="0.6" fill="url(#lg-flourish-r)" />
        <circle cx="56.5" cy="6" r="1.1" fill="#b08640" />
        <circle cx="75.5" cy="6" r="1.1" fill="#b08640" />
        <path d="M66 0.8 L71.2 6 L66 11.2 L60.8 6 Z" fill="#c49a48" stroke="#8a6a24" strokeWidth="0.6" />
        <path d="M66 3.4 L68.6 6 L66 8.6 L63.4 6 Z" fill="#fff4d6" opacity="0.7" />
      </svg>
      <p className="logo-tagline">{t('app.tagline')}</p>
    </div>
  )
}
