import { Link } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import { useCollection } from '../context/CollectionContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'

export default function Collection() {
  const { collection } = useCollection()
  const { t } = useLanguage()
  const perfumes = PERFUMES.filter((p) => collection.includes(p.id))
  useRestoreScroll(perfumes.length > 0)

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
        <PerfumeGrid perfumes={perfumes} />
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
