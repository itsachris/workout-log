import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { defaultExercises } from '../data/exercises'

function generateId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
}

function createEmptySet() {
  return { id: generateId(), reps: 0, weight: 0, completed: false }
}

function createExercise(name, prefill = null) {
  const sets = prefill
    ? prefill.sets.map((s) => ({ ...createEmptySet(), reps: s.reps, weight: s.weight }))
    : [createEmptySet(), createEmptySet(), createEmptySet()]
  return { id: generateId(), name, sets, notes: '', completed: false }
}

export function useWorkoutSession() {
  const [session, setSession, removeSession] = useLocalStorage('wl_active_session', null)
  const [workouts, setWorkouts] = useLocalStorage('wl_workouts', [])
  const [customExercises, setCustomExercises] = useLocalStorage('wl_custom_exercises', {
    push: [],
    pull: [],
    legs: [],
  })

  const startSession = useCallback((category) => {
    // Find last workout of same category for pre-fill
    const lastSame = [...workouts]
      .reverse()
      .find((w) => w.category === category)

    const exerciseNames = [
      ...defaultExercises[category],
      ...(customExercises[category] || []),
    ]

    const exercises = exerciseNames.map((name) => {
      const prevExercise = lastSame?.exercises.find((e) => e.name === name)
      return createExercise(name, prevExercise)
    })

    const newSession = {
      id: generateId(),
      category,
      startedAt: new Date().toISOString(),
      completedAt: null,
      exercises,
      notes: '',
    }
    setSession(newSession)
    return newSession
  }, [workouts, customExercises, setSession])

  const updateSet = useCallback((exerciseId, setId, field, value) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, [field]: value } : s
                ),
              }
            : ex
        ),
      }
    })
  }, [setSession])

  const completeSet = useCallback((exerciseId, setId) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, completed: !s.completed } : s
                ),
              }
            : ex
        ),
      }
    })
  }, [setSession])

  const addSet = useCallback((exerciseId) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex
          // Copy weight/reps from last set
          const lastSet = ex.sets[ex.sets.length - 1]
          const newSet = {
            ...createEmptySet(),
            reps: lastSet?.reps || 0,
            weight: lastSet?.weight || 0,
          }
          return { ...ex, sets: [...ex.sets, newSet] }
        }),
      }
    })
  }, [setSession])

  const removeSet = useCallback((exerciseId, setId) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
            : ex
        ),
      }
    })
  }, [setSession])

  const updateNotes = useCallback((exerciseId, notes) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, notes } : ex
        ),
      }
    })
  }, [setSession])

  const toggleExerciseComplete = useCallback((exerciseId) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
        ),
      }
    })
  }, [setSession])

  const addExercise = useCallback((name) => {
    if (!session) return

    // Add to session
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: [...prev.exercises, createExercise(name)],
      }
    })

    // Save to custom exercises if not in defaults
    if (!defaultExercises[session.category].includes(name)) {
      setCustomExercises((prev) => {
        const catList = prev[session.category] || []
        if (catList.includes(name)) return prev
        return { ...prev, [session.category]: [...catList, name] }
      })
    }
  }, [session, setSession, setCustomExercises])

  const removeExercise = useCallback((exerciseId) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
      }
    })
  }, [setSession])

  const reorderExercises = useCallback((fromIndex, toIndex) => {
    setSession((prev) => {
      if (!prev) return prev
      const exercises = [...prev.exercises]
      const [moved] = exercises.splice(fromIndex, 1)
      exercises.splice(toIndex, 0, moved)
      return { ...prev, exercises }
    })
  }, [setSession])

  const finishWorkout = useCallback(() => {
    if (!session) return null
    const completed = {
      ...session,
      completedAt: new Date().toISOString(),
    }
    setWorkouts((prev) => [...prev, completed])
    removeSession()
    return completed
  }, [session, setWorkouts, removeSession])

  const discardWorkout = useCallback(() => {
    removeSession()
  }, [removeSession])

  return {
    session,
    workouts,
    startSession,
    updateSet,
    completeSet,
    addSet,
    removeSet,
    updateNotes,
    toggleExerciseComplete,
    addExercise,
    removeExercise,
    reorderExercises,
    finishWorkout,
    discardWorkout,
  }
}
