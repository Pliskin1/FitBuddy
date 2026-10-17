import { useEffect, useState, type FormEvent } from 'react'
import { ClientSelectField } from '@/features/clients'
import type { Role } from '@/shared/auth/session'
import { toISODate } from '@/shared/lib/date'
import { hasErrors, type FieldErrors } from '@/shared/lib/validation'
import { Button, ErrorState, Panel, TextField, TextareaField, layout } from '@/shared/ui'
import { MEASUREMENT_FIELDS } from '../model/fields'
import {
  toMeasurementInput,
  validateMeasurementInput,
  type MeasurementFormValues,
} from '../model/validation'
import type { MeasurementInput } from '../types'

interface MeasurementFormProps {
  role: Role
  initialValues: MeasurementFormValues
  submitLabel: string
  submitting: boolean
  serverErrors?: Record<string, string>
  formError?: unknown
  onSubmit: (input: MeasurementInput) => void
  onCancel: () => void
}

export function MeasurementForm({
  role,
  initialValues,
  submitLabel,
  submitting,
  serverErrors,
  formError,
  onSubmit,
  onCancel,
}: MeasurementFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors<MeasurementInput>>({})

  useEffect(() => {
    if (serverErrors) setErrors(serverErrors)
  }, [serverErrors])

  function set<K extends keyof MeasurementFormValues>(key: K, value: MeasurementFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input = toMeasurementInput(values)
    const found = validateMeasurementInput(input)
    setErrors(found)
    if (hasErrors(found)) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      )
      return
    }
    onSubmit(input)
  }

  return (
    <form className={layout.page} onSubmit={handleSubmit} noValidate>
      {formError !== undefined && formError !== null && !serverErrors && (
        <ErrorState error={formError} title="Čuvanje nije uspjelo" compact />
      )}

      <Panel title="Kada i za koga">
        <div className={layout.formGrid}>
          {role === 'trainer' && (
            <ClientSelectField
              id="clientId"
              required
              value={values.clientId}
              error={errors.clientId}
              onChange={(clientId) => set('clientId', clientId)}
            />
          )}
          <TextField
            id="date"
            label="Datum mjerenja"
            type="date"
            required
            max={toISODate(new Date())}
            value={values.date}
            error={errors.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>
      </Panel>

      <Panel
        title="Mjere"
        description="Popuni samo ono što je izmjereno – prazna polja se preskaču."
      >
        <div className={layout.formGrid}>
          {MEASUREMENT_FIELDS.map((field) => (
            <TextField
              key={field.key}
              id={field.key}
              label={field.unit ? `${field.label} (${field.unit})` : field.label}
              inputMode={field.digits === 0 ? 'numeric' : 'decimal'}
              placeholder={field.placeholder}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
            />
          ))}
          <div className={layout.full}>
            <TextareaField
              id="note"
              label="Napomena"
              optional
              placeholder="npr. mjereno ujutru, natašte"
              value={values.note}
              onChange={(e) => set('note', e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <div className={layout.formActions}>
        <Button type="submit" loading={submitting} loadingText="Čuvam…" icon="check">
          {submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Odustani
        </Button>
      </div>
    </form>
  )
}
