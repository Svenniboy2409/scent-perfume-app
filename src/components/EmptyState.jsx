import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, message, actionLabel, actionTo }) {
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
    </div>
  )
}
