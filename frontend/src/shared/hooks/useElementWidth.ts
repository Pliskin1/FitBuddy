import { useEffect, useRef, useState } from 'react'

/** Prati širinu elementa (npr. da grafikon crta u pravim pikselima na 375 i 1440 px). */
export function useElementWidth<T extends HTMLElement>(initial = 0) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    setWidth(element.clientWidth)
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
