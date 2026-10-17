import { useParams } from 'react-router'
import { UpcomingAppointments } from '@/features/appointments'
import { ClientProgress } from '@/features/measurements'
import { ApiError, isNotFound } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import { formatDate } from '@/shared/lib/format'
import {
  Button,
  ButtonLink,
  DetailSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  layout,
  useToast,
} from '@/shared/ui'
import { useClient, useSetClientStatus } from '../api/clients.queries'
import { ClientProfilePanels } from '../components/ClientProfilePanels'
import { GOAL_LABELS, fullName } from '../model/labels'

export function ClientDetailPage() {
  const { clientId = '' } = useParams()
  const query = useClient(clientId)
  const setStatus = useSetClientStatus()
  const toast = useToast()

  if (query.isPending) return <DetailSkeleton label="Učitavam klijenta…" />

  if (query.isError) {
    return isNotFound(query.error) ? (
      <EmptyState
        icon="users"
        title="Klijent nije pronađen"
        text="Možda je link pogrešan ili je klijent uklonjen."
        action={<ButtonLink to={paths.clients}>Svi klijenti</ButtonLink>}
      />
    ) : (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    )
  }

  const client = query.data
  const archived = client.status === 'archived'

  const toggleArchive = () =>
    setStatus.mutate(
      { id: client.id, status: archived ? 'active' : 'archived' },
      {
        onSuccess: () => toast(archived ? 'Klijent je ponovo aktivan.' : 'Klijent je arhiviran.'),
        onError: (error) =>
          toast(error instanceof ApiError ? error.message : 'Promjena nije uspjela.', 'error'),
      },
    )

  return (
    <div className={layout.page}>
      <PageHeader
        back={{ to: paths.clients, label: 'Svi klijenti' }}
        title={fullName(client)}
        subtitle={`${GOAL_LABELS[client.goal]} · klijent od ${formatDate(client.startDate)}`}
        actions={
          <>
            <ButtonLink to={paths.clientEdit(client.id)} variant="secondary" icon="edit">
              Uredi
            </ButtonLink>
            <Button
              variant="ghost"
              icon={archived ? 'restore' : 'archive'}
              loading={setStatus.isPending}
              onClick={toggleArchive}
            >
              {archived ? 'Vrati u aktivne' : 'Arhiviraj'}
            </Button>
          </>
        }
      />

      <div className={layout.split}>
        <div className={layout.page}>
          <Panel
            title="Mjerenja i napredak"
            action={
              <ButtonLink
                to={paths.measurementNew('trainer', { client: client.id })}
                size="sm"
                variant="secondary"
                icon="plus"
              >
                Novo mjerenje
              </ButtonLink>
            }
          >
            <ClientProgress clientId={client.id} role="trainer" />
          </Panel>
          <Panel
            title="Naredni termini"
            action={
              !archived && (
                <ButtonLink
                  to={paths.appointmentNew('trainer', { client: client.id })}
                  size="sm"
                  variant="secondary"
                  icon="plus"
                >
                  Zakaži termin
                </ButtonLink>
              )
            }
          >
            <UpcomingAppointments clientId={client.id} role="trainer" />
          </Panel>
        </div>
        <div className={layout.page}>
          <ClientProfilePanels client={client} />
        </div>
      </div>
    </div>
  )
}
