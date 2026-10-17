import { http, HttpResponse } from 'msw'
import { appointmentsDb } from '@/features/appointments/api/appointments.db'
import { canAccessClient, forbidden, requireUser } from '@/features/auth/api/auth.guard'
import { measurementsDb } from '@/features/measurements/api/measurements.db'
import { API_BASE } from '@/shared/api/client'
import { hasErrors } from '@/shared/lib/validation'
import {
  conflict,
  mockDelay,
  newId,
  notFound,
  nowISO,
  validationError,
} from '@/shared/mocks/responses'
import { validateClient } from '../model/validation'
import {
  CLIENT_STATUSES,
  type Client,
  type ClientInput,
  type ClientListItem,
  type ClientStatus,
} from '../types'
import { clientsDb } from './clients.db'

/*
 * Mock rute za klijente – ponašaju se kao budući backend (docs/entities.md, "Client").
 *   GET    /api/clients?search=&goal=&status=active|archived|all
 *   GET    /api/clients/:id
 *   POST   /api/clients
 *   PUT    /api/clients/:id
 *   PATCH  /api/clients/:id          { status }
 * Sve rute su za trenera; klijent smije samo GET /api/clients/:id za svoj profil.
 */

const BASE = `${API_BASE}/clients`

function toListItem(client: Client): ClientListItem {
  const now = Date.now()
  const nextAppointment = appointmentsDb
    .all()
    .filter((a) => a.clientId === client.id && (a.status === 'confirmed' || a.status === 'pending'))
    .filter((a) => new Date(a.startsAt).getTime() >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0]
  const measurements = measurementsDb
    .all()
    .filter((m) => m.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return {
    ...client,
    nextAppointmentAt: nextAppointment?.startsAt ?? null,
    lastMeasuredAt: measurements[0]?.date ?? null,
    latestWeightKg: measurements.find((m) => m.weightKg !== null)?.weightKg ?? null,
  }
}

function emailTaken(email: string, exceptId?: string) {
  return clientsDb.all().some((c) => c.email === email && c.id !== exceptId)
}

export const clientsHandlers = [
  http.get(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    const params = new URL(request.url).searchParams
    const search = (params.get('search') ?? '').trim().toLowerCase()
    const goal = params.get('goal')
    const status = params.get('status') ?? 'active'

    const items = clientsDb
      .all()
      .filter((c) => status === 'all' || c.status === status)
      .filter((c) => !goal || c.goal === goal)
      .filter(
        (c) => !search || `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search),
      )
      .sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'sr'),
      )
      .map(toListItem)

    return HttpResponse.json(items)
  }),

  http.get(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const id = String(params.id)
    if (!canAccessClient(auth.user, id)) return forbidden()
    const client = clientsDb.find(id)
    return client ? HttpResponse.json(client) : notFound('Klijent ne postoji ili je obrisan.')
  }),

  http.post(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    const input = (await request.json()) as ClientInput
    const errors = validateClient(input)
    if (hasErrors(errors)) return validationError(errors)
    if (emailTaken(input.email)) {
      return conflict('Klijent sa ovim emailom već postoji.', {
        email: 'Ovaj email već koristi drugi klijent.',
      })
    }
    const now = nowISO()
    const client = clientsDb.insert({ ...input, id: newId('c'), createdAt: now, updatedAt: now })
    return HttpResponse.json(client, { status: 201 })
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    const id = String(params.id)
    if (!clientsDb.find(id)) return notFound('Klijent ne postoji ili je obrisan.')
    const input = (await request.json()) as ClientInput
    const errors = validateClient(input)
    if (hasErrors(errors)) return validationError(errors)
    if (emailTaken(input.email, id)) {
      return conflict('Klijent sa ovim emailom već postoji.', {
        email: 'Ovaj email već koristi drugi klijent.',
      })
    }
    return HttpResponse.json(clientsDb.update(id, { ...input, updatedAt: nowISO() }))
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    const id = String(params.id)
    if (!clientsDb.find(id)) return notFound('Klijent ne postoji ili je obrisan.')
    const { status } = (await request.json()) as { status: ClientStatus }
    if (!CLIENT_STATUSES.includes(status)) return validationError({ status: 'Nepoznat status.' })
    return HttpResponse.json(clientsDb.update(id, { status, updatedAt: nowISO() }))
  }),
]
