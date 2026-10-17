import { http, HttpResponse } from 'msw'
import { API_BASE } from '@/shared/api/client'
import { mockDelay } from '@/shared/mocks/responses'
import type { LoginInput, LoginResponse } from '../types'
import { MOCK_ACCOUNTS } from './auth.accounts'
import { authenticate } from './auth.guard'

/*
 * Mock rute za prijavu (docs/entities.md, "Auth"):
 *   POST /api/auth/login    { username, password } → { token, user }
 *   GET  /api/auth/me       → user (401 bez važećeg tokena)
 *   POST /api/auth/logout   → 204
 * Posle 5 pogrešnih pokušaja korisničko ime je zaključano 15 minuta (SPEC.md, 12.1).
 */

const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>()

function lockedMessage(lockedUntil: number) {
  const minutes = Math.max(1, Math.ceil((lockedUntil - Date.now()) / 60_000))
  return `Previše neuspjelih pokušaja. Pokušaj ponovo za ${minutes} min.`
}

export const authHandlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await mockDelay()
    const body = (await request.json()) as Partial<LoginInput>
    const username = (body.username ?? '').trim().toLowerCase()
    const password = body.password ?? ''

    if (!username || !password) {
      return HttpResponse.json(
        {
          message: 'Unesi korisničko ime i lozinku.',
          fieldErrors: {
            ...(username ? {} : { username: 'Unesi korisničko ime.' }),
            ...(password ? {} : { password: 'Unesi lozinku.' }),
          },
        },
        { status: 422 },
      )
    }

    const attempts = failedAttempts.get(username)
    if (attempts && attempts.lockedUntil > Date.now()) {
      return HttpResponse.json({ message: lockedMessage(attempts.lockedUntil) }, { status: 429 })
    }

    const account = MOCK_ACCOUNTS.find(
      (a) => a.user.username === username && a.password === password,
    )
    if (!account) {
      const count = (attempts?.count ?? 0) + 1
      if (count >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCK_MS
        failedAttempts.set(username, { count: 0, lockedUntil })
        return HttpResponse.json({ message: lockedMessage(lockedUntil) }, { status: 429 })
      }
      failedAttempts.set(username, { count, lockedUntil: 0 })
      // Poruka namjerno ne otkriva da li korisničko ime postoji.
      return HttpResponse.json(
        {
          message: `Pogrešno korisničko ime ili lozinka. Preostalo pokušaja: ${MAX_ATTEMPTS - count}.`,
        },
        { status: 401 },
      )
    }

    failedAttempts.delete(username)
    const response: LoginResponse = { token: account.token, user: account.user }
    return HttpResponse.json(response)
  }),

  http.get(`${API_BASE}/auth/me`, async ({ request }) => {
    await mockDelay()
    const user = authenticate(request)
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ message: 'Sesija je istekla. Prijavi se ponovo.' }, { status: 401 })
  }),

  http.post(`${API_BASE}/auth/logout`, () => new HttpResponse(null, { status: 204 })),
]
