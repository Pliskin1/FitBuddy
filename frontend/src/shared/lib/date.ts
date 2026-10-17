/**
 * Datumske pomoćne funkcije. Rade u lokalnoj vremenskoj zoni korisnika.
 * Dogovor: kalendarski datum je 'YYYY-MM-DD', a trenutak u vremenu ISO 8601 string (UTC).
 */

export const DAY_MS = 24 * 60 * 60 * 1000

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

/** Ponedjeljak tekuće sedmice u 00:00. */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date)
  const mondayBased = (d.getDay() + 6) % 7
  return addDays(d, -mondayBased)
}

/** 'YYYY-MM-DD' u lokalnoj zoni – za <input type="date"> i polja tipa datum. */
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parsira 'YYYY-MM-DD' kao lokalni datum (ne kao UTC ponoć). */
export function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 'HH:mm' u lokalnoj zoni. */
export function toTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Spaja 'YYYY-MM-DD' i 'HH:mm' u ISO trenutak. */
export function combineDateTime(date: string, time: string): string {
  const [h, min] = time.split(':').map(Number)
  const d = parseISODate(date)
  d.setHours(h, min, 0, 0)
  return d.toISOString()
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Broj kalendarskih dana od `from` do `to` (pozitivan ako je `to` kasnije). */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS)
}
