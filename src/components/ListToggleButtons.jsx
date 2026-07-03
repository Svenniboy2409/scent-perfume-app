import { useCollection } from '../context/CollectionContext.jsx'

// Heart (wishlist) + check (collection) toggle buttons.
// `size="sm"` renders the compact icon buttons used on cards;
// default renders the full labeled buttons used on the detail page.
export default function ListToggleButtons({ perfume, size = 'md' }) {
  const { isWishlisted, isCollected, toggleWishlist, toggleCollection } = useCollection()
  const wished = isWishlisted(perfume.id)
  const owned = isCollected(perfume.id)

  if (size === 'sm') {
    return (
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`icon-btn ${wished ? 'active wish' : ''}`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => toggleWishlist(perfume.id)}
        >
          {wished ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className={`icon-btn ${owned ? 'active own' : ''}`}
          aria-label={owned ? 'Remove from collection' : 'Add to collection'}
          aria-pressed={owned}
          onClick={() => toggleCollection(perfume.id)}
        >
          {owned ? '✓' : '+'}
        </button>
      </div>
    )
  }

  return (
    <div className="toggle-buttons">
      <button
        type="button"
        className={`btn ${wished ? 'btn-wish-active' : 'btn-outline'}`}
        aria-pressed={wished}
        onClick={() => toggleWishlist(perfume.id)}
      >
        <span className="btn-icon">{wished ? '♥' : '♡'}</span>
        {wished ? 'On Wishlist' : 'Add to Wishlist'}
      </button>
      <button
        type="button"
        className={`btn ${owned ? 'btn-own-active' : 'btn-outline'}`}
        aria-pressed={owned}
        onClick={() => toggleCollection(perfume.id)}
      >
        <span className="btn-icon">{owned ? '✓' : '+'}</span>
        {owned ? 'In Collection' : 'Add to Collection'}
      </button>
    </div>
  )
}
