import { categoryLabels, categoryEmojis } from '../data/exercises'

export default function CategoryTile({ category, isNext, lastDate, onClick }) {
  const colorVar = `var(--color-${category})`

  return (
    <button
      className={`category-tile ${isNext ? 'category-tile--next' : ''}`}
      onClick={onClick}
      style={{ '--tile-color': colorVar }}
      type="button"
    >
      <span className="category-tile-emoji">{categoryEmojis[category]}</span>
      <span className="category-tile-label">{categoryLabels[category]}</span>
      {isNext && <span className="category-tile-badge">Up Next</span>}
      {lastDate && (
        <span className="category-tile-date">
          Last: {formatRelativeDate(lastDate)}
        </span>
      )}
    </button>
  )
}

function formatRelativeDate(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
