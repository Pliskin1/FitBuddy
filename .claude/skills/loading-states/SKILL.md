---
name: loading-states
description: Kako FitBuddy osigurava da korisnik nikad ne vidi praznu stranicu – route loaderi sa prefetch-om, skeletoni istog oblika kao sadržaj, BootScreen, traka napretka, stanja greške i prazno. Koristi pri pravljenju ili izmjeni bilo kog ekrana koji učitava podatke.
---

# Loaderi i stanja učitavanja

## Slojevi (od pokretanja do podataka)

| Trenutak                                | Šta korisnik vidi                                | Gdje je                                                    |
| --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| Prije nego što se JS učita              | logo + „Učitavam FitBuddy…”                      | statički HTML u `frontend/index.html`                      |
| Pokretanje MSW-a i prve rute            | `BootScreen`                                     | `hydrateFallbackElement` u `app/router.tsx`                |
| Promjena rute, učitavanje koda stranice | tanka traka na vrhu (+ `PageLoader` kao rezerva) | `AppLayout` (`useNavigation`, `useIsFetching`, `Suspense`) |
| Podaci stižu                            | **skeleton istog oblika** kao sadržaj            | stranica/komponenta (`query.isPending`)                    |
| Osvježavanje sa novim filterom          | stari podaci + „Osvježavam…”                     | `RefreshingIndicator`, `placeholderData: keepPreviousData` |
| Čuvanje                                 | dugme sa spinnerom „Čuvam…”, blokirano           | `Button loading`                                           |

## Route loader = zaštita + prefetch (bez čekanja)

```ts
{
  index: true,
  loader: protect('trainer', ({ request }) => {
    void queryClient.prefetchQuery(clientQueries.list(parseClientFilters(new URL(request.url).searchParams)))
    return null          // ne čekamo – stranica se odmah crta sa skeletonom
  }),
  lazy: () => import('./pages/ClientsListPage').then((m) => ({ Component: m.ClientsListPage })),
}
```

Loader i komponenta moraju koristiti **isti objekat filtera**, da bi pogodili isti ključ keša (vidi `pages/home/homeQueries.ts`).

## Komponenta – četiri stanja

```tsx
const query = useClients(filters)

{query.isPending ? (
  <CardGridSkeleton label="Učitavam klijente…" />
) : query.isError ? (
  <ErrorState error={query.error} onRetry={() => void query.refetch()} />
) : query.data.length === 0 ? (
  <EmptyState icon="users" title="Još nema klijenata" text="Dodaj prvog klijenta…" action={<ButtonLink …>Dodaj klijenta</ButtonLink>} />
) : (
  <div className={layout.cardGrid}>{query.data.map(…)}</div>
)}
```

## Izbor skeletona

- Kartice → `CardGridSkeleton`; liste redova (termini) → `ListSkeleton`; tabele → `TableSkeleton`; detalj → `DetailSkeleton`; forma koja čeka postojeći zapis → `FormSkeleton`; jedna brojka → `StatCard loading`.
- Nešto posebno (npr. tamna kartica sljedećeg termina) → složi od `Skeleton` blokova unutar `LoadingRegion` sa opisom (`label`) za čitač ekrana.
- Skeleton zauzima isti prostor kao sadržaj, da se raspored ne pomjera kad podaci stignu.

## Provjera

- Mock kašnjenje je 350–900 ms (`VITE_MOCK_DELAY_MIN_MS` / `MAX_MS`). Za provjeru loadera privremeno ga povećaj u `frontend/.env.local`.
- Otvori stranicu direktnim linkom (osvježavanje) i kroz meni – u oba slučaja ne smije se vidjeti prazan bijeli ekran.
