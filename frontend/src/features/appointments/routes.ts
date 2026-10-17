import type { RouteObject } from 'react-router'
import { protect } from '@/features/auth'
import { queryClient } from '@/shared/api/queryClient'
import type { Role } from '@/shared/auth/session'
import { appointmentQueries } from './api/appointments.queries'
import { parseAppointmentFilters } from './model/filters'

/*
 * Rute termina za datu ulogu (/trener/termini… i /klijent/termini…).
 * Loader provjerava prijavu i odmah pokreće učitavanje podataka (prefetch), a stranica
 * u međuvremenu prikazuje loader – korisnik nikad ne gleda praznu stranicu.
 */
export function appointmentsRoutes(role: Role): RouteObject[] {
  return [
    {
      path: 'termini',
      children: [
        {
          index: true,
          loader: protect(role, ({ request }) => {
            void queryClient.prefetchQuery(
              appointmentQueries.list(parseAppointmentFilters(new URL(request.url).searchParams)),
            )
            return null
          }),
          lazy: () =>
            import('./pages/AppointmentsListPage').then((m) => ({
              Component: m.AppointmentsListPage,
            })),
        },
        {
          path: 'novi',
          loader: protect(role),
          lazy: () =>
            import('./pages/AppointmentFormPage').then((m) => ({
              Component: m.AppointmentFormPage,
            })),
        },
        {
          path: ':appointmentId',
          loader: protect(role, ({ params }) => {
            void queryClient.prefetchQuery(appointmentQueries.detail(params.appointmentId ?? ''))
            return null
          }),
          lazy: () =>
            import('./pages/AppointmentDetailPage').then((m) => ({
              Component: m.AppointmentDetailPage,
            })),
        },
        ...(role === 'trainer'
          ? [
              {
                path: ':appointmentId/uredi',
                loader: protect(role, ({ params }) => {
                  void queryClient.prefetchQuery(
                    appointmentQueries.detail(params.appointmentId ?? ''),
                  )
                  return null
                }),
                lazy: () =>
                  import('./pages/AppointmentFormPage').then((m) => ({
                    Component: m.AppointmentFormPage,
                  })),
              },
            ]
          : []),
      ],
    },
  ]
}
