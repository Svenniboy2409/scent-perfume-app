import { GENDERS, GENDER_META, OCCASIONS, SEASONS, SEASON_META } from '../data/occasions.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

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
  onSearchFocus,
  onSearchBlur,
}) {
  const { t, term } = useLanguage()

  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          // `type="text"` rather than "search": the browser's own clear button
          // is tiny and inconsistent, and we render our own below.
          type="text"
          className="search-input"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label={t('search.label')}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="search"
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            // Keep the field focused so the scroll hold isn't released.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onQueryChange('')}
            aria-label={t('search.clear')}
          >
            ×
          </button>
        )}
      </div>

      {/* Always rendered, even mid-search: a row that appeared on focus or
          vanished on blur would shift everything below it. Tapping an
          example simply replaces the query. */}
      <div className="search-examples">
        <span className="search-examples-label">{t('search.try')}</span>
        {t('search.examples').map((example) => (
          <button
            key={example}
            type="button"
            className="search-example"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onQueryChange(example)}
          >
            {example}
          </button>
        ))}
      </div>

      <div className="chip-row" role="group" aria-label={t('search.byGender')}>
        <button
          type="button"
          className={`chip ${gender === 'All' ? 'chip-active' : ''}`}
          onClick={() => onGenderChange('All')}
        >
          {t('search.all')}
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
              <span aria-hidden="true">{meta.emoji}</span> {term('gender', g)}
            </button>
          )
        })}
      </div>

      <div className="chip-row" role="group" aria-label={t('search.byOccasion')}>
        <button
          type="button"
          className={`chip chip-sm ${occasion === 'All' ? 'chip-active' : ''}`}
          onClick={() => onOccasionChange('All')}
        >
          {t('search.anyOccasion')}
        </button>
        {OCCASIONS.map((o) => (
          <button
            key={o}
            type="button"
            className={`chip chip-sm ${occasion === o ? 'chip-active' : ''}`}
            onClick={() => onOccasionChange(o)}
          >
            {term('occasion', o)}
          </button>
        ))}
      </div>

      <div className="chip-row" role="group" aria-label={t('search.bySeason')}>
        <button
          type="button"
          className={`chip chip-sm ${season === 'All' ? 'chip-active' : ''}`}
          onClick={() => onSeasonChange('All')}
        >
          {t('search.anySeason')}
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
              <span aria-hidden="true">{meta.emoji}</span> {term('season', s)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
