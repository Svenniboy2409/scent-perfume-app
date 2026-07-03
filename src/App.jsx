import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { useEffect } from 'react'
import BottomNav from './components/BottomNav.jsx'
import Discover from './pages/Discover.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Collection from './pages/Collection.jsx'
import PerfumeDetail from './pages/PerfumeDetail.jsx'
import './styles/global.css'

export default function App() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  // Scroll to top when navigating to a new screen (feels native on mobile).
  // Skip on back/forward (POP) navigation so list pages can instead restore
  // the scroll position of the perfume that was being viewed. Discover is also
  // skipped: it owns its scroll position (the logo soft-wall reveal positions
  // it at the content top on mount).
  useEffect(() => {
    if (navigationType === 'POP' || pathname === '/') return
    window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/perfume/:id" element={<PerfumeDetail />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
