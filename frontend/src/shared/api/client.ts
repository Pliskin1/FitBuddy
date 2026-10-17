import { getToken } from '@/shared/auth/session'

/**
 * Tanak omotač oko fetch-a. Svi feature-i zovu API isključivo preko `apiClient`,
 * pa prelazak sa mock-a na pravi backend znači samo promjenu VITE_API_URL / VITE_USE_MOCKS.
 * Token prijavljenog korisnika ide u svaki zahtjev kao `Authorization: Bearer <token>`.
 */

export const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export type QueryParams = Record<string, string | number | boolean | null | undefined>

/** Greška iz API-ja. `fieldErrors` dolazi uz 422/409 i mapira se na polja forme. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.status === 403)
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${API_BASE}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '')
      url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function request<T>(
  method: string,
  path: string,
  options: { query?: QueryParams; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(0, 'Nema veze sa serverom. Provjeri internet i pokušaj ponovo.')
  }

  if (response.status === 204) return undefined as T

  // Ako umjesto JSON-a stigne npr. HTML (pogrešna adresa API-ja), to je greška, a ne prazan rezultat.
  if (!(response.headers.get('Content-Type') ?? '').includes('application/json')) {
    throw new ApiError(response.status, 'Server je vratio neočekivan odgovor. Pokušaj ponovo.')
  }

  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const body = (data ?? {}) as { message?: string; fieldErrors?: Record<string, string> }
    throw new ApiError(
      response.status,
      body.message ?? 'Došlo je do greške. Pokušaj ponovo.',
      body.fieldErrors,
    )
  }
  return data as T
}

export const apiClient = {
  get: <T>(path: string, query?: QueryParams) => request<T>('GET', path, { query }),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, { body }),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, { body }),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, { body }),
  delete: (path: string) => request<void>('DELETE', path),
}
