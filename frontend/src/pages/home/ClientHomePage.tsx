import { Link } from 'react-router'
import {
  APPOINTMENT_TYPE_LABELS,
  AppointmentStatusBadge,
  UpcomingAppointments,
  timeRange,
  useAppointments,
} from '@/features/appointments'
import { useCurrentUser } from '@/features/auth'
import { ClientProgress } from '@/features/measurements'
import { paths } from '@/shared/config/paths'
import {
  capitalize,
  formatDate,
  formatRelativeDay,
  formatWeekday,
  greeting,
} from '@/shared/lib/format'
import { ButtonLink, LoadingRegion, PageHeader, Panel, Skeleton, layout } from '@/shared/ui'
import { clientHomeFilters } from './homeQueries'
import styles from './HomePage.module.css'

/** Početna klijenta: sljedeći termin, naredni termini i napredak. */
export function ClientHomePage() {
  const user = useCurrentUser()
  const clientId = user.clientId ?? ''
  const filters = clientHomeFilters(clientId)
  const upcoming = useAppointments(filters.upcoming)
  const now = new Date()
  const next = upcoming.data?.find((a) => a.status === 'confirmed' || a.status === 'pending')

  return (
    <div className={layout.page}>
      <PageHeader
        title={`${greeting(now)}, ${user.displayName.split(' ')[0]}`}
        documentTitle="Početna"
        subtitle={`${capitalize(formatWeekday(now))}, ${formatDate(now)}`}
        actions={
          <ButtonLink to={paths.measurementNew('client')} variant="secondary" icon="plus">
            Upiši mjerenje
          </ButtonLink>
        }
      />

      {upcoming.isPending ? (
        <LoadingRegion label="Učitavam sljedeći termin…" className={styles.hero}>
          <Skeleton width={140} height={14} />
          <Skeleton width="70%" height={40} />
          <Skeleton width="50%" height={16} />
        </LoadingRegion>
      ) : next ? (
        <Link to={paths.appointment('client', next.id)} className={styles.hero}>
          <span className={styles.heroLabel}>
            <span className={styles.heroEyebrow}>Sljedeći termin</span>
            <AppointmentStatusBadge status={next.status} />
          </span>
          <span className={styles.heroTitle}>
            {formatRelativeDay(next.startsAt)} · {timeRange(next)}
          </span>
          <span className={styles.heroText}>
            {[APPOINTMENT_TYPE_LABELS[next.type], next.programDay].filter(Boolean).join(' · ')}
          </span>
        </Link>
      ) : (
        <div className={styles.hero}>
          <span className={styles.heroLabel}>
            <span className={styles.heroEyebrow}>Sljedeći termin</span>
          </span>
          <span className={styles.heroTitle}>Nemaš zakazan termin</span>
          <span className={styles.heroText}>
            Zatraži termin – trener ga potvrđuje ili predlaže drugo vrijeme.
          </span>
          <div className={styles.heroActions}>
            <ButtonLink to={paths.appointmentNew('client')} variant="accent" icon="plus">
              Zatraži termin
            </ButtonLink>
          </div>
        </div>
      )}

      <div className={layout.split}>
        <Panel
          title="Moj napredak"
          action={
            <Link to={paths.measurements('client')} className={layout.meta}>
              Sva mjerenja
            </Link>
          }
        >
          <ClientProgress clientId={clientId} role="client" />
        </Panel>
        <Panel
          title="Naredni termini"
          action={
            <Link to={paths.appointments('client')} className={layout.meta}>
              Svi termini
            </Link>
          }
        >
          <UpcomingAppointments clientId={clientId} role="client" />
        </Panel>
      </div>
    </div>
  )
}
