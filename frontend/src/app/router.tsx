import { createBrowserRouter } from 'react-router'
import { appointmentsRoutes } from '@/features/appointments/routes'
import { RequireRole, loginLoader, protect, rootRedirectLoader } from '@/features/auth'
import { clientsRoutes, myProfileRoute } from '@/features/clients/routes'
import { measurementsRoutes } from '@/features/measurements/routes'
import { clientHomeLoader } from '@/pages/home/clientHome.loader'
import { trainerHomeLoader } from '@/pages/home/trainerHome.loader'
import { RouteErrorPage } from '@/pages/errors/RouteErrorPage'
import { BootScreen } from '@/shared/ui'
import { AppLayout } from './layout/AppLayout'

/*
 * Mapa ruta:
 *   /prijava                       prijava (javno)
 *   /                              preusmjerenje na početnu uloge
 *   /trener …                      kontrolna tabla, klijenti, termini, mjerenja (uloga: trener)
 *   /klijent …                     početna, termini, mjerenja, profil (uloga: klijent)
 * Svaka stranica se učitava lijeno (lazy), a loader rute provjerava prijavu i pokreće učitavanje podataka.
 */
export const router = createBrowserRouter([
  {
    path: '/prijava',
    loader: loginLoader,
    hydrateFallbackElement: <BootScreen />,
    lazy: () => import('@/features/auth/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
  },
  {
    path: '/',
    element: <AppLayout />,
    hydrateFallbackElement: <BootScreen />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, loader: rootRedirectLoader },
      {
        errorElement: <RouteErrorPage />,
        children: [
          {
            path: 'trener',
            element: <RequireRole role="trainer" />,
            children: [
              {
                index: true,
                loader: protect('trainer', trainerHomeLoader),
                lazy: () =>
                  import('@/pages/home/TrainerHomePage').then((m) => ({
                    Component: m.TrainerHomePage,
                  })),
              },
              ...clientsRoutes,
              ...appointmentsRoutes('trainer'),
              ...measurementsRoutes('trainer'),
            ],
          },
          {
            path: 'klijent',
            element: <RequireRole role="client" />,
            children: [
              {
                index: true,
                loader: protect('client', clientHomeLoader),
                lazy: () =>
                  import('@/pages/home/ClientHomePage').then((m) => ({
                    Component: m.ClientHomePage,
                  })),
              },
              myProfileRoute,
              ...appointmentsRoutes('client'),
              ...measurementsRoutes('client'),
            ],
          },
          {
            path: '*',
            lazy: () =>
              import('@/pages/errors/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
          },
        ],
      },
    ],
  },
])
