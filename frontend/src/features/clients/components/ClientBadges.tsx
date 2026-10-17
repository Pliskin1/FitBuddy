import { Badge } from '@/shared/ui'
import { GOAL_LABELS, STALE_MEASUREMENT_DAYS, daysSinceMeasurement } from '../model/labels'
import type { ClientGoal, ClientStatus } from '../types'

export function GoalBadge({ goal }: { goal: ClientGoal }) {
  return <Badge>{GOAL_LABELS[goal]}</Badge>
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return status === 'active' ? (
    <Badge tone="success" icon="check">
      Aktivan
    </Badge>
  ) : (
    <Badge icon="archive">Arhiviran</Badge>
  )
}

/** Upozorenje ako klijent nije mjeren duže od 14 dana. */
export function StaleMeasurementBadge({ lastMeasuredAt }: { lastMeasuredAt: string | null }) {
  const days = daysSinceMeasurement(lastMeasuredAt)
  if (days !== null && days <= STALE_MEASUREMENT_DAYS) return null
  return (
    <Badge tone="warning" icon="alert">
      {days === null ? 'Bez mjerenja' : `Bez mjerenja ${days} dana`}
    </Badge>
  )
}
