---
description: Napravi novi feature (entitet) u frontend/src/features po FitBuddy strukturi
argument-hint: <ime-feature-a> [kratak opis entiteta]
---

Napravi novi feature: **$ARGUMENTS**

1. Pročitaj `CLAUDE.md`, `.claude/skills/add-feature/SKILL.md` i dio `SPEC.md` / `docs/entities.md` koji opisuje ovaj entitet.
2. Prije koda napiši plan u 5–10 tačaka: polja i tipovi, veze sa postojećim entitetima, API rute, prava po ulozi (trener/klijent), ekrani (lista + filter, detalj, forma) i putanje. Ako nešto nije definisano u specifikaciji, izaberi razumno rješenje i navedi ga kao pretpostavku.
3. Implementiraj tačno po skill-u `add-feature` (redoslijed fajlova, loaderi, mock rute sa provjerom uloge, validacija dijeljena između forme i mock-a).
4. Dopuni `docs/entities.md` i, ako treba, `DESIGN.md` i meni u `src/app/layout/navigation.ts`.
5. Pokreni `npm run check` i ispravi greške.
6. Na kraju: spisak novih fajlova, nove rute, šta nije urađeno.
