import { useState, type PointerEvent } from 'react'
import { useElementWidth } from '@/shared/hooks/useElementWidth'
import { parseISODate } from '@/shared/lib/date'
import { formatDayMonth, formatNumber, formatShortDate } from '@/shared/lib/format'
import { EmptyState } from '@/shared/ui'
import styles from './WeightChart.module.css'

export interface ChartPoint {
  date: string
  value: number
}

interface WeightChartProps {
  /** Tačke od najstarije ka najnovijoj. */
  points: ChartPoint[]
  label?: string
  unit?: string
  height?: number
}

const PAD = { top: 24, right: 20, bottom: 28, left: 44 }

/**
 * Linijski grafikon jedne mjere kroz vrijeme (jedna serija, bez legende – naslov panela je imenuje).
 * Crta se u pravim pikselima širine kontejnera, pa je čitljiv i na 375 i na 1440 px.
 */
export function WeightChart({
  points,
  label = 'Težina',
  unit = 'kg',
  height = 220,
}: WeightChartProps) {
  const [ref, measuredWidth] = useElementWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  if (points.length < 2) {
    return (
      <div ref={ref}>
        <EmptyState
          compact
          icon="chart"
          title="Grafikon čeka drugo mjerenje"
          text={`Napredak se vidi kad postoje bar dva mjerenja (${label.toLowerCase()}).`}
        />
      </div>
    )
  }

  const width = Math.max(measuredWidth, 280)
  const times = points.map((p) => parseISODate(p.date).getTime())
  const values = points.map((p) => p.value)
  let lo = Math.floor(Math.min(...values) - 1)
  let hi = Math.ceil(Math.max(...values) + 1)
  if (hi - lo < 4) {
    const mid = (hi + lo) / 2
    lo = Math.floor(mid - 2)
    hi = Math.ceil(mid + 2)
  }

  const t0 = times[0]
  const t1 = times[times.length - 1]
  const x = (t: number) =>
    PAD.left + ((t - t0) / Math.max(1, t1 - t0)) * (width - PAD.left - PAD.right)
  const y = (v: number) => PAD.top + ((hi - v) / (hi - lo)) * (height - PAD.top - PAD.bottom)
  const bottom = height - PAD.bottom
  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3)

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(times[i])},${y(p.value)}`).join(' ')
  const area = `${line} L${x(t1)},${bottom} L${x(t0)},${bottom} Z`
  const last = points[points.length - 1]
  const first = points[0]

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left
    let nearest = 0
    times.forEach((t, i) => {
      if (Math.abs(x(t) - px) < Math.abs(x(times[nearest]) - px)) nearest = i
    })
    setHover(nearest)
  }

  const hovered = hover !== null ? points[hover] : null

  return (
    <div ref={ref} className={styles.chart}>
      <svg
        className={styles.svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${label}: od ${formatNumber(first.value)} do ${formatNumber(last.value)} ${unit}, ${points.length} mjerenja između ${formatShortDate(first.date)} i ${formatShortDate(last.date)}.`}
        onPointerMove={handlePointer}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              className={styles.grid}
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
            />
            <text className={styles.axis} x={PAD.left - 8} y={y(tick) + 4} textAnchor="end">
              {formatNumber(tick, 0)}
            </text>
          </g>
        ))}

        <path className={styles.area} d={area} />
        <path className={styles.line} d={line} />

        {points.slice(0, -1).map((p, i) => (
          <circle
            key={p.date + i}
            className={styles.point}
            cx={x(times[i])}
            cy={y(p.value)}
            r={4}
          />
        ))}
        <circle className={styles.lastPoint} cx={x(t1)} cy={y(last.value)} r={6} />
        <text className={styles.valueLabel} x={x(t1) - 4} y={y(last.value) - 12} textAnchor="end">
          {formatNumber(last.value)} {unit}
        </text>

        <text className={styles.axis} x={x(t0)} y={height - 6} textAnchor="start">
          {formatDayMonth(first.date)}
        </text>
        <text className={styles.axis} x={x(t1)} y={height - 6} textAnchor="end">
          {formatDayMonth(last.date)}
        </text>

        {hover !== null && (
          <line
            className={styles.cursor}
            x1={x(times[hover])}
            x2={x(times[hover])}
            y1={PAD.top}
            y2={bottom}
          />
        )}
      </svg>

      {hovered && hover !== null && (
        <div className={styles.tooltip} style={{ left: x(times[hover]), top: y(hovered.value) }}>
          {formatShortDate(hovered.date)}
          <strong>
            {formatNumber(hovered.value)} {unit}
          </strong>
        </div>
      )}
    </div>
  )
}
