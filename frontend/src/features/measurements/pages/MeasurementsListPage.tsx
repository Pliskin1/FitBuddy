import { useSearchParams } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { ClientSelectField } from '@/features/clients'
import { paths } from '@/shared/config/paths'
import { pluralize } from '@/shared/lib/format'
import {
  ButtonLink,
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  RefreshingIndicator,
  SegmentedControl,
  TableSkeleton,
  layout,
} from '@/shared/ui'
import { useMeasurements } from '../api/measurements.queries'
import { MeasurementTable } from '../components/MeasurementTable'
import { WeightChart } from '../components/WeightChart'
import {
  MEASUREMENT_PERIOD_LABELS,
  measurementFiltersToParams,
  parseMeasurementFilters,
} from '../model/filters'
import { MEASUREMENT_PERIODS, type MeasurementFilters } from '../types'

const PERIOD_OPTIONS = MEASUREMENT_PERIODS.map((period) => ({
  value: period,
  label: MEASUREMENT_PERIOD_LABELS[period],
}))

export function MeasurementsListPage() {
  const { role } = useCurrentUser()
  const isTrainer = role === 'trainer'
  const [params, setParams] = useSearchParams()
  const filters = parseMeasurementFilters(params)
  const query = useMeasurements(filters)

  const updateFilters = (next: MeasurementFilters) =>
    setParams(measurementFiltersToParams(next), { replace: true })
  // Grafikon ima smisla za jednu osobu: klijentu uvijek, treneru kad izabere klijenta.
  const showChart = !isTrainer || Boolean(filters.clientId)
  const chartPoints = (query.data ?? [])
    .filter((m) => m.weightKg !== null)
    .map((m) => ({ date: m.date, value: m.weightKg as number }))
    .reverse()

  const newLink = (
    <ButtonLink
      to={paths.measurementNew(
        role,
        isTrainer && filters.clientId ? { client: filters.clientId } : undefined,
      )}
      variant="accent"
      icon="plus"
    >
      Novo mjerenje
    </ButtonLink>
  )

  return (
    <div className={layout.page}>
      <PageHeader
        title={isTrainer ? 'Mjerenja' : 'Moja mjerenja'}
        subtitle={
          query.data
            ? pluralize(query.data.length, ['mjerenje', 'mjerenja', 'mjerenja'])
            : 'Učitavam…'
        }
        actions={newLink}
      />

      <div className={layout.toolbar}>
        {isTrainer && (
          <div className={layout.filterSelect}>
            <ClientSelectField
              id="filter-client"
              placeholder="Svi klijenti"
              value={filters.clientId}
              onChange={(clientId) => updateFilters({ ...filters, clientId })}
            />
          </div>
        )}
        <SegmentedControl
          label="Period"
          value={filters.period}
          options={PERIOD_OPTIONS}
          onChange={(period) => updateFilters({ ...filters, period })}
        />
        <RefreshingIndicator active={query.isFetching && !query.isPending} />
      </div>

      {query.isPending ? (
        <TableSkeleton label="Učitavam mjerenja…" />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data.length === 0 ? (
        <EmptyState
          icon="chart"
          title="Nema mjerenja za izabrani period"
          text="Promijeni period ili upiši novo mjerenje."
          action={newLink}
        />
      ) : (
        <>
          {showChart && (
            <Panel title="Težina kroz vrijeme">
              <WeightChart points={chartPoints} />
            </Panel>
          )}
          <Panel title="Unosi">
            <MeasurementTable
              measurements={query.data}
              role={role}
              showClient={isTrainer && !filters.clientId}
            />
          </Panel>
        </>
      )}
    </div>
  )
}
