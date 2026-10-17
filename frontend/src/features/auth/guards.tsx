import { Navigate, Outlet, redirect, useLocation, type LoaderFunctionArgs } from 'react-router'
import { loadSession, type Role } from '@/shared/auth/session'
import { ROLE_HOME, paths } from '@/shared/config/paths'
import { useAuth } from './AuthProvider'

/*
 * Zaštita ruta na dva mjesta:
 *  1. u route loaderu (`protect`) – prije nego što se stranica i podaci uopšte učitaju;
 *  2. u komponenti (`RequireRole`) – ako se korisnik odjavi dok je stranica otvorena.
 */

function loginUrl(next: string) {
  return `${paths.login}?next=${encodeURIComponent(next)}`
}

type Loader = (args: LoaderFunctionArgs) => unknown

/** Omotava loader rute: bez sesije → prijava, pogrešna uloga → početna te uloge. */
export function protect(role: Role, loader?: Loader) {
  return (args: LoaderFunctionArgs) => {
    const session = loadSession()
    const url = new URL(args.request.url)
    if (!session) throw redirect(loginUrl(url.pathname + url.search))
    if (session.user.role !== role) throw redirect(ROLE_HOME[session.user.role])
    return loader ? loader(args) : null
  }
}

/** "/" vodi na početnu uloge ili na prijavu. */
export function rootRedirectLoader() {
  const session = loadSession()
  return redirect(session ? ROLE_HOME[session.user.role] : paths.login)
}

/** Prijavljeni korisnik ne treba da vidi ekran za prijavu. */
export function loginLoader() {
  const session = loadSession()
  return session ? redirect(ROLE_HOME[session.user.role]) : null
}

export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={loginUrl(location.pathname + location.search)} replace />
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role]} replace />
  return <Outlet />
}

/** Dozvoljava samo interne putanje kao `next`, da prijava ne bi preusmjerila na drugi sajt. */
export function safeNextPath(next: string | null): string | null {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : null
}
