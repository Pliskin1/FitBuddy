import { SelectField } from '@/shared/ui'
import { useClients } from '../api/clients.queries'
import { fullName } from '../model/labels'

interface ClientSelectFieldProps {
  id: string
  label?: string
  value: string
  onChange: (clientId: string) => void
  error?: string
  placeholder?: string
  required?: boolean
}

const ALL_CLIENTS = { search: '', goal: '', status: 'all' } as const

/**
 * Izbor klijenta za forme i filtere drugih feature-a (termini, mjerenja).
 * Nudi aktivne klijente; arhivirani se pojavljuje samo ako je već izabran.
 */
export function ClientSelectField({
  id,
  label = 'Klijent',
  value,
  onChange,
  error,
  placeholder = 'Izaberi klijenta',
  required,
}: ClientSelectFieldProps) {
  const query = useClients(ALL_CLIENTS)
  const options = (query.data ?? [])
    .filter((client) => client.status === 'active' || client.id === value)
    .map((client) => ({
      value: client.id,
      label: client.status === 'archived' ? `${fullName(client)} (arhiviran)` : fullName(client),
    }))

  return (
    <SelectField
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={options}
      placeholder={query.isPending ? 'Učitavam klijente…' : placeholder}
      disabled={query.isPending}
      required={required}
      error={error ?? (query.isError ? 'Lista klijenata se nije učitala.' : undefined)}
    />
  )
}
