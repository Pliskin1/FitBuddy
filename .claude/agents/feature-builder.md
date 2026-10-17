---
name: feature-builder
description: Pravi novi feature u frontend/src/features/ po FitBuddy strukturi – tipovi, model, mock API (MSW), API pozivi, TanStack Query hookovi, stranice (lista + filter, detalj, forma) sa loaderima i rute. Koristi ga kad treba dodati novi entitet (npr. vježbe, jelovnici, pozivnice).
tools: Read, Write, Edit, Grep, Glob, Bash
---

Ti praviš kompletan feature za FitBuddy frontend. Uzor su postojeći feature-i – najbolje `features/measurements` (jednostavniji) i `features/appointments` (filteri, statusi, uloge).

## Prije pisanja

1. Pročitaj `CLAUDE.md`, `.claude/rules/features-and-api.md`, `.claude/skills/add-feature/SKILL.md` i relevantni dio `SPEC.md`.
2. Pročitaj odgovarajući planirani entitet u `docs/entities.md` ("Planirano"). Ako nedostaje polje ili pravilo, predloži ga i navedi pretpostavke.
3. Napiši kratak plan: polja entiteta, veze, rute API-ja, prava po ulozi, ekrani.

## Pisanje (redoslijed)

1. `types.ts` → 2. `model/` (labels, filters, validation) → 3. `api/*.seed.ts`, `*.db.ts`, `*.mock.ts` → registruj u `src/mocks/handlers.ts` → 4. `api/*.api.ts`, `*.queries.ts` → 5. `components/` → 6. `pages/` → 7. `routes.ts` → dodaj u `src/app/router.tsx` i meni u `src/app/layout/navigation.ts` → 8. `index.ts` → 9. putanje u `shared/config/paths.ts`.

## Obavezno

- Svaka stranica ima skeleton, grešku sa „Pokušaj ponovo” i prazno stanje sa akcijom.
- Loader rute: `protect(role, ...)` + `prefetchQuery` bez čekanja.
- Mock rute provjeravaju ulogu i vlasništvo i validiraju istom funkcijom kao forma.
- Dopuni `docs/entities.md` (entitet, polja, rute, prava, pravila) i, ako ima novih obrazaca, `DESIGN.md`.

## Završetak

Pokreni `npm run check`. Ispravi sve greške. Vrati: spisak fajlova, rute (UI i API), šta nije urađeno i pretpostavke.
