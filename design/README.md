# FitBuddy – izvorni fajlovi dizajna

Ovo je izvezena kopija ekrana sa dizajnerskog platna:
**https://claude.ai/artifact/NBQ8KUF7ikNuRiDB1eKK4N**

> Platno je privatno dok ga vlasnik ne podijeli (meni **Share** na platnu).
> Za izvoz u slike ili PDF koristite opciju **Export** iz istog menija.

## Šta su ovi fajlovi

- `*.dc.html` – izvorni kod svakog ekrana u formatu _Design Component_. Platno ih prikazuje; **ne otvaraju se samostalno** u pretraživaču, jer im treba okruženje platna.
- `canvas.json` – raspored ekrana na platnu (pozicije, veličine, naslovi sekcija).

Služe kao rezervna kopija i za praćenje izmjena kroz git. Za pregled i komentare koristite link na platno.

## Spisak ekrana

| Fajl                           | Ekran                                              | Uloga   |
| ------------------------------ | -------------------------------------------------- | ------- |
| `Main.dc.html`                 | Vizuelni identitet (boje, tipografija, komponente) | –       |
| `Klijent-Pocetna.dc.html`      | Početna                                            | Klijent |
| `Klijent-Trening.dc.html`      | Trening danas (unos serija)                        | Klijent |
| `Klijent-Jelovnik.dc.html`     | Jelovnik                                           | Klijent |
| `Klijent-Termini.dc.html`      | Zakazivanje termina                                | Klijent |
| `Klijent-Mjerenja.dc.html`     | Mjerenja                                           | Klijent |
| `Trener-Kontrolna.dc.html`     | Kontrolna tabla                                    | Trener  |
| `Trener-Klijent.dc.html`       | Detalji klijenta i napredak                        | Trener  |
| `Tok-Prijava.dc.html`          | Dijagram: tok prijave                              | –       |
| `Tok-Registracija.dc.html`     | Dijagram: tok registracije                         | –       |
| `Auth-Prijava.dc.html`         | Prijava (sve uloge)                                | Sve     |
| `Klijent-Reg-Nalog.dc.html`    | Registracija 1/3 – nalog                           | Klijent |
| `Klijent-Reg-Profil.dc.html`   | Registracija 2/3 – profil i saglasnost             | Klijent |
| `Klijent-Reg-Mjerenja.dc.html` | Registracija 3/3 – početna mjerenja                | Klijent |
| `Trener-Poziv.dc.html`         | Pozovi klijenta                                    | Trener  |
| `Trener-Registracija.dc.html`  | Registracija trenera                               | Trener  |
| `Tok-Statusi.dc.html`          | Dijagram: statusi naloga                           | –       |
| `Admin-Korisnici.dc.html`      | Upravljanje korisnicima                            | Admin   |

## Vizuelni identitet ukratko

| Token  | Boja      | Upotreba                                  |
| ------ | --------- | ----------------------------------------- |
| Grafit | `#121A16` | tekst, tamni paneli, primarno dugme       |
| Limeta | `#C5F04A` | jedini akcenat (uvijek sa tamnim tekstom) |
| Kreda  | `#F1F3F0` | pozadina                                  |
| Bijela | `#FFFFFF` | kartice                                   |
| Kamen  | `#4E5953` | sekundarni tekst                          |
| Linija | `#DCE1DD` | okviri                                    |

Fontovi: **Barlow Condensed** (brojevi, naslovi) i **Barlow** (tekst). Detalji su u `SPEC.md`, sekcija 11.
