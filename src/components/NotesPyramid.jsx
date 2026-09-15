import Tag from './Tag.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const LEVELS = ['top', 'heart', 'base']

export default function NotesPyramid({ notes }) {
  const { t, term } = useLanguage()

  return (
    <div className="notes-pyramid">
      {LEVELS.map((key) => {
        const items = notes?.[key] ?? []
        if (items.length === 0) return null
        return (
          <div className="notes-level" key={key}>
            <div className="notes-level-head">
              <span className={`notes-marker notes-${key}`} aria-hidden="true" />
              <h4>{t(`notes.${key}`)}</h4>
            </div>
            <div className="notes-tags">
              {items.map((note) => (
                <Tag key={note} variant="note">
                  {term('note', note)}
                </Tag>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
