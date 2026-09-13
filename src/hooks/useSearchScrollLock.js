import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Holds the page still while the user is typing in the search field.
//
// Results change on every keystroke, and a shrinking list — especially when a
// half-typed query passes through "0 results" — leaves the document too short
// to sustain the current scroll position. The browser then clamps the scroll
// upward, so the search bar and everything around it slide up and down under
// the user's eyes.
//
// While the field has focus we therefore:
//   1. read the scroll position (the "anchor") on every render — i.e. before
//      React touches the DOM, so before the browser can clamp it — and
//      re-assert it right after the commit, before the browser paints;
//   2. grow the page with an invisible spacer whenever the content is too short
//      to sustain that anchor;
//   3. suspend the logo soft-wall's scroll snapping, which would otherwise
//      fight the hold.
// Because the anchor is simply "wherever the page was just before this
// update", scrolling by hand is never fought: the next keystroke holds the
// position the user scrolled to.
//
// (Tracking the anchor with scroll events instead is unreliable: they arrive
// asynchronously, so a scroll landing in the same frame as a keystroke would
// be missed and the hold would yank the page back to a stale position.)
//
// Leaving the field releases the hold: the page glides to exactly where the
// released page will settle (its real bottom, or the logo wall) and only on the
// frame it lands is the spacer removed, so nothing moves afterwards.

// The push back up is animated by hand (not native smooth scrolling) so we know
// the exact frame it lands on — native smooth scroll has no reliable "done"
// signal, and guessing with a timeout either waits too long or drops the
// spacer mid-glide, which snaps the last stretch.
const GLIDE_MIN_MS = 280
const GLIDE_MAX_MS = 700

// `wallRef` points at the logo soft-wall (Discover's content top), so a release
// that starts inside the logo band can glide onto a band edge.
export function useSearchScrollLock(wallRef) {
  const [active, setActive] = useState(false)
  const spacerRef = useRef(null)
  const anchorRef = useRef(0)
  const releasingRef = useRef(false)
  const cancelGlideRef = useRef(null)
  const restoreSnapRef = useRef('')

  // Resize the spacer so the document can always sustain the anchor, and undo
  // any clamping the browser already did.
  const sustain = useCallback(() => {
    const spacer = spacerRef.current
    if (!spacer) return
    spacer.style.height = '0px'
    const natural = document.documentElement.scrollHeight
    const needed = Math.max(0, anchorRef.current + window.innerHeight - natural)
    spacer.style.height = `${needed}px`
    if (Math.abs(window.scrollY - anchorRef.current) > 1) {
      window.scrollTo({ top: anchorRef.current, behavior: 'instant' })
    }
  }, [])

  // Render phase: DOM not yet updated for this render, so this is the position
  // the user is actually looking at. A plain read — no side effects.
  if (active && !releasingRef.current && typeof window !== 'undefined') {
    anchorRef.current = window.scrollY
  }

  // No dependency array on purpose: the hold has to be re-asserted after every
  // render that could have changed the page height, i.e. after every keystroke.
  useLayoutEffect(() => {
    if (active && !releasingRef.current) sustain()
  })

  useEffect(() => {
    if (!active) return

    // Snapping would drag the view to the logo panel or the content top while
    // the list is churning; the hold owns the scroll position instead.
    const html = document.documentElement
    restoreSnapRef.current = html.style.scrollSnapType
    html.style.scrollSnapType = 'none'

    // The on-screen keyboard opening/closing changes the viewport height, which
    // changes how much spacer is needed.
    const onResize = () => {
      if (releasingRef.current) return
      anchorRef.current = window.scrollY
      sustain()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      html.style.scrollSnapType = restoreSnapRef.current
    }
  }, [active, sustain])

  const onSearchFocus = useCallback(() => {
    // Tapping back into the field mid-glide: stop the glide and hold here.
    cancelGlideRef.current?.()
    releasingRef.current = false
    anchorRef.current = window.scrollY
    setActive(true)
    sustain()
  }, [sustain])

  const onSearchBlur = useCallback(() => {
    const spacer = spacerRef.current
    if (!spacer) {
      setActive(false)
      return
    }
    releasingRef.current = true

    let frame = 0
    const stopGlide = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', finish)
      window.removeEventListener('touchstart', finish)
      cancelGlideRef.current = null
    }
    // Only called once the view sits exactly where the released page settles,
    // so removing the spacer and restoring snapping can't move anything.
    function finish() {
      stopGlide()
      spacer.style.height = '0px'
      releasingRef.current = false
      setActive(false)
    }

    const from = window.scrollY

    // Dry-run the release to learn where the page will settle. Synchronous, so
    // nothing is painted in between: drop the spacer, restore snapping, force
    // layout, read the position, then put everything back. The browser's
    // answer includes clamping to the real bottom *and* the logo wall's snap
    // (onto the wall, or lining the content's bottom edge up with the screen) --
    // rules that differ per engine and would be fragile to re-implement.
    const html = document.documentElement
    const held = spacer.style.height
    spacer.style.height = '0px'
    html.style.scrollSnapType = restoreSnapRef.current
    void html.offsetHeight
    let to = Math.round(window.scrollY)
    const maxAfter = html.scrollHeight - window.innerHeight
    html.style.scrollSnapType = 'none'
    spacer.style.height = held
    void html.offsetHeight
    window.scrollTo({ top: from, behavior: 'instant' })

    // The one case the dry run can't see: a view left inside the logo band,
    // between the logo top and the wall. Browsers settle that by snapping to the
    // nearer of the two edges, but only on a later frame, so it would arrive
    // after the glide as a jump. Glide to the nearest reachable edge ourselves.
    const wall = wallRef?.current
    if (wall) {
      const wallTop = Math.round(wall.getBoundingClientRect().top + window.scrollY)
      if (to > 0 && to < wallTop) {
        const edges = wallTop <= maxAfter ? [0, wallTop] : [0]
        to = edges.reduce((best, edge) => (Math.abs(edge - to) < Math.abs(best - to) ? edge : best))
      }
    }

    // Usually a push back up, but it can be a short nudge down onto the wall
    // when the field was left with the view inside the logo band.
    const distance = to - from
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (Math.abs(distance) <= 1 || reduceMotion) {
      if (Math.abs(distance) > 1) window.scrollTo({ top: to, behavior: 'instant' })
      finish()
      return
    }

    // Longer pushes take a little longer, within bounds; ease-out so it feels
    // like being pushed by the wall and settling, not dragged.
    const duration = Math.min(GLIDE_MAX_MS, GLIDE_MIN_MS + Math.abs(distance) * 0.18)
    const startedAt = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      window.scrollTo({ top: from + distance * eased, behavior: 'instant' })
      if (t < 1) frame = requestAnimationFrame(step)
      else finish()
    }

    // A touch or wheel during the glide means the user takes over: end it
    // right away rather than fighting them.
    window.addEventListener('wheel', finish, { passive: true })
    window.addEventListener('touchstart', finish, { passive: true })
    cancelGlideRef.current = stopGlide
    frame = requestAnimationFrame(step)
  }, [])

  return { searchActive: active, spacerRef, onSearchFocus, onSearchBlur }
}
