import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ApiError } from '@/shared/api/client'
import { ROLE_HOME } from '@/shared/config/paths'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { Button, Icon, LogoMark, TextField } from '@/shared/ui'
import { useAuth } from '../AuthProvider'
import { safeNextPath } from '../guards'
import type { LoginInput } from '../types'
import styles from './LoginPage.module.css'

/** Demo nalozi – prikazani na ekranu jer aplikacija još nema backend ni registraciju. */
const DEMO_ACCOUNTS = [
  { role: 'Trener', username: 'trener', password: 'trener123' },
  { role: 'Klijent', username: 'klijent', password: 'klijent123' },
]

export function LoginPage() {
  useDocumentTitle('Prijava')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})

  const mutation = useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      const next = safeNextPath(params.get('next'))
      // `next` važi samo ako pripada ulozi koja se prijavila.
      navigate(next && next.startsWith(ROLE_HOME[user.role]) ? next : ROLE_HOME[user.role], {
        replace: true,
      })
    },
    onError: (error) => {
      if (error instanceof ApiError) setFieldErrors(error.fieldErrors)
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const errors = {
      username: username.trim() ? undefined : 'Unesi korisničko ime.',
      password: password ? undefined : 'Unesi lozinku.',
    }
    setFieldErrors(errors)
    if (errors.username || errors.password) return
    mutation.mutate({ username, password, remember })
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? Object.keys(mutation.error.fieldErrors).length > 0
        ? null
        : mutation.error.message
      : mutation.error
        ? 'Prijava nije uspjela. Pokušaj ponovo.'
        : null

  return (
    <div className={styles.screen}>
      <aside className={styles.brand}>
        <div className={styles.brandName}>
          <LogoMark size={44} inverted />
          FitBuddy
        </div>
        <p className={styles.headline}>
          Trener planira.
          <br />
          Klijent napreduje.
        </p>
        <ul className={styles.benefits}>
          {[
            'Termini bez dopisivanja – klijent vidi slobodna vremena',
            'Mjerenja i napredak na grafikonu',
            'Svaki klijent vidi samo svoje podatke',
          ].map((text) => (
            <li key={text}>
              <Icon name="check" size={22} className={styles.benefitIcon} />
              {text}
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.mobileBrand}>
            <LogoMark size={44} />
            FitBuddy
          </div>
          <div>
            <h1 className={styles.title}>Prijava</h1>
            <p className={styles.lead}>
              Jedan ekran za trenere i klijente – aplikacija sama zna šta da ti pokaže.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {errorMessage && (
              <div className={styles.alert} role="alert">
                <Icon name="alert" size={18} />
                <span>{errorMessage}</span>
              </div>
            )}
            <TextField
              id="username"
              label="Korisničko ime"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              error={fieldErrors.username}
              onChange={(event) => {
                setUsername(event.target.value)
                setFieldErrors((e) => ({ ...e, username: undefined }))
              }}
            />
            <div className={styles.passwordWrap}>
              <TextField
                id="password"
                label="Lozinka"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                error={fieldErrors.password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setFieldErrors((e) => ({ ...e, password: undefined }))
                }}
              />
              {!fieldErrors.password && (
                <button
                  type="button"
                  className={styles.toggle}
                  aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              )}
            </div>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Zapamti me na ovom uređaju
            </label>
            <Button
              type="submit"
              fullWidth
              loading={mutation.isPending}
              loadingText="Prijavljujem…"
            >
              Prijavi se
            </Button>
          </form>

          <section className={styles.demo} aria-label="Demo nalozi">
            <div>
              <p className={styles.demoTitle}>Demo nalozi</p>
              <p className={styles.demoText}>
                Nema još baze, pa prijava radi sa ova dva naloga. Klik popunjava polja.
              </p>
            </div>
            <div className={styles.demoButtons}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  className={styles.demoButton}
                  onClick={() => {
                    setUsername(account.username)
                    setPassword(account.password)
                    setFieldErrors({})
                    mutation.reset()
                  }}
                >
                  <span className={styles.demoRole}>{account.role}</span>
                  <span className={styles.demoCredentials}>
                    {account.username} / {account.password}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
