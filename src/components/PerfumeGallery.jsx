import { useState, useRef } from 'react'
import PerfumeImage from './PerfumeImage.jsx'
import { getPerfumeImages } from '../utils/images.js'

// Swipeable image gallery for the detail page. Shows one slide when only a
// single photo is available; adds swipe + dot navigation for multiple.
export default function PerfumeGallery({ perfume }) {
  const images = getPerfumeImages(perfume)
  // Always render at least one slide (the placeholder handles "no image").
  const slides = images.length > 0 ? images : [undefined]
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(null)

  const go = (i) => setIndex(Math.max(0, Math.min(slides.length - 1, i)))

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchStartX.current = null
  }

  const multiple = slides.length > 1

  return (
    <div className="gallery">
      <div
        className="gallery-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="gallery-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((src, i) => (
            <div className="gallery-slide" key={i}>
              <PerfumeImage perfume={perfume} src={src} contain />
            </div>
          ))}
        </div>

        {multiple && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-prev"
              aria-label="Previous image"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-next"
              aria-label="Next image"
              disabled={index === slides.length - 1}
              onClick={() => go(index + 1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="gallery-dots" role="tablist" aria-label="Image navigation">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`gallery-dot ${i === index ? 'active' : ''}`}
              aria-label={`Go to image ${i + 1}`}
              aria-selected={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
