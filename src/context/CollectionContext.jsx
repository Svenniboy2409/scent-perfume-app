import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const WISHLIST_KEY = 'perfume-app:wishlist'
const COLLECTION_KEY = 'perfume-app:collection'

const CollectionContext = createContext(null)

export function CollectionProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage(WISHLIST_KEY, [])
  const [collection, setCollection] = useLocalStorage(COLLECTION_KEY, [])

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])
  const isCollected = useCallback((id) => collection.includes(id), [collection])

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
      // Wanting something you already own doesn't make sense, but we don't force
      // removal from collection here — only the reverse (owning removes wanting).
    },
    [setWishlist],
  )

  const toggleCollection = useCallback(
    (id) => {
      setCollection((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
      // Owning a perfume means you no longer "want" it — drop it from wishlist.
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev))
    },
    [setCollection, setWishlist],
  )

  const value = useMemo(
    () => ({
      wishlist,
      collection,
      isWishlisted,
      isCollected,
      toggleWishlist,
      toggleCollection,
    }),
    [wishlist, collection, isWishlisted, isCollected, toggleWishlist, toggleCollection],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) {
    throw new Error('useCollection must be used within a CollectionProvider')
  }
  return ctx
}
