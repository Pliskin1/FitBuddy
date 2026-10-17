import type { Role } from '@/shared/auth/session'
import { paths } from '@/shared/config/paths'
import type { IconName } from '@/shared/ui'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  /** Aktivan samo na tačnoj putanji (za početnu). */
  end?: boolean
}

/** Stavke menija po ulozi – iste za bočni meni (desktop) i donju navigaciju (telefon). */
export const NAVIGATION: Record<Role, NavItem[]> = {
  trainer: [
    { to: paths.home('trainer'), label: 'Početna', icon: 'home', end: true },
    { to: paths.clients, label: 'Klijenti', icon: 'users' },
    { to: paths.appointments('trainer'), label: 'Termini', icon: 'calendar' },
    { to: paths.measurements('trainer'), label: 'Mjerenja', icon: 'chart' },
  ],
  client: [
    { to: paths.home('client'), label: 'Početna', icon: 'home', end: true },
    { to: paths.appointments('client'), label: 'Termini', icon: 'calendar' },
    { to: paths.measurements('client'), label: 'Mjerenja', icon: 'chart' },
    { to: paths.myProfile, label: 'Profil', icon: 'user' },
  ],
}

export const ROLE_LABELS: Record<Role, string> = {
  trainer: 'Trener',
  client: 'Klijent',
}
