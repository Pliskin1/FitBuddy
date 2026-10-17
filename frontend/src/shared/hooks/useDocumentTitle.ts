import { useEffect } from 'react'

/** Postavlja naslov taba: "Klijenti · FitBuddy". */
export function useDocumentTitle(title: string | undefined): void {
  useEffect(() => {
    document.title = title ? `${title} · FitBuddy` : 'FitBuddy'
  }, [title])
}
