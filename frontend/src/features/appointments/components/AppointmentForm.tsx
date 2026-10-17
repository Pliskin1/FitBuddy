import { useEffect, useState, type FormEvent } from 'react'
import { ClientSelectField } from '@/features/clients'
import type { Role } from '@/shared/auth/session'
import { toISODate } from '@/shared/lib/date'
import { hasErrors, type FieldErrors } from '@/shared/lib/validation'
import {
  Button,
  ErrorState,
  Panel,
  SelectField,
  TextField,
  TextareaField,
  layout,
} from '@/shared/ui'
import {
  APPOINTMENT_STATUS_META,
  APPOINTMENT_TYPE_LABELS,
  CLIENT_CANCEL_HOURS,
  DURATION_OPTIONS,
} from '../model/labels'
import {
  mapServerErrors,
  toAppointmentInput,
  validateAppointmentForm,
  type AppointmentFormValues,
} from '../model/validation'
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
  type AppointmentInput,
  type AppointmentStatus,
  type AppointmentType,
} from '../types'

interface AppointmentFormProps {
  role: Role
  initialValues: AppointmentFormValues
  submitLabel: string
  submitting: boolean
  serverErrors?: Record<string, string>
  formError?: unknown
  onSubmit: (input: AppointmentInput) => void
  onCancel: () => void
}

const DURATION_SELECT = DURATION_OPTIONS.map((minutes) => ({
  value: String(minutes),
  label: `${minutes} min`,
}))
const STATUS_SELECT = APPOINTMENT_STATUSES.map((status) => ({
  value: status,
  label: APPOINTMENT_STATUS_META[status].label,
}))

/**
 * Forma termina. Trener bira klijenta i status; klijent šalje zahtjev za sebe
 * (status je uvijek "na čekanju" dok ga trener ne potvrdi).
 */
export function AppointmentForm({
  role,
  initialValues,
  submitLabel,
  submitting,
  serverErrors,
  formError,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const isTrainer = role === 'trainer'
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors<AppointmentFormValues>>({})

  useEffect(() => {
    if (serverErrors) setErrors(mapServerErrors(serverErrors))
  }, [serverErrors])

  function set<K extends keyof AppointmentFormValues>(key: K, value: AppointmentFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const found = validateAppointmentForm(values)
    setErrors(found)
    if (hasErrors(found)) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      )
      return
    }
    onSubmit(toAppointmentInput(values))
  }

  const typeOptions = APPOINTMENT_TYPES.filter((type) => isTrainer || type !== 'assessment').map(
    (type) => ({
      value: type,
      label: APPOINTMENT_TYPE_LABELS[type],
    }),
  )

  return (
    <form className={layout.page} onSubmit={handleSubmit} noValidate>
      {formError !== undefined && formError !== null && !serverErrors && (
        <ErrorState error={formError} title="Čuvanje nije uspjelo" compact />
      )}

      <Panel
        title="Kada i ko"
        description={
          isTrainer
            ? 'Sistem ne dozvoljava dva termina u isto vrijeme.'
            : `Trener potvrđuje zahtjev. Otkazivanje je moguće najkasnije ${CLIENT_CANCEL_HOURS} h prije termina.`
        }
      >
        <div className={layout.formGrid}>
          {isTrainer && (
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
            label="Datum"
            type="date"
            required
            min={isTrainer ? undefined : toISODate(new Date())}
            value={values.date}
            error={errors.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <TextField
            id="time"
            label="Vrijeme početka"
            type="time"
            required
            step={900}
            value={values.time}
            error={errors.time}
            onChange={(e) => set('time', e.target.value)}
          />
          <SelectField
            id="durationMin"
            label="Trajanje"
            required
            options={DURATION_SELECT}
            value={values.durationMin}
            error={errors.durationMin}
            onChange={(e) => set('durationMin', e.target.value)}
          />
        </div>
      </Panel>

      <Panel title="Detalji">
        <div className={layout.formGrid}>
          <SelectField
            id="type"
            label="Vrsta termina"
            options={typeOptions}
            value={values.type}
            error={errors.type}
            onChange={(e) => set('type', e.target.value as AppointmentType)}
          />
          {isTrainer && (
            <>
              <SelectField
                id="status"
                label="Status"
                options={STATUS_SELECT}
                value={values.status}
                error={errors.status}
                onChange={(e) => set('status', e.target.value as AppointmentStatus)}
              />
              <TextField
                id="programDay"
                label="Dan programa"
                optional
                placeholder="npr. Dan B – Noge i leđa"
                value={values.programDay}
                onChange={(e) => set('programDay', e.target.value)}
              />
            </>
          )}
          <div className={layout.full}>
            <TextareaField
              id="note"
              label={isTrainer ? 'Napomena' : 'Poruka za trenera'}
              optional
              placeholder={isTrainer ? undefined : 'npr. mogu i sat ranije ako je zauzeto'}
              value={values.note}
              onChange={(e) => set('note', e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <div className={layout.formActions}>
        <Button type="submit" loading={submitting} loadingText="Šaljem…" icon="check">
          {submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Odustani
        </Button>
      </div>
    </form>
  )
}
