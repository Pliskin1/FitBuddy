import { ageFromBirthDate, formatDate, formatShortDate } from '@/shared/lib/format'
import { Badge, Panel, layout } from '@/shared/ui'
import { GOAL_LABELS } from '../model/labels'
import type { Client } from '../types'
import { ClientStatusBadge } from './ClientBadges'

/** Profil i zdravstveni podaci klijenta – isti prikaz za trenera i za klijenta ("Moj profil"). */
export function ClientProfilePanels({ client }: { client: Client }) {
  return (
    <>
      <Panel title="Profil">
        <dl className={layout.definitions}>
          <dt>Email</dt>
          <dd>{client.email}</dd>
          <dt>Telefon</dt>
          <dd>{client.phone ?? '—'}</dd>
          <dt>Datum rođenja</dt>
          <dd>
            {client.birthDate
              ? `${formatShortDate(client.birthDate)} (${ageFromBirthDate(client.birthDate)} god.)`
              : '—'}
          </dd>
          <dt>Visina</dt>
          <dd>{client.heightCm ? `${client.heightCm} cm` : '—'}</dd>
          <dt>Cilj</dt>
          <dd>{GOAL_LABELS[client.goal]}</dd>
          <dt>Saradnja od</dt>
          <dd>{formatDate(client.startDate)}</dd>
          <dt>Status</dt>
          <dd>
            <ClientStatusBadge status={client.status} />
          </dd>
        </dl>
      </Panel>

      <Panel title="Zdravlje i ishrana">
        <dl className={layout.definitions}>
          <dt>Povrede</dt>
          <dd>{client.injuries || 'Nema upisanih'}</dd>
          <dt>Alergije</dt>
          <dd>
            {client.allergies ? (
              <Badge tone="warning" icon="alert">
                {client.allergies}
              </Badge>
            ) : (
              'Nema upisanih'
            )}
          </dd>
          <dt>Napomene</dt>
          <dd>{client.notes || '—'}</dd>
        </dl>
      </Panel>
    </>
  )
}
