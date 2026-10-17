import { http, HttpResponse } from 'msw'
import { canAccessClient, forbidden, requireUser } from '@/features/auth/api/auth.guard'
import { clientsDb } from '@/features/clients/api/clients.db'
import { API_BASE } from '@/shared/api/client'
import type { SessionUser } from '@/shared/auth/session'
import { hasErrors } from '@/shared/lib/validation'
import { mockDelay, newId, notFound, nowISO, validationError } from '@/shared/mocks/responses'
import { validateMeasurementInput } from '../model/validation'
import type { Measurement, MeasurementInput, MeasurementWithClient } from '../types'
import { measurementsDb } from './measurements.db'

/*
 * Mock rute za mjerenja (docs/entities.md, "Measurement").
 *   GET    /api/measurements?clientId=&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=   (najnovija prva)
 *   GET    /api/measurements/:id
 *   POST   /api/measurements
 *   PUT    /api/measurements/:id
 *   DELETE /api/measurements/:id
 * Trener radi sa mjerenjima svih klijenata, klijent samo sa svojim.
 */

const BASE = `${API_BASE}/measurements`
const NOT_FOUND = 'Mjerenje ne postoji ili je obrisano.'

function withClient(measurement: Measurement): MeasurementWithClient {
  const client = clientsDb.find(measurement.clientId)
  return {
    ...measurement,
    client: client
      ? { id: client.id, firstName: client.firstName, lastName: client.lastName }
      : null,
  }
}

/** Klijent uvijek upisuje mjerenje za sebe, bez obzira šta pošalje. */
function scopeInput(user: SessionUser, input: MeasurementInput): MeasurementInput {
  return user.role === 'client' ? { ...input, clientId: user.clientId ?? '' } : input
}

function validate(input: MeasurementInput) {
  const errors = validateMeasurementInput(input)
  if (input.clientId && !clientsDb.find(input.clientId)) errors.clientId = 'Klijent ne postoji.'
  return errors
}

export const measurementsHandlers = [
  http.get(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error

    const params = new URL(request.url).searchParams
    const clientId = auth.user.role === 'client' ? auth.user.clientId : params.get('clientId')
    const from = params.get('from')
    const to = params.get('to')
    const limit = Number(params.get('limit')) || undefined

    const items = measurementsDb
      .all()
      .filter((m) => !clientId || m.clientId === clientId)
      .filter((m) => !from || m.date >= from)
      .filter((m) => !to || m.date <= to)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map(withClient)

    return HttpResponse.json(items)
  }),

  http.get(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const measurement = measurementsDb.find(String(params.id))
    if (!measurement) return notFound(NOT_FOUND)
    if (!canAccessClient(auth.user, measurement.clientId)) return forbidden()
    return HttpResponse.json(withClient(measurement))
  }),

  http.post(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const input = scopeInput(auth.user, (await request.json()) as MeasurementInput)
    const errors = validate(input)
    if (hasErrors(errors)) return validationError(errors)
    const now = nowISO()
    const created = measurementsDb.insert({
      ...input,
      id: newId('m'),
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json(withClient(created), { status: 201 })
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const id = String(params.id)
    const existing = measurementsDb.find(id)
    if (!existing) return notFound(NOT_FOUND)
    if (!canAccessClient(auth.user, existing.clientId)) return forbidden()
    const input = scopeInput(auth.user, (await request.json()) as MeasurementInput)
    const errors = validate(input)
    if (hasErrors(errors)) return validationError(errors)
    return HttpResponse.json(
      withClient(measurementsDb.update(id, { ...input, updatedAt: nowISO() })!),
    )
  }),

  http.delete(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const id = String(params.id)
    const existing = measurementsDb.find(id)
    if (!existing) return notFound(NOT_FOUND)
    if (!canAccessClient(auth.user, existing.clientId)) return forbidden()
    measurementsDb.remove(id)
    return new HttpResponse(null, { status: 204 })
  }),
]
