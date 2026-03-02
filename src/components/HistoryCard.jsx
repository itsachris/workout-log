import { useNavigate } from 'react-router-dom'
import { categoryLabels, categoryEmojis } from '../data/exercises'

export default function HistoryCard({ workout }) {
  const navigate = useNavigate()
  const date = new Date(workout.completedAt)
  const colorVar = `var(--color-${workout.category})`
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  )
  const duration = (() => {
    const mins = Math.round(
      (new Date(workout.completedAt) - new Date(workout.startedAt)) / 60000
    )
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  })()

  return (
    <button
      className="history-card card"
      onClick={() => navigate(`/history/${workout.id}`)}
      type="button"
    >
      <div className="history-card-left">
        <span className="history-card-emoji">{categoryEmojis[workout.category]}</span>
        <div>
          <div className="history-card-title" style={{ color: colorVar }}>
            {categoryLabels[workout.category]} Day
          </div>
          <div className="text-xs text-muted">
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
      <div className="history-card-right text-xs text-muted">
        <span>{workout.exercises.length} exercises</span>
        <span>{totalSets} sets</span>
        <span>{duration}</span>
      </div>
    </button>
  )
}
