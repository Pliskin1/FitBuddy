import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { SearchInput, SegmentedControl, SelectField, layout } from '@/shared/ui'
import { GOAL_LABELS } from '../model/labels'
import { CLIENT_GOALS, type ClientFilters, type ClientGoal, type ClientStatus } from '../types'

interface ClientFiltersBarProps {
  filters: ClientFilters
  onChange: (filters: ClientFilters) => void
}

const STATUS_OPTIONS: Array<{ value: ClientStatus | 'all'; label: string }> = [
  { value: 'active', label: 'Aktivni' },
  { value: 'archived', label: 'Arhivirani' },
  { value: 'all', label: 'Svi' },
]

const GOAL_OPTIONS = CLIENT_GOALS.map((goal) => ({ value: goal, label: GOAL_LABELS[goal] }))

export function ClientFiltersBar({ filters, onChange }: ClientFiltersBarProps) {
  // Pretraga se šalje tek kad korisnik prestane da kuca, da ne bi išao zahtjev za svako slovo.
  const [search, setSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(search)

  // Namjerno zavisi samo od pretrage: ostali filteri se šalju odmah, kroz svoje onChange.
  useEffect(() => {
    if (debouncedSearch !== filters.search) onChange({ ...filters, search: debouncedSearch })
  }, [debouncedSearch])

  return (
    <div className={layout.toolbar}>
      <SearchInput
        label="Pretraži klijente"
        placeholder="Ime, prezime ili email…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={layout.grow}
      />
      <div className={layout.filterSelect}>
        <SelectField
          id="filter-goal"
          label="Cilj"
          placeholder="Svi ciljevi"
          options={GOAL_OPTIONS}
          value={filters.goal}
          onChange={(event) =>
            onChange({ ...filters, goal: event.target.value as ClientGoal | '' })
          }
        />
      </div>
      <SegmentedControl
        label="Status"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onChange({ ...filters, status })}
      />
    </div>
  )
}
