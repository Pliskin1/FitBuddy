import { apiClient } from '@/shared/api/client'
import type { MeasurementInput, MeasurementQuery, MeasurementWithClient } from '../types'

/** API pozivi za mjerenja. */
export const measurementsApi = {
  list: (query: MeasurementQuery) => apiClient.get<MeasurementWithClient[]>('/measurements', query),
  get: (id: string) => apiClient.get<MeasurementWithClient>(`/measurements/${id}`),
  create: (input: MeasurementInput) =>
    apiClient.post<MeasurementWithClient>('/measurements', input),
  update: (id: string, input: MeasurementInput) =>
    apiClient.put<MeasurementWithClient>(`/measurements/${id}`, input),
  remove: (id: string) => apiClient.delete(`/measurements/${id}`),
}
