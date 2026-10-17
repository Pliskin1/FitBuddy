# Kako radimo na FitBuddy-ju

## Prvi put

1. `git clone https://github.com/<korisnik>/FitBuddy.git && cd FitBuddy`
2. `npm install`
3. `npm run dev` → http://localhost:5173 (demo nalozi su u `README.md`)
4. Pročitaj `CLAUDE.md`, `DESIGN.md` i dio `SPEC.md` na kom radiš.

## Grane i pull requestovi

- `main` je uvijek ispravan: build prolazi, aplikacija radi.
- Za svaki zadatak nova grana iz `main`: `feat/klijenti-pretraga`, `fix/termini-preklapanje`, `docs/entities-mjerenja`.
- Male, česte izmjene; jedan PR = jedna funkcionalnost ili ispravka.
- Prije PR-a: `npm run check` (tipovi, format, build) i provjera u pregledaču na **375 px** i **1440 px**.
- U opisu PR-a: šta je urađeno, kako se provjerava (koji nalog, koji ekran), snimak ekrana za UI izmjene.
- Bar jedna osoba pregleda PR prije spajanja.

## Pravila koda (ukratko)

Detaljno u `.claude/rules/`. Najvažnije:

- novi entitet = novi feature u `frontend/src/features/<ime>/` (vidi `.claude/skills/add-feature/SKILL.md`);
- podaci samo kroz hookove iz `api/*.queries.ts`, nikad `fetch` iz komponente;
- svaki ekran ima loader, grešku i prazno stanje;
- boje, razmaci i oblici samo iz tokena (`DESIGN.md`);
- izmjena tipa ili API rute → izmjena `docs/entities.md` u istom commitu.

Commit poruke i komentari: `docs/COMMENTS.md`.

## Rad sa Claude Code-om

U repozitorijumu je sve što Claude Code treba:

| Šta                  | Gdje                 | Upotreba                                                                |
| -------------------- | -------------------- | ----------------------------------------------------------------------- |
| Uputstvo za projekat | `CLAUDE.md`          | učitava se automatski                                                   |
| Pravila koda         | `.claude/rules/*.md` | učitavaju se automatski (neka samo za određene putanje)                 |
| Komande              | `.claude/commands/`  | `/new-feature`, `/new-screen`, `/check`, `/sync-entities`, `/review-ui` |
| Agenti               | `.claude/agents/`    | `feature-builder`, `ui-reviewer`, `api-contract-keeper`                 |
| Skillovi             | `.claude/skills/`    | `add-feature`, `mock-api`, `loading-states`                             |
| Promptovi            | `PROMPTS.md`         | gotovi promptovi za dizajn, specifikaciju i kod                         |

Lična podešavanja Claude Code-a idu u `.claude/settings.local.json` (git ga ignoriše).
