export default function Tag({ children, variant = 'default' }) {
  return <span className={`tag tag-${variant}`}>{children}</span>
}
