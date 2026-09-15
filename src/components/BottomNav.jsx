import { NavLink, useLocation } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const ICONS = {
  discover: '✦',
  wishlist: '♥',
  collection: '✓',
}

export default function BottomNav() {
  const { wishlist, collection } = useCollection()
  const { t } = useLanguage()
  const { pathname } = useLocation()

  const items = [
    { to: '/', label: t('nav.discover'), icon: ICONS.discover, count: 0, end: true },
    { to: '/wishlist', label: t('nav.wishlist'), icon: ICONS.wishlist, count: wishlist.length },
    {
      to: '/collection',
      label: t('nav.collection'),
      icon: ICONS.collection,
      count: collection.length,
      // Settings is opened from the Collection page, so keep that tab lit.
      alsoActiveOn: '/settings',
    },
  ]

  return (
    <nav className="bottom-nav" aria-label={t('nav.primary')}>
      {items.map(({ to, label, icon, count, end, alsoActiveOn }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `nav-item ${isActive || pathname === alsoActiveOn ? 'nav-active' : ''}`
          }
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
