/*
 * Sesija prijavljenog korisnika. "Zapamti me" čuva sesiju u localStorage-u (ostaje posle zatvaranja
 * pretraživača), inače u sessionStorage-u (nestaje zatvaranjem taba).
 * apiClient odavde čita token i šalje ga kao `Authorization: Bearer <token>`.
 */

export type Role = 'trainer' | 'client'

export interface SessionUser {
  id: string
  username: string
  role: Role
  displayName: string
  /** Za ulogu klijenta: ID klijenta čije podatke korisnik vidi. Za trenera null. */
  clientId: string | null
}

export interface Session {
  token: string
  user: SessionUser
}

const KEY = 'fitbuddy.session'

type Listener = (session: Session | null) => void
const listeners = new Set<Listener>()

function readFrom(storage: Storage): Session | null {
  try {
    const raw = storage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function loadSession(): Session | null {
  if (typeof window === 'undefined') return null
  return readFrom(window.localStorage) ?? readFrom(window.sessionStorage)
}

export function getToken(): string | null {
  return loadSession()?.token ?? null
}

export function saveSession(session: Session, remember: boolean): void {
  try {
    clearStorage()
    ;(remember ? window.localStorage : window.sessionStorage).setItem(KEY, JSON.stringify(session))
  } catch {
    // Storage nedostupan – sesija ostaje samo dok je stranica otvorena (kroz listenere).
  }
  listeners.forEach((listener) => listener(session))
}

export function clearSession(): void {
  clearStorage()
  listeners.forEach((listener) => listener(null))
}

function clearStorage() {
  try {
    window.localStorage.removeItem(KEY)
    window.sessionStorage.removeItem(KEY)
  } catch {
    // ignorišemo – nema šta da se obriše
  }
}

export function subscribeToSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
