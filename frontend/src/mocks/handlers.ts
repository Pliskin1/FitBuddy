import { appointmentsHandlers } from '@/features/appointments/api/appointments.mock'
import { authHandlers } from '@/features/auth/api/auth.mock'
import { clientsHandlers } from '@/features/clients/api/clients.mock'
import { measurementsHandlers } from '@/features/measurements/api/measurements.mock'

/** Sve mock rute aplikacije. Novi feature dodaje svoje handlere ovdje. */
export const handlers = [
  ...authHandlers,
  ...clientsHandlers,
  ...appointmentsHandlers,
  ...measurementsHandlers,
]
