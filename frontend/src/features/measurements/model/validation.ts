import { toISODate } from '@/shared/lib/date'
import { formatNumber } from '@/shared/lib/format'
import { numberToInput, parseOptionalNumber, type FieldErrors } from '@/shared/lib/validation'
import type { Measurement, MeasurementInput, MeasurementValueKey } from '../types'
import { MEASUREMENT_FIELDS } from './fields'

export type MeasurementFormValues = Record<MeasurementValueKey, string> & {
  clientId: string
  date: string
  note: string
}

export function toMeasurementFormValues(
  measurement?: Measurement,
  defaults: Partial<MeasurementFormValues> = {},
): MeasurementFormValues {
  const values = Object.fromEntries(
    MEASUREMENT_FIELDS.map((field) => [field.key, numberToInput(measurement?.[field.key])]),
  ) as Record<MeasurementValueKey, string>
  return {
    ...values,
    clientId: measurement?.clientId ?? '',
    date: measurement?.date ?? toISODate(new Date()),
    note: measurement?.note ?? '',
    ...defaults,
  }
}

/** Koraci se kucaju sa tačkom za hiljade ("8.500"), ostale mjere sa decimalnim zarezom ("78,4"). */
function parseField(key: MeasurementValueKey, text: string): number | null {
  if (key === 'steps') {
    const digits = text.replace(/[.\s]/g, '')
    return digits ? Number.parseInt(digits, 10) : null
  }
  return parseOptionalNumber(text)
}

export function toMeasurementInput(values: MeasurementFormValues): MeasurementInput {
  const numbers = Object.fromEntries(
    MEASUREMENT_FIELDS.map((field) => [field.key, parseField(field.key, values[field.key])]),
  ) as Record<MeasurementValueKey, number | null>
  return { ...numbers, clientId: values.clientId, date: values.date, note: values.note.trim() }
}

/** Pravila za mjerenje – koriste ih forma i mock API. */
export function validateMeasurementInput(input: MeasurementInput): FieldErrors<MeasurementInput> {
  const errors: FieldErrors<MeasurementInput> = {}
  if (!input.clientId) errors.clientId = 'Izaberi klijenta.'
  if (!input.date) errors.date = 'Izaberi datum mjerenja.'
  else if (input.date > toISODate(new Date())) errors.date = 'Mjerenje ne može biti u budućnosti.'

  let filled = 0
  for (const field of MEASUREMENT_FIELDS) {
    const value = input[field.key]
    if (value === null || value === undefined) continue
    filled++
    if (Number.isNaN(value) || value < field.min || value > field.max) {
      errors[field.key] =
        `Unesi vrijednost između ${formatNumber(field.min)} i ${formatNumber(field.max)}${field.unit ? ` ${field.unit}` : ''}.`
    }
  }
  if (filled === 0) errors.weightKg = 'Unesi bar jednu mjeru (npr. težinu).'
  return errors
}
