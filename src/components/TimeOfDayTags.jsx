import { getTimeOfDay, TIME_META } from '../data/timeOfDay.js'

// Renders a perfume's ideal time(s) of day as colored, emoji-prefixed pills.
// Reuses the season-pill styling (`.season-tags` / `.season-tag`), which is
// driven purely by the `--season-color` custom property.
export default function TimeOfDayTags({ perfume }) {
  const times = getTimeOfDay(perfume)
  if (times.length === 0) return null

  return (
    <div className="season-tags season-tags-pill">
      {times.map((time) => {
        const meta = TIME_META[time]
        return (
          <span
            key={time}
            className="season-tag"
            style={{ '--season-color': meta.color }}
          >
            <span className="season-emoji" aria-hidden="true">
              {meta.emoji}
            </span>
            {time}
          </span>
        )
      })}
    </div>
  )
}
