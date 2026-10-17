import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Panel.module.css'

interface PanelProps {
  title?: string
  description?: string
  /** Akcija u zaglavlju panela, npr. link "Svi termini". */
  action?: ReactNode
  children: ReactNode
  className?: string
  /** Za pristupačnost: panel postaje imenovana sekcija. */
  as?: 'section' | 'div'
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  as: Tag = 'section',
}: PanelProps) {
  return (
    <Tag className={cn(styles.panel, className)} aria-label={Tag === 'section' ? title : undefined}>
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  )
}
