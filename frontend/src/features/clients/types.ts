/*
 * Klijent – osoba sa kojom trener radi. Ugovor sa backendom: docs/entities.md, "Client".
 * Kalendarski datumi su 'YYYY-MM-DD', trenuci u vremenu ISO 8601.
 */

export const CLIENT_GOALS = [
  'fat_loss',
  'muscle_gain',
  'strength',
  'conditioning',
  'health',
] as const
export type ClientGoal = (typeof CLIENT_GOALS)[number]

export const CLIENT_STATUSES = ['active', 'archived'] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  birthDate: string | null
  heightCm: number | null
  goal: ClientGoal
  status: ClientStatus
  startDate: string
  /** Povrede i zdravstvena ograničenja – trener ih vidi pri planiranju treninga. */
  injuries: string
  /** Alergije i namirnice koje klijent ne jede – važno za jelovnik. */
  allergies: string
  notes: string
  createdAt: string
  updatedAt: string
}

/** Kratka referenca na klijenta koju uz sebe vraćaju drugi resursi (termini, mjerenja). */
export interface ClientRef {
  id: string
  firstName: string
  lastName: string
}

/** Stavka liste klijenata: klijent + sažetak iz povezanih resursa (računa ga API). */
export interface ClientListItem extends Client {
  nextAppointmentAt: string | null
  lastMeasuredAt: string | null
  latestWeightKg: number | null
}

/** Podaci koje šalje forma (POST/PUT). */
export type ClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>

export interface ClientFilters {
  search: string
  goal: ClientGoal | ''
  status: ClientStatus | 'all'
}
