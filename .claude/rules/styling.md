---
paths:
  - 'frontend/src/**/*.css'
  - 'frontend/src/**/*.tsx'
---

# Stilovi

- CSS Modules (`Ime.module.css`) za komponente; globalno samo `styles/tokens.css` i `styles/global.css`.
- **Samo tokeni** iz `styles/tokens.css`: boje (`var(--text)`, `var(--surface)`…), razmaci (`var(--space-4)`), radijusi, visine kontrola. Nova vrijednost koja se ponavlja → novi token, opisan u `DESIGN.md`.
- Komponente koriste semantičke tokene (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`). Sirove `--color-*` samo za identitet (limeta na tamnom).
- Bez inline `style={{…}}` osim za vrijednosti koje se računaju u kodu (pozicija tooltipa, širina trake napretka).
- SVG boje preko CSS klasa ili `style`, ne preko atributa `fill="var(--…)"`.
- **Mobilno prvo:** osnovni stil je za 375 px; šire se dodaje sa `@media (min-width: 768px)` i `@media (min-width: 1024px)`.
- Raspored: flex/grid + `gap`, ne margine između sestrinskih elemenata. Grid kolone `minmax(0, 1fr)`, flex djeca sa tekstom `min-width: 0`.
- Stranica nikad ne skroluje vodoravno. Široka tabela ide u okvir sa `overflow-x: auto` **i** `position: relative`.
- Dodirne površine najmanje `var(--touch-min)` (44 px).
- Animacije su kratke (`--duration-fast`) i globalno se gase za `prefers-reduced-motion`.
- Status se nikad ne prikazuje samo bojom – uvijek ikona i tekst (`Badge` sa `icon`).
