import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ClientFilters, ClientInput, ClientStatus } from '../types'
import { clientsApi } from './clients.api'

/*
 * TanStack Query sloj: ključevi keša, upiti i mutacije za klijente.
 * Route loaderi koriste `clientQueries` za prefetch, a komponente hook-ove ispod.
 */

export const clientKeys = {
  all: ['clients'] as const,
}

export const clientQueries = {
  list: (filters: ClientFilters) =>
    queryOptions({
      queryKey: [...clientKeys.all, 'list', filters] as const,
      queryFn: () => clientsApi.list(filters),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...clientKeys.all, 'detail', id] as const,
      queryFn: () => clientsApi.get(id),
    }),
}

/** Lista klijenata. Dok se učitava novi filter, ostaje prethodni rezultat (bez treptanja). */
export function useClients(filters: ClientFilters) {
  return useQuery({ ...clientQueries.list(filters), placeholderData: keepPreviousData })
}

export function useClient(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    ...clientQueries.detail(id),
    enabled: (options.enabled ?? true) && Boolean(id),
  })
}

/** Kreira (bez id) ili mijenja (sa id) klijenta. */
export function useSaveClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: ClientInput }) =>
      id ? clientsApi.update(id, input) : clientsApi.create(input),
    onSuccess: (client) => {
      queryClient.setQueryData(clientQueries.detail(client.id).queryKey, client)
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}

export function useSetClientStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ClientStatus }) =>
      clientsApi.setStatus(id, status),
    onSuccess: (client) => {
      queryClient.setQueryData(clientQueries.detail(client.id).queryKey, client)
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}
