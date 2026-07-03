import { useParams, useNavigate } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import PerfumeGallery from '../components/PerfumeGallery.jsx'
import NotesPyramid from '../components/NotesPyramid.jsx'
import ListToggleButtons from '../components/ListToggleButtons.jsx'
import Tag from '../components/Tag.jsx'
import SeasonTags from '../components/SeasonTags.jsx'
import Longevity from '../components/Longevity.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getOccasions, getSeasons, GENDER_META } from '../data/occasions.js'
import { getLongevity } from '../data/longevity.js'

export default function PerfumeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const perfume = PERFUMES.find((p) => p.id === id)
  const genderMeta = perfume && GENDER_META[perfume.gender]

  if (!perfume) {
    return (
      <div className="page">
        <EmptyState
          icon="?"
          title="Perfume not found"
          message="This fragrance doesn't exist or has been removed."
          actionLabel="Back to Discover"
          actionTo="/"
        />
      </div>
    )
  }

  return (
    <div className="page detail-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-hero">
        <div className="detail-media">
          <PerfumeGallery perfume={perfume} />
        </div>
        <div className="detail-heading">
          <p className="detail-brand">{perfume.brand}</p>
          <h1 className="detail-name">{perfume.name}</h1>
          <div className="detail-meta">
            <span>{perfume.concentration}</span>
            <span className="card-dot">·</span>
            <span className="detail-gender" style={{ '--gender-color': genderMeta.color }}>
              <span aria-hidden="true">{genderMeta.emoji}</span> {perfume.gender}
            </span>
            <span className="card-dot">·</span>
            <span>{perfume.year}</span>
          </div>
        </div>
      </div>

      <ListToggleButtons perfume={perfume} />

      <p className="detail-description">{perfume.description}</p>

      <section className="detail-section">
        <h3 className="section-title">Main Accords</h3>
        <div className="tag-wrap">
          {perfume.accords.map((accord) => (
            <Tag key={accord} variant="accord">
              {accord}
            </Tag>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3 className="section-title">Fragrance Notes</h3>
        <NotesPyramid notes={perfume.notes} />
      </section>

      <section className="detail-section">
        <h3 className="section-title">Longevity</h3>
        <Longevity {...getLongevity(perfume)} />
      </section>

      {getSeasons(perfume.occasions).length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">Season</h3>
          <SeasonTags occasions={perfume.occasions} variant="pill" />
        </section>
      )}

      {getOccasions(perfume.occasions).length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">Best For</h3>
          <div className="tag-wrap">
            {getOccasions(perfume.occasions).map((occasion) => (
              <Tag key={occasion} variant="occasion">
                {occasion}
              </Tag>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
