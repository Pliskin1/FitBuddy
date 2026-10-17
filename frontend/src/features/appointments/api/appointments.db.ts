import { createCollection } from '@/shared/mocks/collection'
import type { Appointment } from '../types'
import { seedAppointments } from './appointments.seed'

/** Mock tabela termina. Koriste je samo mock rute (*.mock.ts), nikad komponente. */
export const appointmentsDb = createCollection<Appointment>('appointments', () =>
  seedAppointments(),
)
