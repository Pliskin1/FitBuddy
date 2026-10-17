import { useNavigate, useParams } from 'react-router'
import { ApiError } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import { ErrorState, FormSkeleton, PageHeader, layout, useToast } from '@/shared/ui'
import { useClient, useSaveClient } from '../api/clients.queries'
import { ClientForm } from '../components/ClientForm'
import { fullName } from '../model/labels'
import { toClientFormValues } from '../model/validation'

/** Isti ekran za "Novi klijent" (/trener/klijenti/novi) i "Uredi klijenta" (/trener/klijenti/:id/uredi). */
export function ClientFormPage() {
  const { clientId } = useParams()
  const isEdit = Boolean(clientId)
  const navigate = useNavigate()
  const toast = useToast()
  const query = useClient(clientId ?? '', { enabled: isEdit })
  const save = useSaveClient()

  const title = isEdit ? 'Uredi klijenta' : 'Novi klijent'
  const back =
    isEdit && clientId
      ? { to: paths.client(clientId), label: 'Nazad na klijenta' }
      : { to: paths.clients, label: 'Svi klijenti' }

  if (isEdit && query.isPending) {
    return (
      <div className={layout.page}>
        <PageHeader title={title} back={back} />
        <FormSkeleton fields={9} />
      </div>
    )
  }

  if (isEdit && query.isError) {
    return (
      <div className={layout.page}>
        <PageHeader title={title} back={back} />
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </div>
    )
  }

  const serverErrors =
    save.error instanceof ApiError && Object.keys(save.error.fieldErrors).length > 0
      ? save.error.fieldErrors
      : undefined

  return (
    <div className={layout.page}>
      <PageHeader
        title={title}
        subtitle={
          isEdit && query.data
            ? fullName(query.data)
            : 'Osnovni podaci, cilj saradnje i zdravstvene napomene.'
        }
        back={back}
      />
      <ClientForm
        key={query.data?.updatedAt ?? 'new'}
        initialValues={toClientFormValues(query.data)}
        submitLabel={isEdit ? 'Sačuvaj izmjene' : 'Dodaj klijenta'}
        submitting={save.isPending}
        serverErrors={serverErrors}
        formError={save.error}
        showStatus={isEdit}
        onCancel={() => navigate(back.to)}
        onSubmit={(input) =>
          save.mutate(
            { id: clientId, input },
            {
              onSuccess: (client) => {
                toast(
                  isEdit ? 'Izmjene su sačuvane.' : `Novi klijent je sačuvan: ${fullName(client)}.`,
                )
                navigate(paths.client(client.id))
              },
            },
          )
        }
      />
    </div>
  )
}
