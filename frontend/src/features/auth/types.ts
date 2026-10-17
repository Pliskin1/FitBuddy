import type { Session } from '@/shared/auth/session'

export type { Role, Session, SessionUser } from '@/shared/auth/session'

export interface LoginInput {
  username: string
  password: string
  /** Zadrži prijavu i posle zatvaranja pretraživača. */
  remember: boolean
}

/** Odgovor na POST /api/auth/login. */
export type LoginResponse = Session
