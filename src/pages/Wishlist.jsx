import { PERFUMES } from '../data/perfumes.js'
import { useCollection } from '../context/CollectionContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'

export default function Wishlist() {
  const { wishlist } = useCollection()
  const { t } = useLanguage()
  const perfumes = PERFUMES.filter((p) => wishlist.includes(p.id))
  useRestoreScroll(perfumes.length > 0)

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">{t('wishlist.eyebrow')}</p>
        <h1 className="page-title">{t('wishlist.title')}</h1>
        {perfumes.length > 0 && (
          <p className="page-subtitle">{t('wishlist.subtitle', perfumes.length)}</p>
        )}
      </header>

      {perfumes.length > 0 ? (
        <PerfumeGrid perfumes={perfumes} />
      ) : (
        <EmptyState
          icon="♡"
          title={t('wishlist.emptyTitle')}
          message={t('wishlist.emptyMessage')}
          actionLabel={t('common.browse')}
          actionTo="/"
        />
      )}
    </div>
  )
}
