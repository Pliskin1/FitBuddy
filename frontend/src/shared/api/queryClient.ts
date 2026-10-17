import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { clearSession } from '@/shared/auth/session'
import { ApiError, isUnauthorized } from './client'

/** Istekla ili nevažeća sesija: odjavi korisnika i vrati ga na prijavu. */
function handleUnauthorized(error: unknown) {
  if (!isUnauthorized(error)) return
  clearSession()
  if (!window.location.pathname.startsWith('/prijava')) window.location.assign('/prijava')
}

/** Jedan QueryClient za cijelu aplikaciju – koriste ga i komponente i route loaderi. */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Greške 4xx (404, 403, validacija) nema smisla ponavljati.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
        failureCount < 2,
    },
  },
})
