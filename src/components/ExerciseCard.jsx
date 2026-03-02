import { useState } from 'react'
import SetRow from './SetRow'

export default function ExerciseCard({
  exercise,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onUpdateNotes,
  onToggleComplete,
  onRemoveExercise,
  onStartTimer,
  categoryColor,
}) {
  const [expanded, setExpanded] = useState(true)
  const [showNotes, setShowNotes] = useState(!!exercise.notes)
  const completedSets = exercise.sets.filter((s) => s.completed).length

  const handleComplete = (setId) => {
    const set = exercise.sets.find((s) => s.id === setId)
    onCompleteSet(exercise.id, setId)
    if (set && !set.completed) {
      onStartTimer?.()
    }
  }

  return (
    <div className={`exercise-card ${exercise.completed ? 'exercise-card--done' : ''}`}>
      <div className="exercise-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="exercise-card-title">
          <button
            className="exercise-card-check"
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete(exercise.id)
            }}
            type="button"
            style={{ color: exercise.completed ? categoryColor : undefined }}
          >
            {exercise.completed ? '✓' : '○'}
          </button>
          <span className={exercise.completed ? 'line-through' : ''}>
            {exercise.name}
          </span>
        </div>
        <div className="exercise-card-meta">
          <span className="text-xs text-muted">
            {completedSets}/{exercise.sets.length}
          </span>
          <span className="exercise-card-chevron">{expanded ? '▾' : '▸'}</span>
        </div>
      </div>

      {expanded && (
        <div className="exercise-card-body">
          <div className="set-row-header">
            <span>Set</span>
            <span>Weight</span>
            <span>Reps</span>
            <span></span>
          </div>
          {exercise.sets.map((set, i) => (
            <SetRow
              key={set.id}
              set={set}
              index={i}
              onUpdate={(setId, field, value) => onUpdateSet(exercise.id, setId, field, value)}
              onComplete={(setId) => handleComplete(setId)}
              onRemove={
                exercise.sets.length > 1
                  ? (setId) => onRemoveSet(exercise.id, setId)
                  : undefined
              }
            />
          ))}
          <div className="exercise-card-actions">
            <button
              className="btn btn-secondary"
              onClick={() => onAddSet(exercise.id)}
              type="button"
            >
              + Add Set
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowNotes(!showNotes)}
              type="button"
            >
              {showNotes ? 'Hide Notes' : 'Notes'}
            </button>
            <button
              className="exercise-card-remove"
              onClick={() => onRemoveExercise(exercise.id)}
              type="button"
            >
              Remove
            </button>
          </div>
          {showNotes && (
            <textarea
              className="exercise-card-notes"
              placeholder="Add notes (e.g., felt easy, increase weight)..."
              value={exercise.notes}
              onChange={(e) => onUpdateNotes(exercise.id, e.target.value)}
              rows={2}
            />
          )}
        </div>
      )}
    </div>
  )
}
