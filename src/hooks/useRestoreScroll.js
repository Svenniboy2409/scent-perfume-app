import { useLayoutEffect } from 'react'
import { useNavigationType } from 'react-router-dom'

const STORAGE_KEY = 'perfume-app:lastSelectedId'

// Called by PerfumeCard right before navigating to a detail page, so the
// originating list knows which card to re-center on if the user comes back.
export function rememberSelectedPerfume(id) {
  try {
    sessionStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore (private browsing / storage unavailable)
  }
}

// Scrolls the previously-selected perfume card into the center of the
// viewport when returning to a list page via the browser/back-button (POP
// navigation). `ready` should be true once the grid for the current list has
// rendered (e.g. results.length > 0), so the target card exists in the DOM.
export function useRestoreScroll(ready) {
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (!ready || navigationType !== 'POP') return
    let id
    try {
      id = sessionStorage.getItem(STORAGE_KEY)
    } catch {
      return
    }
    if (!id) return

    const el = document.querySelector(`[data-id="${id}"]`)
    if (el) {
      el.scrollIntoView({ block: 'center' })
    }
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [ready, navigationType])
}
