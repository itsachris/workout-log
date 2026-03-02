import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import HistoryCard from '../components/HistoryCard'

export default function History() {
  const navigate = useNavigate()
  const [workouts] = useLocalStorage('wl_workouts', [])

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
  )

  // Group by date
  const groups = []
  let currentLabel = ''
  for (const workout of sorted) {
    const label = getDateLabel(workout.completedAt)
    if (label !== currentLabel) {
      currentLabel = label
      groups.push({ label, workouts: [] })
    }
    groups[groups.length - 1].workouts.push(workout)
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')} type="button">
          ←
        </button>
        <h1>History</h1>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No workouts yet</p>
          <p className="text-sm text-muted mt-sm">Complete your first workout to see it here</p>
        </div>
      ) : (
        <div className="history-list">
          {groups.map((group) => (
            <div key={group.label} className="history-group">
              <h3 className="history-group-label">{group.label}</h3>
              {group.workouts.map((w) => (
                <HistoryCard key={w.id} workout={w} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getDateLabel(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return 'This Week'
  if (diffDays < 30) return 'This Month'
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
