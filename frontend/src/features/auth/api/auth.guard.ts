import { HttpResponse } from 'msw'
import type { Role, SessionUser } from '@/shared/auth/session'
import { MOCK_ACCOUNTS } from './auth.accounts'

/*
 * Provjera prava u mock rutama – isto što će raditi backend:
 *   bez tokena ili sa nevažećim tokenom → 401, pogrešna uloga → 403.
 * Upotreba u handleru:
 *   const auth = requireUser(request, ['trainer'])
 *   if (auth.error) return auth.error
 */

function unauthorized() {
  return HttpResponse.json({ message: 'Sesija je istekla. Prijavi se ponovo.' }, { status: 401 })
}

export function forbidden(message = 'Nemaš pristup ovom podatku.') {
  return HttpResponse.json({ message }, { status: 403 })
}

export function authenticate(request: Request): SessionUser | null {
  const header = request.headers.get('Authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
  return MOCK_ACCOUNTS.find((account) => account.token === token)?.user ?? null
}

type AuthResult =
  | { user: SessionUser; error?: undefined }
  | { user?: undefined; error: ReturnType<typeof unauthorized> }

export function requireUser(request: Request, roles?: Role[]): AuthResult {
  const user = authenticate(request)
  if (!user) return { error: unauthorized() }
  if (roles && !roles.includes(user.role)) return { error: forbidden() }
  return { user }
}

/** Klijent smije da vidi samo svoje podatke; trener sve. */
export function canAccessClient(user: SessionUser, clientId: string): boolean {
  return user.role === 'trainer' || user.clientId === clientId
}
