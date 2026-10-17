/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'false' isključuje MSW i šalje pozive na pravi backend. */
  readonly VITE_USE_MOCKS?: string
  /** Osnovna adresa API-ja, podrazumijevano '/api'. */
  readonly VITE_API_URL?: string
  readonly VITE_MOCK_DELAY_MIN_MS?: string
  readonly VITE_MOCK_DELAY_MAX_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
