import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import styles from './Field.module.css'

interface FieldBaseProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** Prikazuje "(opciono)" pored labele. */
  optional?: boolean
}

function describedBy(id: string, hint?: string, error?: string) {
  return (
    [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined
  )
}

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: FieldBaseProps & { children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opciono)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

type TextFieldProps = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...input
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={cn(styles.control, error && styles.invalid, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...input}
      />
    </FieldShell>
  )
}

export interface SelectOption {
  value: string
  label: string
}

type SelectFieldProps = FieldBaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    options: SelectOption[]
    placeholder?: string
  }

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  options,
  placeholder,
  className,
  ...select
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        id={id}
        className={cn(styles.control, error && styles.invalid, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...select}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

type TextareaFieldProps = FieldBaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>

export function TextareaField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...textarea
}: TextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        className={cn(styles.control, error && styles.invalid, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...textarea}
      />
    </FieldShell>
  )
}

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

/** Polje za pretragu sa ikonom. Labela je skrivena vizuelno, ali je čitač ekrana čita. */
export function SearchInput({ label, className, ...input }: SearchInputProps) {
  return (
    <div className={cn(styles.search, className)}>
      <Icon name="search" size={18} className={styles.searchIcon} />
      <input type="search" aria-label={label} className={styles.control} {...input} />
    </div>
  )
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
  className?: string
}

/** Izbor jedne od nekoliko opcija (npr. period ili status u filterima). */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn(styles.segmented, className)} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.segment}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
