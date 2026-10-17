---
paths:
  - 'frontend/src/**/*.tsx'
---

# React komponente i stranice

- Funkcionalne komponente sa **imenovanim** izvozom (`export function ClientCard`). Bez default izvoza (osim gdje alat traži).
- Jedna komponenta po fajlu; stil u `Ime.module.css` pored nje.
- **Podaci samo kroz hookove** iz `api/*.queries.ts` (TanStack Query). Nema `fetch`, `useEffect` + `setState` za učitavanje, ni direktnog poziva `*.api.ts` iz komponente.
- **Svaki prikaz podataka ima četiri stanja**, ovim redom:
  ```tsx
  {query.isPending ? <ListSkeleton label="Učitavam termine…" />
    : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    : query.data.length === 0 ? <EmptyState title="…" text="…" action={…} />
    : <Lista …/>}
  ```
  Uz liste sa filterima dodaj `<RefreshingIndicator active={query.isFetching && !query.isPending} />`.
- Stranica počinje sa `<PageHeader>` (postavlja h1 i naslov taba) i omotana je u `layout.page`.
- Putanje samo preko `paths` iz `@/shared/config/paths`. Navigacija: `<Link>`/`<ButtonLink>`, ne `<a href>` za interne rute.
- Uloga korisnika: `useCurrentUser()` na zaštićenim stranicama (`role === 'trainer'` / `'client'`). UI razlike po ulozi su dozvoljene, ali **pravo pristupa uvijek provjerava i mock/backend**.
- Mutacije: `mutation.mutate(vars, { onSuccess: () => { toast('…'); navigate(…) } })`; dugme dobija `loading={mutation.isPending}`.
- Nepovratne akcije (brisanje) idu kroz `ConfirmButton`.
- Forme: kontrolisana polja, `noValidate`, validacija iz `model/validation.ts` prije slanja, greške servera (`ApiError.fieldErrors`) se prikazuju ispod polja.
- Pristupačnost: svako polje ima `label`; dugme samo sa ikonom ima `aria-label`; dekorativne ikone su `aria-hidden` (komponenta `Icon` to radi sama).
- Ne dodaj novu zajedničku komponentu u feature – ako je potrebna na dva mjesta, ide u `shared/ui` i izvozi se iz `shared/ui/index.ts`.
