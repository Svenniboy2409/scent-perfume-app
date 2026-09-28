import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import { useCollection } from '../context/CollectionContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'
import { useViewPager } from '../hooks/useViewPager.jsx'

// The shelf (and its cut-out data) loads on its own; it's fetched in the
// background shortly after the page opens, so a swipe can reveal it at once.
const loadShelf = () => import('../components/PerfumeShelf.jsx')
const PerfumeShelf = lazy(loadShelf)
const VIEWS = ['tiles', 'shelf']

const VIEW_KEY = 'perfume-app:collection-view'

function TilesIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      {[2, 11].map((x) =>
        [2, 11].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="1.8" />),
      )}
    </svg>
  )
}

function ShelfIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="3" y="6" width="4" height="9" rx="1.2" />
      <rect x="4.2" y="4" width="1.6" height="2.4" rx="0.5" />
      <rect x="8.5" y="3" width="3.6" height="12" rx="1.2" />
      <rect x="9.5" y="1.2" width="1.6" height="2.2" rx="0.5" />
      <rect x="13.6" y="8.5" width="4" height="6.5" rx="1.6" />
      <rect x="14.8" y="6.8" width="1.6" height="2" rx="0.5" />
      <rect x="1" y="16" width="18" height="2.4" rx="1" />
    </svg>
  )
}

export default function Collection() {
  const { collection } = useCollection()
  const { t } = useLanguage()
  const [storedView, setView] = useLocalStorage(VIEW_KEY, 'tiles')
  const view = storedView === 'shelf' ? 'shelf' : 'tiles'
  const perfumes = PERFUMES.filter((p) => collection.includes(p.id))
  // The shelf restores its own scroll position once its layout is measured.
  useRestoreScroll(perfumes.length > 0 && view === 'tiles')

  const views = [
    { id: 'tiles', label: t('collection.viewTiles'), Icon: TilesIcon },
    { id: 'shelf', label: t('collection.viewShelf'), Icon: ShelfIcon },
  ]

  useEffect(() => {
    const timer = setTimeout(loadShelf, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Swipe left/right between Tiles and Shelfie; the switch's thumb follows.
  const thumbRef = useRef(null)
  const onProgress = useCallback((position, animate) => {
    const thumb = thumbRef.current
    if (!thumb) return
    thumb.style.transition = animate ? '' : 'none'
    thumb.style.translate = `${Math.min(1, Math.max(0, position)) * 100}% 0`
  }, [])
  const pager = useViewPager({
    views: VIEWS,
    active: view,
    onChange: setView,
    onProgress,
    render: (id, active) =>
      id === 'shelf' ? (
        <Suspense fallback={<div className="shelfie-loading" aria-hidden="true" />}>
          <PerfumeShelf perfumes={perfumes} active={active} />
        </Suspense>
      ) : (
        <PerfumeGrid perfumes={perfumes} />
      ),
  })

  return (
    <div className="page">
      <header className="page-header page-header-with-action">
        <Link to="/settings" className="settings-gear" aria-label={t('collection.settings')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M19.14 12.94a7.07 7.07 0 0 0 .06-.94 7.07 7.07 0 0 0-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54a7.03 7.03 0 0 0-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.73 8.87a.48.48 0 0 0 .12.61l2.03 1.58a7.3 7.3 0 0 0 0 1.88l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54c.05.24.25.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54a7.03 7.03 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <p className="eyebrow">{t('collection.eyebrow')}</p>
        <h1 className="page-title">{t('collection.title')}</h1>
        {perfumes.length > 0 && (
          <p className="page-subtitle">{t('collection.subtitle', perfumes.length)}</p>
        )}
      </header>

      {perfumes.length > 0 ? (
        <>
          <div className="view-switch" role="radiogroup" aria-label={t('collection.view')}>
            {views.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={view === id}
                className={`view-option ${view === id ? 'view-option-active' : ''}`}
                onClick={() => pager.panTo(id)}
              >
                <Icon />
                {label}
              </button>
            ))}
            <span
              ref={thumbRef}
              className={`view-thumb ${view === 'shelf' ? 'view-thumb-right' : ''}`}
              aria-hidden="true"
            />
          </div>

          {pager.element}
        </>
      ) : (
        <EmptyState
          icon="✓"
          title={t('collection.emptyTitle')}
          message={t('collection.emptyMessage')}
          actionLabel={t('common.browse')}
          actionTo="/"
        />
      )}
    </div>
  )
}
