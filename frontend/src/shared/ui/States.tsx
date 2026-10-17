import type { ReactNode } from 'react'
import { ApiError } from '@/shared/api/client'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { Icon, type IconName } from './Icon'
import styles from './State.module.css'

interface EmptyStateProps {
  title: string
  text?: string
  icon?: IconName
  action?: ReactNode
  compact?: boolean
}

/** Prazno stanje: kaže šta bi ovdje stajalo i kako dodati prvi zapis. */
export function EmptyState({ title, text, icon = 'info', action, compact }: EmptyStateProps) {
  return (
    <div className={cn(styles.state, compact && styles.compact)}>
      <span className={styles.icon}>
        <Icon name={icon} />
      </span>
      <p className={styles.title}>{title}</p>
      {text && <p className={styles.text}>{text}</p>}
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  )
}

interface ErrorStateProps {
  error: unknown
  title?: string
  onRetry?: () => void
  action?: ReactNode
  compact?: boolean
}

/** Greška pri učitavanju: šta se desilo i dugme da se pokuša ponovo. */
export function ErrorState({
  error,
  title = 'Podaci se nijesu učitali',
  onRetry,
  action,
  compact,
}: ErrorStateProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : 'Nešto je pošlo naopako. Pokušaj ponovo za nekoliko trenutaka.'

  return (
    <div className={cn(styles.state, styles.error, compact && styles.compact)} role="alert">
      <span className={styles.icon}>
        <Icon name="alert" />
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{message}</p>
      <div className={styles.actions}>
        {onRetry && (
          <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
            Pokušaj ponovo
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}
