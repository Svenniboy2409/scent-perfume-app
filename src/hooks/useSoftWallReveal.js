import { useLayoutEffect } from 'react'
import { useNavigationType } from 'react-router-dom'

// Positions the Discover page for the logo "soft wall" reveal.
//
// The actual soft-wall behaviour is done natively with CSS scroll-snapping
// (`scroll-snap-type: y proximity` on the document, with snap points at the
// logo panel top and the content top — see global.css). Momentum scrolling up
// from the list settles ("stops") at the content-top snap; pushing further up
// crosses to the logo snap; scrolling back down snaps to the content again.
//
// This hook only handles the initial scroll position: sit at the content top
// (logo hidden) on a fresh app load and on forward navigation into Discover,
// so the logo is revealed only by an intentional upward push. On a
// back-navigation it stays out of the way so useRestoreScroll can re-center the
// tapped card.

// Distinguishes a fresh app load (sit at the wall) from a back-navigation
// (let the card be restored). Both report navigationType 'POP', and the stored
// id can't be relied on due to StrictMode double-mounts, so we track mounts.
let hasMountedDiscover = false

export function useSoftWallReveal(contentRef, enabled = true) {
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (!enabled) return

    const contentTop = () => {
      const el = contentRef.current
      if (!el) return window.innerHeight
      return Math.round(el.getBoundingClientRect().top + window.scrollY)
    }

    const isFirstLoad = !hasMountedDiscover
    hasMountedDiscover = true

    // Sit at the content top (logo hidden) on first load and forward nav; skip
    // on back-navigation so the tapped card gets re-centered instead.
    if (navigationType !== 'POP' || isFirstLoad) {
      window.scrollTo({ top: contentTop(), left: 0, behavior: 'instant' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}
