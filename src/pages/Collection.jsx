import { PERFUMES } from '../data/perfumes.js'
import { useCollection } from '../context/CollectionContext.jsx'
import PerfumeGrid from '../components/PerfumeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRestoreScroll } from '../hooks/useRestoreScroll.js'

export default function Collection() {
  const { collection } = useCollection()
  const perfumes = PERFUMES.filter((p) => collection.includes(p.id))
  useRestoreScroll(perfumes.length > 0)

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Perfumes you own</p>
        <h1 className="page-title">My Collection</h1>
        {perfumes.length > 0 && (
          <p className="page-subtitle">
            {perfumes.length} {perfumes.length === 1 ? 'bottle' : 'bottles'} on your shelf
          </p>
        )}
      </header>

      {perfumes.length > 0 ? (
        <PerfumeGrid perfumes={perfumes} />
      ) : (
        <EmptyState
          icon="✓"
          title="No perfumes yet"
          message="Add the fragrances you already own with the + button to build your shelf."
          actionLabel="Browse perfumes"
          actionTo="/"
        />
      )}
    </div>
  )
}
