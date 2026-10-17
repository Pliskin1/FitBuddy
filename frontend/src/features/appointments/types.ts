import type { ClientRef } from '@/features/clients'

/*
 * Termin – zakazani trening, mjerenje ili konsultacije sa klijentom.
 * Veza: Appointment.clientId → Client.id (N:1). Ugovor: docs/entities.md, "Appointment".
 */

export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
] as const
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

export const APPOINTMENT_TYPES = ['training', 'assessment', 'consultation'] as const
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number]

export interface Appointment {
  id: string
  clientId: string
  /** Početak, ISO 8601. */
  startsAt: string
  durationMin: number
  type: AppointmentType
  status: AppointmentStatus
  /** Dan programa koji se radi, npr. "Dan B – Noge i leđa". */
  programDay: string
  note: string
  createdAt: string
  updatedAt: string
}

/** Termin kakav vraća API: uz kratku referencu na klijenta. */
export interface AppointmentWithClient extends Appointment {
  client: ClientRef | null
}

export type AppointmentInput = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>

export const APPOINTMENT_PERIODS = ['today', 'week', 'upcoming', 'past', 'all'] as const
export type AppointmentPeriod = (typeof APPOINTMENT_PERIODS)[number]

/** Filteri u UI-ju (i ključ keša). Pretvaraju se u `AppointmentQuery` tek pri slanju zahtjeva. */
export interface AppointmentFilters {
  period: AppointmentPeriod
  status: AppointmentStatus | ''
  clientId: string
  limit?: number
}

/** Parametri GET /api/appointments. */
export type AppointmentQuery = {
  from?: string
  to?: string
  status?: string
  clientId?: string
  order?: 'asc' | 'desc'
  limit?: number
}
