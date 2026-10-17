import { addDays, toISODate } from '@/shared/lib/date'
import {
  MEASUREMENT_PERIODS,
  type MeasurementFilters,
  type MeasurementPeriod,
  type MeasurementQuery,
} from '../types'

export const MEASUREMENT_PERIOD_LABELS: Record<MeasurementPeriod, string> = {
  '30': 'Posljednjih 30 dana',
  '90': 'Posljednjih 90 dana',
  all: 'Sva mjerenja',
}

export const DEFAULT_MEASUREMENT_FILTERS: MeasurementFilters = { clientId: '', period: '90' }

/** ?client=c-ana&period=30 */
export function parseMeasurementFilters(params: URLSearchParams): MeasurementFilters {
  const period = params.get('period') ?? ''
  return {
    clientId: params.get('client') ?? '',
    period: (MEASUREMENT_PERIODS as readonly string[]).includes(period)
      ? (period as MeasurementPeriod)
      : DEFAULT_MEASUREMENT_FILTERS.period,
  }
}

export function measurementFiltersToParams(filters: MeasurementFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.clientId) params.set('client', filters.clientId)
  if (filters.period !== DEFAULT_MEASUREMENT_FILTERS.period) params.set('period', filters.period)
  return params
}

export function toMeasurementQuery(
  filters: MeasurementFilters,
  now = new Date(),
): MeasurementQuery {
  return {
    clientId: filters.clientId || undefined,
    from: filters.period === 'all' ? undefined : toISODate(addDays(now, -Number(filters.period))),
    limit: filters.limit,
  }
}
