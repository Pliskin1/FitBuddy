import type { Role } from '@/shared/auth/session'
import { paths } from '@/shared/config/paths'
import { formatAgo, formatNumber, formatSigned } from '@/shared/lib/format'
import { ButtonLink, EmptyState, ErrorState, LoadingRegion, Skeleton } from '@/shared/ui'
import { useMeasurements } from '../api/measurements.queries'
import type { MeasurementValueKey, MeasurementWithClient } from '../types'
import { MeasurementTable } from './MeasurementTable'
import { WeightChart } from './WeightChart'
import styles from './ClientProgress.module.css'

interface ClientProgressProps {
  clientId: string
  role: Role
}

/** Prva i posljednja vrijednost jedne mjere (mjerenja stižu od najnovijeg). */
function firstAndLast(measurements: MeasurementWithClient[], key: MeasurementValueKey) {
  const withValue = measurements.filter((m) => m[key] !== null)
  if (withValue.length === 0) return null
  return {
    latest: withValue[0][key] as number,
    first: withValue[withValue.length - 1][key] as number,
  }
}

/** Napredak jednog klijenta: brojke, grafikon težine i posljednja mjerenja. */
export function ClientProgress({ clientId, role }: ClientProgressProps) {
  const query = useMeasurements({ clientId, period: 'all' })

  if (query.isPending) {
    return (
      <LoadingRegion label="Učitavam mjerenja…" className={styles.wrap}>
        <div className={styles.stats}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={76} radius={14} />
          ))}
        </div>
        <Skeleton height={220} radius={14} />
      </LoadingRegion>
    )
  }

  if (query.isError)
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} compact />

  const measurements = query.data
  if (measurements.length === 0) {
    return (
      <EmptyState
        compact
        icon="chart"
        title="Još nema mjerenja"
        text="Upiši početnu težinu i obime – od njih se računa napredak."
        action={
          <ButtonLink
            to={paths.measurementNew(role, role === 'trainer' ? { client: clientId } : undefined)}
            size="sm"
            icon="plus"
          >
            Prvo mjerenje
          </ButtonLink>
        }
      />
    )
  }

  const weight = firstAndLast(measurements, 'weightKg')
  const waist = firstAndLast(measurements, 'waistCm')
  const chartPoints = measurements
    .filter((m) => m.weightKg !== null)
    .map((m) => ({ date: m.date, value: m.weightKg as number }))
    .reverse()

  return (
    <div className={styles.wrap}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Težina</span>
          <span className={styles.statValue}>
            {weight ? `${formatNumber(weight.latest)} kg` : '—'}
          </span>
          {weight && (
            <span className={styles.statHint}>
              {formatSigned(weight.latest - weight.first, 'kg')} od početka
            </span>
          )}
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Struk</span>
          <span className={styles.statValue}>
            {waist ? `${formatNumber(waist.latest)} cm` : '—'}
          </span>
          {waist && (
            <span className={styles.statHint}>
              {formatSigned(waist.latest - waist.first, 'cm')} od početka
            </span>
          )}
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Posljednje mjerenje</span>
          <span className={styles.statValue}>{formatAgo(measurements[0].date)}</span>
          <span className={styles.statHint}>ukupno {measurements.length}</span>
        </div>
      </div>

      <WeightChart points={chartPoints} />
      <MeasurementTable
        measurements={measurements.slice(0, 5)}
        role={role}
        caption="Posljednja mjerenja"
      />

      {measurements.length > 5 && (
        <div className={styles.footer}>
          <ButtonLink
            to={
              role === 'trainer'
                ? `${paths.measurements(role)}?client=${clientId}&period=all`
                : `${paths.measurements(role)}?period=all`
            }
            variant="ghost"
            size="sm"
            icon="chevronRight"
          >
            Sva mjerenja
          </ButtonLink>
        </div>
      )}
    </div>
  )
}
