import Tag from './Tag.jsx'

const LEVELS = [
  { key: 'top', label: 'Top Notes' },
  { key: 'heart', label: 'Heart Notes' },
  { key: 'base', label: 'Base Notes' },
]

export default function NotesPyramid({ notes }) {
  return (
    <div className="notes-pyramid">
      {LEVELS.map(({ key, label }) => {
        const items = notes?.[key] ?? []
        if (items.length === 0) return null
        return (
          <div className="notes-level" key={key}>
            <div className="notes-level-head">
              <span className={`notes-marker notes-${key}`} aria-hidden="true" />
              <h4>{label}</h4>
            </div>
            <div className="notes-tags">
              {items.map((note) => (
                <Tag key={note} variant="note">
                  {note}
                </Tag>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
