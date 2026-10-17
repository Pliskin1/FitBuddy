import { apiClient } from '@/shared/api/client'
import type {
  AppointmentInput,
  AppointmentQuery,
  AppointmentStatus,
  AppointmentWithClient,
} from '../types'

/** API pozivi za termine. */
export const appointmentsApi = {
  list: (query: AppointmentQuery) => apiClient.get<AppointmentWithClient[]>('/appointments', query),
  get: (id: string) => apiClient.get<AppointmentWithClient>(`/appointments/${id}`),
  create: (input: AppointmentInput) =>
    apiClient.post<AppointmentWithClient>('/appointments', input),
  update: (id: string, input: AppointmentInput) =>
    apiClient.put<AppointmentWithClient>(`/appointments/${id}`, input),
  setStatus: (id: string, status: AppointmentStatus) =>
    apiClient.patch<AppointmentWithClient>(`/appointments/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/appointments/${id}`),
}
