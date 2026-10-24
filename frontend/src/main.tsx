import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'

/**
 * Pokreće MSW prije svega ostalog, da nijedan API poziv ne ode mimo mock ruta.
 * Sa VITE_USE_MOCKS=false aplikacija zove pravi backend sa VITE_API_URL adrese.
 */
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'false') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

/** Ako pokretanje ne uspije, umjesto beskonačnog loadera prikaži šta se desilo i kako dalje. */
function showStartupError(root: HTMLElement, error: unknown) {
  console.error('FitBuddy se nije pokrenuo:', error)
  const box = document.createElement('div')
  box.className = 'boot'
  box.setAttribute('role', 'alert')
  const title = document.createElement('strong')
  title.textContent = 'Aplikacija se nije pokrenula'
  const text = document.createElement('span')
  text.textContent =
    'Mock API (service worker) nije mogao da se registruje. Osvježi stranicu; ako se ponovi, otvori aplikaciju na adresi koju je ispisao "npm run dev".'
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = 'Osvježi stranicu'
  button.addEventListener('click', () => window.location.reload())
  box.append(title, text, button)
  root.replaceChildren(box)
}

async function bootstrap() {
  const root = document.getElementById('root')!
  try {
    await enableMocking()
    // App (i ruter u njemu) se uvozi tek sad: ruter odmah pokreće loadere početne rute,
    // a oni moraju da naiđu na već pokrenut mock API.
    const { App } = await import('@/app/App')
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    showStartupError(root, error)
  }
}

void bootstrap()
