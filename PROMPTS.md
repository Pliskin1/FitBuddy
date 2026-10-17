# FitBuddy – promptovi

Promptovi kojima je napravljena specifikacija i dizajn, i gotovi promptovi za nastavak rada sa AI asistentom (Claude ili drugi).

---

## 1. Kako koristiti

- **Novi razgovor počni kontekst promptom** (sekcija 2), da asistent zna o čemu se radi.
- **Jedan prompt = jedna stvar**: jedan ekran, jedan modul ili jedna odluka.
- **Pozivaj se na sekcije iz SPEC.md**, npr. „prema sekciji 12.3”.
- **Odluke upisuj u SPEC.md.** Kad nešto dogovorite, traži od asistenta da ažurira specifikaciju.
- **Dizajn mijenjaj na postojećem platnu**, da ostane jedno mjesto istine za izgled.
- Uglaste zagrade `[...]` u promptovima zamijeni svojim sadržajem.

---

## 2. Kontekst prompt (zalijepi na početku razgovora)

```
Radimo na aplikaciji FitBuddy, platformi koja povezuje personalne trenere i njihove klijente.
Uloge: Admin, Trener, Klijent.
Moduli: zakazivanje termina, jelovnik koji trener određuje klijentu, mjerenja (težina, obimi tijela, koraci), tabela vježbi sa praćenjem napretka (težina, ponavljanja), prijava i registracija (klijenti samo preko pozivnice trenera) i admin panel.

Specifikacija je u fajlu SPEC.md – pročitaj je cijelu prije rada.
Kod je u frontend/ (React + TypeScript + mock API); arhitektura i pravila su u CLAUDE.md i .claude/rules/, API ugovor u docs/entities.md.
Dizajn je na platnu: https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N (izvorni fajlovi su u folderu design/).

Vizuelni identitet: Grafit #121A16, Limeta #C5F04A (jedini akcenat, uvijek sa tamnim tekstom), Kreda #F1F3F0 (pozadina), Bijela #FFFFFF (kartice), Kamen #4E5953 (sekundarni tekst), Linija #DCE1DD (okviri).
Fontovi: Barlow Condensed za brojeve i naslove, Barlow za tekst. Dodirne površine najmanje 44 px.
Klijent koristi mobilni prikaz, trener i admin web prikaz.

Piši na crnogorskom jeziku (ijekavica, latinica).
```

---

## 3. Promptovi koji su doveli do trenutnog stanja

Hronološki, onako kako su napisani.

**1. Razrada ideje** → razrada modula, uloga, modela podataka i faza razvoja.

```
Razradi mi sledeću ideju za aplikaciju.
Ne kodiraj ništa.

Aplikacija bi se zvala FitBuddy

1. Zakazivanje termina treninga,
2. Jelovnik koji trener određuje klijentu,
3. Razna mjerenja (br. koraka, dimenzije tjela)
4. Tabela vježbi đe bi se pratio napredak (težina , br ponavljanja).

Aplikaciju bi napravili tako da postoje dvije role (Trener, Klijent).
```

**2. Specifikacija i prvi dizajn** → `SPEC.md`, vizuelni identitet, 5 mobilnih ekrana klijenta i 2 web ekrana trenera.

```
Može sačuvaj je u SPEC fajlu i predloži mi potencijalni dizajn aplikacije.
```

**3. Prijava, registracija i administracija** → 3 dijagrama, ekrani prijave i registracije, uloga Admin, admin panel i sekcija 12 u specifikaciji.

```
Dodaj još login i registraciju u dizajnu i osmisli kako bi taj proces radio logički
```

```
Takođe kako bih upravljao trenere i korisnike u aplikaciji
```

**4. Paket za saradnju** → ovaj fajl, `README.md`, folder `design/` i timski vodič.

```
Pomozi mi da eksportujem ovaj dizajn i promptove kako bi mogao da sarađujem sa drugim kolegama
```

**5. Frontend u kodu** → monorepo, `frontend/` (React + TypeScript + mock API), tri feature-a sa vezama, loaderi, `CLAUDE.md`, `DESIGN.md`, `docs/entities.md`, `.claude/` (rules, agents, commands, skills) i lokalni git.
Uz prompt je priložena slika zadatka sa radionice: 2–3 entiteta sa vezom u `frontend/src/features/`; ekrani početna, lista + filter, detalj, forma, prijava; mock podaci kroz `api/` folder svakog feature-a sa TypeScript tipovima; `DESIGN.md` + tokeni, responsive 375 i 1440 px; repo na GitHub-u i `docs/entities.md` za backend.

```
Danas radimo samo frontend.
U nastavku ti dostavljam instrukcije po kojima je potrebno napraviti riješenje u kodu.
Izostavi registraciju i login obzirom da nemamo bazupodataka.
Napravi mockup ruta i api poziva.
Prilikom učitavanja stranice koristi loadere za podatke kako korisnik ne bi vidio praznu stranicu.
Takođe koristi TypeScript.
Sve što je potrebno upiši u MD fajlove (Claude, Design, Skills, Comments, Agents, Commands, Rules itd)
Neka bude monorepo cijeli projekat u jednom repozitorijumu.
Kreiraj lokalno git, kako bi ka kasnije koristili na GitHUB-u.
```

```
Call the repository FitBuddy
```

```
Ubaci login stranicu na početku aplikacije.
Kako nemamo bazu neka prihvata sledeće kredencijale.
Za rolu trenera: Username: trener, Password: trener123
Za rolu klijenta: Username: klijent, Password: klijent123
```

---

## 4. Nastavak dizajna

**Novi ekran**

```
Na FitBuddy platnu (https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N) dodaj ekran [NAZIV] za ulogu [Klijent / Trener / Admin].
Prati postojeći vizuelni identitet i raspored sličnih ekrana.
Prije crtanja ukratko opiši šta ekran prikazuje i koje akcije nudi, prema SPEC.md sekciji [BROJ].
```

Ekrani koji još nedostaju:

- Kalendar trenera (sedmični prikaz termina)
- Editor programa treninga
- Editor plana ishrane i šabloni
- Biblioteka vježbi i baza namirnica
- Podešavanja klijenta (povlačenje saglasnosti, izvoz i brisanje naloga)
- Obavještenja
- Zaboravljena lozinka i unos nove lozinke
- Admin: dnevnik aktivnosti

**Izmjena postojećeg ekrana**

```
Na ekranu [NAZIV] na FitBuddy platnu promijeni [ŠTA I KAKO].
Ne diraj ostale ekrane. Ako izmjena mijenja logiku aplikacije, ažuriraj i SPEC.md.
```

**Provjera dosljednosti**

```
Pregledaj sve ekrane na FitBuddy platnu i nađi nedosljednosti: različite nazive za istu stvar, podatke koji se ne poklapaju između ekrana, dugmad bez jasne akcije i manjak praznih stanja ili poruka o grešci. Vrati listu, bez izmjena.
```

---

## 5. Specifikacija

**Otvorena pitanja**

```
Pročitaj SPEC.md, sekciju 10 (otvorena pitanja). Za svako pitanje predloži moguće odgovore sa prednostima i manama i preporuči jedan.
Kad potvrdim odluke, upiši ih u SPEC.md uz datum.
```

**Korisničke priče**

```
Za modul [NAZIV MODULA] iz SPEC.md napiši korisničke priče u obliku
„Kao [uloga], želim [akcija], da bih [cilj]”, sa kriterijumima prihvatanja za svaku.
Označi koje ulaze u MVP (SPEC.md, sekcija 8).
```

**Kritički pregled**

```
Pregledaj SPEC.md kao iskusan product manager. Nađi kontradikcije, slučajeve koji nedostaju (greške, prazna stanja, dozvole po ulogama) i nejasna pravila.
Vrati listu poređanu po važnosti, bez mijenjanja fajla.
```

---

## 6. Kodiranje

Frontend već postoji (`frontend/`, vidi `CLAUDE.md`). U Claude Code-u su spremne komande `/new-feature`, `/new-screen`, `/check`, `/sync-entities` i `/review-ui`.

**Novi feature u postojećem frontendu**

```
/new-feature exercises Biblioteka vježbi trenera: naziv, mišićna grupa, oprema, link na video. Samo trener. Lista sa pretragom i filterom po grupi, detalj i forma.
```

**Backend po ugovoru**

```
Napravi backend u folderu backend/ ovog monorepa koji implementira tačno rute, statuse i pravila iz docs/entities.md (uključujući uloge, 401/403/409/422 i oblik fieldErrors).
Prvo predloži tehnologije i šemu baze, pa čekaj potvrdu prije koda.
```

**Šema baze podataka**

```
Na osnovu SPEC.md, sekcija 5 i 12.8, napravi šemu baze za [IZABRANA BAZA]: tabele, kolone, tipove, veze i indekse.
Objasni kako se sprovodi pravilo da trener vidi samo svoje klijente, a admin ne vidi zdravstvene podatke.
```

**Podjela MVP-a na zadatke**

```
Podijeli MVP iz SPEC.md (sekcija 8, faza 1) na zadatke od najviše jednog dana rada, sa redoslijedom i zavisnostima, tako da više ljudi može raditi paralelno.
```

**Implementacija jedne funkcionalnosti**

```
Implementiraj [FUNKCIONALNOST] prema SPEC.md, sekcija [BROJ], sa izgledom kao na ekranu [NAZIV] sa platna.
Prvo napiši kratak plan i testove za glavne slučajeve, pa onda kod.
```

Primjer za prijavu: _„Implementiraj prijavu prema SPEC.md, sekcija 12.1, sa izgledom kao na ekranu Prijava. Testovi: tačni podaci, pogrešna lozinka, zaključavanje posle 5 pokušaja, nepotvrđen email, suspendovan nalog, preusmjeravanje po ulozi.”_

---

## 7. Pravila za tim

1. **SPEC.md** je jedino mjesto istine za logiku, a **platno** za izgled.
2. Svaka odluka se upisuje u SPEC.md, uz datum.
3. Komentare na dizajn ostavljajte direktno na ekranu na platnu.
4. Kad se dizajn promijeni, izvezite ga ponovo u folder `design/`, da git prati izmjene.
