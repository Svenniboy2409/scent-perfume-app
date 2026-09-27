import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottlePlaceholder } from './PerfumeImage.jsx'
import { getFragranticaImage } from '../utils/images.js'
import { bottleSize, getBottleShape } from '../utils/bottleShape.js'
import { layoutShelves } from '../utils/shelfLayout.js'
import { rememberSelectedPerfume, useRestoreScroll } from '../hooks/useRestoreScroll.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/shelf.css'

// "Shelfie": the collection as bottles on a lit display cabinet. Each bottle
// is cut out of its product photo with a measured mask, sized by its
// real proportions, and placed in a back or front row (see utils/shelfLayout).

const FRAME = 22 // cabinet frame + inner padding on each side (px)
const HEADROOM = 30 // space above the tallest bottle on a shelf (px)
const SURFACE = 20 // visible top face of the plank the bottles stand on (px)
const FRONT_FLOOR = 4 // front row stands this far up the top face (px)
const FALLBACK_ASPECT = 1.95 // for perfumes without a measured photo (the drawn bottle)

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

function FairyLights({ width }) {
  const count = Math.max(5, Math.round(width / 40))
  const bulbs = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count
    return { x: t * 100, y: 6 + 22 * 4 * t * (1 - t) }
  })
  return (
    <div className="shelfie-lights" aria-hidden="true">
      <svg className="shelfie-wire" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 4 Q50 52 100 4" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className={`shelfie-bulb bulb-${i % 4}`}
          style={{ left: `${b.x}%`, top: `${b.y}px`, '--delay': `${(i * 0.37) % 2.4}s` }}
        />
      ))}
    </div>
  )
}

function ShelfBottle({ bottle, index, active, onPointerDown, onActivate, onHover }) {
  const { perfume, shape } = bottle
  // The photo CDN occasionally refuses a request when many bottles load at
  // once, so retry once before falling back to the drawn bottle.
  const [attempt, setAttempt] = useState(0)
  const photo = getFragranticaImage(perfume)
  const src = photo && attempt === 1 ? `${photo}${photo.includes('?') ? '&' : '?'}retry=1` : photo
  const cutout = shape && photo && attempt < 2

  return (
    <button
      type="button"
      data-id={perfume.id}
      className={`shelfie-bottle is-${bottle.row} ${active ? 'is-active' : ''}`}
      style={{
        left: bottle.x,
        bottom: FRONT_FLOOR + bottle.bottom,
        width: bottle.w,
        height: bottle.h,
        zIndex: bottle.row === 'front' ? 3 : 1,
        '--delay': `${index * 70}ms`,
      }}
      aria-label={`${perfume.brand} ${perfume.name}`}
      onPointerDown={onPointerDown}
      onClick={onActivate}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(perfume.id)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onHover(null)}
      // Only keyboard focus counts as hovering: a tapped button keeps its
      // focus, which would otherwise hold the bottle up after deselecting.
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && onHover(perfume.id)}
      onBlur={() => onHover(null)}
    >
      <span className="shelfie-contact" aria-hidden="true" />
      {/* Only this inner part lifts when the bottle is chosen: the button
          itself stays put, so it always settles back in the same spot and
          the pointer never slips off its bottom edge mid-lift. */}
      <span className="shelfie-lift">
        <span className="shelfie-cutout">
          {cutout ? (
            <span className="shelfie-glass" style={{ maskImage: shape.mask, WebkitMaskImage: shape.mask }}>
              <img
                key={src}
                src={src}
                alt=""
                draggable="false"
                style={shape.image}
                onError={() => setAttempt((a) => a + 1)}
              />
            </span>
          ) : (
            <BottlePlaceholder perfume={perfume} standing />
          )}
        </span>
        {index % 3 === 1 && <span className="shelfie-sparkle" aria-hidden="true" />}
      </span>
    </button>
  )
}

export default function PerfumeShelf({ perfumes }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const pointerType = useRef(null)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const usable = Math.max(0, width - FRAME * 2)
  const shelves = useMemo(() => {
    if (!usable) return []
    const layout = (scale) =>
      layoutShelves(
        perfumes.map((perfume) => {
          const shape = getBottleShape(perfume.id)
          return { id: perfume.id, perfume, shape, ...bottleSize(shape?.aspect ?? FALLBACK_ASPECT, scale) }
        }),
        usable,
      )
    const base = usable >= 560 ? 1.18 : 1
    let result = layout(base)
    // Slim bottles can leave the shelves looking bare; if even the fullest
    // shelf uses well under its width, enlarge everything a little.
    const extent = Math.max(
      ...result.map(({ bottles }) => {
        const left = Math.min(...bottles.map((b) => b.x))
        const right = Math.max(...bottles.map((b) => b.x + b.w))
        return right - left
      }),
    )
    if (extent < usable * 0.75) result = layout(base * Math.min(1.3, (usable * 0.88) / extent))
    return result
  }, [perfumes, usable])

  useRestoreScroll(shelves.length > 0)

  const open = (perfume) => {
    rememberSelectedPerfume(perfume.id)
    navigate(`/perfume/${perfume.id}`)
  }

  // Mouse and keyboard open straight away (the label shows on hover/focus).
  // On touch there's no hover, so the first tap reads the label, the second
  // one opens the perfume.
  const activate = (perfume) => {
    if (pointerType.current === 'touch' && selected !== perfume.id) {
      setSelected(perfume.id)
      return
    }
    open(perfume)
  }

  const activeId = hovered ?? selected
  let order = 0

  return (
    <div className="shelfie" ref={wrapRef}>
      <div className="shelfie-frame">
      <div
        className="shelfie-cabinet"
        onClick={(e) => {
          if (!e.target.closest('.shelfie-bottle, .shelfie-tag')) setSelected(null)
        }}
      >
        {usable > 0 && <FairyLights width={usable} />}

        {shelves.map((shelf, s) => {
          const stageHeight = shelf.height + HEADROOM + FRONT_FLOOR + SURFACE
          const active = shelf.bottles.find((b) => b.id === activeId)
          return (
            <section className="shelfie-shelf" key={s} aria-label={t('shelf.plaque', ROMAN[s] ?? s + 1)}>
              <div className="shelfie-stage" style={{ height: stageHeight }}>
                <span className="shelfie-spot" aria-hidden="true" />
                <span className="shelfie-surface" aria-hidden="true" />
                {shelf.bottles.map((bottle) => (
                  <ShelfBottle
                    key={bottle.id}
                    bottle={bottle}
                    index={order++}
                    active={activeId === bottle.id}
                    onPointerDown={(e) => {
                      pointerType.current = e.pointerType
                    }}
                    onActivate={() => activate(bottle.perfume)}
                    onHover={setHovered}
                  />
                ))}
                {active && (
                  <button
                    type="button"
                    className={`shelfie-tag ${
                      active.x + active.w / 2 < 80
                        ? 'align-start'
                        : active.x + active.w / 2 > usable - 80
                          ? 'align-end'
                          : ''
                    }`}
                    style={{
                      left: active.x + active.w / 2,
                      bottom: FRONT_FLOOR + active.bottom + active.h + 8,
                    }}
                    tabIndex={-1}
                    onClick={() => open(active.perfume)}
                  >
                    <span className="shelfie-tag-brand">{active.perfume.brand}</span>
                    <span className="shelfie-tag-name">{active.perfume.name}</span>
                    {selected === active.id && (
                      <span className="shelfie-tag-open">{t('shelf.open')} →</span>
                    )}
                  </button>
                )}
              </div>
              <div className="shelfie-plank" aria-hidden="true">
                <span className="shelfie-plate">{t('shelf.plaque', ROMAN[s] ?? s + 1)}</span>
              </div>
            </section>
          )
        })}
      </div>
      </div>
      <p className="shelfie-hint">{t('shelf.hint')}</p>
    </div>
  )
}
