import { useEffect, useState, type FormEvent } from 'react'
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
import { CLIENT_STATUS_LABELS, GOAL_LABELS } from '../model/labels'
import { toClientInput, validateClient, type ClientFormValues } from '../model/validation'
import {
  CLIENT_GOALS,
  CLIENT_STATUSES,
  type ClientGoal,
  type ClientInput,
  type ClientStatus,
} from '../types'

interface ClientFormProps {
  initialValues: ClientFormValues
  submitLabel: string
  submitting: boolean
  /** Greške po poljima koje je vratio API (422/409). */
  serverErrors?: Record<string, string>
  /** Greška koja nije vezana za polje (npr. nema mreže). */
  formError?: unknown
  showStatus?: boolean
  onSubmit: (input: ClientInput) => void
  onCancel: () => void
}

const GOAL_OPTIONS = CLIENT_GOALS.map((goal) => ({ value: goal, label: GOAL_LABELS[goal] }))
const STATUS_OPTIONS = CLIENT_STATUSES.map((status) => ({
  value: status,
  label: CLIENT_STATUS_LABELS[status],
}))

/** Forma za novog klijenta i izmjenu postojećeg. */
export function ClientForm({
  initialValues,
  submitLabel,
  submitting,
  serverErrors,
  formError,
  showStatus,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors<ClientInput>>({})

  useEffect(() => {
    if (serverErrors) setErrors(serverErrors)
  }, [serverErrors])

  function set<K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input = toClientInput(values)
    const found = validateClient(input)
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

      <Panel title="Osnovni podaci">
        <div className={layout.formGrid}>
          <TextField
            id="firstName"
            label="Ime"
            required
            autoComplete="given-name"
            value={values.firstName}
            error={errors.firstName}
            onChange={(e) => set('firstName', e.target.value)}
          />
          <TextField
            id="lastName"
            label="Prezime"
            required
            autoComplete="family-name"
            value={values.lastName}
            error={errors.lastName}
            onChange={(e) => set('lastName', e.target.value)}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="ime@primjer.com"
            value={values.email}
            error={errors.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <TextField
            id="phone"
            label="Telefon"
            optional
            type="tel"
            autoComplete="tel"
            placeholder="+382 67 123 456"
            value={values.phone}
            error={errors.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          <TextField
            id="birthDate"
            label="Datum rođenja"
            optional
            type="date"
            value={values.birthDate}
            error={errors.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
          />
          <TextField
            id="heightCm"
            label="Visina (cm)"
            optional
            inputMode="numeric"
            placeholder="npr. 168"
            value={values.heightCm}
            error={errors.heightCm}
            onChange={(e) => set('heightCm', e.target.value)}
          />
        </div>
      </Panel>

      <Panel title="Saradnja">
        <div className={layout.formGrid}>
          <SelectField
            id="goal"
            label="Glavni cilj"
            required
            options={GOAL_OPTIONS}
            value={values.goal}
            error={errors.goal}
            onChange={(e) => set('goal', e.target.value as ClientGoal)}
          />
          <TextField
            id="startDate"
            label="Početak saradnje"
            required
            type="date"
            value={values.startDate}
            error={errors.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
          {showStatus && (
            <SelectField
              id="status"
              label="Status"
              options={STATUS_OPTIONS}
              value={values.status}
              error={errors.status}
              onChange={(e) => set('status', e.target.value as ClientStatus)}
            />
          )}
        </div>
      </Panel>

      <Panel
        title="Zdravlje i ishrana"
        description="Trener ove podatke vidi pri pravljenju programa i jelovnika."
      >
        <div className={layout.formGrid}>
          <TextareaField
            id="injuries"
            label="Povrede ili zdravstvena ograničenja"
            optional
            placeholder="npr. lijevo koljeno (2024), bez skokova"
            value={values.injuries}
            onChange={(e) => set('injuries', e.target.value)}
          />
          <TextareaField
            id="allergies"
            label="Alergije i namirnice koje ne jede"
            optional
            placeholder="npr. kikiriki, laktoza"
            value={values.allergies}
            onChange={(e) => set('allergies', e.target.value)}
          />
          <div className={layout.full}>
            <TextareaField
              id="notes"
              label="Napomene"
              optional
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <div className={layout.formActions}>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          loadingText="Čuvam…"
          icon="check"
        >
          {submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Odustani
        </Button>
      </div>
    </form>
  )
}
