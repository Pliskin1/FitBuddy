import type { ClientRef } from '@/features/clients'

/*
 * Mjerenje – jedan unos tjelesnih mjera i koraka za jednog klijenta.
 * Veza: Measurement.clientId → Client.id (N:1). Ugovor: docs/entities.md, "Measurement".
 * Svako polje je opciono (null), ali mjerenje mora imati bar jednu vrijednost.
 */

export interface Measurement {
  id: string
  clientId: string
  /** Dan mjerenja, 'YYYY-MM-DD'. */
  date: string
  weightKg: number | null
  bodyFatPct: number | null
  waistCm: number | null
  hipsCm: number | null
  chestCm: number | null
  armCm: number | null
  thighCm: number | null
  steps: number | null
  note: string
  createdAt: string
  updatedAt: string
}

export type MeasurementValueKey =
  'weightKg' | 'bodyFatPct' | 'waistCm' | 'hipsCm' | 'chestCm' | 'armCm' | 'thighCm' | 'steps'

export interface MeasurementWithClient extends Measurement {
  client: ClientRef | null
}

export type MeasurementInput = Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>

export const MEASUREMENT_PERIODS = ['30', '90', 'all'] as const
export type MeasurementPeriod = (typeof MEASUREMENT_PERIODS)[number]

export interface MeasurementFilters {
  clientId: string
  period: MeasurementPeriod
  limit?: number
}

/** Parametri GET /api/measurements. */
export type MeasurementQuery = {
  clientId?: string
  from?: string
  to?: string
  limit?: number
}
