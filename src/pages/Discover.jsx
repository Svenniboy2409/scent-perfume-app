import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import SearchFilterBar from '../components/SearchFilterBar.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Logo from '../components/Logo.jsx'
import QueryHints from '../components/QueryHints.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'
import { useSoftWallReveal } from '../hooks/useSoftWallReveal.js'
import { useSearchScrollLock } from '../hooks/useSearchScrollLock.js'
import { describeQuery, searchPerfumes, suggestTerm } from '../utils/search.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Filters live in the URL's search params (rather than local state) so they
// survive navigating to a perfume's detail page and back via the browser's
// back button — the query string is part of that history entry.
export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, anyTerm } = useLanguage()
  const query = searchParams.get('q') ?? ''
  const gender = searchParams.get('gender') ?? 'All'
  const occasion = searchParams.get('occasion') ?? 'All'
  const season = searchParams.get('season') ?? 'All'

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'All') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  // Chips narrow the catalogue first; the search engine then ranks whatever is
  // left by relevance (an empty query falls back to brand → name order).
  const results = useMemo(() => {
    const shortlist = PERFUMES.filter(
      (p) =>
        (gender === 'All' || p.gender === gender) &&
        (occasion === 'All' || p.occasions.includes(occasion)) &&
        (season === 'All' || p.occasions.includes(season)),
    )
    return searchPerfumes(shortlist, query)
  }, [query, gender, occasion, season])

  const hints = useMemo(() => describeQuery(query), [query])
  // Suggestions come back as catalogue values (often English); show — and
  // search for — them in the app language. The index knows both spellings.
  const suggestion = useMemo(() => {
    if (results.length > 0 || !query.trim()) return null
    const term = suggestTerm(PERFUMES, query)
    return term ? anyTerm(term) : null
  }, [results.length, query, anyTerm])

  const contentRef = useRef(null)
  // Keeps the page from sliding around while the result list churns on every
  // keystroke; released (with a soft push back up) when the field loses focus.
  const { searchActive, spacerRef, onSearchFocus, onSearchBlur } = useSearchScrollLock(contentRef)

  useSoftWallReveal(contentRef)
  useRestoreScroll(results.length > 0)

  return (
    <div className="discover-page">
      <div className="logo-reveal">
        <Logo />
      </div>

      <div
        className={`discover-content ${searchActive ? 'search-active' : ''}`}
        ref={contentRef}
      >
        <header className="page-header">
          <p className="eyebrow">{t('discover.eyebrow')}</p>
          <h1 className="page-title">{t('discover.title')}</h1>
          <p className="page-subtitle">{t('discover.subtitle', PERFUMES.length)}</p>
        </header>

        <SearchFilterBar
          query={query}
          onQueryChange={(v) => setFilter('q', v)}
          gender={gender}
          onGenderChange={(v) => setFilter('gender', v)}
          occasion={occasion}
          onOccasionChange={(v) => setFilter('occasion', v)}
          season={season}
          onSeasonChange={(v) => setFilter('season', v)}
          onSearchFocus={onSearchFocus}
          onSearchBlur={onSearchBlur}
        />

        <div className="result-summary">
          <p className="result-count">
            {t('discover.results', results.length)}
            {query.trim() && results.length > 0 && (
              <span className="result-sorted">{t('discover.bestMatch')}</span>
            )}
          </p>
          <QueryHints hints={hints} />
        </div>

        {results.length > 0 ? (
          <PerfumeGrid perfumes={results} />
        ) : (
          <EmptyState
            icon="⌕"
            title={t('discover.noMatches')}
            message={
              suggestion
                ? t('discover.noMatchesFor', query.trim())
                : t('discover.noMatchesTips')
            }
            actionLabel={suggestion ? t('discover.searchInstead', suggestion) : null}
            onAction={suggestion ? () => setFilter('q', suggestion) : null}
          />
        )}

        {/* Grows only while the search is held, so a shrinking result list
            can't drag the page (and the search bar) upward. */}
        <div className="scroll-hold" ref={spacerRef} aria-hidden="true" />
      </div>
    </div>
  )
}
