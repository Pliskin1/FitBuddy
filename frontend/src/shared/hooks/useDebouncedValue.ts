import { useEffect, useState } from 'react'

/** Vraća vrijednost tek kad se ne mijenja `delayMs` milisekundi (npr. pretraga dok korisnik kuca). */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
