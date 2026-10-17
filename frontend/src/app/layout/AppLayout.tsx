import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useNavigate, useNavigation } from 'react-router'
import { useAuth } from '@/features/auth'
import { ROLE_HOME, paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/cn'
import { resetAllMockData } from '@/shared/mocks/collection'
import { Icon, LogoMark, PageLoader, useToast } from '@/shared/ui'
import { NAVIGATION, ROLE_LABELS } from './navigation'
import styles from './AppLayout.module.css'

/** Okvir aplikacije: bočni meni (desktop), gornja traka i donja navigacija (telefon). */
export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const fetching = useIsFetching()
  const queryClient = useQueryClient()
  const toast = useToast()

  const items = user ? NAVIGATION[user.role] : []
  const busy = navigation.state !== 'idle' || fetching > 0
  const initials = user
    ? user.displayName
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
    : ''

  async function handleLogout() {
    await logout()
    navigate(paths.login, { replace: true })
  }

  function handleResetDemo() {
    resetAllMockData()
    void queryClient.invalidateQueries()
    toast('Demo podaci su vraćeni na početne.')
  }

  return (
    <div className={styles.shell}>
      <a href="#sadrzaj" className={styles.skip}>
        Preskoči na sadržaj
      </a>
      {busy && <div className={styles.progress} role="progressbar" aria-label="Učitavanje" />}

      {user && (
        <aside className={styles.sidebar} aria-label="Bočni meni">
          <div className={styles.brand}>
            <LogoMark size={40} inverted />
            FitBuddy
            <span className={styles.role}>{ROLE_LABELS[user.role]}</span>
          </div>
          <nav aria-label="Glavna navigacija" className={styles.nav}>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(styles.navLink, isActive && styles.active)}
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.user}>
              <span aria-hidden="true" className={styles.userAvatar}>
                {initials}
              </span>
              <div>
                <div className={styles.userName}>{user.displayName}</div>
                <div className={styles.userRole}>
                  {user.role === 'trainer' ? 'Personalni trener' : 'Klijent'}
                </div>
              </div>
            </div>
            <button type="button" className={styles.sideButton} onClick={handleResetDemo}>
              <Icon name="refresh" size={18} />
              Vrati demo podatke
            </button>
            <button type="button" className={styles.sideButton} onClick={handleLogout}>
              <Icon name="logout" size={18} />
              Odjavi se
            </button>
          </div>
        </aside>
      )}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <Link to={user ? ROLE_HOME[user.role] : paths.login} className={styles.topbarBrand}>
            <LogoMark size={36} />
            FitBuddy
          </Link>
          {user && (
            <div className={styles.topbarActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={handleResetDemo}
                aria-label="Vrati demo podatke"
              >
                <Icon name="refresh" size={18} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={handleLogout}
                aria-label="Odjavi se"
              >
                <Icon name="logout" size={18} />
              </button>
            </div>
          )}
        </header>

        <main id="sadrzaj" className={styles.content}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {user && (
        <nav aria-label="Glavna navigacija" className={styles.bottomNav}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(styles.bottomLink, isActive && styles.active)}
            >
              <span className={styles.bottomIcon}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      <ScrollRestoration />
    </div>
  )
}
