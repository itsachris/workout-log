import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRotation } from '../hooks/useRotation'
import { rotationOrder } from '../data/exercises'
import CategoryTile from '../components/CategoryTile'

export default function Home() {
  const navigate = useNavigate()
  const { nextCategory } = useRotation()
  const [workouts] = useLocalStorage('wl_workouts', [])
  const [activeSession] = useLocalStorage('wl_active_session', null)

  const lastWorkoutDates = {}
  for (const cat of rotationOrder) {
    const last = [...workouts].reverse().find((w) => w.category === cat)
    if (last) lastWorkoutDates[cat] = last.completedAt
  }

  return (
    <div className="page">
      <div className="home-header">
        <h1>Workout Log</h1>
        <p className="text-muted text-sm">Push / Pull / Legs</p>
      </div>

      {activeSession && (
        <button
          className="continue-banner"
          onClick={() => navigate(`/workout/${activeSession.category}`)}
          type="button"
        >
          <span>Continue {activeSession.category.charAt(0).toUpperCase() + activeSession.category.slice(1)} Workout</span>
          <span className="continue-banner-arrow">&rarr;</span>
        </button>
      )}

      <div className="tile-grid">
        {rotationOrder.map((category) => (
          <CategoryTile
            key={category}
            category={category}
            isNext={category === nextCategory && !activeSession}
            lastDate={lastWorkoutDates[category]}
            onClick={() => navigate(`/workout/${category}`)}
          />
        ))}
      </div>

      {workouts.length > 0 && (
        <div className="home-recent">
          <div className="home-recent-header">
            <h3>Recent Activity</h3>
            <button
              className="text-sm"
              onClick={() => navigate('/history')}
              style={{ color: 'var(--text-secondary)' }}
              type="button"
            >
              View All &rarr;
            </button>
          </div>
          <div className="home-recent-list">
            {workouts
              .slice(-3)
              .reverse()
              .map((w) => {
                const date = new Date(w.completedAt)
                const sets = w.exercises.reduce(
                  (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
                  0
                )
                return (
                  <button
                    key={w.id}
                    className="home-recent-item card"
                    onClick={() => navigate(`/history/${w.id}`)}
                    type="button"
                  >
                    <span
                      className="home-recent-dot"
                      style={{ background: `var(--color-${w.category})` }}
                    />
                    <span>
                      {w.category.charAt(0).toUpperCase() + w.category.slice(1)}
                    </span>
                    <span className="text-muted text-xs">
                      {sets} sets &middot;{' '}
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
