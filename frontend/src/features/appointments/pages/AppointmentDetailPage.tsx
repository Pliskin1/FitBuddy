import { Link, useNavigate, useParams } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { fullName } from '@/features/clients'
import { ApiError, isNotFound } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import { formatDate, formatRelativeDay } from '@/shared/lib/format'
import {
  Button,
  ButtonLink,
  ConfirmButton,
  DetailSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  layout,
  useToast,
} from '@/shared/ui'
import {
  useAppointment,
  useDeleteAppointment,
  useSetAppointmentStatus,
} from '../api/appointments.queries'
import { AppointmentStatusBadge } from '../components/AppointmentStatusBadge'
import {
  APPOINTMENT_TYPE_LABELS,
  CLIENT_CANCEL_HOURS,
  blocksTime,
  hoursUntil,
  timeRange,
} from '../model/labels'
import type { AppointmentStatus } from '../types'

const STATUS_TOASTS: Partial<Record<AppointmentStatus, string>> = {
  confirmed: 'Termin je potvrđen.',
  completed: 'Termin je označen kao završen.',
  cancelled: 'Termin je otkazan.',
  no_show: 'Upisan je izostanak.',
}

export function AppointmentDetailPage() {
  const { appointmentId = '' } = useParams()
  const { role } = useCurrentUser()
  const isTrainer = role === 'trainer'
  const navigate = useNavigate()
  const toast = useToast()
  const query = useAppointment(appointmentId)
  const setStatus = useSetAppointmentStatus()
  const remove = useDeleteAppointment()
  const listPath = paths.appointments(role)

  if (query.isPending) return <DetailSkeleton label="Učitavam termin…" />

  if (query.isError) {
    return isNotFound(query.error) ? (
      <EmptyState
        icon="calendar"
        title="Termin nije pronađen"
        text="Možda je obrisan ili link nije ispravan."
        action={<ButtonLink to={listPath}>Svi termini</ButtonLink>}
      />
    ) : (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    )
  }

  const appointment = query.data
  const started = new Date(appointment.startsAt).getTime() <= Date.now()
  const active = blocksTime(appointment.status)
  const clientCanCancel = active && hoursUntil(appointment.startsAt) >= CLIENT_CANCEL_HOURS

  const changeStatus = (status: AppointmentStatus) =>
    setStatus.mutate(
      { id: appointment.id, status },
      {
        onSuccess: () => toast(STATUS_TOASTS[status] ?? 'Status je promijenjen.'),
        onError: (error) =>
          toast(error instanceof ApiError ? error.message : 'Promjena nije uspjela.', 'error'),
      },
    )

  const trainerActions = (
    <>
      {appointment.status === 'pending' && (
        <>
          <Button
            icon="check"
            loading={setStatus.isPending}
            onClick={() => changeStatus('confirmed')}
          >
            Potvrdi
          </Button>
          <Button
            variant="secondary"
            icon="x"
            disabled={setStatus.isPending}
            onClick={() => changeStatus('cancelled')}
          >
            Odbij
          </Button>
        </>
      )}
      {appointment.status === 'confirmed' && started && (
        <>
          <Button
            icon="check"
            loading={setStatus.isPending}
            onClick={() => changeStatus('completed')}
          >
            Označi kao završen
          </Button>
          <Button
            variant="secondary"
            disabled={setStatus.isPending}
            onClick={() => changeStatus('no_show')}
          >
            Izostanak
          </Button>
        </>
      )}
      {appointment.status === 'confirmed' && !started && (
        <Button
          variant="secondary"
          icon="x"
          loading={setStatus.isPending}
          onClick={() => changeStatus('cancelled')}
        >
          Otkaži
        </Button>
      )}
      <ButtonLink to={paths.appointmentEdit(appointment.id)} variant="ghost" icon="edit">
        Uredi
      </ButtonLink>
    </>
  )

  return (
    <div className={layout.page}>
      <PageHeader
        back={{ to: listPath, label: isTrainer ? 'Svi termini' : 'Moji termini' }}
        title={`${formatRelativeDay(appointment.startsAt)} · ${timeRange(appointment)}`}
        documentTitle="Termin"
        subtitle={[
          isTrainer && appointment.client ? fullName(appointment.client) : null,
          APPOINTMENT_TYPE_LABELS[appointment.type],
          appointment.programDay || null,
        ]
          .filter(Boolean)
          .join(' · ')}
        actions={isTrainer ? trainerActions : undefined}
      />

      <div className={layout.split}>
        <Panel title="Detalji termina">
          <dl className={layout.definitions}>
            <dt>Status</dt>
            <dd>
              <AppointmentStatusBadge status={appointment.status} />
            </dd>
            {isTrainer && (
              <>
                <dt>Klijent</dt>
                <dd>
                  {appointment.client ? (
                    <Link to={paths.client(appointment.client.id)}>
                      {fullName(appointment.client)}
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </>
            )}
            <dt>Datum</dt>
            <dd>{formatDate(appointment.startsAt)}</dd>
            <dt>Vrijeme</dt>
            <dd className="tabular">{timeRange(appointment)}</dd>
            <dt>Trajanje</dt>
            <dd>{appointment.durationMin} min</dd>
            <dt>Vrsta</dt>
            <dd>{APPOINTMENT_TYPE_LABELS[appointment.type]}</dd>
            <dt>Dan programa</dt>
            <dd>{appointment.programDay || '—'}</dd>
            <dt>Napomena</dt>
            <dd>{appointment.note || '—'}</dd>
          </dl>
        </Panel>

        {isTrainer ? (
          <Panel
            title="Brisanje"
            description="Obrisan termin nestaje i iz kalendara klijenta. Za otkazivanje koristi dugme Otkaži."
          >
            <div>
              <ConfirmButton
                label="Obriši termin"
                icon="trash"
                question="Obrisati termin trajno?"
                confirmLabel="Da, obriši"
                loading={remove.isPending}
                onConfirm={() =>
                  remove.mutate(appointment.id, {
                    onSuccess: () => {
                      toast('Termin je obrisan.')
                      navigate(listPath)
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
        ) : (
          active && (
            <Panel
              title="Otkazivanje"
              description={
                clientCanCancel
                  ? `Termin možeš otkazati najkasnije ${CLIENT_CANCEL_HOURS} h prije početka.`
                  : `Do termina je manje od ${CLIENT_CANCEL_HOURS} h – za otkazivanje se javi treneru.`
              }
            >
              {clientCanCancel && (
                <div>
                  <ConfirmButton
                    label="Otkaži termin"
                    icon="x"
                    question="Otkazati ovaj termin?"
                    confirmLabel="Da, otkaži"
                    loading={setStatus.isPending}
                    onConfirm={() => changeStatus('cancelled')}
                  />
                </div>
              )}
            </Panel>
          )
        )}
      </div>
    </div>
  )
}
