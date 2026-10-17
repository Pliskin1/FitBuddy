import type { Role } from '@/shared/auth/session'

/*
 * Sve putanje aplikacije na jednom mjestu. Komponente nikad ne pišu URL ručno,
 * nego koriste ove funkcije – pa se ruta mijenja na jednom mjestu.
 * Trener radi pod /trener, klijent pod /klijent.
 */

export const ROLE_HOME: Record<Role, string> = {
  trainer: '/trener',
  client: '/klijent',
}

const withQuery = (path: string, query?: Record<string, string | undefined>) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) if (value) params.set(key, value)
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export const paths = {
  login: '/prijava',
  home: (role: Role) => ROLE_HOME[role],

  // Klijenti – samo trener
  clients: '/trener/klijenti',
  client: (id: string) => `/trener/klijenti/${id}`,
  clientNew: '/trener/klijenti/novi',
  clientEdit: (id: string) => `/trener/klijenti/${id}/uredi`,
  myProfile: '/klijent/profil',

  // Termini – obje uloge
  appointments: (role: Role) => `${ROLE_HOME[role]}/termini`,
  appointment: (role: Role, id: string) => `${ROLE_HOME[role]}/termini/${id}`,
  appointmentNew: (role: Role, query?: { client?: string; date?: string }) =>
    withQuery(`${ROLE_HOME[role]}/termini/novi`, query),
  appointmentEdit: (id: string) => `/trener/termini/${id}/uredi`,

  // Mjerenja – obje uloge
  measurements: (role: Role) => `${ROLE_HOME[role]}/mjerenja`,
  measurementNew: (role: Role, query?: { client?: string }) =>
    withQuery(`${ROLE_HOME[role]}/mjerenja/novo`, query),
  measurementEdit: (role: Role, id: string) => `${ROLE_HOME[role]}/mjerenja/${id}/uredi`,
}
