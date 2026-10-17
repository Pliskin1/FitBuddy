import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon, type IconName } from './Icon'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'ink'

interface BadgeProps {
  tone?: BadgeTone
  /** Statusi uvijek imaju ikonu – boja nikad ne nosi značenje sama. */
  icon?: IconName
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', icon, children, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[tone], className)}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  )
}
