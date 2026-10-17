/* Javni API feature-a "clients". Drugi feature-i i stranice uvoze samo odavde. */
export { clientKeys, clientQueries, useClient, useClients } from './api/clients.queries'
export { ClientStatusBadge, GoalBadge, StaleMeasurementBadge } from './components/ClientBadges'
export { ClientSelectField } from './components/ClientSelectField'
export {
  GOAL_LABELS,
  STALE_MEASUREMENT_DAYS,
  daysSinceMeasurement,
  fullName,
  isMeasurementStale,
} from './model/labels'
export type {
  Client,
  ClientFilters,
  ClientGoal,
  ClientListItem,
  ClientRef,
  ClientStatus,
} from './types'
