import { CLIENT_GOALS, type ClientFilters, type ClientGoal } from '../types'

/*
 * Filteri liste klijenata žive u URL-u (?q=ana&goal=strength&status=all),
 * pa se lista može podijeliti linkom i vraća se ista posle osvježavanja.
 */

export const DEFAULT_CLIENT_FILTERS: ClientFilters = { search: '', goal: '', status: 'active' }

export function parseClientFilters(params: URLSearchParams): ClientFilters {
  const goal = params.get('goal') ?? ''
  const status = params.get('status')
  return {
    search: params.get('q') ?? '',
    goal: (CLIENT_GOALS as readonly string[]).includes(goal) ? (goal as ClientGoal) : '',
    status: status === 'archived' || status === 'all' ? status : 'active',
  }
}

export function clientFiltersToParams(filters: ClientFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set('q', filters.search)
  if (filters.goal) params.set('goal', filters.goal)
  if (filters.status !== DEFAULT_CLIENT_FILTERS.status) params.set('status', filters.status)
  return params
}
