import { useSearchParams } from 'react-router'
import { paths } from '@/shared/config/paths'
import { pluralize } from '@/shared/lib/format'
import {
  ButtonLink,
  CardGridSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  RefreshingIndicator,
  layout,
} from '@/shared/ui'
import { useClients } from '../api/clients.queries'
import { ClientCard } from '../components/ClientCard'
import { ClientFiltersBar } from '../components/ClientFiltersBar'
import { DEFAULT_CLIENT_FILTERS, clientFiltersToParams, parseClientFilters } from '../model/filters'
import type { ClientFilters } from '../types'

export function ClientsListPage() {
  const [params, setParams] = useSearchParams()
  const filters = parseClientFilters(params)
  const query = useClients(filters)

  const updateFilters = (next: ClientFilters) =>
    setParams(clientFiltersToParams(next), { replace: true })
  const hasActiveFilters =
    filters.search !== DEFAULT_CLIENT_FILTERS.search || filters.goal !== DEFAULT_CLIENT_FILTERS.goal

  return (
    <div className={layout.page}>
      <PageHeader
        title="Klijenti"
        subtitle={
          query.data
            ? pluralize(query.data.length, ['klijent', 'klijenta', 'klijenata'])
            : 'Učitavam…'
        }
        actions={
          <ButtonLink to={paths.clientNew} variant="accent" icon="plus">
            Novi klijent
          </ButtonLink>
        }
      />

      <ClientFiltersBar filters={filters} onChange={updateFilters} />
      <RefreshingIndicator active={query.isFetching && !query.isPending} />

      {query.isPending ? (
        <CardGridSkeleton label="Učitavam klijente…" />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data.length === 0 ? (
        <EmptyState
          icon="users"
          title={hasActiveFilters ? 'Nema klijenata za ovu pretragu' : 'Još nema klijenata'}
          text={
            hasActiveFilters
              ? 'Promijeni pretragu ili cilj, ili prikaži i arhivirane klijente.'
              : 'Dodaj prvog klijenta – posle mu možeš zakazivati termine i bilježiti mjerenja.'
          }
          action={
            hasActiveFilters ? undefined : (
              <ButtonLink to={paths.clientNew} icon="plus">
                Dodaj klijenta
              </ButtonLink>
            )
          }
        />
      ) : (
        <div className={layout.cardGrid}>
          {query.data.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}
