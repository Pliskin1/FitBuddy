import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** MSW u pretraživaču: presreće fetch pozive ka /api i odgovara iz mock ruta. */
export const worker = setupWorker(...handlers)
