import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { queryClient } from '@/shared/api/queryClient'
import {
  clearSession,
  loadSession,
  saveSession,
  subscribeToSession,
  type Session,
  type SessionUser,
} from '@/shared/auth/session'
import { authApi } from './api/auth.api'
import type { LoginInput } from './types'

interface AuthContextValue {
  session: Session | null
  user: SessionUser | null
  login: (input: LoginInput) => Promise<SessionUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession())

  // Sesiju mogu promijeniti i drugi dijelovi aplikacije (npr. 401 iz API-ja), pa je pratimo.
  useEffect(() => subscribeToSession(setSession), [])

  const login = useCallback(async ({ username, password, remember }: LoginInput) => {
    const result = await authApi.login(username, password)
    queryClient.clear()
    saveSession(result, remember)
    return result.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearSession()
      queryClient.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, login, logout }),
    [session, login, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth mora biti unutar <AuthProvider>.')
  return context
}

/** Prijavljeni korisnik – koristi se samo na zaštićenim rutama, gdje korisnik sigurno postoji. */
export function useCurrentUser(): SessionUser {
  const { user } = useAuth()
  if (!user) throw new Error('Nema prijavljenog korisnika.')
  return user
}
