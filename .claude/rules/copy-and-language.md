# Jezik i tekst u aplikaciji

- UI tekst, poruke grešaka iz mock API-ja, komentari i dokumentacija su na **crnogorskom, ijekavica, latinica**: „mjerenje”, „sjutra”, „uvijek”, „vrijeme”, „trenutak”.
- Imena u kodu (promjenljive, funkcije, fajlovi, ključevi API-ja) su na **engleskom**. Rute u URL-u su na crnogorskom (`/trener/termini/novi`) i definišu se samo u `shared/config/paths.ts`.
- **Rodno neutralno:** „Novi klijent je sačuvan”, „Još nema mjerenja”, „Zahtjev je poslat treneru”. Izbjegavaj oblike sa kosom crtom („dodat/a”).
- Obraćanje korisniku na „ti”: „Prijavi se”, „Izaberi klijenta”.
- Dugme kaže šta radi: „Zakaži termin”, „Sačuvaj izmjene”, „Pošalji zahtjev”, „Obriši mjerenje”. Ne „OK”, „Pošalji” bez objekta, „Klikni ovdje”.
- Greška kaže šta nije u redu i kako dalje, bez izvinjavanja: „Email nije ispravan, npr. ime@primjer.com.”
- Prazno stanje kaže šta bi tu stajalo i nudi akciju: „Još nema klijenata – dodaj prvog…”.
- Formatiranje isključivo kroz `shared/lib/format.ts`: datumi „17. oktobar 2026.” / „17.10.2026.”, vrijeme „18:00”, brojevi „78,4”, „8.500”, znak minus `−`, množina preko `pluralize` („1 termin”, „3 termina”, „5 klijenata”).
