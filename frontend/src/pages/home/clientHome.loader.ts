import { appointmentQueries } from '@/features/appointments'
import { measurementQueries } from '@/features/measurements'
import { queryClient } from '@/shared/api/queryClient'
import { loadSession } from '@/shared/auth/session'
import { clientHomeFilters } from './homeQueries'

/** Pokreće upite početne strane klijenta (termini i mjerenja) prije crtanja. */
export function clientHomeLoader() {
  const clientId = loadSession()?.user.clientId
  if (!clientId) return null
  const filters = clientHomeFilters(clientId)
  void queryClient.prefetchQuery(appointmentQueries.list(filters.upcoming))
  void queryClient.prefetchQuery(measurementQueries.list(filters.measurements))
  return null
}
