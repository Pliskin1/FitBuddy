import type { RouteObject } from 'react-router'
import { protect } from '@/features/auth'
import { queryClient } from '@/shared/api/queryClient'
import { clientQueries } from './api/clients.queries'
import { parseClientFilters } from './model/filters'

/*
 * Rute klijenata. Lista i detalj su samo za trenera (/trener/klijenti…),
 * a klijent ima svoj profil (/klijent/profil).
 * Loader provjerava ulogu i pokreće učitavanje podataka prije nego što se stranica prikaže.
 */
export const clientsRoutes: RouteObject[] = [
  {
    path: 'klijenti',
    children: [
      {
        index: true,
        loader: protect('trainer', ({ request }) => {
          void queryClient.prefetchQuery(
            clientQueries.list(parseClientFilters(new URL(request.url).searchParams)),
          )
          return null
        }),
        lazy: () =>
          import('./pages/ClientsListPage').then((m) => ({ Component: m.ClientsListPage })),
      },
      {
        path: 'novi',
        loader: protect('trainer'),
        lazy: () => import('./pages/ClientFormPage').then((m) => ({ Component: m.ClientFormPage })),
      },
      {
        path: ':clientId',
        loader: protect('trainer', ({ params }) => {
          void queryClient.prefetchQuery(clientQueries.detail(params.clientId ?? ''))
          return null
        }),
        lazy: () =>
          import('./pages/ClientDetailPage').then((m) => ({ Component: m.ClientDetailPage })),
      },
      {
        path: ':clientId/uredi',
        loader: protect('trainer', ({ params }) => {
          void queryClient.prefetchQuery(clientQueries.detail(params.clientId ?? ''))
          return null
        }),
        lazy: () => import('./pages/ClientFormPage').then((m) => ({ Component: m.ClientFormPage })),
      },
    ],
  },
]

export const myProfileRoute: RouteObject = {
  path: 'profil',
  loader: protect('client'),
  lazy: () => import('./pages/MyProfilePage').then((m) => ({ Component: m.MyProfilePage })),
}
