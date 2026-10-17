import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { clientKeys } from '@/features/clients'
import { toAppointmentQuery } from '../model/filters'
import type { AppointmentFilters, AppointmentInput, AppointmentStatus } from '../types'
import { appointmentsApi } from './appointments.api'

export const appointmentKeys = {
  all: ['appointments'] as const,
}

export const appointmentQueries = {
  // Ključ su filteri (stabilni), a tačan vremenski raspon se računa tek pri slanju zahtjeva.
  list: (filters: AppointmentFilters) =>
    queryOptions({
      queryKey: [...appointmentKeys.all, 'list', filters] as const,
      queryFn: () => appointmentsApi.list(toAppointmentQuery(filters)),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...appointmentKeys.all, 'detail', id] as const,
      queryFn: () => appointmentsApi.get(id),
    }),
}

export function useAppointments(filters: AppointmentFilters) {
  return useQuery({ ...appointmentQueries.list(filters), placeholderData: keepPreviousData })
}

export function useAppointment(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    ...appointmentQueries.detail(id),
    enabled: (options.enabled ?? true) && Boolean(id),
  })
}

/** Termin mijenja i sažetak klijenta ("sljedeći termin"), pa osvježavamo oba keša. */
function useInvalidateAppointments() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    void queryClient.invalidateQueries({ queryKey: clientKeys.all })
  }
}

export function useSaveAppointment() {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: AppointmentInput }) =>
      id ? appointmentsApi.update(id, input) : appointmentsApi.create(input),
    onSuccess: invalidate,
  })
}

export function useSetAppointmentStatus() {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsApi.setStatus(id, status),
    onSuccess: invalidate,
  })
}

export function useDeleteAppointment() {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.remove(id),
    onSuccess: invalidate,
  })
}
