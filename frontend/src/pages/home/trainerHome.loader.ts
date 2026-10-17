import { appointmentQueries } from '@/features/appointments'
import { clientQueries } from '@/features/clients'
import { measurementQueries } from '@/features/measurements'
import { queryClient } from '@/shared/api/queryClient'
import { TRAINER_HOME } from './homeQueries'

/** Pokreće sve upite kontrolne table paralelno, prije nego što se stranica nacrta. */
export function trainerHomeLoader() {
  void queryClient.prefetchQuery(clientQueries.list(TRAINER_HOME.activeClients))
  void queryClient.prefetchQuery(appointmentQueries.list(TRAINER_HOME.today))
  void queryClient.prefetchQuery(appointmentQueries.list(TRAINER_HOME.week))
  void queryClient.prefetchQuery(appointmentQueries.list(TRAINER_HOME.pending))
  void queryClient.prefetchQuery(measurementQueries.list(TRAINER_HOME.recentMeasurements))
  return null
}
