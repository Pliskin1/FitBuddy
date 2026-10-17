import { toISODate } from '@/shared/lib/date'

/**
 * Mala "baza" za mock API: kolekcija zapisa u memoriji koja se čuva u localStorage-u.
 * Dok niko ne izmijeni podatke, demo podaci se generišu iznova svakog dana
 * (seed zavisi od današnjeg datuma, pa uvijek postoje današnji termini).
 */

const STORAGE_PREFIX = 'fitbuddy.mock.'
const STORAGE_VERSION = 1

interface StoredCollection<T> {
  version: number
  seededOn: string
  dirty: boolean
  items: T[]
}

export interface Collection<T extends { id: string }> {
  all(): T[]
  find(id: string): T | undefined
  insert(item: T): T
  update(id: string, patch: Partial<T>): T | undefined
  remove(id: string): boolean
  reset(): void
}

const resetters: Array<() => void> = []

function read<T>(key: string): StoredCollection<T> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as StoredCollection<T>) : null
  } catch {
    return null
  }
}

function write<T>(key: string, value: StoredCollection<T>): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Privatni prozor ili pun storage – podaci tada žive samo u memoriji.
  }
}

function fresh<T>(seed: () => T[]): StoredCollection<T> {
  return { version: STORAGE_VERSION, seededOn: toISODate(new Date()), dirty: false, items: seed() }
}

export function createCollection<T extends { id: string }>(
  name: string,
  seed: () => T[],
): Collection<T> {
  const key = STORAGE_PREFIX + name
  const stored = read<T>(key)
  const isUsable =
    stored !== null &&
    stored.version === STORAGE_VERSION &&
    (stored.dirty || stored.seededOn === toISODate(new Date()))

  let state: StoredCollection<T> = isUsable ? stored : fresh(seed)
  write(key, state)

  const commit = (items: T[]) => {
    state = { ...state, dirty: true, items }
    write(key, state)
  }

  const collection: Collection<T> = {
    all: () => [...state.items],
    find: (id) => state.items.find((item) => item.id === id),
    insert(item) {
      commit([...state.items, item])
      return item
    },
    update(id, patch) {
      const current = state.items.find((item) => item.id === id)
      if (!current) return undefined
      const next = { ...current, ...patch }
      commit(state.items.map((item) => (item.id === id ? next : item)))
      return next
    },
    remove(id) {
      const before = state.items.length
      commit(state.items.filter((item) => item.id !== id))
      return state.items.length < before
    },
    reset() {
      state = fresh(seed)
      write(key, state)
    },
  }

  resetters.push(collection.reset)
  return collection
}

/** Vraća sve mock kolekcije na početne demo podatke. */
export function resetAllMockData(): void {
  resetters.forEach((reset) => reset())
}
