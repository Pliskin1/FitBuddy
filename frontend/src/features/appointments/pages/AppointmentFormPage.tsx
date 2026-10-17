import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { ApiError } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import { ErrorState, FormSkeleton, PageHeader, layout, useToast } from '@/shared/ui'
import { useAppointment, useSaveAppointment } from '../api/appointments.queries'
import { AppointmentForm } from '../components/AppointmentForm'
import { toAppointmentFormValues } from '../model/validation'

/**
 * Novi termin (trener), zahtjev za termin (klijent) i izmjena termina (trener).
 * Za novi termin podržava ?client=<id>&date=YYYY-MM-DD, npr. sa detalja klijenta.
 */
export function AppointmentFormPage() {
  const { appointmentId } = useParams()
  const isEdit = Boolean(appointmentId)
  const [params] = useSearchParams()
  const user = useCurrentUser()
  const isTrainer = user.role === 'trainer'
  const navigate = useNavigate()
  const toast = useToast()
  const query = useAppointment(appointmentId ?? '', { enabled: isEdit })
  const save = useSaveAppointment()

  const title = isEdit ? 'Uredi termin' : isTrainer ? 'Novi termin' : 'Zatraži termin'
  const back =
    isEdit && appointmentId
      ? { to: paths.appointment(user.role, appointmentId), label: 'Nazad na termin' }
      : { to: paths.appointments(user.role), label: isTrainer ? 'Svi termini' : 'Moji termini' }

  if (isEdit && (query.isPending || query.isError)) {
    return (
      <div className={layout.page}>
        <PageHeader title={title} back={back} />
        {query.isError ? (
          <ErrorState error={query.error} onRetry={() => void query.refetch()} />
        ) : (
          <FormSkeleton fields={7} />
        )}
      </div>
    )
  }

  const initialValues = toAppointmentFormValues(query.data, {
    clientId: isTrainer ? (params.get('client') ?? '') : (user.clientId ?? ''),
    date: params.get('date') ?? undefined,
    status: isTrainer ? 'confirmed' : 'pending',
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
          isTrainer
            ? undefined
            : 'Izaberi datum i vrijeme – trener potvrđuje ili predlaže drugo vrijeme.'
        }
        back={back}
      />
      <AppointmentForm
        key={query.data?.updatedAt ?? 'new'}
        role={user.role}
        initialValues={initialValues}
        submitLabel={isEdit ? 'Sačuvaj izmjene' : isTrainer ? 'Zakaži termin' : 'Pošalji zahtjev'}
        submitting={save.isPending}
        serverErrors={serverErrors}
        formError={save.error}
        onCancel={() => navigate(back.to)}
        onSubmit={(input) =>
          save.mutate(
            { id: appointmentId, input },
            {
              onSuccess: (appointment) => {
                toast(
                  isEdit
                    ? 'Termin je sačuvan.'
                    : isTrainer
                      ? 'Termin je zakazan.'
                      : 'Zahtjev je poslat treneru.',
                )
                navigate(paths.appointment(user.role, appointment.id))
              },
            },
          )
        }
      />
    </div>
  )
}
