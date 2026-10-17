import { Link } from 'react-router'
import { paths } from '@/shared/config/paths'
import { formatDateTimeCompact, formatNumber } from '@/shared/lib/format'
import { Avatar, Icon } from '@/shared/ui'
import { fullName } from '../model/labels'
import type { ClientListItem } from '../types'
import { ClientStatusBadge, GoalBadge, StaleMeasurementBadge } from './ClientBadges'
import styles from './ClientCard.module.css'

export function ClientCard({ client }: { client: ClientListItem }) {
  return (
    <Link to={paths.client(client.id)} className={styles.card}>
      <div className={styles.head}>
        <Avatar firstName={client.firstName} lastName={client.lastName} />
        <div className={styles.titles}>
          <h2 className={styles.name}>{fullName(client)}</h2>
          <span className={styles.email}>{client.email}</span>
        </div>
        <Icon name="chevronRight" className={styles.chevron} />
      </div>

      <div className={styles.badges}>
        <GoalBadge goal={client.goal} />
        {client.status === 'archived' ? (
          <ClientStatusBadge status="archived" />
        ) : (
          <StaleMeasurementBadge lastMeasuredAt={client.lastMeasuredAt} />
        )}
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Sljedeći termin</dt>
          <dd>
            {client.nextAppointmentAt
              ? formatDateTimeCompact(client.nextAppointmentAt)
              : 'Nije zakazan'}
          </dd>
        </div>
        <div>
          <dt>Težina</dt>
          <dd>
            {client.latestWeightKg !== null ? `${formatNumber(client.latestWeightKg)} kg` : '—'}
          </dd>
        </div>
      </dl>
    </Link>
  )
}
