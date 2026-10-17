import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import styles from './Toast.module.css'

type ToastTone = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

type ShowToast = (message: string, tone?: ToastTone) => void

const ToastContext = createContext<ShowToast>(() => {})

let nextId = 1

/** Kratke potvrde poslije akcije ("Klijent je sačuvan"). Nestaju same posle 3,5 s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback<ShowToast>((message, tone = 'success') => {
    const id = nextId++
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={cn(styles.toast, toast.tone === 'error' && styles.error)}>
            <Icon
              name={toast.tone === 'error' ? 'alert' : 'check'}
              size={18}
              className={styles.icon}
            />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ShowToast {
  return useContext(ToastContext)
}
