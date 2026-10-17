import type { Role } from '@/shared/auth/session'
import { toISODate } from '@/shared/lib/date'
import { formatDate, formatRelativeDay, pluralize } from '@/shared/lib/format'
import { Panel, layout } from '@/shared/ui'
import type { AppointmentWithClient } from '../types'
import { AppointmentList, AppointmentRow } from './AppointmentRow'

interface AppointmentDayGroupsProps {
  appointments: AppointmentWithClient[]
  role: Role
  showClient?: boolean
}

const RELATIVE_WORDS = ['Danas', 'Sjutra', 'Juče']

/** Termini grupisani po danima, svaki dan u svom panelu. Redoslijed prati redoslijed iz API-ja. */
export function AppointmentDayGroups({
  appointments,
  role,
  showClient = true,
}: AppointmentDayGroupsProps) {
  const groups = new Map<string, AppointmentWithClient[]>()
  for (const appointment of appointments) {
    const day = toISODate(new Date(appointment.startsAt))
    groups.set(day, [...(groups.get(day) ?? []), appointment])
  }

  return (
    <div className={layout.page}>
      {[...groups.entries()].map(([day, items]) => {
        const title = formatRelativeDay(day)
        return (
          <Panel
            key={day}
            title={title}
            description={RELATIVE_WORDS.includes(title) ? formatDate(day) : undefined}
            action={
              <span className={layout.meta}>
                {pluralize(items.length, ['termin', 'termina', 'termina'])}
              </span>
            }
          >
            <AppointmentList>
              {items.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  role={role}
                  showClient={showClient}
                />
              ))}
            </AppointmentList>
          </Panel>
        )
      })}
    </div>
  )
}
