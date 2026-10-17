import { useSearchParams } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { paths } from '@/shared/config/paths'
import { pluralize } from '@/shared/lib/format'
import {
  ButtonLink,
  EmptyState,
  ErrorState,
  ListSkeleton,
  PageHeader,
  Panel,
  RefreshingIndicator,
  layout,
} from '@/shared/ui'
import { useAppointments } from '../api/appointments.queries'
import { AppointmentDayGroups } from '../components/AppointmentDayGroups'
import { AppointmentFiltersBar } from '../components/AppointmentFiltersBar'
import {
  PERIOD_LABELS,
  appointmentFiltersToParams,
  parseAppointmentFilters,
} from '../model/filters'
import type { AppointmentFilters } from '../types'

export function AppointmentsListPage() {
  const { role } = useCurrentUser()
  const isTrainer = role === 'trainer'
  const [params, setParams] = useSearchParams()
  const filters = parseAppointmentFilters(params)
  const query = useAppointments(filters)

  const updateFilters = (next: AppointmentFilters) =>
    setParams(appointmentFiltersToParams(next), { replace: true })
  const newLink = (
    <ButtonLink to={paths.appointmentNew(role)} variant="accent" icon="plus">
      {isTrainer ? 'Novi termin' : 'Zatraži termin'}
    </ButtonLink>
  )

  return (
    <div className={layout.page}>
      <PageHeader
        title={isTrainer ? 'Termini' : 'Moji termini'}
        subtitle={
          query.data
            ? `${PERIOD_LABELS[filters.period]} · ${pluralize(query.data.length, ['termin', 'termina', 'termina'])}`
            : 'Učitavam…'
        }
        actions={newLink}
      />

      <AppointmentFiltersBar
        filters={filters}
        onChange={updateFilters}
        showClientFilter={isTrainer}
      />
      <RefreshingIndicator active={query.isFetching && !query.isPending} />

      {query.isPending ? (
        <Panel as="div">
          <ListSkeleton rows={5} label="Učitavam termine…" />
        </Panel>
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Nema termina za izabrani period"
          text={
            isTrainer
              ? 'Promijeni period ili status, ili zakaži novi termin.'
              : 'Promijeni period ili zatraži novi termin od trenera.'
          }
          action={newLink}
        />
      ) : (
        <AppointmentDayGroups appointments={query.data} role={role} showClient={isTrainer} />
      )}
    </div>
  )
}
