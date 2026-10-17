import { toISODate } from '@/shared/lib/date'
import {
  EMAIL_PATTERN,
  numberToInput,
  parseOptionalNumber,
  type FieldErrors,
} from '@/shared/lib/validation'
import {
  CLIENT_GOALS,
  CLIENT_STATUSES,
  type Client,
  type ClientGoal,
  type ClientInput,
  type ClientStatus,
} from '../types'

/** Vrijednosti forme – brojevi su tekst dok korisnik kuca. */
export interface ClientFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  heightCm: string
  goal: ClientGoal
  status: ClientStatus
  startDate: string
  injuries: string
  allergies: string
  notes: string
}

export function toClientFormValues(client?: Client): ClientFormValues {
  return {
    firstName: client?.firstName ?? '',
    lastName: client?.lastName ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    birthDate: client?.birthDate ?? '',
    heightCm: numberToInput(client?.heightCm),
    goal: client?.goal ?? 'fat_loss',
    status: client?.status ?? 'active',
    startDate: client?.startDate ?? toISODate(new Date()),
    injuries: client?.injuries ?? '',
    allergies: client?.allergies ?? '',
    notes: client?.notes ?? '',
  }
}

export function toClientInput(values: ClientFormValues): ClientInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim() || null,
    birthDate: values.birthDate || null,
    heightCm: parseOptionalNumber(values.heightCm),
    goal: values.goal,
    status: values.status,
    startDate: values.startDate,
    injuries: values.injuries.trim(),
    allergies: values.allergies.trim(),
    notes: values.notes.trim(),
  }
}

/**
 * Pravila za klijenta. Koriste ih i forma (odmah, prije slanja) i mock API (kao backend),
 * pa poruke o grešci izgledaju isto bez obzira gdje je greška otkrivena.
 */
export function validateClient(input: ClientInput): FieldErrors<ClientInput> {
  const errors: FieldErrors<ClientInput> = {}
  if (!input.firstName) errors.firstName = 'Unesi ime.'
  if (!input.lastName) errors.lastName = 'Unesi prezime.'
  if (!input.email) errors.email = 'Unesi email.'
  else if (!EMAIL_PATTERN.test(input.email))
    errors.email = 'Email nije ispravan, npr. ime@primjer.com.'
  if (input.heightCm !== null && (input.heightCm < 100 || input.heightCm > 250)) {
    errors.heightCm = 'Visina treba da bude između 100 i 250 cm.'
  }
  if (input.birthDate && input.birthDate > toISODate(new Date())) {
    errors.birthDate = 'Datum rođenja ne može biti u budućnosti.'
  }
  if (!input.startDate) errors.startDate = 'Unesi datum početka saradnje.'
  if (!CLIENT_GOALS.includes(input.goal)) errors.goal = 'Izaberi cilj.'
  if (!CLIENT_STATUSES.includes(input.status)) errors.status = 'Izaberi status.'
  return errors
}
