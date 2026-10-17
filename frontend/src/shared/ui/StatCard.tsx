import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon, type IconName } from './Icon'
import { Skeleton } from './Skeleton'
import styles from './StatCard.module.css'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  hintIcon?: IconName
  tone?: 'default' | 'ink' | 'warning'
  loading?: boolean
}

/** Kartica sa jednom brojkom (kontrolna tabla). Dok se učitava, broj zamjenjuje loader. */
export function StatCard({
  label,
  value,
  hint,
  hintIcon,
  tone = 'default',
  loading,
}: StatCardProps) {
  return (
    <div
      className={cn(
        styles.card,
        tone === 'ink' && styles.ink,
        tone === 'warning' && styles.warning,
      )}
      aria-busy={loading || undefined}
    >
      <span className={styles.label}>{label}</span>
      {loading ? (
        <Skeleton width={64} height={44} />
      ) : (
        <span className={styles.value}>{value}</span>
      )}
      {hint &&
        (loading ? (
          <Skeleton width="60%" height={14} />
        ) : (
          <span className={styles.hint}>
            {hintIcon && <Icon name={hintIcon} size={14} />}
            {hint}
          </span>
        ))}
    </div>
  )
}
