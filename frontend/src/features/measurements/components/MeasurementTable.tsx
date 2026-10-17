import { Link } from 'react-router'
import { fullName } from '@/features/clients'
import type { Role } from '@/shared/auth/session'
import { paths } from '@/shared/config/paths'
import { formatShortDate } from '@/shared/lib/format'
import { Icon } from '@/shared/ui'
import { formatMeasurementValue } from '../model/fields'
import type { MeasurementValueKey, MeasurementWithClient } from '../types'
import styles from './MeasurementTable.module.css'

const COLUMNS: Array<{ key: MeasurementValueKey; label: string }> = [
  { key: 'weightKg', label: 'Težina' },
  { key: 'waistCm', label: 'Struk' },
  { key: 'hipsCm', label: 'Kukovi' },
  { key: 'bodyFatPct', label: 'Mast' },
  { key: 'steps', label: 'Koraci' },
]

interface MeasurementTableProps {
  measurements: MeasurementWithClient[]
  role: Role
  showClient?: boolean
  caption?: string
}

/** Tabela mjerenja (najnovije prvo). Na telefonu se skroluje vodoravno unutar svog okvira. */
export function MeasurementTable({
  measurements,
  role,
  showClient = false,
  caption = 'Mjerenja',
}: MeasurementTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Datum</th>
            {showClient && <th scope="col">Klijent</th>}
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={styles.num}>
                {column.label}
              </th>
            ))}
            <th scope="col">
              <span className="visually-hidden">Akcije</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.id}>
              <td className={styles.date}>{formatShortDate(m.date)}</td>
              {showClient && (
                <td>
                  {m.client ? (
                    <Link to={paths.client(m.client.id)}>{fullName(m.client)}</Link>
                  ) : (
                    '—'
                  )}
                </td>
              )}
              {COLUMNS.map((column) => (
                <td key={column.key} className={styles.num}>
                  {formatMeasurementValue(column.key, m[column.key])}
                </td>
              ))}
              <td>
                <Link
                  to={paths.measurementEdit(role, m.id)}
                  className={styles.edit}
                  aria-label={`Uredi mjerenje od ${formatShortDate(m.date)}`}
                >
                  <Icon name="edit" size={16} />
                  Uredi
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
