import { ClientSelectField } from '@/features/clients'
import { SegmentedControl, SelectField, layout } from '@/shared/ui'
import { PERIOD_LABELS } from '../model/filters'
import { APPOINTMENT_STATUS_META } from '../model/labels'
import {
  APPOINTMENT_PERIODS,
  APPOINTMENT_STATUSES,
  type AppointmentFilters,
  type AppointmentStatus,
} from '../types'

interface AppointmentFiltersBarProps {
  filters: AppointmentFilters
  onChange: (filters: AppointmentFilters) => void
  /** Filter po klijentu ima smisla samo treneru. */
  showClientFilter: boolean
}

const PERIOD_OPTIONS = APPOINTMENT_PERIODS.map((period) => ({
  value: period,
  label: PERIOD_LABELS[period],
}))
const STATUS_OPTIONS = APPOINTMENT_STATUSES.map((status) => ({
  value: status,
  label: APPOINTMENT_STATUS_META[status].label,
}))

export function AppointmentFiltersBar({
  filters,
  onChange,
  showClientFilter,
}: AppointmentFiltersBarProps) {
  return (
    <div className={layout.toolbar}>
      <SegmentedControl
        label="Period"
        value={filters.period}
        options={PERIOD_OPTIONS}
        onChange={(period) => onChange({ ...filters, period })}
      />
      <div className={layout.filterSelect}>
        <SelectField
          id="filter-status"
          label="Status"
          placeholder="Svi statusi"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as AppointmentStatus | '' })
          }
        />
      </div>
      {showClientFilter && (
        <div className={layout.filterSelect}>
          <ClientSelectField
            id="filter-client"
            placeholder="Svi klijenti"
            value={filters.clientId}
            onChange={(clientId) => onChange({ ...filters, clientId })}
          />
        </div>
      )}
    </div>
  )
}
