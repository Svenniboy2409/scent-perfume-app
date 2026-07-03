import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import SearchFilterBar from '../components/SearchFilterBar.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Logo from '../components/Logo.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'
import { useSoftWallReveal } from '../hooks/useSoftWallReveal.js'

// Filters live in the URL's search params (rather than local state) so they
// survive navigating to a perfume's detail page and back via the browser's
// back button — the query string is part of that history entry.
export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams()
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

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PERFUMES.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      const matchesGender = gender === 'All' || p.gender === gender
      const matchesOccasion = occasion === 'All' || p.occasions.includes(occasion)
      const matchesSeason = season === 'All' || p.occasions.includes(season)
      return matchesQuery && matchesGender && matchesOccasion && matchesSeason
    }).sort(
      (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name),
    )
  }, [query, gender, occasion, season])

  const contentRef = useRef(null)
  useSoftWallReveal(contentRef)
  useRestoreScroll(results.length > 0)

  return (
    <div className="discover-page">
      <div className="logo-reveal">
        <Logo />
      </div>

      <div className="discover-content" ref={contentRef}>
        <header className="page-header">
          <p className="eyebrow">Explore</p>
          <h1 className="page-title">Discover</h1>
          <p className="page-subtitle">
            {PERFUMES.length} fragrances · notes &amp; occasions for every mood
          </p>
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
        />

        <p className="result-count">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>

        {results.length > 0 ? (
          <PerfumeGrid perfumes={results} />
        ) : (
          <EmptyState
            icon="⌕"
            title="No matches"
            message="Try a different search term or clear your filters."
          />
        )}
      </div>
    </div>
  )
}
