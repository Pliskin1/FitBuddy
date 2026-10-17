---
name: mock-api
description: Kako se pišu mock API rute (MSW) u FitBuddy-ju tako da se ponašaju kao pravi backend – kašnjenje, autentifikacija i uloge, validacija, greške 401/403/404/409/422, mock tabela u localStorage i demo podaci. Koristi kad dodaješ ili mijenjaš rutu u features/*/api/*.mock.ts.
---

# Mock API (MSW)

Mock rute su **ugovor sa backendom u obliku koda**. Frontend ne zna da li priča sa mock-om ili pravim serverom – zato mock mora vraćati iste statuse i oblike grešaka kao što piše u `docs/entities.md`.

## Gdje je šta

- `shared/mocks/collection.ts` – `createCollection(name, seed)`: tabela u memoriji + `localStorage` (`fitbuddy.mock.<name>.v1`); dok niko ne izmijeni podatke, seed se obnavlja svaki dan. `resetAllMockData()` vraća početno stanje.
- `shared/mocks/responses.ts` – `mockDelay()`, `newId(prefix)`, `nowISO()`, `notFound()`, `validationError()`, `conflict()`.
- `features/auth/api/auth.guard.ts` – `requireUser(request, roles?)`, `canAccessClient(user, clientId)`, `forbidden()`.
- `src/mocks/handlers.ts` – registracija svih handlera; `src/mocks/browser.ts` – `setupWorker`.
- `src/main.tsx` – MSW se pokreće **prije** uvoza `App`-a (ruter odmah pokreće loadere).

## Šablon handlera

```ts
import { http, HttpResponse } from 'msw'
import { canAccessClient, forbidden, requireUser } from '@/features/auth/api/auth.guard'
import { API_BASE } from '@/shared/api/client'
import { hasErrors } from '@/shared/lib/validation'
import { mockDelay, newId, notFound, nowISO, validationError } from '@/shared/mocks/responses'

/*
 * Mock rute za <resurs> (docs/entities.md, "<Ime>").
 *   GET  /api/<resurs>?…      ko smije šta
 *   POST /api/<resurs>
 */
const BASE = `${API_BASE}/<resurs>`

export const xxxHandlers = [
  http.get(BASE, async ({ request }) => {
    await mockDelay() // 1. kašnjenje – da se vide loaderi
    const auth = requireUser(request) // 2. 401 bez tokena
    if (auth.error) return auth.error
    const params = new URL(request.url).searchParams
    // 3. klijent vidi samo svoje – zanemari clientId iz upita
    const clientId = auth.user.role === 'client' ? auth.user.clientId : params.get('clientId')
    const items = xxxDb.all().filter((x) => !clientId || x.clientId === clientId)
    return HttpResponse.json(items)
  }),

  http.post(BASE, async ({ request }) => {
    await mockDelay()
    const auth = requireUser(request, ['trainer']) // 403 za pogrešnu ulogu
    if (auth.error) return auth.error
    const input = (await request.json()) as XxxInput
    const errors = validateXxxInput(input) // 4. ista validacija kao forma
    if (hasErrors(errors)) return validationError(errors) // 422 + fieldErrors
    // 5. poslovna pravila → conflict('Poruka', { polje: 'Poruka' })  // 409
    const now = nowISO()
    return HttpResponse.json(
      xxxDb.insert({ ...input, id: newId('x'), createdAt: now, updatedAt: now }),
      { status: 201 },
    )
  }),

  http.get(`${BASE}/:id`, async ({ params, request }) => {
    await mockDelay()
    const auth = requireUser(request)
    if (auth.error) return auth.error
    const item = xxxDb.find(String(params.id))
    if (!item) return notFound('Zapis ne postoji ili je obrisan.') // 404
    if (!canAccessClient(auth.user, item.clientId)) return forbidden() // 403
    return HttpResponse.json(item)
  }),
]
```

## Pravila

- Poruke grešaka su na crnogorskom i kažu kako dalje. Ključevi `fieldErrors` su imena polja iz tijela zahtjeva.
- Odgovor sa vezom uključuje kratku referencu (`client: ClientRef | null`), ne cijeli objekat.
- Seed podaci su realni (imena, brojke koje imaju smisla), relativni u odnosu na danas i deterministični (bez `Math.random` u seedu).
- Mock sloj smije čitati `*.db.ts` drugih feature-a (npr. za sažetak ili referencu), komponente nikad.
- Svaka nova ruta ide u `docs/entities.md` u istom commitu.
- Isključivanje mock-a: `VITE_USE_MOCKS=false` u `frontend/.env.local`.
