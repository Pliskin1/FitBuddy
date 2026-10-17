import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { LogoMark } from './Logo'
import styles from './Skeleton.module.css'

/*
 * Loaderi: dok se podaci učitavaju prikazujemo "kostur" sadržaja istog oblika,
 * da korisnik nikad ne vidi praznu stranicu i da se raspored ne pomjera kad podaci stignu.
 */

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
}

export function Skeleton({ width = '100%', height = 16, radius, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius }}
    />
  )
}

/** Omotač za svaki loader: najavljuje čitaču ekrana da se sadržaj učitava. */
export function LoadingRegion({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="visually-hidden">{label}</span>
      {children}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <Skeleton width={44} height={44} radius="50%" />
        <div className={styles.grow}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton height={14} />
      <Skeleton width="70%" height={14} />
    </div>
  )
}

export function CardGridSkeleton({
  count = 6,
  label = 'Učitavam…',
}: {
  count?: number
  label?: string
}) {
  return (
    <LoadingRegion label={label} className={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </LoadingRegion>
  )
}

export function ListSkeleton({ rows = 4, label = 'Učitavam…' }: { rows?: number; label?: string }) {
  return (
    <LoadingRegion label={label} className={styles.stack}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.row}>
          <Skeleton width={56} height={40} radius={10} />
          <div className={styles.grow}>
            <Skeleton width="55%" height={16} />
            <Skeleton width="35%" height={13} />
          </div>
          <Skeleton width={84} height={26} radius={999} />
        </div>
      ))}
    </LoadingRegion>
  )
}

export function TableSkeleton({
  rows = 6,
  label = 'Učitavam…',
}: {
  rows?: number
  label?: string
}) {
  return (
    <LoadingRegion label={label} className={styles.card}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={i === 0 ? 12 : 20} width={i === 0 ? '50%' : '100%'} />
      ))}
    </LoadingRegion>
  )
}

export function DetailSkeleton({ label = 'Učitavam detalje…' }: { label?: string }) {
  return (
    <LoadingRegion label={label} className={styles.loader}>
      <div className={styles.row}>
        <Skeleton width={72} height={72} radius="50%" />
        <div className={styles.grow}>
          <Skeleton width="45%" height={32} />
          <Skeleton width="30%" height={16} />
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <Skeleton width="40%" height={18} />
          <Skeleton height={14} />
          <Skeleton height={14} />
          <Skeleton width="60%" height={14} />
        </div>
        <div className={styles.card}>
          <Skeleton width="40%" height={18} />
          <Skeleton height={140} radius={12} />
        </div>
      </div>
    </LoadingRegion>
  )
}

export function FormSkeleton({
  fields = 6,
  label = 'Učitavam formu…',
}: {
  fields?: number
  label?: string
}) {
  return (
    <LoadingRegion label={label} className={styles.card}>
      <div className={styles.formGrid}>
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className={styles.stack}>
            <Skeleton width="35%" height={14} />
            <Skeleton height={48} radius={10} />
          </div>
        ))}
      </div>
      <Skeleton width={160} height={48} radius={14} />
    </LoadingRegion>
  )
}

/** Prikazuje se dok se kod stranice učitava (lazy rute). */
export function PageLoader() {
  return (
    <LoadingRegion label="Učitavam stranicu…" className={styles.loader}>
      <div className={styles.stack}>
        <Skeleton width={220} height={36} />
        <Skeleton width={320} height={16} />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 3 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </LoadingRegion>
  )
}

/** Cijeli ekran dok se aplikacija pokreće (prvo učitavanje rute). */
export function BootScreen() {
  return (
    <div className={styles.boot} role="status" aria-live="polite">
      <span className={styles.bootMark}>
        <LogoMark size={56} />
      </span>
      <span>Učitavam FitBuddy…</span>
    </div>
  )
}
