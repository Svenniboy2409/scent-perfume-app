import { PERFUMES } from '../data/perfumes.js'
import { useCollection } from '../context/CollectionContext.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'

export default function Wishlist() {
  const { wishlist } = useCollection()
  const perfumes = PERFUMES.filter((p) => wishlist.includes(p.id))
  useRestoreScroll(perfumes.length > 0)

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Perfumes you want</p>
        <h1 className="page-title">Wishlist</h1>
        {perfumes.length > 0 && (
          <p className="page-subtitle">
            {perfumes.length} {perfumes.length === 1 ? 'fragrance' : 'fragrances'} saved
          </p>
        )}
      </header>

      {perfumes.length > 0 ? (
        <PerfumeGrid perfumes={perfumes} />
      ) : (
        <EmptyState
          icon="♡"
          title="Your wishlist is empty"
          message="Tap the heart on any perfume to save the ones you're longing for."
          actionLabel="Browse perfumes"
          actionTo="/"
        />
      )}
    </div>
  )
}
