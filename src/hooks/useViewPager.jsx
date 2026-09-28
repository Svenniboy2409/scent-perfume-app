import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Two (or more) views side by side, like a panorama: a clear horizontal swipe
// pans the "camera" from one to the next, following the finger. Views are
// ordered left → right as given; the neighbour of the active view is only
// rendered while it's being revealed, so the page keeps the height (and the
// scroll behaviour) of the active one.
//
// A swipe only counts when it's clearly horizontal and goes far enough:
// COMMIT of the width, or FLICK of it done quickly. Anything less springs
// back, and pulling past either end only gives a little.

const START = 12 // px of horizontal travel before a drag takes over
const COMMIT = 0.35
const FLICK = 0.2
const FLICK_SPEED = 0.55 // px per ms
const GAP = 24 // px between two views
const DURATION = 420 // ms
const EASE = 'cubic-bezier(0.22, 0.8, 0.2, 1)'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * @param views     view ids, left to right
 * @param active    the active view id
 * @param onChange  (view) => void, called once a pan to a view has finished
 * @param onProgress (position, animate) => void — position is a fractional
 *                  index (0 = first view … 1 = second), e.g. for a switch thumb
 * @param render    (view, isActive) => element
 * @returns { element, panTo(view) }
 */
export function useViewPager({ views, active, onChange, onProgress, render }) {
  const index = Math.max(0, views.indexOf(active))
  const trackRef = useRef(null)
  const gesture = useRef(null)
  const suppressClick = useRef(false)
  const springBack = useRef(null)
  const [peek, setPeek] = useState(null) // index of the neighbour on show
  const [settling, setSettling] = useState(null) // index being panned to

  const callbacks = useRef({ onChange, onProgress })
  callbacks.current = { onChange, onProgress }

  const width = () => (trackRef.current?.offsetWidth ?? 0) + GAP

  const setOffset = useCallback(
    (px, animate) => {
      const track = trackRef.current
      if (!track) return
      track.style.transition = animate ? `transform ${DURATION}ms ${EASE}` : 'none'
      // No transform at rest: it would trap fixed-position descendants.
      track.style.transform = px ? `translate3d(${px}px, 0, 0)` : ''
      callbacks.current.onProgress?.(index - px / width(), animate)
    },
    [index],
  )

  const settle = useCallback(
    (target) => {
      clearTimeout(springBack.current)
      if (target === index) {
        setOffset(0, true)
        springBack.current = setTimeout(() => setPeek(null), DURATION)
      } else if (reducedMotion()) {
        callbacks.current.onChange(views[target])
      } else {
        setSettling(target)
        setOffset((index - target) * width(), true)
      }
    },
    [index, setOffset, views],
  )

  // Once the pan has finished, the neighbour becomes the active view.
  useEffect(() => {
    if (settling === null) return undefined
    const done = setTimeout(() => callbacks.current.onChange(views[settling]), DURATION)
    return () => clearTimeout(done)
  }, [settling, views])

  // The active view changed: it now sits at the origin, no neighbour showing.
  const shown = useRef(index)
  useLayoutEffect(() => {
    if (shown.current === index) return
    shown.current = index
    setSettling(null)
    setPeek(null)
    setOffset(0, false)
  }, [index, setOffset])

  useEffect(() => () => clearTimeout(springBack.current), [])

  // Tapping the switch: reveal the neighbour, then pan to it.
  const panTo = useCallback(
    (view) => {
      const target = views.indexOf(view)
      if (target === index || target < 0 || settling !== null) return
      if (reducedMotion()) {
        callbacks.current.onChange(view)
        return
      }
      clearTimeout(springBack.current)
      setPeek(target)
      requestAnimationFrame(() => requestAnimationFrame(() => settle(target)))
    },
    [index, settle, settling, views],
  )

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' || settling !== null) return
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: false }
  }

  const onPointerMove = (e) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.dragging) {
      if (Math.abs(dy) > START && Math.abs(dy) >= Math.abs(dx)) {
        gesture.current = null // a scroll, not a swipe
        return
      }
      if (Math.abs(dx) < START || Math.abs(dx) < Math.abs(dy) * 1.5) return
      // Take over. Distance still counts from where the finger went down.
      g.dragging = true
      g.samples = [[e.timeStamp, g.x]]
      clearTimeout(springBack.current)
      e.currentTarget.setPointerCapture?.(e.pointerId)
      return
    }
    let offset = e.clientX - g.x
    const target = offset < 0 ? index + 1 : index - 1
    if (target < 0 || target >= views.length) offset *= 0.2 // nothing there: resist
    else if (peek !== target) setPeek(target)
    g.offset = offset
    g.samples.push([e.timeStamp, e.clientX])
    if (g.samples.length > 6) g.samples.shift()
    setOffset(offset, false)
  }

  const onPointerEnd = (e) => {
    const g = gesture.current
    gesture.current = null
    if (!g || g.id !== e.pointerId || !g.dragging) return
    // The browser may still fire a click for the finger lifting: swallow it.
    suppressClick.current = true
    setTimeout(() => (suppressClick.current = false), 350)
    const offset = g.offset ?? 0
    const target = offset < 0 ? index + 1 : index - 1
    const distance = Math.abs(offset) / width()
    const [t0, x0] = g.samples[0]
    const [t1, x1] = g.samples[g.samples.length - 1]
    const speed = Math.abs(x1 - x0) / Math.max(1, t1 - t0)
    const valid = target >= 0 && target < views.length
    settle(valid && (distance > COMMIT || (distance > FLICK && speed > FLICK_SPEED)) ? target : index)
  }

  // A swipe that started on a card or a bottle mustn't also open it.
  const onClickCapture = (e) => {
    if (suppressClick.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const neighbour = settling ?? peek
  const element = (
    <div className="view-pager">
      <div
        ref={trackRef}
        className="view-pager-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
      >
        <div className="view-pager-pane">{render(views[index], true)}</div>
        {neighbour !== null && neighbour !== index && (
          <div
            className="view-pager-pane is-neighbour"
            style={{ left: `calc(${(neighbour - index) * 100}% + ${(neighbour - index) * GAP}px)` }}
            aria-hidden="true"
          >
            {render(views[neighbour], false)}
          </div>
        )}
      </div>
    </div>
  )
  return { element, panTo }
}
