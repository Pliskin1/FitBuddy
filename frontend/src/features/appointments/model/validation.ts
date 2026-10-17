import { combineDateTime, toISODate, toTimeString } from '@/shared/lib/date'
import type { FieldErrors } from '@/shared/lib/validation'
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
  type Appointment,
  type AppointmentInput,
  type AppointmentStatus,
  type AppointmentType,
} from '../types'

export interface AppointmentFormValues {
  clientId: string
  date: string
  time: string
  durationMin: string
  type: AppointmentType
  status: AppointmentStatus
  programDay: string
  note: string
}

export function toAppointmentFormValues(
  appointment?: Appointment,
  defaults: Partial<AppointmentFormValues> = {},
): AppointmentFormValues {
  if (appointment) {
    const start = new Date(appointment.startsAt)
    return {
      clientId: appointment.clientId,
      date: toISODate(start),
      time: toTimeString(start),
      durationMin: String(appointment.durationMin),
      type: appointment.type,
      status: appointment.status,
      programDay: appointment.programDay,
      note: appointment.note,
    }
  }
  // Preskačemo undefined, da npr. `date: undefined` ne pregazi današnji datum.
  const provided = Object.fromEntries(
    Object.entries(defaults).filter(([, value]) => value !== undefined),
  )
  return {
    clientId: '',
    date: toISODate(new Date()),
    time: '18:00',
    durationMin: '60',
    type: 'training',
    status: 'confirmed',
    programDay: '',
    note: '',
    ...provided,
  }
}

/** Provjera forme prije slanja (polja koja korisnik vidi). */
export function validateAppointmentForm(
  values: AppointmentFormValues,
): FieldErrors<AppointmentFormValues> {
  const errors: FieldErrors<AppointmentFormValues> = {}
  if (!values.clientId) errors.clientId = 'Izaberi klijenta.'
  if (!values.date) errors.date = 'Izaberi datum.'
  if (!values.time) errors.time = 'Izaberi vrijeme početka.'
  if (!Number(values.durationMin)) errors.durationMin = 'Izaberi trajanje.'
  return errors
}

export function toAppointmentInput(values: AppointmentFormValues): AppointmentInput {
  return {
    clientId: values.clientId,
    startsAt: combineDateTime(values.date, values.time),
    durationMin: Number(values.durationMin),
    type: values.type,
    status: values.status,
    programDay: values.programDay.trim(),
    note: values.note.trim(),
  }
}

/** Pravila koja provjerava i API (mock ruta). */
export function validateAppointmentInput(input: AppointmentInput): FieldErrors<AppointmentInput> {
  const errors: FieldErrors<AppointmentInput> = {}
  if (!input.clientId) errors.clientId = 'Izaberi klijenta.'
  if (!input.startsAt || Number.isNaN(new Date(input.startsAt).getTime()))
    errors.startsAt = 'Vrijeme nije ispravno.'
  if (!Number.isInteger(input.durationMin) || input.durationMin < 15 || input.durationMin > 240) {
    errors.durationMin = 'Trajanje treba da bude između 15 i 240 minuta.'
  }
  if (!APPOINTMENT_TYPES.includes(input.type)) errors.type = 'Izaberi vrstu termina.'
  if (!APPOINTMENT_STATUSES.includes(input.status)) errors.status = 'Nepoznat status.'
  return errors
}

/** Greške sa API-ja (polja ulaza) → polja forme. `startsAt` se prikazuje ispod vremena. */
export function mapServerErrors(
  fieldErrors: Record<string, string>,
): FieldErrors<AppointmentFormValues> {
  const { startsAt, ...rest } = fieldErrors
  return { ...rest, ...(startsAt ? { time: startsAt } : {}) }
}
