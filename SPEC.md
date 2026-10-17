# FitBuddy – Specifikacija aplikacije

> Verzija 0.1 · 17.10.2026 · Status: nacrt (prije kodiranja)

---

## 1. Ukratko

FitBuddy je aplikacija koja povezuje personalnog trenera i njegove klijente na jednom mjestu.
Trener **planira** (termine, ishranu, treninge), a klijent **izvršava i bilježi** (mjerenja, odrađene serije),
pa obje strane vide napredak kroz vrijeme.

---

## 2. Role i dozvole

- **Odnos:** jedan trener → više klijenata; klijent (u MVP-u) ima jednog trenera.
- **Povezivanje:** trener šalje pozivni link/kod, klijent se registruje preko njega i automatski se veže za trenera.

| Oblast   | Trener                                                                              | Klijent                                                             |
| -------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Termini  | Podešava radno vrijeme, zakazuje, potvrđuje, otkazuje, vidi kalendar svih klijenata | Zakazuje u slobodne termine, otkazuje (po pravilu), vidi samo svoje |
| Jelovnik | Kreira, mijenja, dodjeljuje, pravi šablone                                          | Čita, označava pojedene obroke, ostavlja komentar                   |
| Mjerenja | Vidi mjerenja svojih klijenata, može unijeti, postavlja ciljeve                     | Unosi svoja mjerenja, vidi grafikone                                |
| Vježbe   | Pravi biblioteku vježbi i programe treninga                                         | Bilježi odrađene serije, vidi istoriju i rekorde                    |
| Klijenti | Dodaje/arhivira klijente, vidi profil                                               | Uređuje svoj profil                                                 |

**Pravilo bezbjednosti:** klijent vidi isključivo svoje podatke; trener vidi samo podatke klijenata koji su vezani za njega.

### Administrator (treća uloga)

Vlasnik platforme upravlja nalozima kroz poseban **admin panel** (detalji u sekciji 12).

- **Može:** odobriti ili odbiti nove trenere, suspendovati ili blokirati nalog, prebaciti klijente drugom treneru, poslati link za reset lozinke, izvesti ili obrisati podatke po GDPR zahtjevu, pregledati dnevnik aktivnosti.
- **Ne može:** vidjeti zdravstvene podatke klijenata (mjerenja, ishranu, povrede, fotografije) niti vidjeti ili postaviti tuđu lozinku.
- **Nalog:** nema javne registracije. Prvi admin se kreira pri instalaciji, ostale dodaje postojeći admin. 2FA je obavezna.

---

## 3. Moduli

### 3.1 Zakazivanje termina

- **Dostupnost trenera:** radni dani i sati, trajanje termina (npr. 60 min), pauza između termina, neradni dani / godišnji odmor.
- **Zakazivanje:** klijent bira iz liste slobodnih termina (sistem ih računa: dostupnost − zauzeti termini); trener može i sam zakazati klijentu.
- **Statusi:** `Na čekanju → Potvrđen → Završen / Otkazan / Nije se pojavio`
- **Pravila:**
  - otkazivanje najkasnije X sati prije (npr. 24h);
  - zabrana preklapanja termina;
  - zakazivanje najviše N dana unaprijed.
- **Ponavljajući termini:** npr. svaki ponedjeljak i četvrtak u 18h (većina klijenata ima fiksan raspored).
- **Prikaz:** trener – kalendar dan/sedmica/mjesec; klijent – lista „Moji naredni termini".
- **Podsjetnici:** 24h i 1h prije termina.
- **Veza sa treningom:** termin može nositi oznaku dana programa (npr. „Dan B – noge"), pa se iz termina direktno otvara unos serija.

### 3.2 Jelovnik (plan ishrane)

- **Struktura:** `Plan ishrane → Dan → Obrok (doručak, užina, ručak…) → Stavka (namirnica + količina)`
- **Automatski obračun:** kalorije i makronutrijenti (proteini, ugljeni hidrati, masti) po obroku i po danu, u odnosu na dnevni cilj koji trener postavi.
- **Baza namirnica:** trener unosi namirnice sa vrijednostima na 100 g; kasnije uvoz iz javne baze (npr. Open Food Facts).
- **Šabloni:** trener jednom napravi npr. „Redukcija 1800 kcal", dodijeli ga više klijenata i prilagodi pojedincu.
- **Zamjene:** uz stavku navesti alternativu (piletina ↔ ćuretina) – mnogo olakšava klijentu.
- **Klijent:** ekran „Danas jedem" – čekiranje pojedenog obroka, komentar.
- **Profil klijenta:** alergije, intolerancije, namirnice koje ne jede (trener ih vidi dok pravi plan).
- **Period važenja:** plan važi od–do, stari planovi ostaju u arhivi.

### 3.3 Mjerenja

| Kategorija | Mjere                                                |
| ---------- | ---------------------------------------------------- |
| Osnovno    | Težina (kg), % tjelesne masti (opciono)              |
| Obimi (cm) | Vrat, grudi, struk, kukovi, nadlaktica, butina, list |
| Aktivnost  | Broj koraka dnevno                                   |
| Opciono    | Fotografije napretka (sprijeda, bočno, otpozadi)     |

- **Ko unosi:** klijent sam, ali i trener (npr. kontrolno mjerenje na terminu). Čuva se datum i ko je unio.
- **Koraci:** MVP – ručni unos; kasnije sinhronizacija sa Google Fit / Health Connect / Apple Health (traži mobilnu aplikaciju).
- **Ciljevi:** npr. 10.000 koraka/dan, ciljana težina 75 kg – prikaz koliko je ostalo.
- **Prikaz:** grafikon kroz vrijeme po svakoj mjeri, poređenje „početak / sada" (npr. struk −6 cm), sedmični prosjek koraka.

### 3.4 Tabela vježbi i praćenje napretka

Srce aplikacije – razdvajaju se tri pojma:

1. **Biblioteka vježbi** – _šta postoji_: naziv, mišićna grupa, oprema, kratko uputstvo, link na video.
2. **Program treninga** – _šta je propisano_: program (npr. „Full body 3× sedmično") sa danima A/B/C; za svaku vježbu: serije, ponavljanja (ili raspon 8–12), ciljana težina, pauza, napomena.
3. **Dnevnik treninga** – _šta je stvarno urađeno_: po seriji se upisuje težina i broj ponavljanja (opciono RPE 1–10).

**Primjer tabele pri unosu:**

| Vježba      | Serija | Prošli put | Plan         | Danas        |
| ----------- | ------ | ---------- | ------------ | ------------ |
| Čučanj      | 1      | 60 kg × 10 | 62,5 kg × 10 | ___ kg × ___ |
| Čučanj      | 2      | 60 kg × 9  | 62,5 kg × 10 | ___ kg × ___ |
| Bench press | 1      | 50 kg × 8  | 50 kg × 10   | ___ kg × ___ |

Kolona **„Prošli put"** je ključna – klijent odmah vidi šta treba da nadmaši.

**Napredak:**

- Grafikon po vježbi: maksimalna težina, ukupni volumen (serije × ponavljanja × težina), procijenjeni 1RM (Epley: težina × (1 + ponavljanja / 30)).
- **Lični rekordi (PR)** – automatsko označavanje kad padne rekord.
- **Signal za trenera:** npr. 3 treninga zaredom bez napretka na vježbi → vrijeme za izmjenu programa.

---

## 4. Kontrolne table (početni ekrani)

**Trener:** današnji termini, zahtjevi na čekanju, klijenti kojima ističe plan, ko nije unio mjerenja ove sedmice, novi rekordi klijenata.

**Klijent:** sljedeći termin, današnji obroci, današnji trening, koraci danas vs. cilj, posljednja promjena težine.

---

## 5. Model podataka (koncept)

| Entitet                          | Ključni podaci                                   | Veze                                    |
| -------------------------------- | ------------------------------------------------ | --------------------------------------- |
| Korisnik                         | ime, email, lozinka, rola                        | –                                       |
| Profil klijenta                  | visina, datum rođenja, cilj, povrede, alergije   | pripada Korisniku, vezan za Trenera     |
| Dostupnost                       | dan u sedmici, od–do, trajanje termina           | pripada Treneru                         |
| Termin                           | početak, kraj, status, napomena                  | Trener, Klijent, (opciono) Dan programa |
| Namirnica                        | naziv, kcal / P / UH / M na 100 g                | kreira Trener                           |
| Plan ishrane → Obrok → Stavka    | naziv, period, cilj kcal / redoslijed / količina | Trener → Klijent ili šablon             |
| Mjerenje                         | tip, vrijednost, jedinica, datum, ko je unio     | Klijent                                 |
| Vježba                           | naziv, mišićna grupa, oprema, video              | Trener                                  |
| Program → Dan → Propisana vježba | serije, ponavljanja, težina, pauza               | Trener → Klijent                        |
| Trening sesija                   | datum, napomena                                  | Klijent, Dan programa, (opciono) Termin |
| Serija                           | redni broj, težina, ponavljanja, RPE             | Trening sesija, Vježba                  |

Mjerenje je generičko („tip + vrijednost"), pa se nove vrste mjerenja dodaju bez mijenjanja strukture.

---

## 6. Tipičan tok korišćenja

1. Trener se registruje, podesi radno vrijeme i doda osnovne vježbe i namirnice.
2. Pošalje pozivni link klijentu.
3. Klijent se registruje, popuni profil i unese početna mjerenja.
4. Trener mu dodijeli program treninga i plan ishrane (iz šablona, uz prilagođavanje).
5. Klijent zakaže termine (ili stalni ponavljajući termin).
6. Na terminu trener unosi serije; kad trenira sam, klijent sam bilježi trening i obroke.
7. Klijent sedmično unosi težinu i obime, a korake svakodnevno.
8. Posle mjesec dana trener gleda grafikone i koriguje ishranu ili program.

---

## 7. Spisak ekrana

- **Zajednički:** Prijava, Registracija (preko poziva), Profil, Obavještenja.
- **Trener:** Kontrolna tabla, Lista klijenata, Detalji klijenta (tabovi: _Termini / Ishrana / Mjerenja / Trening / Napredak_), Kalendar, Podešavanje dostupnosti, Biblioteka vježbi, Baza namirnica, Editor programa, Editor plana ishrane, Šabloni.
- **Klijent:** Početna, Moji termini + zakazivanje, Jelovnik (danas / sedmica), Trening danas (unos serija), Mjerenja (unos + grafikoni), Napredak (rekordi, grafikoni po vježbi).

---

## 8. Faze razvoja

| Faza        | Sadržaj                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 – MVP** | Registracija + role + poziv, termini (bez ponavljanja), ručni jelovnik, ručna mjerenja + osnovni grafikon, programi i dnevnik treninga sa kolonom „prošli put" |
| **2**       | Ponavljajući termini, podsjetnici (email/push), šabloni, PR i 1RM, fotografije napretka, upozorenja na kontrolnoj tabli                                        |
| **3**       | Mobilna aplikacija i sinhronizacija koraka, chat trener–klijent, uvoz namirnica iz javne baze, grupni treninzi, paketi termina (npr. „preostalo 4 od 12")      |

---

## 9. Tehničke napomene

- **Platforma:** za početak responsive web aplikacija (radi i na telefonu), eventualno PWA; native mobilna tek kad zatreba sinhronizacija koraka.
- **Autorizacija:** provjera role i vlasništva nad podacima na serveru za svaki zahtjev – ne samo sakrivanje dugmadi u interfejsu.
- **Termini:** preklapanje i vremenske zone rješavati na serveru (da dva klijenta ne uzmu isti termin istovremeno).
- **Osjetljivi podaci:** težina, povrede i fotografije su zdravstveni podaci → saglasnost, mogućnost brisanja naloga i izvoza podataka (GDPR).

---

## 10. Otvorena pitanja (odlučiti prije kodiranja)

1. Može li klijent imati više trenera (npr. trener + nutricionista)?
2. Potvrđuje li trener svaki zakazani termin ili je potvrda automatska?
3. Samo individualni ili i grupni treninzi?
4. Samostalni treneri ili teretana sa više trenera?
5. Plaćanja / paketi termina u aplikaciji – da ili ne?
6. Web, mobilna ili oboje?

---

## 11. Dizajn (prijedlog v0.1)

**Mockup:** https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N (privatan dok se ne podijeli preko menija Share)

### Pristup po rolama

- **Klijent → mobilni prikaz** (390 px): aplikaciju koristi u teretani i kod kuće, jednom rukom. Donja navigacija sa 5 tabova: _Početna · Trening · Jelovnik · Termini · Mjerenja_.
- **Trener → web / desktop prikaz** (1440 px): planira za stolom, treba mu pregled više klijenata. Lijevi meni + sadržaj; na telefonu se meni slaže iznad sadržaja.

### Vizuelni jezik

| Token                           | Vrijednost                        | Upotreba                                                                    |
| ------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Grafit                          | `#121A16`                         | tekst, tamni paneli, primarno dugme                                         |
| Limeta                          | `#C5F04A`                         | jedini akcenat: napredak, rekordi, glavna akcija (uvijek sa tamnim tekstom) |
| Kreda                           | `#F1F3F0`                         | pozadina aplikacije                                                         |
| Bijela                          | `#FFFFFF`                         | kartice                                                                     |
| Kamen                           | `#4E5953`                         | sekundarni tekst                                                            |
| Linija                          | `#DCE1DD`                         | okviri, mreža grafikona                                                     |
| Potvrđen / Na čekanju / Otkazan | `#1F7A45` / `#8F5207` / `#B42318` | statusi termina, uvijek uz ikonu i tekst                                    |

- **Fontovi:** _Barlow Condensed_ za brojeve i naslove (kilaže, ponavljanja, kalorije), _Barlow_ za tekst – oba podržavaju č, ć, š, ž, đ.
- **Oblici:** kartice sa zaobljenjem 18–20 px, dugmad 12–14 px; dodirne površine najmanje 44 px.
- **Grafikoni:** jedna boja (grafit), tanka linija 2 px, posljednja tačka istaknuta limetom i direktno označena vrijednošću.

### Nacrtani ekrani

| Rola    | Ekran                   | Ključni detalj                                                                                                                   |
| ------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Klijent | Početna                 | sljedeći termin, koraci, težina, trening danas, obroci                                                                           |
| Klijent | Trening danas           | tabela serija sa kolonom „Prošli put", tajmer pauze, obavještenje o rekordu                                                      |
| Klijent | Jelovnik                | izbor dana, kcal i makronutrijenti, obroci sa zamjenama, „Označi kao pojedeno"                                                   |
| Klijent | Zakazivanje             | izbor dana i slobodnog termina, ponavljanje svake sedmice, pravilo otkazivanja                                                   |
| Klijent | Mjerenja                | grafikon težine sa ciljem, obimi u odnosu na početak, koraci po danima                                                           |
| Trener  | Kontrolna tabla         | brojke dana, današnji termini sa potvrdom, „Zahtijeva pažnju", novi rekordi, lista klijenata                                     |
| Trener  | Detalji klijenta        | profil (alergije, povrede), grafikon napretka po vježbi (maks. težina / volumen / 1RM), posljednji trening uporedo sa prethodnim |
| Sve     | Prijava                 | jedan ekran za sve uloge, stanja greške i zaključavanja                                                                          |
| Klijent | Registracija 1–3        | nalog iz pozivnice → profil i saglasnost → početna mjerenja                                                                      |
| Trener  | Registracija            | forma → potvrda emaila → čekanje odobrenja                                                                                       |
| Trener  | Pozovi klijenta         | pozivnica na email ili kod/link, lista poslatih pozivnica                                                                        |
| Admin   | Upravljanje korisnicima | tabovi Na čekanju / Treneri / Klijenti, detalji i akcije                                                                         |
| –       | Dijagrami               | tok prijave, tok registracije, statusi naloga                                                                                    |

---

## 12. Prijava, registracija i upravljanje nalozima

### 12.1 Prijava (isti ekran za sve uloge)

1. Korisnik unosi email i lozinku.
2. **Podaci netačni** → poruka „Pogrešan email ili lozinka” (ne otkriva da li email postoji). Posle 5 grešaka prijava je zaključana 15 min i šalje se link za reset.
3. **Email nije potvrđen** → ekran „Potvrdi email” sa dugmetom za ponovno slanje.
4. **Status naloga:**
   - _na čekanju_ (novi trener) → ekran „Nalog čeka odobrenje”;
   - _suspendovan / blokiran_ → poruka sa razlogom i kontaktom podrške;
   - _aktivan_ → dalje po ulozi.
5. **Uloga:**
   - Admin → 2FA kod → admin panel;
   - Trener → kontrolna tabla (prvi put: podešavanje radnog vremena);
   - Klijent → početna (prvi put: profil i saglasnost).

- „Zapamti me” = sesija 30 dana; inače sesija ističe zatvaranjem aplikacije.

### 12.2 Registracija trenera

`Forma (ime, email, lozinka, grad, teretana, sertifikat) → potvrda emaila (link 24 h) → status „na čekanju” → admin odobrava ili odbija → email sa odlukom → prva prijava → radno vrijeme → kontrolna tabla`

- Admin dobija obavještenje o svakom novom zahtjevu; odobrenje je moguće tek kad je email potvrđen.
- Odbijanje uvijek ide uz razlog koji trener dobija emailom.

### 12.3 Poziv i registracija klijenta

1. Trener šalje pozivnicu **na email** ili pravi **kod/link** (za slanje porukom).
2. Pozivnica je jednokratna, vezana za trenera (i email), važi 7 dana. Statusi: _poslata → prihvaćena / istekla / opozvana_. Trener može ponovo poslati, opozvati ili obnoviti pozivnicu.
3. Klijent otvara link ili unosi kod → sistem provjerava pozivnicu (nevažeća → poruka „zamoli trenera za novu”).
4. **Korak 1 – nalog:** ime, lozinka, prihvatanje uslova. Email iz pozivnice je zaključan i smatra se potvrđenim; kod ulaska preko koda email se unosi i potvrđuje linkom.
5. **Korak 2 – profil:** datum rođenja, visina, cilj, povrede, alergije + **obavezna saglasnost** za obradu zdravstvenih podataka.
6. **Korak 3 – početna mjerenja:** težina, obimi, cilj koraka; može se preskočiti.
7. Klijent ulazi na početnu, trener dobija obavještenje.

- **Email već ima nalog** → klijent se prijavljuje i potvrđuje prelazak kod novog trenera (stari trener gubi pristup novim podacima).

### 12.4 Zaboravljena lozinka

`„Zaboravljena lozinka?” → unos emaila → uvijek ista poruka („ako nalog postoji, poslali smo link”) → link važi 1 h, jednokratan → nova lozinka → odjava sa svih uređaja → prijava`

### 12.5 Statusi naloga

| Nalog   | Statusi                                                                      | Ko mijenja                                                       |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Trener  | na čekanju → aktivan ⇄ suspendovan; na čekanju → odbijen; aktivan → obrisan  | admin (brisanje može zatražiti i sam trener)                     |
| Klijent | pozvan → aktivan ⇄ arhiviran; aktivan ⇄ blokiran; pozvan → pozivnica istekla | trener arhivira/vraća, admin blokira                             |
| Svi     | → obrisan (GDPR)                                                             | korisnik ili admin; podaci se čuvaju 30 dana, zatim trajno brišu |

- **Arhiviran klijent** vidi svoju istoriju, ali ne dobija nove planove.
- **Suspendovan trener:** njegovi klijenti vide obavještenje, podaci ostaju netaknuti; admin ih može prebaciti drugom treneru.

### 12.6 Admin panel

- **Pregled brojki:** aktivni treneri, zahtjevi na čekanju, aktivni klijenti, suspendovani/blokirani.
- **Tab „Na čekanju”:** novi treneri sa sertifikatom; akcije _Odobri_, _Odbij uz razlog_, _Zatraži dodatne podatke_.
- **Tab „Treneri”:** status, broj klijenata, zadnja prijava; akcije _Suspenduj / Aktiviraj_, _Reset lozinke_, _Prebaci klijente_, _Obriši (GDPR)_.
- **Tab „Klijenti”:** trener, status, zadnja prijava; akcije _Promijeni trenera_, _Reset lozinke_, _Blokiraj / Odblokiraj_, _Izvezi podatke_, _Obriši (GDPR)_.
- **Dnevnik aktivnosti:** svaka promjena statusa i svaka admin akcija (ko, kada, šta, razlog).
- **Podešavanja:** dodavanje admina, uključivanje automatskog odobravanja trenera (opciono).

### 12.7 Sigurnost

- Lozinke samo heširane (Argon2 ili bcrypt), najmanje 8 znakova i jedan broj.
- Tokeni za potvrdu emaila, reset i pozivnice: nasumični, jednokratni, sa rokom važenja; u bazi se čuva samo njihov heš.
- Ograničenje pokušaja prijave (5 grešaka → 15 min), obavezna 2FA za admina.
- Provjera uloge i vlasništva na serveru za svaki zahtjev; admin rute odvojene i dodatno zaštićene.

### 12.8 Dopune modela podataka

| Entitet            | Ključni podaci                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Korisnik (dopuna)  | rola (admin / trener / klijent), status, email_potvrđen, 2FA tajna (admin), zadnja prijava |
| Profil trenera     | grad, teretana, sertifikat (fajl), odobrio (admin), datum odobrenja, razlog odbijanja      |
| Pozivnica          | token (heš), trener, email ili kod, status, ističe, iskoristio (klijent)                   |
| Token              | vrsta (potvrda emaila / reset lozinke), korisnik, ističe, iskorišćen                       |
| Saglasnost         | korisnik, vrsta (zdravstveni podaci), datum davanja / povlačenja                           |
| Dnevnik aktivnosti | ko, akcija, nad kim, vrijeme, razlog                                                       |
