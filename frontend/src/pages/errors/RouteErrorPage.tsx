import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button, ButtonLink, EmptyState, ErrorState } from '@/shared/ui'

/** Greška pri učitavanju rute (npr. kod stranice se nije učitao) – nikad bijeli ekran. */
export function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <EmptyState
        icon="info"
        title="Ova stranica ne postoji"
        text="Link je možda pogrešan ili je stranica premještena."
        action={<ButtonLink to="/">Na početnu</ButtonLink>}
      />
    )
  }

  return (
    <ErrorState
      error={error}
      title="Stranica se nije učitala"
      action={
        <Button
          variant="secondary"
          size="sm"
          icon="refresh"
          onClick={() => window.location.reload()}
        >
          Osvježi stranicu
        </Button>
      }
    />
  )
}
