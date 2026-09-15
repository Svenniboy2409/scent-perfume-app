import { GENDER_META, SEASON_META } from '../data/occasions.js'
import { TIME_META } from '../data/timeOfDay.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Small emoji/color for each concept a query can stand for. Occasions have no
// meta of their own, so they fall back to a neutral pill.
const OCCASION_EMOJI = {
  Daily: '☕',
  Office: '💼',
  Evening: '🌆',
  Date: '💞',
  Sport: '🏃',
  Special: '✨',
}

function metaFor({ type, value }) {
  if (type === 'season') return SEASON_META[value]
  if (type === 'gender') return GENDER_META[value]
  if (type === 'time') return TIME_META[value]
  return { emoji: OCCASION_EMOJI[value] ?? '◈', color: '#8a7a52' }
}

// Shows how a free-text query was understood — "herfst" → 🍂 Fall — so it's
// obvious that concept words work, not just brand and product names.
export default function QueryHints({ hints }) {
  const { t, term } = useLanguage()
  if (!hints || hints.length === 0) return null

  return (
    <div className="query-hints">
      <span className="query-hints-label">{t('search.matching')}</span>
      {hints.map(({ type, value }) => {
        const meta = metaFor({ type, value })
        return (
          <span
            key={`${type}-${value}`}
            className="query-hint"
            style={{ '--hint-color': meta.color }}
          >
            <span aria-hidden="true">{meta.emoji}</span> {term(type, value)}
          </span>
        )
      })}
    </div>
  )
}
