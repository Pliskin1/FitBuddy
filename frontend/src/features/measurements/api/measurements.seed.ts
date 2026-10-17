import { SEED_CLIENT_IDS } from '@/features/clients/api/clients.seed'
import { addDays, toISODate } from '@/shared/lib/date'
import type { Measurement } from '../types'

/*
 * Demo mjerenja. Za svakog klijenta niz mjerenja unazad (u danima), od najstarijeg ka najnovijem.
 * Marko namjerno nije mjeren 18 dana – kontrolna tabla ga prikazuje kao "zahtijeva pažnju".
 */

type Values = Partial<
  Pick<
    Measurement,
    'weightKg' | 'bodyFatPct' | 'waistCm' | 'hipsCm' | 'chestCm' | 'armCm' | 'thighCm' | 'steps'
  >
>

interface Series {
  clientId: string
  daysAgo: number[]
  values: (index: number) => Values
}

const lerp = (from: number, to: number, index: number, count: number) =>
  Math.round((from + ((to - from) * index) / Math.max(1, count - 1)) * 10) / 10

const steps = (base: number, index: number) => base + ((index * 1371) % 2600)

const SERIES: Series[] = [
  {
    clientId: SEED_CLIENT_IDS.ana,
    daysAgo: [45, 38, 31, 24, 17, 10, 3],
    values: (i) => ({
      weightKg: [82.0, 81.3, 80.9, 80.1, 79.6, 78.9, 78.4][i],
      bodyFatPct: lerp(31, 28, i, 7),
      waistCm: lerp(92, 86, i, 7),
      hipsCm: lerp(101, 98, i, 7),
      chestCm: lerp(102, 101, i, 7),
      armCm: lerp(33, 34, i, 7),
      thighCm: lerp(60, 58, i, 7),
      steps: steps(6800, i),
    }),
  },
  {
    clientId: SEED_CLIENT_IDS.marko,
    daysAgo: [32, 18],
    values: (i) => ({ weightKg: [96.0, 95.1][i], waistCm: [104, 102][i], steps: steps(5200, i) }),
  },
  {
    clientId: SEED_CLIENT_IDS.jelena,
    daysAgo: [28, 21, 14, 7],
    values: (i) => ({
      weightKg: [64.5, 64.2, 64.3, 64.0][i],
      bodyFatPct: lerp(22, 21, i, 4),
      thighCm: lerp(57, 58, i, 4),
      steps: steps(9000, i),
    }),
  },
  {
    clientId: SEED_CLIENT_IDS.stefan,
    daysAgo: [30, 16, 5],
    values: (i) => ({
      weightKg: [92.4, 91.0, 89.9][i],
      waistCm: [98, 96, 95][i],
      steps: steps(10200, i),
    }),
  },
  {
    clientId: SEED_CLIENT_IDS.milica,
    daysAgo: [21, 7],
    values: (i) => ({ weightKg: [71.0, 70.2][i], waistCm: [84, 83][i], steps: steps(7400, i) }),
  },
  {
    clientId: SEED_CLIENT_IDS.luka,
    daysAgo: [42, 35, 28, 21, 14, 7, 2],
    values: (i) => ({
      weightKg: [79.1, 79.4, 79.9, 80.3, 80.6, 81.0, 81.2][i],
      armCm: lerp(35, 37, i, 7),
      chestCm: lerp(98, 101, i, 7),
      steps: steps(8100, i),
    }),
  },
  {
    clientId: SEED_CLIENT_IDS.ivana,
    daysAgo: [26, 12],
    values: (i) => ({ weightKg: [60.4, 59.8][i], steps: steps(11000, i) }),
  },
  {
    clientId: SEED_CLIENT_IDS.mila,
    daysAgo: [230, 210],
    values: (i) => ({ weightKg: [69.0, 68.0][i] }),
  },
]

const EMPTY: Values = {
  weightKg: null,
  bodyFatPct: null,
  waistCm: null,
  hipsCm: null,
  chestCm: null,
  armCm: null,
  thighCm: null,
  steps: null,
}

export function seedMeasurements(now = new Date()): Measurement[] {
  return SERIES.flatMap((series) =>
    series.daysAgo.map((daysAgo, index) => {
      const day = addDays(now, -daysAgo)
      const created = day.toISOString()
      return {
        id: `m-${series.clientId.slice(2)}-${index + 1}`,
        clientId: series.clientId,
        date: toISODate(day),
        ...EMPTY,
        ...series.values(index),
        note: '',
        createdAt: created,
        updatedAt: created,
      } as Measurement
    }),
  )
}
