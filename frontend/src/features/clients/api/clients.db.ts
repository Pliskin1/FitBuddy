import { createCollection } from '@/shared/mocks/collection'
import type { Client } from '../types'
import { seedClients } from './clients.seed'

/** Mock tabela klijenata. Koriste je samo mock rute (*.mock.ts), nikad komponente. */
export const clientsDb = createCollection<Client>('clients', seedClients)
