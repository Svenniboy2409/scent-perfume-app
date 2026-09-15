import { useParams, useNavigate } from 'react-router-dom'
import { PERFUMES } from '../data/perfumes.js'
import PerfumeGallery from '../components/PerfumeGallery.jsx'
import NotesPyramid from '../components/NotesPyramid.jsx'
import ListToggleButtons from '../components/ListToggleButtons.jsx'
import Tag from '../components/Tag.jsx'
import SeasonTags from '../components/SeasonTags.jsx'
import Longevity from '../components/Longevity.jsx'
import TimeOfDayTags from '../components/TimeOfDayTags.jsx'
import SeasonalBackdrop from '../components/SeasonalBackdrop.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getOccasions, getSeasons, GENDER_META } from '../data/occasions.js'
import { getLongevity } from '../data/longevity.js'
import { getTimeOfDay } from '../data/timeOfDay.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function PerfumeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, term, describe } = useLanguage()
  const perfume = PERFUMES.find((p) => p.id === id)
  const genderMeta = perfume && GENDER_META[perfume.gender]

  if (!perfume) {
    return (
      <div className="page">
        <EmptyState
          icon="?"
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundMessage')}
          actionLabel={t('detail.backToDiscover')}
          actionTo="/"
        />
      </div>
    )
  }

  return (
    <div className="page detail-page">
      <SeasonalBackdrop occasions={perfume.occasions} times={getTimeOfDay(perfume)} />
      <div className="detail-content">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        {t('common.back')}
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
              <span aria-hidden="true">{genderMeta.emoji}</span> {term('gender', perfume.gender)}
            </span>
            <span className="card-dot">·</span>
            <span>{perfume.year}</span>
          </div>
        </div>
      </div>

      <ListToggleButtons perfume={perfume} />

      <p className="detail-description">{describe(perfume)}</p>

      <section className="detail-section">
        <h3 className="section-title">{t('detail.accords')}</h3>
        <div className="tag-wrap">
          {perfume.accords.map((accord) => (
            <Tag key={accord} variant="accord">
              {term('accord', accord)}
            </Tag>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3 className="section-title">{t('detail.notes')}</h3>
        <NotesPyramid notes={perfume.notes} />
      </section>

      <section className="detail-section">
        <h3 className="section-title">{t('detail.longevity')}</h3>
        <Longevity {...getLongevity(perfume)} />
      </section>

      {getSeasons(perfume.occasions).length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">{t('detail.season')}</h3>
          <SeasonTags occasions={perfume.occasions} variant="pill" />
        </section>
      )}

      <section className="detail-section">
        <h3 className="section-title">{t('detail.timeOfDay')}</h3>
        <TimeOfDayTags perfume={perfume} />
      </section>

      {getOccasions(perfume.occasions).length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">{t('detail.bestFor')}</h3>
          <div className="tag-wrap">
            {getOccasions(perfume.occasions).map((occasion) => (
              <Tag key={occasion} variant="occasion">
                {term('occasion', occasion)}
              </Tag>
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  )
}
