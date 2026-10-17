import type { RouteObject } from 'react-router'
import { protect } from '@/features/auth'
import { queryClient } from '@/shared/api/queryClient'
import type { Role } from '@/shared/auth/session'
import { measurementQueries } from './api/measurements.queries'
import { parseMeasurementFilters } from './model/filters'

/** Rute mjerenja za datu ulogu (/trener/mjerenja… i /klijent/mjerenja…). */
export function measurementsRoutes(role: Role): RouteObject[] {
  return [
    {
      path: 'mjerenja',
      children: [
        {
          index: true,
          loader: protect(role, ({ request }) => {
            void queryClient.prefetchQuery(
              measurementQueries.list(parseMeasurementFilters(new URL(request.url).searchParams)),
            )
            return null
          }),
          lazy: () =>
            import('./pages/MeasurementsListPage').then((m) => ({
              Component: m.MeasurementsListPage,
            })),
        },
        {
          path: 'novo',
          loader: protect(role),
          lazy: () =>
            import('./pages/MeasurementFormPage').then((m) => ({
              Component: m.MeasurementFormPage,
            })),
        },
        {
          path: ':measurementId/uredi',
          loader: protect(role, ({ params }) => {
            void queryClient.prefetchQuery(measurementQueries.detail(params.measurementId ?? ''))
            return null
          }),
          lazy: () =>
            import('./pages/MeasurementFormPage').then((m) => ({
              Component: m.MeasurementFormPage,
            })),
        },
      ],
    },
  ]
}
