# FitBuddy – dizajn sistem

Izvor istine za izgled frontenda. Tokeni su u `frontend/src/styles/tokens.css`, komponente u `frontend/src/shared/ui/`.
Vizuelni prijedlog (platno sa svim ekranima): https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N – izvoz je u folderu `design/`.

## 1. Karakter

- **Brojevi su glavni.** Kilaže, ponavljanja, termini i koraci su ono što korisnik gleda – zato su krupni, u kondenzovanom fontu, sa tabularnim ciframa.
- **Jedan akcenat.** Limeta (`--color-lime`) označava glavnu akciju, aktivnu stavku menija i napredak. Ne koristi se za ukrase.
- **Mirna pozadina, jasne kartice.** Kreda pozadina, bijele kartice sa tankom linijom; tamni (grafit) paneli samo za istaknuto (bočni meni, sljedeći termin, brojka koja traži pažnju).
- **Palac na dohvat.** Klijent koristi telefon jednom rukom: dodirne površine najmanje 44 px, glavna navigacija dolje.

## 2. Tokeni

### Boje

| Token                     | Vrijednost            | Upotreba                                  |
| ------------------------- | --------------------- | ----------------------------------------- |
| `--color-ink` (Grafit)    | `#121A16`             | tekst, primarno dugme, tamni paneli       |
| `--color-lime` (Limeta)   | `#C5F04A`             | jedini akcenat – uvijek sa tamnim tekstom |
| `--color-chalk` (Kreda)   | `#F1F3F0`             | pozadina aplikacije (`--bg`)              |
| `--color-white`           | `#FFFFFF`             | kartice (`--surface`)                     |
| `--color-stone` (Kamen)   | `#4E5953`             | sekundarni tekst (`--text-muted`)         |
| `--color-line` (Linija)   | `#DCE1DD`             | okviri (`--border`)                       |
| `--color-line-soft`       | `#EEF1EF`             | razdjelnici u listama, pozadina skeletona |
| `--color-success` / `-bg` | `#1F7A45` / `#E6F2EA` | potvrđeno, aktivno                        |
| `--color-warning` / `-bg` | `#8F5207` / `#F8EEDC` | na čekanju, upozorenje                    |
| `--color-danger` / `-bg`  | `#B42318` / `#F8E4E2` | otkazano, greška, brisanje                |

Komponente koriste **semantičke tokene** (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--on-accent`). Sirove boje (`--color-*`) samo kad je boja dio identiteta (npr. limeta na tamnom panelu).
Statusne boje se **nikad ne pojavljuju same** – uvijek uz ikonu i tekst (`<Badge tone="warning" icon="clock">Na čekanju</Badge>`).

### Tipografija

| Token            | Font                     | Upotreba                                  |
| ---------------- | ------------------------ | ----------------------------------------- |
| `--font-display` | Barlow Condensed 600/700 | naslovi stranica, brojke, vremena termina |
| `--font-body`    | Barlow 400/500/600/700   | sav ostali tekst                          |

Skala: `--text-xs` 12 · `--text-sm` 14 · `--text-md` 16 · `--text-lg` 18 · `--text-xl` 22 · `--text-2xl` 32 · `--text-3xl` 40 · `--text-display` 52.
Naslov stranice (h1) je 32 px na telefonu, 40 px na desktopu. Brojevi u kolonama: `font-variant-numeric: tabular-nums` (klasa `.tabular`).

### Razmaci, oblici, kontrole

- Razmaci na mreži od 4 px: `--space-1` (4) … `--space-12` (48). Između sekcija stranice `--space-6`.
- Radijusi: `--radius-sm` 10 (polja), `--radius-md` 14 (dugmad), `--radius-lg` 20 (kartice, paneli), `--radius-pill` (bedževi).
- Visina kontrola: `--control-height` 48, mala `--control-height-sm` 38; minimalna dodirna površina `--touch-min` 44.
- Sjenke skoro ne koristimo: `--shadow-sm` na hover kartice, `--shadow-md` za toast.

### Raspored i prijelomne tačke

| Širina                              | Raspored                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| < 768 px (provjera na **375 px**)   | jedna kolona, gornja traka + **donja navigacija**, gutter 16 px                   |
| ≥ 768 px                            | gutter 24 px, mreže kartica prelaze u više kolona                                 |
| ≥ 1024 px (provjera na **1440 px**) | **bočni meni** 248 px, sadržaj do 1200 px, gutter 40 px, raspored `split` (2 : 1) |

Stranica **nikad ne skroluje vodoravno**. Široke tabele skroluju u svom okviru (`overflow-x: auto`, `position: relative`).

## 3. Komponente (`shared/ui`)

| Komponenta                                                                                                                     | Kada                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `Button`, `ButtonLink`                                                                                                         | akcija / navigacija; varijante `primary`, `accent` (jedna po ekranu – glavna akcija), `secondary`, `ghost`, `danger` |
| `ConfirmButton`                                                                                                                | nepovratne akcije (brisanje) – drugi klik potvrđuje                                                                  |
| `TextField`, `SelectField`, `TextareaField`                                                                                    | polja forme sa labelom, hintom i greškom                                                                             |
| `SearchInput`, `SegmentedControl`                                                                                              | filteri iznad liste                                                                                                  |
| `Badge`                                                                                                                        | statusi i oznake; statusi uvijek sa ikonom                                                                           |
| `Panel`                                                                                                                        | sekcija sa naslovom i opcionom akcijom                                                                               |
| `PageHeader`                                                                                                                   | h1, podnaslov, akcije, link nazad; postavlja i naslov taba                                                           |
| `StatCard`                                                                                                                     | jedna brojka na kontrolnoj tabli                                                                                     |
| `Avatar`                                                                                                                       | inicijali (dekorativno – ime uvijek stoji pored)                                                                     |
| `EmptyState`, `ErrorState`                                                                                                     | prazno stanje sa akcijom; greška sa „Pokušaj ponovo”                                                                 |
| `Skeleton` + `CardGridSkeleton`, `ListSkeleton`, `TableSkeleton`, `DetailSkeleton`, `FormSkeleton`, `PageLoader`, `BootScreen` | loaderi istog oblika kao sadržaj                                                                                     |
| `RefreshingIndicator`                                                                                                          | osvježavanje u pozadini (stari podaci ostaju vidljivi)                                                               |
| `ToastProvider` / `useToast`                                                                                                   | kratka potvrda posle akcije                                                                                          |
| `Icon`                                                                                                                         | ikone linijom 2 px; nova ikona se dodaje u `Icon.tsx`                                                                |

## 4. Obrasci

### Stanja ekrana (obavezno za svaki prikaz podataka)

1. **Učitavanje** – skeleton istog oblika kao sadržaj, unutar `LoadingRegion` (najava za čitač ekrana).
2. **Greška** – `ErrorState` sa porukom iz API-ja i dugmetom „Pokušaj ponovo”.
3. **Prazno** – `EmptyState` koji kaže šta bi ovdje stajalo i nudi akciju (npr. „Dodaj klijenta”).
4. **Podaci** – uz `RefreshingIndicator` dok se filter osvježava.

### Forme

- Labela iznad polja, „(opciono)” za neobavezna; greška ispod polja sa ikonom; fokus ide na prvo neispravno polje.
- Ista pravila validacije važe u formi i u mock API-ju (`model/validation.ts`).
- Dugme za slanje prikazuje „Čuvam…” i blokira se; poslije uspjeha toast i povratak na detalj.

### Liste

- Filteri u traci iznad liste i u URL-u (`?status=pending`), da se lista može podijeliti linkom.
- Termini su grupisani po danima („Danas”, „Sjutra”, „Ponedjeljak, 19. oktobar”).

### Grafikoni

- Jedna serija, linija 2,5 px u grafitu, svijetla površina ispod, posljednja tačka limeta sa vrijednošću.
- Crta se u pravim pikselima (čitljivo na 375 i 1440), hover pokazuje datum i vrijednost; `aria-label` opisuje trend.

## 5. Tekst

- Crnogorski, ijekavica, latinica: „sjutra”, „mjerenje”, „termin je potvrđen”.
- Rodno neutralno: „Novi klijent je sačuvan”, „Još nema mjerenja” (izbjegavati „dodat/a”).
- Dugme kaže šta se dešava: „Zakaži termin”, „Sačuvaj izmjene”, „Pošalji zahtjev”.
- Greška kaže šta nije u redu i kako dalje: „Termin se može otkazati najkasnije 24 h prije početka. Javi se treneru.”
- Datumi: „17. oktobar 2026.”, kratko „17.10.2026.”; brojevi: „78,4 kg”, „8.500 koraka”; znak minus `−`.

## 6. Pristupačnost

- Kontrast teksta najmanje 4,5 : 1 (svi tokeni teksta to ispunjavaju na `--bg` i `--surface`).
- Vidljiv fokus (`:focus-visible` – limeta-tamni prsten), link „Preskoči na sadržaj”.
- Prave `<button>`, `<a>`, `<label>`; ikonice bez teksta imaju `aria-label`.
- Animacije poštuju `prefers-reduced-motion`.
