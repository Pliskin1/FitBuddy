import { Badge } from '@/shared/ui'
import { APPOINTMENT_STATUS_META } from '../model/labels'
import type { AppointmentStatus } from '../types'

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = APPOINTMENT_STATUS_META[status]
  return (
    <Badge tone={meta.tone} icon={meta.icon}>
      {meta.label}
    </Badge>
  )
}
