---
paths:
  - 'frontend/src/features/**'
  - 'frontend/src/mocks/**'
  - 'frontend/src/shared/api/**'
  - 'docs/entities.md'
---

# Feature-i, API i mock rute

## Struktura feature-a (obavezna)

```
features/<ime>/
  types.ts            entitet, Input, Filters, Query
  model/              labels.ts, filters.ts (URL ↔ filteri), validation.ts (pravila + forma ↔ input)
  api/
    <ime>.api.ts      fetch pozivi preko apiClient – jedino mjesto sa URL-ovima API-ja
    <ime>.queries.ts  queryOptions (ključevi keša) + useXxx hookovi + mutacije sa invalidacijom
    <ime>.mock.ts     MSW rute (ponašaju se kao backend)
    <ime>.db.ts       createCollection(...) – mock tabela
    <ime>.seed.ts     demo podaci, relativni u odnosu na danas
  components/  pages/
  routes.ts           RouteObject[] sa `protect(...)` loaderima i `lazy` stranicama
  index.ts            javni API (hookovi, komponente, tipovi, labele) – bez stranica
```

## Pravila uvoza

- Drugi feature se uvozi **samo** kroz `@/features/<ime>` (njegov `index.ts`).
- Izuzetak je mock sloj: `*.mock.ts` smije uvoziti `@/features/<drugi>/api/<drugi>.db` i `@/features/auth/api/auth.guard`.
- `shared/` nikad ne uvozi iz `features/`.
- Komponente nikad ne uvoze `*.db.ts`, `*.seed.ts` ni `*.mock.ts`.

## Mock rute (`*.mock.ts`)

Svaki handler, ovim redom:

1. `await mockDelay()` – da se vide loaderi.
2. `const auth = requireUser(request, ['trainer'])` → `if (auth.error) return auth.error` (401/403).
3. Za klijenta suzi podatke na `auth.user.clientId` (lista) ili provjeri `canAccessClient` (detalj).
4. Validacija istom funkcijom kao forma (`model/validation.ts`) → `validationError(errors)` (422).
5. Poslovna pravila → `conflict(message, fieldErrors)` (409), `notFound(...)` (404).
6. Odgovor: `HttpResponse.json(data, { status })`; brisanje `new HttpResponse(null, { status: 204 })`.

- Novi handleri se registruju u `src/mocks/handlers.ts`.
- Na vrhu fajla komentar sa spiskom ruta.

## Upiti (TanStack Query)

- Ključ keša: `['<ime>', 'list', filters]` i `['<ime>', 'detail', id]`; `filters` mora biti stabilan objekat (bez `new Date()` u ključu – raspon datuma se računa u `queryFn`).
- Liste koriste `placeholderData: keepPreviousData`.
- Mutacija invalidira svoj ključ **i** ključeve resursa čiji sažetak zavisi od nje (npr. termin → i `clientKeys.all`).

## Rute

- Svaki `loader` je umotan u `protect(role, fn)` i radi `void queryClient.prefetchQuery(...)` **bez await** – stranica odmah prikazuje skeleton.
- Stranice se učitavaju lijeno: `lazy: () => import('./pages/X').then((m) => ({ Component: m.X }))`.

## Ugovor

- Svaka promjena polja, rute, statusa ili pravila ide i u `docs/entities.md` u istom commitu.
