import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { categoryLabels } from '../data/exercises'

export default function WorkoutDetail() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [workouts] = useLocalStorage('wl_workouts', [])

  const workout = workouts.find((w) => w.id === workoutId)

  if (!workout) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/history')} type="button">
            ←
          </button>
          <h1>Not Found</h1>
        </div>
        <p className="text-muted">This workout could not be found.</p>
      </div>
    )
  }

  const colorVar = `var(--color-${workout.category})`
  const date = new Date(workout.completedAt)
  const duration = (() => {
    const mins = Math.round(
      (new Date(workout.completedAt) - new Date(workout.startedAt)) / 60000
    )
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  })()
  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.filter((s) => s.completed).reduce((s2, set) => s2 + set.weight * set.reps, 0),
    0
  )
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  )

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/history')} type="button">
          ←
        </button>
        <div>
          <h1 style={{ color: colorVar }}>{categoryLabels[workout.category]} Day</h1>
          <span className="text-xs text-muted">
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-value">{duration}</span>
          <span className="detail-stat-label">Duration</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{totalSets}</span>
          <span className="detail-stat-label">Sets</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{totalVolume.toLocaleString()}</span>
          <span className="detail-stat-label">Volume</span>
        </div>
      </div>

      <div className="detail-exercises">
        {workout.exercises.map((exercise) => {
          const completedSets = exercise.sets.filter((s) => s.completed)
          if (completedSets.length === 0 && !exercise.notes) return null

          return (
            <div key={exercise.id} className="detail-exercise card">
              <div className="detail-exercise-name">{exercise.name}</div>
              <div className="detail-sets">
                {exercise.sets.map((set, i) => (
                  <div
                    key={set.id}
                    className={`detail-set ${set.completed ? '' : 'detail-set--skipped'}`}
                  >
                    <span className="text-muted">Set {i + 1}</span>
                    <span>
                      {set.weight} lbs × {set.reps} reps
                    </span>
                    {set.completed ? (
                      <span style={{ color: 'var(--color-success)' }}>✓</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </div>
                ))}
              </div>
              {exercise.notes && (
                <div className="detail-exercise-notes text-sm text-muted">
                  {exercise.notes}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
