import { categoryLabels } from '../data/exercises'

export default function WorkoutSummary({ workout, onDone }) {
  const duration = (() => {
    const start = new Date(workout.startedAt)
    const end = new Date(workout.completedAt)
    const mins = Math.round((end - start) / 60000)
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  })()

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0)
  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.filter((s) => s.completed).reduce((s2, set) => s2 + set.weight * set.reps, 0),
    0
  )
  const exercisesCompleted = workout.exercises.filter((ex) => ex.completed).length

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="summary-header">
          <h2>Workout Complete!</h2>
          <p className="text-muted">{categoryLabels[workout.category]} Day</p>
        </div>

        <div className="summary-stats">
          <div className="summary-stat">
            <span className="summary-stat-value">{duration}</span>
            <span className="summary-stat-label">Duration</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-value">{exercisesCompleted}/{workout.exercises.length}</span>
            <span className="summary-stat-label">Exercises</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-value">{totalSets}</span>
            <span className="summary-stat-label">Sets</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-value">{totalVolume.toLocaleString()}</span>
            <span className="summary-stat-label">Volume (lbs)</span>
          </div>
        </div>

        <button className="btn btn-primary btn-block mt-md" onClick={onDone} type="button">
          Done
        </button>
      </div>
    </div>
  )
}
