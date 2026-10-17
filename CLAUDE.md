# FitBuddy – uputstvo za Claude Code

FitBuddy povezuje personalnog trenera i njegove klijente: termini, mjerenja, napredak (kasnije i jelovnici i programi treninga).
Ovaj repozitorijum (**FitBuddy**) je monorepo; trenutno postoji samo frontend sa mock API-jem, backend dolazi kasnije.

Prije rada pročitaj:

- `SPEC.md` – šta aplikacija radi i zašto (uloge, moduli, pravila).
- `DESIGN.md` – vizuelni identitet, tokeni i obrasci UI-ja.
- `docs/entities.md` – entiteti i API ugovor (isti za mock i budući backend).
- `.claude/rules/` – pravila pisanja koda (učitavaju se automatski).

## Komande

```bash
npm install            # jednom, iz korijena repozitorijuma
npm run dev            # http://localhost:5173 (MSW mock API je uključen)
npm run typecheck      # TypeScript provjera
npm run build          # produkcijski build (uključuje typecheck)
npm run format         # Prettier
npm run check          # typecheck + format:check + build – pokreni prije svakog commita
```

## Demo nalozi (mock prijava)

| Uloga   | Korisničko ime | Lozinka      | Početna                   |
| ------- | -------------- | ------------ | ------------------------- |
| Trener  | `trener`       | `trener123`  | `/trener`                 |
| Klijent | `klijent`      | `klijent123` | `/klijent` (Ana Petrović) |

Nalozi su definisani samo u `frontend/src/features/auth/api/auth.accounts.ts`. Registracija ne postoji (nema baze).

## Struktura

```
FitBuddy/
├─ CLAUDE.md · DESIGN.md · SPEC.md · PROMPTS.md · README.md · CONTRIBUTING.md
├─ docs/            entities.md (API ugovor), COMMENTS.md (komentari i commit poruke)
├─ design/          izvezeni ekrani sa dizajnerskog platna (.dc.html) – samo referenca
├─ .claude/         rules/, agents/, commands/, skills/, launch.json
└─ frontend/        Vite + React 19 + TypeScript
   └─ src/
      ├─ main.tsx           pokreće MSW, pa tek onda App (redoslijed je bitan!)
      ├─ app/               App, router, layout (meni po ulozi)
      ├─ pages/             stranice koje spajaju više feature-a (početne, greške)
      ├─ features/<ime>/    jedan entitet = jedan feature
      │  ├─ types.ts        TypeScript tipovi entiteta (ugovor sa backendom)
      │  ├─ model/          labele, filteri (URL ↔ objekat), validacija, pretvaranje forme
      │  ├─ api/            *.api.ts (fetch pozivi), *.queries.ts (TanStack Query),
      │  │                  *.mock.ts (MSW rute), *.db.ts (mock tabela), *.seed.ts (demo podaci)
      │  ├─ components/     UI tog feature-a
      │  ├─ pages/          ekrani (lista + filter, detalj, forma)
      │  ├─ routes.ts       rute + loaderi (zaštita + prefetch)
      │  └─ index.ts        JAVNI API – drugi feature-i uvoze samo odavde
      ├─ shared/            api klijent, auth sesija, putanje, ui komponente, lib, hooks, mocks
      ├─ mocks/             spaja sve MSW handlere (browser.ts, handlers.ts)
      └─ styles/            tokens.css (dizajn tokeni), global.css
```

Feature-i: `auth` (prijava, uloge, zaštita ruta), `clients`, `appointments` (veza → client), `measurements` (veza → client).

## Kako teku podaci

```
Komponenta → hook (api/*.queries.ts) → api/*.api.ts → shared/api/client.ts (fetch /api, Bearer token)
           → MSW handler (api/*.mock.ts) → mock tabela (api/*.db.ts, čuva se u localStorage)
```

- **Loaderi i učitavanje:** svaka ruta ima `loader` koji (1) provjerava prijavu i ulogu (`protect`) i (2) pokreće `queryClient.prefetchQuery` bez čekanja. Stranica dok čeka prikazuje skeleton (`CardGridSkeleton`, `ListSkeleton`, `DetailSkeleton`, `FormSkeleton`, `TableSkeleton`). Pri prvom učitavanju vidi se `BootScreen`, pri promjeni rute tanka traka na vrhu. **Prazna stranica nikad.**
- **Mock API se ponaša kao backend:** provjerava token i ulogu (401/403), validira (422 sa `fieldErrors`), prijavljuje konflikte (409). Klijent uvijek dobija samo svoje podatke.
- **Prelazak na pravi backend:** `VITE_USE_MOCKS=false` i `VITE_API_URL=https://…` u `frontend/.env.local`. Komponente i hookovi se ne mijenjaju.
- **Demo podaci** se generišu relativno u odnosu na današnji dan; dugme „Vrati demo podatke” ih resetuje.

## Pravila koja se najčešće krše

1. Nikad `fetch` iz komponente – uvijek `api/*.api.ts` + hook iz `api/*.queries.ts`.
2. Nikad URL kao string u komponenti – koristi `paths` iz `shared/config/paths.ts`.
3. Nikad sirova boja ili px vrijednost koja postoji kao token – koristi `var(--…)` iz `styles/tokens.css`.
4. Svako stanje ima prikaz: učitavanje (skeleton), greška (`ErrorState` sa „Pokušaj ponovo”), prazno (`EmptyState` sa akcijom).
5. Feature uvozi drugi feature samo preko njegovog `index.ts`. Izuzetak: mock sloj (`*.mock.ts`) smije uvoziti `*.db.ts` i `auth.guard.ts` drugih feature-a.
6. Kad mijenjaš tip, mock rutu ili pravilo validacije – ažuriraj i `docs/entities.md`.
7. UI tekst je na crnogorskom (ijekavica), rodno neutralan; imena u kodu su na engleskom.
8. Prije commita: `npm run check`.

## Korisno

- Novi feature: komanda `/new-feature <ime>` ili skill `add-feature`.
- Provjera kvaliteta: komanda `/check`; pregled UI-ja: agent `ui-reviewer`.
- Usklađivanje API ugovora: komanda `/sync-entities` ili agent `api-contract-keeper`.
- Pokretanje u pregledaču Claude desktop aplikacije: `.claude/launch.json` (konfiguracija `frontend`).
