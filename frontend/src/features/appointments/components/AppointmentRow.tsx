import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { fullName } from '@/features/clients'
import type { Role } from '@/shared/auth/session'
import { paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/cn'
import { formatRelativeDay, formatTime } from '@/shared/lib/format'
import { APPOINTMENT_TYPE_LABELS } from '../model/labels'
import type { AppointmentWithClient } from '../types'
import { AppointmentStatusBadge } from './AppointmentStatusBadge'
import styles from './AppointmentRow.module.css'

interface AppointmentRowProps {
  appointment: AppointmentWithClient
  role: Role
  /** Na listi trenera naslov je ime klijenta; kod klijenta vrsta termina. */
  showClient?: boolean
  showDate?: boolean
  /** Brze akcije pored statusa (npr. "Potvrdi" na kontrolnoj tabli). */
  actions?: ReactNode
}

export function AppointmentRow({
  appointment,
  role,
  showClient = true,
  showDate = false,
  actions,
}: AppointmentRowProps) {
  const inactive = appointment.status === 'cancelled' || appointment.status === 'no_show'
  const typeLabel = APPOINTMENT_TYPE_LABELS[appointment.type]
  const title = showClient
    ? appointment.client
      ? fullName(appointment.client)
      : 'Nepoznat klijent'
    : typeLabel
  const subtitle = [
    showDate && formatRelativeDay(appointment.startsAt),
    showClient && typeLabel,
    appointment.programDay,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={cn(styles.row, inactive && styles.inactive)}>
      <Link to={paths.appointment(role, appointment.id)} className={styles.link}>
        <span className={styles.time}>
          <span className={styles.start}>{formatTime(appointment.startsAt)}</span>
          <span className={styles.duration}>{appointment.durationMin} min</span>
        </span>
        <span className={styles.body}>
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.sub}>{subtitle}</span>}
        </span>
      </Link>
      <div className={styles.side}>
        <AppointmentStatusBadge status={appointment.status} />
        {actions}
      </div>
    </div>
  )
}

export function AppointmentList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>
}
