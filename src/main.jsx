import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { CollectionProvider } from './context/CollectionContext.jsx'
import './index.css'

// Let the app fully control scroll position on navigation instead of the
// browser's native back/forward scroll restoration, which otherwise races
// with (and can override) the perfume re-centering logic on list pages.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <CollectionProvider>
        <App />
      </CollectionProvider>
    </HashRouter>
  </React.StrictMode>,
)
