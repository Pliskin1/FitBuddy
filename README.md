# FitBuddy

Platforma koja povezuje personalne trenere i njihove klijente: zakazivanje termina, mjerenja i napredak klijenata, a u narednim fazama jelovnici i programi treninga.

**Repozitorijum:** `FitBuddy` – monorepo (trenutno `frontend/`, kasnije i `backend/`).
**Stanje (17. 10. 2026):** frontend v0.1 sa mock API-jem. Pravi backend i baza još ne postoje.

## Brzi start

Potreban je Node.js 20.19 ili noviji.

```bash
npm install
npm run dev
```

Otvori http://localhost:5173 i prijavi se jednim od demo naloga:

| Uloga   | Korisničko ime | Lozinka      | Šta vidi                                                                              |
| ------- | -------------- | ------------ | ------------------------------------------------------------------------------------- |
| Trener  | `trener`       | `trener123`  | kontrolnu tablu, sve klijente, termine i mjerenja                                     |
| Klijent | `klijent`      | `klijent123` | svoju početnu, svoje termine (i zahtjeve za termin), mjerenja i profil (Ana Petrović) |

Demo podaci se generišu u odnosu na današnji dan i čuvaju u pretraživaču. Dugme **„Vrati demo podatke”** ih vraća na početne.

## Šta je napravljeno

| Ekran                  | Trener                                                                                                   | Klijent                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Prijava                | ✓ (zajednička, sa zaključavanjem posle 5 pogrešnih pokušaja)                                             | ✓                                          |
| Početna                | kontrolna tabla: brojke, današnji termini, „Zahtijeva pažnju”, posljednja mjerenja                       | sljedeći termin, napredak, naredni termini |
| Lista + filter         | klijenti (pretraga, cilj, status), termini (period, status, klijent), mjerenja (klijent, period)         | moji termini, moja mjerenja                |
| Detalj                 | klijent (profil, grafikon napretka, naredni termini), termin (potvrda, završetak, otkazivanje, brisanje) | termin (otkazivanje 24 h unaprijed)        |
| Forma (novo / izmjena) | klijent, termin (bez preklapanja), mjerenje                                                              | zahtjev za termin, mjerenje                |

Entiteti sa vezama: **Client** ← **Appointment** (N:1), **Client** ← **Measurement** (N:1), **User** → **Client** (klijentski nalog). Detalji: [docs/entities.md](docs/entities.md).

Svaki ekran prikazuje loader istog oblika kao sadržaj dok podaci stižu (skeleton), poruku sa „Pokušaj ponovo” kad nešto ne uspije i prazno stanje sa akcijom. Raspored je prilagođen za 375 px (telefon, donja navigacija) i 1440 px (desktop, bočni meni).

## Tehnologije

React 19 · TypeScript 5.9 · Vite 6 · React Router 7 (data router, loaderi, lazy rute) · TanStack Query 5 · MSW 2 (mock API) · CSS Modules + dizajn tokeni · Prettier.

## Struktura

```
FitBuddy/
├─ frontend/          aplikacija (src/app, src/features/<entitet>, src/shared, src/mocks, src/styles)
├─ docs/              entities.md (API ugovor za backend), COMMENTS.md (komentari, commit poruke)
├─ design/            izvoz ekrana sa dizajnerskog platna (referenca)
├─ .claude/           pravila, agenti, komande i skillovi za Claude Code
├─ CLAUDE.md          uputstvo za Claude Code (arhitektura, komande, pravila)
├─ DESIGN.md          dizajn sistem i tokeni
├─ SPEC.md            specifikacija aplikacije
├─ PROMPTS.md         promptovi za rad sa AI asistentom
└─ CONTRIBUTING.md    kako radimo kao tim (git, grane, provjere)
```

## Komande

| Komanda             | Šta radi                             |
| ------------------- | ------------------------------------ |
| `npm run dev`       | razvojni server sa mock API-jem      |
| `npm run typecheck` | TypeScript provjera                  |
| `npm run build`     | produkcijski build u `frontend/dist` |
| `npm run format`    | formatiranje (Prettier)              |
| `npm run check`     | sve provjere – pokreni prije commita |

## Mock API i prelazak na backend

API pozive presreće [MSW](https://mswjs.io) – rute su u `frontend/src/features/*/api/*.mock.ts` i ponašaju se kao pravi server (token, uloge, validacija, greške 401/403/404/409/422).
Kad backend bude spreman, u `frontend/.env.local` (uzor: `frontend/.env.example`):

```bash
VITE_USE_MOCKS=false
VITE_API_URL=https://api.primjer.com/api
```

Backend treba da ispuni ugovor iz [docs/entities.md](docs/entities.md).

## Linkovi

| Šta                                                               | Gdje                                              |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| Timski vodič (dizajn, specifikacija i promptovi na jednom mjestu) | https://claude.ai/artifact/YNHFNrEk85p2wiJw5NPKzG |
| Dizajn (platno sa svim ekranima)                                  | https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N |

> Linkovi su privatni dok ih vlasnik ne podijeli preko menija **Share**.

## Postavljanje na GitHub

Lokalni git repozitorijum već postoji (grana `main`). Na GitHub-u napravi prazan repozitorijum **FitBuddy** (bez README-a), pa:

```bash
git remote add origin https://github.com/<korisnik>/FitBuddy.git
git push -u origin main
```

Dalje radimo kroz grane i pull requestove – vidi [CONTRIBUTING.md](CONTRIBUTING.md).
