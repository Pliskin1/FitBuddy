import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // PORT dolazi od alata koji pokreće server (npr. preview u Claude aplikaciji kad je 5173 zauzet).
    port: Number(process.env.PORT) || 5173,
    // Bez tihog prelaska na drugi port: MSW service worker radi samo na adresi koju pregledač očekuje.
    strictPort: true,
  },
})
