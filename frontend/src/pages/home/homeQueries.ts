import type { AppointmentFilters } from '@/features/appointments'
import type { ClientFilters } from '@/features/clients'
import type { MeasurementFilters } from '@/features/measurements'

/*
 * Filteri koje koriste početne stranice. Isti objekti idu u loader (prefetch) i u komponentu,
 * pa obje strane koriste isti ključ keša i podaci se ne učitavaju dvaput.
 */

export const TRAINER_HOME = {
  activeClients: { search: '', goal: '', status: 'active' } satisfies ClientFilters,
  today: { period: 'today', status: '', clientId: '' } satisfies AppointmentFilters,
  week: { period: 'week', status: '', clientId: '' } satisfies AppointmentFilters,
  pending: { period: 'upcoming', status: 'pending', clientId: '' } satisfies AppointmentFilters,
  recentMeasurements: { clientId: '', period: '30', limit: 5 } satisfies MeasurementFilters,
}

export function clientHomeFilters(clientId: string) {
  return {
    upcoming: { period: 'upcoming', status: '', clientId, limit: 5 } satisfies AppointmentFilters,
    measurements: { clientId, period: 'all' } satisfies MeasurementFilters,
  }
}
