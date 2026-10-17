import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { fullName } from '@/features/clients'
import { ApiError } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import { formatShortDate } from '@/shared/lib/format'
import {
  ConfirmButton,
  ErrorState,
  FormSkeleton,
  PageHeader,
  Panel,
  layout,
  useToast,
} from '@/shared/ui'
import {
  useDeleteMeasurement,
  useMeasurement,
  useSaveMeasurement,
} from '../api/measurements.queries'
import { MeasurementForm } from '../components/MeasurementForm'
import { toMeasurementFormValues } from '../model/validation'

/** Novo mjerenje (?client=<id> popunjava klijenta) i izmjena/brisanje postojećeg. */
export function MeasurementFormPage() {
  const { measurementId } = useParams()
  const isEdit = Boolean(measurementId)
  const [params] = useSearchParams()
  const user = useCurrentUser()
  const isTrainer = user.role === 'trainer'
  const navigate = useNavigate()
  const toast = useToast()
  const query = useMeasurement(measurementId ?? '', { enabled: isEdit })
  const save = useSaveMeasurement()
  const remove = useDeleteMeasurement()

  const title = isEdit ? 'Uredi mjerenje' : 'Novo mjerenje'
  const back = {
    to: paths.measurements(user.role),
    label: isTrainer ? 'Sva mjerenja' : 'Moja mjerenja',
  }

  if (isEdit && (query.isPending || query.isError)) {
    return (
      <div className={layout.page}>
        <PageHeader title={title} back={back} />
        {query.isError ? (
          <ErrorState error={query.error} onRetry={() => void query.refetch()} />
        ) : (
          <FormSkeleton fields={9} />
        )}
      </div>
    )
  }

  const initialValues = toMeasurementFormValues(query.data, {
    clientId:
      query.data?.clientId ?? (isTrainer ? (params.get('client') ?? '') : (user.clientId ?? '')),
  })
  const serverErrors =
    save.error instanceof ApiError && Object.keys(save.error.fieldErrors).length > 0
      ? save.error.fieldErrors
      : undefined

  return (
    <div className={layout.page}>
      <PageHeader
        title={title}
        subtitle={
          query.data
            ? [
                isTrainer && query.data.client ? fullName(query.data.client) : null,
                formatShortDate(query.data.date),
              ]
                .filter(Boolean)
                .join(' · ')
            : 'Težina, obimi i koraci – sve je opciono osim datuma.'
        }
        back={back}
      />
      <MeasurementForm
        key={query.data?.updatedAt ?? 'new'}
        role={user.role}
        initialValues={initialValues}
        submitLabel={isEdit ? 'Sačuvaj izmjene' : 'Sačuvaj mjerenje'}
        submitting={save.isPending}
        serverErrors={serverErrors}
        formError={save.error}
        onCancel={() => navigate(back.to)}
        onSubmit={(input) =>
          save.mutate(
            { id: measurementId, input },
            {
              onSuccess: (measurement) => {
                toast(isEdit ? 'Mjerenje je sačuvano.' : 'Novo mjerenje je upisano.')
                navigate(
                  isTrainer ? paths.client(measurement.clientId) : paths.measurements(user.role),
                )
              },
            },
          )
        }
      />

      {isEdit && measurementId && (
        <Panel title="Brisanje" description="Obrisano mjerenje nestaje i sa grafikona napretka.">
          <div>
            <ConfirmButton
              label="Obriši mjerenje"
              icon="trash"
              question="Obrisati mjerenje trajno?"
              confirmLabel="Da, obriši"
              loading={remove.isPending}
              onConfirm={() =>
                remove.mutate(measurementId, {
                  onSuccess: () => {
                    toast('Mjerenje je obrisano.')
                    navigate(back.to)
                  },
                  onError: (error) =>
                    toast(
                      error instanceof ApiError ? error.message : 'Brisanje nije uspjelo.',
                      'error',
                    ),
                })
              }
            />
          </div>
        </Panel>
      )}
    </div>
  )
}
