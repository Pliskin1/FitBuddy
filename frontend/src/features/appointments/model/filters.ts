import { addDays, startOfDay, startOfWeek } from '@/shared/lib/date'
import {
  APPOINTMENT_PERIODS,
  APPOINTMENT_STATUSES,
  type AppointmentFilters,
  type AppointmentPeriod,
  type AppointmentQuery,
  type AppointmentStatus,
} from '../types'

export const PERIOD_LABELS: Record<AppointmentPeriod, string> = {
  today: 'Danas',
  week: 'Ova sedmica',
  upcoming: 'Narednih 30 dana',
  past: 'Prošli',
  all: 'Svi',
}

export const DEFAULT_APPOINTMENT_FILTERS: AppointmentFilters = {
  period: 'upcoming',
  status: '',
  clientId: '',
}

/** ?period=week&status=pending&client=c-ana */
export function parseAppointmentFilters(params: URLSearchParams): AppointmentFilters {
  const period = params.get('period') ?? ''
  const status = params.get('status') ?? ''
  return {
    period: (APPOINTMENT_PERIODS as readonly string[]).includes(period)
      ? (period as AppointmentPeriod)
      : DEFAULT_APPOINTMENT_FILTERS.period,
    status: (APPOINTMENT_STATUSES as readonly string[]).includes(status)
      ? (status as AppointmentStatus)
      : '',
    clientId: params.get('client') ?? '',
  }
}

export function appointmentFiltersToParams(filters: AppointmentFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.period !== DEFAULT_APPOINTMENT_FILTERS.period) params.set('period', filters.period)
  if (filters.status) params.set('status', filters.status)
  if (filters.clientId) params.set('client', filters.clientId)
  return params
}

/** Period iz UI-ja → konkretan vremenski raspon za API (računa se u trenutku slanja zahtjeva). */
export function toAppointmentQuery(
  filters: AppointmentFilters,
  now = new Date(),
): AppointmentQuery {
  const base: AppointmentQuery = {
    status: filters.status || undefined,
    clientId: filters.clientId || undefined,
    limit: filters.limit,
  }
  const today = startOfDay(now)

  switch (filters.period) {
    case 'today':
      return { ...base, from: today.toISOString(), to: addDays(today, 1).toISOString() }
    case 'week': {
      const monday = startOfWeek(now)
      return { ...base, from: monday.toISOString(), to: addDays(monday, 7).toISOString() }
    }
    case 'upcoming':
      return { ...base, from: now.toISOString(), to: addDays(now, 30).toISOString() }
    case 'past':
      return {
        ...base,
        from: addDays(today, -90).toISOString(),
        to: now.toISOString(),
        order: 'desc',
      }
    case 'all':
      return base
  }
}
