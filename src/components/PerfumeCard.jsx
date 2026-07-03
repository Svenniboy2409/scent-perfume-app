import { useNavigate } from 'react-router-dom'
import PerfumeImage from './PerfumeImage.jsx'
import ListToggleButtons from './ListToggleButtons.jsx'
import SeasonTags from './SeasonTags.jsx'
import { getPerfumeImages } from '../utils/images.js'
import { getOccasions, GENDER_META } from '../data/occasions.js'
import { rememberSelectedPerfume } from '../hooks/useRestoreScroll.js'

export default function PerfumeCard({ perfume }) {
  const navigate = useNavigate()
  const primaryOccasion = getOccasions(perfume.occasions)[0]
  const cover = getPerfumeImages(perfume)[0]
  const genderMeta = GENDER_META[perfume.gender]

  const openDetail = () => {
    rememberSelectedPerfume(perfume.id)
    navigate(`/perfume/${perfume.id}`)
  }

  return (
    <article
      className="card"
      data-id={perfume.id}
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openDetail()
        }
      }}
    >
      <div className="card-media">
        <PerfumeImage perfume={perfume} src={cover} contain />
        <ListToggleButtons perfume={perfume} size="sm" />
      </div>
      <div className="card-body">
        <p className="card-brand">{perfume.brand}</p>
        <h3 className="card-name">{perfume.name}</h3>
        <div className="card-meta">
          <span className="card-gender" style={{ '--gender-color': genderMeta.color }}>
            <span aria-hidden="true">{genderMeta.emoji}</span> {perfume.gender}
          </span>
          {primaryOccasion && <span className="card-dot">·</span>}
          {primaryOccasion && <span>{primaryOccasion}</span>}
        </div>
        <SeasonTags occasions={perfume.occasions} variant="compact" />
      </div>
    </article>
  )
}
