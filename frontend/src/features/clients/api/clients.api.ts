import { apiClient } from '@/shared/api/client'
import type { Client, ClientFilters, ClientInput, ClientListItem, ClientStatus } from '../types'

/** API pozivi za klijente. Isti kod radi i sa mock rutama i sa pravim backendom. */
export const clientsApi = {
  list: (filters: ClientFilters) =>
    apiClient.get<ClientListItem[]>('/clients', {
      search: filters.search,
      goal: filters.goal,
      status: filters.status,
    }),
  get: (id: string) => apiClient.get<Client>(`/clients/${id}`),
  create: (input: ClientInput) => apiClient.post<Client>('/clients', input),
  update: (id: string, input: ClientInput) => apiClient.put<Client>(`/clients/${id}`, input),
  setStatus: (id: string, status: ClientStatus) =>
    apiClient.patch<Client>(`/clients/${id}`, { status }),
}
