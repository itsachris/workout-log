import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutSession } from '../hooks/useWorkoutSession'
import { useRestTimer } from '../hooks/useRestTimer'
import { useRotation } from '../hooks/useRotation'
import { categoryLabels } from '../data/exercises'
import ExerciseCard from '../components/ExerciseCard'
import RestTimer from '../components/RestTimer'
import AddExerciseModal from '../components/AddExerciseModal'
import WorkoutSummary from '../components/WorkoutSummary'

export default function Workout() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { markCompleted } = useRotation()
  const {
    session,
    startSession,
    updateSet,
    completeSet,
    addSet,
    removeSet,
    updateNotes,
    toggleExerciseComplete,
    addExercise,
    removeExercise,
    finishWorkout,
    discardWorkout,
  } = useWorkoutSession()

  const timer = useRestTimer(90)
  const [showAddModal, setShowAddModal] = useState(false)
  const [completedWorkout, setCompletedWorkout] = useState(null)
  const [showDiscard, setShowDiscard] = useState(false)

  useEffect(() => {
    if (!session || session.category !== category) {
      if (session && session.category !== category) {
        setShowDiscard(true)
        return
      }
      startSession(category)
    }
  }, [category])

  const handleFinish = () => {
    const completed = finishWorkout()
    if (completed) {
      markCompleted(completed.category)
      timer.dismiss()
      setCompletedWorkout(completed)
    }
  }

  const handleDiscard = () => {
    discardWorkout()
    setShowDiscard(false)
    startSession(category)
  }

  const handleKeepPrevious = () => {
    navigate(`/workout/${session.category}`)
    setShowDiscard(false)
  }

  const colorVar = `var(--color-${category})`

  // Show summary modal even after session is cleared
  if (completedWorkout) {
    return (
      <WorkoutSummary
        workout={completedWorkout}
        onDone={() => navigate('/')}
      />
    )
  }

  // Show discard prompt on a clean screen when session is for a different category
  if (showDiscard && session && session.category !== category) {
    return (
      <div className="page workout-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')} type="button">
            ←
          </button>
          <h1 style={{ color: colorVar }}>{categoryLabels[category]} Day</h1>
        </div>
        <div className="modal-overlay" style={{ background: 'transparent' }}>
          <div className="modal-content">
            <h2>Unfinished Workout</h2>
            <p className="text-muted mt-sm mb-md">
              You have an unfinished {categoryLabels[session.category]} workout. What would you like to do?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button className="btn btn-primary btn-block" onClick={handleKeepPrevious} type="button">
                Continue {categoryLabels[session.category]} Workout
              </button>
              <button className="btn btn-danger btn-block" onClick={handleDiscard} type="button">
                Discard & Start {categoryLabels[category]}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.category !== category) return null

  return (
    <div className="page workout-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')} type="button">
          ←
        </button>
        <div>
          <h1 style={{ color: colorVar }}>{categoryLabels[category]} Day</h1>
          <span className="text-xs text-muted">
            {new Date(session.startedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      <div className="exercise-list">
        {session.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={updateSet}
            onCompleteSet={completeSet}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onUpdateNotes={updateNotes}
            onToggleComplete={toggleExerciseComplete}
            onRemoveExercise={removeExercise}
            onStartTimer={() => timer.start()}
            categoryColor={colorVar}
          />
        ))}
      </div>

      <button
        className="btn btn-secondary btn-block mb-md"
        onClick={() => setShowAddModal(true)}
        type="button"
      >
        + Add Exercise
      </button>

      <button
        className="btn btn-primary btn-block finish-btn"
        onClick={handleFinish}
        type="button"
        style={{ background: colorVar, color: '#0a0a0f' }}
      >
        Finish Workout
      </button>

      <RestTimer
        secondsRemaining={timer.secondsRemaining}
        isRunning={timer.isRunning}
        isVisible={timer.isVisible}
        onDismiss={timer.dismiss}
        onExtend={timer.extend}
        onPause={timer.pause}
        onResume={timer.resume}
      />

      {showAddModal && (
        <AddExerciseModal
          onAdd={addExercise}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
