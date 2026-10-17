---
description: Dodaj novi ekran u postojeći feature, sa loaderom, stanjima i rutom
argument-hint: <feature> <ekran, npr. "kalendar sedmice za trenera">
---

Dodaj ekran: **$ARGUMENTS**

1. Pročitaj `DESIGN.md`, `.claude/rules/react-components.md` i postojeće stranice tog feature-a (`features/<feature>/pages/`) – novi ekran treba da izgleda i radi isto.
2. Ako ekran postoji na dizajnerskom platnu (`design/*.dc.html`), koristi ga kao referencu za raspored i tekst.
3. Napravi stranicu sa `PageHeader`, sva četiri stanja (skeleton → greška → prazno → podaci) i, ako ima filtere, filtere u URL-u.
4. Dodaj putanju u `shared/config/paths.ts`, rutu u `features/<feature>/routes.ts` sa `protect(role, …)` loaderom koji radi `prefetchQuery`, i stavku menija ako je ekran glavni.
5. Ako treba nova API ruta – dodaj je u `*.mock.ts`, `*.api.ts`, `*.queries.ts` i `docs/entities.md`.
6. Provjeri u pregledaču na 375 i 1440 px (bez vodoravnog skrola), pa pokreni `npm run check`.
