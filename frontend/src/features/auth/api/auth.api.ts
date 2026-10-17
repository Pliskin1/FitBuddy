import { apiClient } from '@/shared/api/client'
import type { SessionUser } from '@/shared/auth/session'
import type { LoginResponse } from '../types'

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { username, password }),
  me: () => apiClient.get<SessionUser>('/auth/me'),
  logout: () => apiClient.post<void>('/auth/logout', {}),
}
