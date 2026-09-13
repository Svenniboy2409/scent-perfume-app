import { Link } from 'react-router-dom'

// `actionTo` renders a link; `onAction` renders a button instead (used by
// Discover's "did you mean…" suggestion, which only rewrites the query).
export default function EmptyState({ icon, title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="empty-title">{title}</h2>
      <p className="empty-message">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-accent">
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button type="button" className="btn btn-accent" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
