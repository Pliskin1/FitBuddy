import { delay, HttpResponse } from 'msw'

/*
 * Zajednički dijelovi mock ruta: kašnjenje, ID-jevi i standardni odgovori sa greškom.
 * Oblik grešaka je ugovor sa backendom – vidi docs/entities.md, "Greške".
 */

const MIN_DELAY = Number(import.meta.env.VITE_MOCK_DELAY_MIN_MS ?? 350)
const MAX_DELAY = Number(import.meta.env.VITE_MOCK_DELAY_MAX_MS ?? 900)

/** Simulira mrežu, da se u UI-ju vide loaderi. */
export function mockDelay() {
  return delay(Math.round(MIN_DELAY + Math.random() * Math.max(0, MAX_DELAY - MIN_DELAY)))
}

export function newId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${random}`
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function notFound(message: string) {
  return HttpResponse.json({ message }, { status: 404 })
}

export function validationError(
  fieldErrors: Partial<Record<string, string>>,
  message = 'Provjeri označena polja.',
) {
  return HttpResponse.json({ message, fieldErrors }, { status: 422 })
}

export function conflict(message: string, fieldErrors?: Partial<Record<string, string>>) {
  return HttpResponse.json({ message, fieldErrors }, { status: 409 })
}
