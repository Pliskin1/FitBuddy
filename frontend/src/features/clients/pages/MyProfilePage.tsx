import { useCurrentUser } from '@/features/auth'
import { DetailSkeleton, ErrorState, PageHeader, layout } from '@/shared/ui'
import { useClient } from '../api/clients.queries'
import { ClientProfilePanels } from '../components/ClientProfilePanels'
import { fullName } from '../model/labels'

/** Klijent vidi svoj profil. Podatke mijenja trener. */
export function MyProfilePage() {
  const user = useCurrentUser()
  const query = useClient(user.clientId ?? '')

  return (
    <div className={layout.page}>
      <PageHeader
        title="Moj profil"
        subtitle={
          query.data
            ? `${fullName(query.data)} · podatke mijenja trener – javi mu ako nešto nije tačno.`
            : undefined
        }
      />
      {query.isPending ? (
        <DetailSkeleton label="Učitavam profil…" />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <div className={layout.cardGrid}>
          <ClientProfilePanels client={query.data} />
        </div>
      )}
    </div>
  )
}
