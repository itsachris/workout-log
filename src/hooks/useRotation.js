import { useLocalStorage } from './useLocalStorage'
import { rotationOrder } from '../data/exercises'

export function useRotation() {
  const [rotation, setRotation] = useLocalStorage('wl_rotation', {
    lastCategory: null,
    lastCompletedAt: null,
  })

  const nextCategory = (() => {
    if (!rotation.lastCategory) return 'push'
    const currentIdx = rotationOrder.indexOf(rotation.lastCategory)
    return rotationOrder[(currentIdx + 1) % rotationOrder.length]
  })()

  const markCompleted = (category) => {
    setRotation({
      lastCategory: category,
      lastCompletedAt: new Date().toISOString(),
    })
  }

  return { nextCategory, rotation, markCompleted }
}
