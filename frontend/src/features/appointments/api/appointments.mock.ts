import { http, HttpResponse } from 'msw'
import { canAccessClient, forbidden, requireUser } from '@/features/auth/api/auth.guard'
import { clientsDb } from '@/features/clients/api/clients.db'
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
import {
  CLIENT_CANCEL_HOURS,
  appointmentEnd,
  blocksTime,
  hoursUntil,
  timeRange,
} from '../model/labels'
import { validateAppointmentInput } from '../model/validation'
import {
  APPOINTMENT_STATUSES,
  type Appointment,
  type AppointmentInput,
  type AppointmentStatus,
  type AppointmentWithClient,
} from '../types'
import { appointmentsDb } from './appointments.db'

/*
 * Mock rute za termine (docs/entities.md, "Appointment").
 *   GET    /api/appointments?from=&to=&status=&clientId=&order=asc|desc&limit=
 *   GET    /api/appointments/:id
 *   POST   /api/appointments           trener: bilo koji klijent; klijent: zahtjev za sebe (status "pending")
 *   PUT    /api/appointments/:id       samo trener
 *   PATCH  /api/appointments/:id       { status } – klijent smije samo da otkaže svoj termin, 24 h unaprijed
 *   DELETE /api/appointments/:id       samo trener
 * Klijent uvijek dobija samo svoje termine.
 */

const BASE = `${API_BASE}/appointments`
const NOT_FOUND = 'Termin ne postoji ili je obrisan.'

function withClient(appointment: Appointment): AppointmentWithClient {
  const client = clientsDb.find(appointment.clientId)
  return {
    ...appointment,
    client: client
      ? { id: client.id, firstName: client.firstName, lastName: client.lastName }
      : null,
  }
}

/** Prvi termin koji zauzima isto vrijeme (trener ne može biti na dva mjesta). */
function findOverlap(input: Pick<Appointment, 'startsAt' | 'durationMin'>, exceptId?: string) {
  const start = new Date(input.startsAt).getTime()
  const end = appointmentEnd(input).getTime()
  return appointmentsDb
    .all()
    .find(
      (a) =>
        a.id !== exceptId &&
        blocksTime(a.status) &&
        new Date(a.startsAt).getTime() < end &&
        start < appointmentEnd(a).getTime(),
    )
}

function overlapResponse(other: Appointment, revealClient: boolean) {
  const client = clientsDb.find(other.clientId)
  const message =
    revealClient && client
      ? `U to vrijeme već postoji termin: ${client.firstName} ${client.lastName}, ${timeRange(other)}.`
      : 'Trener je u to vrijeme zauzet. Izaberi drugo vrijeme.'
  return conflict(message, { startsAt: message })
}

export const appointmentsHandlers = [
  http.get(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error

    const params = new URL(request.url).searchParams
    const from = params.get('from')
    const to = params.get('to')
    const status = params.get('status')
    const clientId = auth.user.role === 'client' ? auth.user.clientId : params.get('clientId')
    const order = params.get('order') === 'desc' ? -1 : 1
    const limit = Number(params.get('limit')) || undefined

    const items = appointmentsDb
      .all()
      .filter((a) => !clientId || a.clientId === clientId)
      .filter((a) => !status || a.status === status)
      .filter((a) => !from || a.startsAt >= from)
      .filter((a) => !to || a.startsAt < to)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt) * order)
      .slice(0, limit)
      .map(withClient)

    return HttpResponse.json(items)
  }),

  http.get(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const appointment = appointmentsDb.find(String(params.id))
    if (!appointment) return notFound(NOT_FOUND)
    if (!canAccessClient(auth.user, appointment.clientId)) return forbidden()
    return HttpResponse.json(withClient(appointment))
  }),

  http.post(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error

    const body = (await request.json()) as AppointmentInput
    const isClient = auth.user.role === 'client'
    // Klijent ne bira klijenta ni status: zahtjev je uvijek za njega i čeka potvrdu trenera.
    const input: AppointmentInput = isClient
      ? { ...body, clientId: auth.user.clientId ?? '', status: 'pending' }
      : body

    const errors = validateAppointmentInput(input)
    const client = clientsDb.find(input.clientId)
    if (input.clientId && (!client || client.status !== 'active'))
      errors.clientId = 'Termin se može zakazati samo aktivnom klijentu.'
    if (isClient && !errors.startsAt && new Date(input.startsAt).getTime() < Date.now()) {
      errors.startsAt = 'Izaberi vrijeme u budućnosti.'
    }
    if (hasErrors(errors)) return validationError(errors)

    const overlap = findOverlap(input)
    if (overlap) return overlapResponse(overlap, !isClient)

    const now = nowISO()
    const created = appointmentsDb.insert({
      ...input,
      id: newId('a'),
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json(withClient(created), { status: 201 })
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    const id = String(params.id)
    if (!appointmentsDb.find(id)) return notFound(NOT_FOUND)

    const input = (await request.json()) as AppointmentInput
    const errors = validateAppointmentInput(input)
    if (input.clientId && !clientsDb.find(input.clientId)) errors.clientId = 'Klijent ne postoji.'
    if (hasErrors(errors)) return validationError(errors)

    const overlap = blocksTime(input.status) ? findOverlap(input, id) : undefined
    if (overlap) return overlapResponse(overlap, true)

    return HttpResponse.json(
      withClient(appointmentsDb.update(id, { ...input, updatedAt: nowISO() })!),
    )
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const id = String(params.id)
    const appointment = appointmentsDb.find(id)
    if (!appointment) return notFound(NOT_FOUND)
    if (!canAccessClient(auth.user, appointment.clientId)) return forbidden()

    const { status } = (await request.json()) as { status: AppointmentStatus }
    if (!APPOINTMENT_STATUSES.includes(status))
      return validationError({ status: 'Nepoznat status.' })

    if (auth.user.role === 'client') {
      if (status !== 'cancelled' || !blocksTime(appointment.status))
        return forbidden('Ovu promjenu može napraviti samo trener.')
      if (hoursUntil(appointment.startsAt) < CLIENT_CANCEL_HOURS) {
        return conflict(
          `Termin se može otkazati najkasnije ${CLIENT_CANCEL_HOURS} h prije početka. Javi se treneru.`,
        )
      }
    }
    if (blocksTime(status) && !blocksTime(appointment.status)) {
      const overlap = findOverlap(appointment, id)
      if (overlap) return overlapResponse(overlap, auth.user.role === 'trainer')
    }

    return HttpResponse.json(
      withClient(appointmentsDb.update(id, { status, updatedAt: nowISO() })!),
    )
  }),

  http.delete(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer'])
    if (auth.error) return auth.error
    return appointmentsDb.remove(String(params.id))
      ? new HttpResponse(null, { status: 204 })
      : notFound(NOT_FOUND)
  }),
]
