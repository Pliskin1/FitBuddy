import { createCollection } from '@/shared/mocks/collection'
import type { Measurement } from '../types'
import { seedMeasurements } from './measurements.seed'

/** Mock tabela mjerenja. Koriste je samo mock rute (*.mock.ts), nikad komponente. */
export const measurementsDb = createCollection<Measurement>('measurements', () =>
  seedMeasurements(),
)
