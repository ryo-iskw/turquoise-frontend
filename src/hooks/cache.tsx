"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>

function useLocalStorage<T>(key: string, initialValue: T): [T, SetStateAction<T>, Error | null] {
  // 現在ページのパスをキーに含める
  const fullKey = `${usePathname()}_${key}`

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(fullKey)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(storedValue))
    } catch (error) {
      console.error(error)
      setError(error as Error)
    }
  }, [fullKey, storedValue])

  return [storedValue, setStoredValue, error]
}

export default useLocalStorage
