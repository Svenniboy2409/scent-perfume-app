import { NavLink } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext.jsx'

const ICONS = {
  discover: '✦',
  wishlist: '♥',
  collection: '✓',
}

export default function BottomNav() {
  const { wishlist, collection } = useCollection()

  const items = [
    { to: '/', label: 'Discover', icon: ICONS.discover, count: 0, end: true },
    { to: '/wishlist', label: 'Wishlist', icon: ICONS.wishlist, count: wishlist.length },
    { to: '/collection', label: 'Collection', icon: ICONS.collection, count: collection.length },
  ]

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(({ to, label, icon, count, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
        >
          <span className="nav-icon" aria-hidden="true">
            {icon}
            {count > 0 && <span className="nav-badge">{count}</span>}
          </span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
