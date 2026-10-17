import { formatNumber } from '@/shared/lib/format'
import type { MeasurementValueKey } from '../types'

/** Opis svakog polja mjerenja – iz ovoga se crtaju forma, tabela i provjera opsega. */
export interface MeasurementField {
  key: MeasurementValueKey
  label: string
  unit: string
  digits: number
  min: number
  max: number
  placeholder: string
}

export const MEASUREMENT_FIELDS: MeasurementField[] = [
  {
    key: 'weightKg',
    label: 'Težina',
    unit: 'kg',
    digits: 1,
    min: 30,
    max: 300,
    placeholder: 'npr. 78,4',
  },
  {
    key: 'bodyFatPct',
    label: 'Tjelesna mast',
    unit: '%',
    digits: 1,
    min: 3,
    max: 70,
    placeholder: 'npr. 28',
  },
  {
    key: 'waistCm',
    label: 'Struk',
    unit: 'cm',
    digits: 1,
    min: 40,
    max: 200,
    placeholder: 'npr. 86',
  },
  {
    key: 'hipsCm',
    label: 'Kukovi',
    unit: 'cm',
    digits: 1,
    min: 50,
    max: 200,
    placeholder: 'npr. 98',
  },
  {
    key: 'chestCm',
    label: 'Grudi',
    unit: 'cm',
    digits: 1,
    min: 50,
    max: 200,
    placeholder: 'npr. 101',
  },
  {
    key: 'armCm',
    label: 'Nadlaktica',
    unit: 'cm',
    digits: 1,
    min: 15,
    max: 70,
    placeholder: 'npr. 34',
  },
  {
    key: 'thighCm',
    label: 'Butina',
    unit: 'cm',
    digits: 1,
    min: 30,
    max: 100,
    placeholder: 'npr. 58',
  },
  {
    key: 'steps',
    label: 'Koraci (dnevno)',
    unit: '',
    digits: 0,
    min: 0,
    max: 100_000,
    placeholder: 'npr. 8.500',
  },
]

export const FIELD_BY_KEY = Object.fromEntries(MEASUREMENT_FIELDS.map((f) => [f.key, f])) as Record<
  MeasurementValueKey,
  MeasurementField
>

export function formatMeasurementValue(key: MeasurementValueKey, value: number | null): string {
  if (value === null) return '—'
  const field = FIELD_BY_KEY[key]
  return `${formatNumber(value, field.digits)}${field.unit ? ` ${field.unit}` : ''}`
}
