import { daysBetween, parseISODate } from './date'

/*
 * Formatiranje za crnogorski (latinica). Imena mjeseci i dana su zapisana ručno,
 * da izgled ne zavisi od toga koje lokalizacije pretraživač ima.
 */

const MONTHS = [
  'januar',
  'februar',
  'mart',
  'april',
  'maj',
  'jun',
  'jul',
  'avgust',
  'septembar',
  'oktobar',
  'novembar',
  'decembar',
]
const MONTHS_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'avg',
  'sep',
  'okt',
  'nov',
  'dec',
]
const WEEKDAYS = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota']
const WEEKDAYS_SHORT = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']

const numberFormatters = new Map<number, Intl.NumberFormat>()

function toDate(value: string | Date): Date {
  if (value instanceof Date) return value
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseISODate(value) : new Date(value)
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "17. oktobar 2026." */
export function formatDate(value: string | Date): string {
  const d = toDate(value)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

/** "17.10.2026." */
export function formatShortDate(value: string | Date): string {
  const d = toDate(value)
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`
}

/** "17. okt" */
export function formatDayMonth(value: string | Date): string {
  const d = toDate(value)
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]}`
}

/** "18:00" */
export function formatTime(value: string | Date): string {
  const d = toDate(value)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** "subota" */
export function formatWeekday(value: string | Date): string {
  return WEEKDAYS[toDate(value).getDay()]
}

/** "Sub" */
export function formatWeekdayShort(value: string | Date): string {
  return WEEKDAYS_SHORT[toDate(value).getDay()]
}

/** "Danas", "Sjutra", "Juče" ili "Ponedjeljak, 19. oktobar". */
export function formatRelativeDay(value: string | Date, now = new Date()): string {
  const d = toDate(value)
  const diff = daysBetween(now, d)
  if (diff === 0) return 'Danas'
  if (diff === 1) return 'Sjutra'
  if (diff === -1) return 'Juče'
  return `${capitalize(WEEKDAYS[d.getDay()])}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`
}

/** "Pon 19.10. · 18:00" – kompaktno za kartice. */
export function formatDateTimeCompact(value: string | Date): string {
  const d = toDate(value)
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}. · ${formatTime(d)}`
}

/** "prije 3 dana", "danas", "juče". */
export function formatAgo(value: string | Date, now = new Date()): string {
  const diff = daysBetween(toDate(value), now)
  if (diff <= 0) return 'danas'
  if (diff === 1) return 'juče'
  // 1, 21, 31… dan; sve ostalo dana (osim 11).
  const unit = diff % 10 === 1 && diff % 100 !== 11 ? 'dan' : 'dana'
  return `prije ${diff} ${unit}`
}

/** 7842 → "7.842", 78.4 → "78,4" */
export function formatNumber(value: number, maxFractionDigits = 1): string {
  let formatter = numberFormatters.get(maxFractionDigits)
  if (!formatter) {
    formatter = new Intl.NumberFormat('sr-Latn-ME', { maximumFractionDigits: maxFractionDigits })
    numberFormatters.set(maxFractionDigits, formatter)
  }
  return formatter.format(value)
}

/** −3,6 kg / +1 cm (pravi znak minus, ne crtica). */
export function formatSigned(value: number, unit = '', maxFractionDigits = 1): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '±'
  return `${sign}${formatNumber(Math.abs(value), maxFractionDigits)}${unit ? ` ${unit}` : ''}`
}

/**
 * Množina po pravilima crnogorskog: pluralize(1, ['klijent', 'klijenta', 'klijenata']) → "1 klijent",
 * 3 → "3 klijenta", 5 → "5 klijenata".
 */
export function pluralize(count: number, [one, few, many]: [string, string, string]): string {
  const mod10 = count % 10
  const mod100 = count % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? one
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? few
        : many
  return `${count} ${word}`
}

/** Godine starosti iz 'YYYY-MM-DD'. */
export function ageFromBirthDate(birthDate: string, now = new Date()): number {
  const b = parseISODate(birthDate)
  let age = now.getFullYear() - b.getFullYear()
  const beforeBirthday =
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  if (beforeBirthday) age -= 1
  return age
}

/** Pozdrav po dobu dana. */
export function greeting(now = new Date()): string {
  const h = now.getHours()
  if (h < 12) return 'Dobro jutro'
  if (h < 18) return 'Dobar dan'
  return 'Dobro veče'
}
