import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value
      try {
        localStorage.setItem(key, JSON.stringify(nextValue))
      } catch {
        // localStorage full or unavailable
      }
      return nextValue
    })
  }, [key])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
