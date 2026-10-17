import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { clientKeys } from '@/features/clients'
import { toMeasurementQuery } from '../model/filters'
import type { MeasurementFilters, MeasurementInput } from '../types'
import { measurementsApi } from './measurements.api'

export const measurementKeys = {
  all: ['measurements'] as const,
}

export const measurementQueries = {
  list: (filters: MeasurementFilters) =>
    queryOptions({
      queryKey: [...measurementKeys.all, 'list', filters] as const,
      queryFn: () => measurementsApi.list(toMeasurementQuery(filters)),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...measurementKeys.all, 'detail', id] as const,
      queryFn: () => measurementsApi.get(id),
    }),
}

export function useMeasurements(filters: MeasurementFilters) {
  return useQuery({ ...measurementQueries.list(filters), placeholderData: keepPreviousData })
}

export function useMeasurement(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    ...measurementQueries.detail(id),
    enabled: (options.enabled ?? true) && Boolean(id),
  })
}

/** Mjerenje mijenja i sažetak klijenta (posljednja težina), pa osvježavamo oba keša. */
function useInvalidateMeasurements() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: measurementKeys.all })
    void queryClient.invalidateQueries({ queryKey: clientKeys.all })
  }
}

export function useSaveMeasurement() {
  const invalidate = useInvalidateMeasurements()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: MeasurementInput }) =>
      id ? measurementsApi.update(id, input) : measurementsApi.create(input),
    onSuccess: invalidate,
  })
}

export function useDeleteMeasurement() {
  const invalidate = useInvalidateMeasurements()
  return useMutation({
    mutationFn: (id: string) => measurementsApi.remove(id),
    onSuccess: invalidate,
  })
}
