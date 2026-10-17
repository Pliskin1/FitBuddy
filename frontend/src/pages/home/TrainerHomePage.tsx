import { Link } from 'react-router'
import {
  AppointmentList,
  AppointmentRow,
  useAppointments,
  useSetAppointmentStatus,
} from '@/features/appointments'
import { useCurrentUser } from '@/features/auth'
import { daysSinceMeasurement, fullName, isMeasurementStale, useClients } from '@/features/clients'
import { formatMeasurementValue, useMeasurements } from '@/features/measurements'
import { ApiError } from '@/shared/api/client'
import { paths } from '@/shared/config/paths'
import {
  capitalize,
  formatDate,
  formatDateTimeCompact,
  formatShortDate,
  formatWeekday,
  greeting,
} from '@/shared/lib/format'
import {
  Button,
  ButtonLink,
  EmptyState,
  ErrorState,
  Icon,
  ListSkeleton,
  PageHeader,
  Panel,
  StatCard,
  layout,
  useToast,
} from '@/shared/ui'
import { TRAINER_HOME } from './homeQueries'
import styles from './HomePage.module.css'

/** Kontrolna tabla trenera: brojke dana, današnji termini i šta zahtijeva pažnju. */
export function TrainerHomePage() {
  const user = useCurrentUser()
  const toast = useToast()
  const clients = useClients(TRAINER_HOME.activeClients)
  const today = useAppointments(TRAINER_HOME.today)
  const week = useAppointments(TRAINER_HOME.week)
  const pending = useAppointments(TRAINER_HOME.pending)
  const recent = useMeasurements(TRAINER_HOME.recentMeasurements)
  const setStatus = useSetAppointmentStatus()

  const now = new Date()
  const staleClients = (clients.data ?? []).filter((client) =>
    isMeasurementStale(client.lastMeasuredAt),
  )
  const weekCount = (week.data ?? []).filter((a) => a.status !== 'cancelled').length

  const confirm = (id: string) =>
    setStatus.mutate(
      { id, status: 'confirmed' },
      {
        onSuccess: () => toast('Termin je potvrđen.'),
        onError: (error) =>
          toast(error instanceof ApiError ? error.message : 'Potvrda nije uspjela.', 'error'),
      },
    )

  return (
    <div className={layout.page}>
      <PageHeader
        title={`${greeting(now)}, ${user.displayName.split(' ')[0]}`}
        documentTitle="Kontrolna tabla"
        subtitle={`${capitalize(formatWeekday(now))}, ${formatDate(now)}`}
        actions={
          <>
            <ButtonLink to={paths.appointmentNew('trainer')} variant="accent" icon="plus">
              Novi termin
            </ButtonLink>
            <ButtonLink to={paths.clientNew} variant="secondary" icon="plus">
              Novi klijent
            </ButtonLink>
          </>
        }
      />

      <div className={styles.stats}>
        <StatCard
          label="Aktivni klijenti"
          value={clients.data?.length ?? 0}
          loading={clients.isPending}
        />
        <StatCard
          label="Termini ove sedmice"
          value={weekCount}
          loading={week.isPending}
          hint="bez otkazanih"
        />
        <StatCard
          label="Zahtjevi na čekanju"
          value={pending.data?.length ?? 0}
          loading={pending.isPending}
          tone={pending.data?.length ? 'warning' : 'default'}
          hint={pending.data?.length ? 'čekaju potvrdu' : 'sve je potvrđeno'}
          hintIcon={pending.data?.length ? 'clock' : 'check'}
        />
        <StatCard
          label="Bez mjerenja 14+ dana"
          value={staleClients.length}
          loading={clients.isPending}
          tone="ink"
          hint="klijenata"
        />
      </div>

      <div className={layout.split}>
        <Panel
          title="Današnji termini"
          action={
            <Link to={`${paths.appointments('trainer')}?period=today`} className={layout.meta}>
              Otvori sve
            </Link>
          }
        >
          {today.isPending ? (
            <ListSkeleton rows={4} label="Učitavam današnje termine…" />
          ) : today.isError ? (
            <ErrorState error={today.error} onRetry={() => void today.refetch()} compact />
          ) : today.data.length === 0 ? (
            <EmptyState
              compact
              icon="calendar"
              title="Danas nema termina"
              text="Slobodan dan – ili vrijeme da zakažeš nove."
            />
          ) : (
            <AppointmentList>
              {today.data.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  role="trainer"
                  actions={
                    appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        icon="check"
                        loading={setStatus.isPending && setStatus.variables?.id === appointment.id}
                        onClick={() => confirm(appointment.id)}
                      >
                        Potvrdi
                      </Button>
                    )
                  }
                />
              ))}
            </AppointmentList>
          )}
        </Panel>

        <div className={layout.page}>
          <Panel title="Zahtijeva pažnju">
            {clients.isPending || pending.isPending ? (
              <ListSkeleton rows={3} label="Učitavam…" />
            ) : clients.isError ? (
              <ErrorState error={clients.error} onRetry={() => void clients.refetch()} compact />
            ) : staleClients.length === 0 && (pending.data ?? []).length === 0 ? (
              <EmptyState
                compact
                icon="check"
                title="Sve je pod kontrolom"
                text="Nema zahtjeva na čekanju ni klijenata bez mjerenja."
              />
            ) : (
              <div className={styles.attention}>
                {(pending.data ?? []).map((appointment) => (
                  <Link
                    key={appointment.id}
                    to={paths.appointment('trainer', appointment.id)}
                    className={styles.attentionItem}
                  >
                    <span className={styles.attentionIcon}>
                      <Icon name="clock" size={18} />
                    </span>
                    <span className={styles.attentionBody}>
                      <span className={styles.attentionTitle}>
                        {appointment.client ? fullName(appointment.client) : 'Klijent'}
                      </span>
                      <span className={styles.attentionText}>
                        Zahtjev za termin: {formatDateTimeCompact(appointment.startsAt)}
                      </span>
                    </span>
                    <Icon name="chevronRight" size={18} />
                  </Link>
                ))}
                {staleClients.map((client) => {
                  const days = daysSinceMeasurement(client.lastMeasuredAt)
                  return (
                    <Link
                      key={client.id}
                      to={paths.client(client.id)}
                      className={styles.attentionItem}
                    >
                      <span className={styles.attentionIcon}>
                        <Icon name="alert" size={18} />
                      </span>
                      <span className={styles.attentionBody}>
                        <span className={styles.attentionTitle}>{fullName(client)}</span>
                        <span className={styles.attentionText}>
                          {days === null ? 'Još nema mjerenja' : `Bez mjerenja ${days} dana`}
                        </span>
                      </span>
                      <Icon name="chevronRight" size={18} />
                    </Link>
                  )
                })}
              </div>
            )}
          </Panel>

          <Panel
            title="Posljednja mjerenja"
            action={
              <Link to={paths.measurements('trainer')} className={layout.meta}>
                Sva mjerenja
              </Link>
            }
          >
            {recent.isPending ? (
              <ListSkeleton rows={3} label="Učitavam mjerenja…" />
            ) : recent.isError ? (
              <ErrorState error={recent.error} onRetry={() => void recent.refetch()} compact />
            ) : recent.data.length === 0 ? (
              <EmptyState
                compact
                icon="chart"
                title="Nema novih mjerenja"
                text="U posljednjih 30 dana niko nije upisao mjerenje."
              />
            ) : (
              <div className={styles.attention}>
                {recent.data.map((m) => (
                  <Link
                    key={m.id}
                    to={m.client ? paths.client(m.client.id) : paths.measurements('trainer')}
                    className={styles.attentionItem}
                  >
                    <span className={styles.attentionBody}>
                      <span className={styles.attentionTitle}>
                        {m.client ? fullName(m.client) : 'Klijent'}
                      </span>
                      <span className={styles.attentionText}>{formatShortDate(m.date)}</span>
                    </span>
                    <span className={styles.metaValue}>
                      {formatMeasurementValue('weightKg', m.weightKg)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
