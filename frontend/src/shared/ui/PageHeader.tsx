import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { Icon } from './Icon'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  back?: { to: string; label: string }
  /** Naslov taba, ako treba da se razlikuje od naslova stranice. */
  documentTitle?: string
}

/** Zaglavlje svake stranice: naslov (h1), podnaslov, akcije i link nazad. Postavlja i naslov taba. */
export function PageHeader({ title, subtitle, actions, back, documentTitle }: PageHeaderProps) {
  useDocumentTitle(documentTitle ?? title)

  return (
    <div className={styles.wrap}>
      {back && (
        <Link to={back.to} className={styles.back}>
          <Icon name="chevronLeft" size={16} />
          {back.label}
        </Link>
      )}
      <header className={styles.header}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
    </div>
  )
}
