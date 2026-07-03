// Renders a fragrance's longevity as a 5-segment strength meter plus a
// "{label} · {hours}" caption. `rating` is 1-5.
export default function Longevity({ rating, label, hours }) {
  return (
    <div
      className="longevity"
      role="img"
      aria-label={`Longevity: ${label}, ${hours}`}
    >
      <div className="longevity-meter" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((seg) => (
          <span
            key={seg}
            className={`longevity-seg ${seg <= rating ? 'filled' : ''}`}
          />
        ))}
      </div>
      <p className="longevity-caption">
        <span className="longevity-label">{label}</span>
        <span className="card-dot">·</span>
        <span>{hours}</span>
      </p>
    </div>
  )
}
