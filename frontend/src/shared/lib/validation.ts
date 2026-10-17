/** Greške po poljima forme: { email: 'Email nije ispravan.' }. */
export type FieldErrors<T> = Partial<Record<keyof T & string, string>>

export function hasErrors(errors: Partial<Record<string, string>>): boolean {
  return Object.values(errors).some(Boolean)
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Pretvara tekst iz input polja u broj ili null (prihvata i decimalni zarez). */
export function parseOptionalNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return null
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

/** Broj u tekst za input polje (prazno za null). */
export function numberToInput(value: number | null | undefined): string {
  return value === null || value === undefined ? '' : String(value).replace('.', ',')
}
