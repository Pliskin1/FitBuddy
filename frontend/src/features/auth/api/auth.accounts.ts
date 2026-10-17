import { SEED_CLIENT_IDS } from '@/features/clients/api/clients.seed'
import type { SessionUser } from '@/shared/auth/session'

/*
 * Demo nalozi za mock prijavu (nema baze ni backenda). Lozinke postoje SAMO ovdje, u mock sloju –
 * pravi backend će ih čuvati heširane (SPEC.md, sekcija 12.7).
 * Klijentski nalog je povezan sa demo klijentom Anom Petrović.
 */

interface MockAccount {
  user: SessionUser
  password: string
  token: string
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    user: {
      id: 'u-trener',
      username: 'trener',
      role: 'trainer',
      displayName: 'Nikola Vuković',
      clientId: null,
    },
    password: 'trener123',
    token: 'mock-token-trener',
  },
  {
    user: {
      id: 'u-klijent',
      username: 'klijent',
      role: 'client',
      displayName: 'Ana Petrović',
      clientId: SEED_CLIENT_IDS.ana,
    },
    password: 'klijent123',
    token: 'mock-token-klijent',
  },
]
