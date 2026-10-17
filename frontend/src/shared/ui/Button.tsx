import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { Icon, type IconName } from './Icon'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName
  fullWidth?: boolean
  children?: ReactNode
}

function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth?: boolean,
  className?: string,
) {
  return cn(
    styles.button,
    styles[variant],
    size === 'sm' && styles.sm,
    fullWidth && styles.full,
    className,
  )
}

export interface ButtonProps extends CommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  /** Prikazuje spinner i blokira dugme dok traje akcija (npr. čuvanje). */
  loading?: boolean
  loadingText?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  loading = false,
  loadingText,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, fullWidth, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  )
}

export interface ButtonLinkProps extends CommonProps, Omit<LinkProps, 'children'> {}

/** Link koji izgleda kao dugme – za navigaciju (npr. "Novi klijent"). */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, fullWidth, className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
    </Link>
  )
}

interface ConfirmButtonProps {
  label: string
  question: string
  confirmLabel?: string
  icon?: IconName
  loading?: boolean
  onConfirm: () => void
}

/** Dugme za nepovratne akcije: prvi klik pita, drugi potvrđuje. */
export function ConfirmButton({
  label,
  question,
  confirmLabel = 'Da, potvrdi',
  icon,
  loading,
  onConfirm,
}: ConfirmButtonProps) {
  const [asking, setAsking] = useState(false)

  if (!asking) {
    return (
      <Button variant="danger" icon={icon} onClick={() => setAsking(true)}>
        {label}
      </Button>
    )
  }

  return (
    <div className={styles.confirm} role="group" aria-label={question}>
      <span>{question}</span>
      <Button variant="danger" size="sm" loading={loading} onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setAsking(false)} disabled={loading}>
        Odustani
      </Button>
    </div>
  )
}
