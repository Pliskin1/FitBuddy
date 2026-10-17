import { addMinutes } from '@/shared/lib/date'
import { formatTime } from '@/shared/lib/format'
import type { BadgeTone, IconName } from '@/shared/ui'
import type { Appointment, AppointmentStatus, AppointmentType } from '../types'

export const APPOINTMENT_STATUS_META: Record<
  AppointmentStatus,
  { label: string; tone: BadgeTone; icon: IconName }
> = {
  pending: { label: 'Na čekanju', tone: 'warning', icon: 'clock' },
  confirmed: { label: 'Potvrđen', tone: 'success', icon: 'check' },
  completed: { label: 'Završen', tone: 'neutral', icon: 'check' },
  cancelled: { label: 'Otkazan', tone: 'danger', icon: 'x' },
  no_show: { label: 'Izostanak', tone: 'danger', icon: 'alert' },
}

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  training: 'Trening',
  assessment: 'Mjerenje i procjena',
  consultation: 'Konsultacije',
}

export const DURATION_OPTIONS = [30, 45, 60, 90] as const

/** Klijent može otkazati termin najkasnije ovoliko sati prije početka (SPEC.md, 3.1). */
export const CLIENT_CANCEL_HOURS = 24

export function appointmentEnd(appointment: Pick<Appointment, 'startsAt' | 'durationMin'>): Date {
  return addMinutes(new Date(appointment.startsAt), appointment.durationMin)
}

/** "18:00–19:00" */
export function timeRange(appointment: Pick<Appointment, 'startsAt' | 'durationMin'>): string {
  return `${formatTime(appointment.startsAt)}–${formatTime(appointmentEnd(appointment))}`
}

/** Termini koji zauzimaju vrijeme trenera (ulaze u provjeru preklapanja). */
export function blocksTime(status: AppointmentStatus): boolean {
  return status === 'pending' || status === 'confirmed'
}

export function hoursUntil(startsAt: string, now = new Date()): number {
  return (new Date(startsAt).getTime() - now.getTime()) / 3_600_000
}
