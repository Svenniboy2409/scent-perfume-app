import { getSeasons, SEASON_META } from '../data/occasions.js'

// Renders a perfume's seasons (in canonical order) as colored, emoji-prefixed
// labels. `variant="pill"` is used on the detail page; the default compact form
// is used on cards.
export default function SeasonTags({ occasions, variant = 'compact' }) {
  const seasons = getSeasons(occasions)
  if (seasons.length === 0) return null

  return (
    <div className={`season-tags season-tags-${variant}`}>
      {seasons.map((season) => {
        const meta = SEASON_META[season]
        return (
          <span
            key={season}
            className="season-tag"
            style={{ '--season-color': meta.color }}
          >
            <span className="season-emoji" aria-hidden="true">
              {meta.emoji}
            </span>
            {season}
          </span>
        )
      })}
    </div>
  )
}
