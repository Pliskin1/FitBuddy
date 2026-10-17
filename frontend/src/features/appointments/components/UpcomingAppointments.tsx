import type { Role } from '@/shared/auth/session'
import { paths } from '@/shared/config/paths'
import { ButtonLink, EmptyState, ErrorState, ListSkeleton } from '@/shared/ui'
import { useAppointments } from '../api/appointments.queries'
import { AppointmentList, AppointmentRow } from './AppointmentRow'

interface UpcomingAppointmentsProps {
  clientId: string
  role: Role
  limit?: number
}

/** Naredni termini jednog klijenta – na detalju klijenta (trener) i početnoj (klijent). */
export function UpcomingAppointments({ clientId, role, limit = 5 }: UpcomingAppointmentsProps) {
  const query = useAppointments({ period: 'upcoming', status: '', clientId, limit })

  if (query.isPending) return <ListSkeleton rows={3} label="Učitavam termine…" />
  if (query.isError)
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} compact />

  if (query.data.length === 0) {
    return (
      <EmptyState
        compact
        icon="calendar"
        title="Nema zakazanih termina"
        text={
          role === 'trainer'
            ? 'Zakaži sljedeći trening da klijent ostane u ritmu.'
            : 'Zatraži termin – trener će ga potvrditi.'
        }
        action={
          <ButtonLink
            to={paths.appointmentNew(role, role === 'trainer' ? { client: clientId } : undefined)}
            size="sm"
            icon="plus"
          >
            {role === 'trainer' ? 'Zakaži termin' : 'Zatraži termin'}
          </ButtonLink>
        }
      />
    )
  }

  return (
    <AppointmentList>
      {query.data.map((appointment) => (
        <AppointmentRow
          key={appointment.id}
          appointment={appointment}
          role={role}
          showClient={false}
          showDate
        />
      ))}
    </AppointmentList>
  )
}
