import { GENDERS, GENDER_META, OCCASIONS, SEASONS, SEASON_META } from '../data/occasions.js'

// Controlled search + filter bar. Parent owns the state; this component only
// renders inputs and reports changes.
export default function SearchFilterBar({
  query,
  onQueryChange,
  gender,
  onGenderChange,
  occasion,
  onOccasionChange,
  season,
  onSeasonChange,
}) {
  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="Search by name or brand…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search perfumes"
        />
      </div>

      <div className="chip-row" role="group" aria-label="Filter by gender">
        <button
          type="button"
          className={`chip ${gender === 'All' ? 'chip-active' : ''}`}
          onClick={() => onGenderChange('All')}
        >
          All
        </button>
        {GENDERS.map((g) => {
          const meta = GENDER_META[g]
          const active = gender === g
          return (
            <button
              key={g}
              type="button"
              className={`chip chip-gender ${active ? 'chip-gender-active' : ''}`}
              style={{ '--gender-color': meta.color }}
              onClick={() => onGenderChange(g)}
            >
              <span aria-hidden="true">{meta.emoji}</span> {g}
            </button>
          )
        })}
      </div>

      <div className="chip-row" role="group" aria-label="Filter by occasion">
        <button
          type="button"
          className={`chip chip-sm ${occasion === 'All' ? 'chip-active' : ''}`}
          onClick={() => onOccasionChange('All')}
        >
          Any occasion
        </button>
        {OCCASIONS.map((o) => (
          <button
            key={o}
            type="button"
            className={`chip chip-sm ${occasion === o ? 'chip-active' : ''}`}
            onClick={() => onOccasionChange(o)}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="chip-row" role="group" aria-label="Filter by season">
        <button
          type="button"
          className={`chip chip-sm ${season === 'All' ? 'chip-active' : ''}`}
          onClick={() => onSeasonChange('All')}
        >
          Any season
        </button>
        {SEASONS.map((s) => {
          const meta = SEASON_META[s]
          const active = season === s
          return (
            <button
              key={s}
              type="button"
              className={`chip chip-sm chip-season ${active ? 'chip-season-active' : ''}`}
              style={{ '--season-color': meta.color }}
              onClick={() => onSeasonChange(s)}
            >
              <span aria-hidden="true">{meta.emoji}</span> {s}
            </button>
          )
        })}
      </div>
    </div>
  )
}
