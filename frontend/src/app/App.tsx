import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from '@/features/auth'
import { queryClient } from '@/shared/api/queryClient'
import { ToastProvider } from '@/shared/ui'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
