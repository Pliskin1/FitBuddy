---
name: add-feature
description: Kako se u FitBuddy frontendu dodaje novi feature (entitet) – struktura fajlova, redoslijed, šabloni za tipove, mock rute, API, TanStack Query, stranice sa loaderima i rute. Koristi kad se pravi novi entitet ili kompletan modul (npr. vježbe, jelovnici, pozivnice).
---

# Dodavanje feature-a

Uzor: `frontend/src/features/measurements` (najjednostavniji kompletan feature) i `features/appointments` (statusi, filteri po periodu, prava po ulozi).

## 1. Tipovi – `features/<ime>/types.ts`

```ts
import type { ClientRef } from '@/features/clients'

/* Opis entiteta i veza (npr. Exercise.clientId → Client.id). Ugovor: docs/entities.md, "<Ime>". */
export const EXERCISE_GROUPS = ['legs', 'back', 'chest'] as const
export type ExerciseGroup = (typeof EXERCISE_GROUPS)[number]

export interface Exercise {
  id: string
  name: string
  group: ExerciseGroup
  videoUrl: string | null
  createdAt: string
  updatedAt: string
}
export type ExerciseInput = Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>
export interface ExerciseFilters {
  search: string
  group: ExerciseGroup | ''
}
export type ExerciseQuery = { search?: string; group?: string }
```

## 2. Model – `model/`

- `labels.ts`: `Record<Enum, string>` za prikaz, pomoćne funkcije prikaza.
- `filters.ts`: `DEFAULT_…_FILTERS`, `parse…Filters(URLSearchParams)`, `…FiltersToParams(filters)`, `to…Query(filters)`.
- `validation.ts`: `…FormValues` (stringovi), `to…FormValues(entity?, defaults)`, `to…Input(values)`, `validate…Input(input): FieldErrors<…Input>` – **ista funkcija** se koristi u formi i u mock ruti.

## 3. Mock sloj – `api/`

```ts
// <ime>.seed.ts – demo podaci relativni u odnosu na danas, fiksni ID-jevi ako ih koriste drugi seedovi
export function seedExercises(): Exercise[] { … }

// <ime>.db.ts
export const exercisesDb = createCollection<Exercise>('exercises', seedExercises)

// <ime>.mock.ts – vidi skill `mock-api` za kompletan šablon handlera
export const exercisesHandlers = [http.get(`${API_BASE}/exercises`, async ({ request }) => { … })]
```

Registruj handlere u `src/mocks/handlers.ts`.

## 4. API i upiti

```ts
// <ime>.api.ts
export const exercisesApi = {
  list: (query: ExerciseQuery) => apiClient.get<Exercise[]>('/exercises', query),
  get: (id: string) => apiClient.get<Exercise>(`/exercises/${id}`),
  create: (input: ExerciseInput) => apiClient.post<Exercise>('/exercises', input),
  update: (id: string, input: ExerciseInput) => apiClient.put<Exercise>(`/exercises/${id}`, input),
}

// <ime>.queries.ts
export const exerciseKeys = { all: ['exercises'] as const }
export const exerciseQueries = {
  list: (filters: ExerciseFilters) =>
    queryOptions({
      queryKey: [...exerciseKeys.all, 'list', filters] as const,
      queryFn: () => exercisesApi.list(toExerciseQuery(filters)),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...exerciseKeys.all, 'detail', id] as const,
      queryFn: () => exercisesApi.get(id),
    }),
}
export const useExercises = (f: ExerciseFilters) =>
  useQuery({ ...exerciseQueries.list(f), placeholderData: keepPreviousData })
// mutacije: onSuccess → invalidateQueries({ queryKey: exerciseKeys.all }) (+ ključevi zavisnih resursa)
```

## 5. Stranice – `pages/`

- **Lista + filter**: `PageHeader` (akcija „Nova …”), traka filtera (stanje u URL-u), `RefreshingIndicator`, četiri stanja (vidi skill `loading-states`).
- **Detalj**: `DetailSkeleton`, 404 → `EmptyState` sa linkom nazad, akcije u `PageHeader`, sadržaj u `Panel`-ima, raspored `layout.split`.
- **Forma** (isti ekran za novo i izmjenu): `FormSkeleton` dok se učitava postojeći zapis, `key={data?.updatedAt ?? 'new'}`, greške servera u polja, toast + `navigate` posle uspjeha.

## 6. Rute – `routes.ts`

```ts
export const exercisesRoutes: RouteObject[] = [{
  path: 'vjezbe',
  children: [
    { index: true,
      loader: protect('trainer', ({ request }) => { void queryClient.prefetchQuery(exerciseQueries.list(parseExerciseFilters(new URL(request.url).searchParams))); return null }),
      lazy: () => import('./pages/ExercisesListPage').then((m) => ({ Component: m.ExercisesListPage })) },
    { path: 'nova', loader: protect('trainer'), lazy: … },
    { path: ':exerciseId', loader: protect('trainer', ({ params }) => { void queryClient.prefetchQuery(exerciseQueries.detail(params.exerciseId ?? '')); return null }), lazy: … },
    { path: ':exerciseId/uredi', … },
  ],
}]
```

Zatim: rute u `src/app/router.tsx` (pod `trener` i/ili `klijent`), putanje u `shared/config/paths.ts`, meni u `src/app/layout/navigation.ts`.

## 7. Javni API – `index.ts`

Izvozi hookove, `…Queries`, `…Keys`, komponente koje drugi koriste, labele i tipove. **Ne izvozi stranice** (njih učitavaju rute lijeno).

## 8. Dokumentacija i provjera

- `docs/entities.md`: entitet (tabela polja), rute, prava po ulozi, pravila.
- `npm run check`, pa provjera u pregledaču na 375 i 1440 px.
