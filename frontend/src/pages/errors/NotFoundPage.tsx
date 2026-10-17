import { useAuth } from '@/features/auth'
import { ROLE_HOME, paths } from '@/shared/config/paths'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { ButtonLink, EmptyState } from '@/shared/ui'

export function NotFoundPage() {
  useDocumentTitle('Stranica ne postoji')
  const { user } = useAuth()
  return (
    <EmptyState
      icon="info"
      title="Ova stranica ne postoji"
      text="Link je možda pogrešan ili je stranica premještena."
      action={<ButtonLink to={user ? ROLE_HOME[user.role] : paths.login}>Na početnu</ButtonLink>}
    />
  )
}
