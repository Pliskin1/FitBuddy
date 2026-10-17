import { daysBetween, parseISODate } from '@/shared/lib/date'
import type { ClientGoal, ClientRef, ClientStatus } from '../types'

export const GOAL_LABELS: Record<ClientGoal, string> = {
  fat_loss: 'Redukcija masti',
  muscle_gain: 'Mišićna masa',
  strength: 'Snaga',
  conditioning: 'Kondicija',
  health: 'Opšte zdravlje',
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Aktivan',
  archived: 'Arhiviran',
}

export function fullName(client: Pick<ClientRef, 'firstName' | 'lastName'>): string {
  return `${client.firstName} ${client.lastName}`
}

/** Posle koliko dana bez mjerenja trener dobija upozorenje (SPEC.md, sekcija 4). */
export const STALE_MEASUREMENT_DAYS = 14

/** Broj dana od posljednjeg mjerenja ili null ako mjerenja nema. */
export function daysSinceMeasurement(
  lastMeasuredAt: string | null,
  now = new Date(),
): number | null {
  return lastMeasuredAt ? daysBetween(parseISODate(lastMeasuredAt), now) : null
}

export function isMeasurementStale(lastMeasuredAt: string | null, now = new Date()): boolean {
  const days = daysSinceMeasurement(lastMeasuredAt, now)
  return days === null || days > STALE_MEASUREMENT_DAYS
}
