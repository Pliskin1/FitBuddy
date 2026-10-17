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

async function bootstrap() {
  await enableMocking()
  // App (i ruter u njemu) se uvozi tek sad: ruter odmah pokreće loadere početne rute,
  // a oni moraju da naiđu na već pokrenut mock API.
  const { App } = await import('@/app/App')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
