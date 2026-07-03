import { useState, useEffect } from 'react'

// Generic state hook that persists its value to localStorage under `key`.
// Falls back to `initialValue` when nothing is stored or parsing fails.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be unavailable (private mode / quota) — ignore silently.
    }
  }, [key, value])

  return [value, setValue]
}
