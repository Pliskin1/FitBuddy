# Komentari u kodu i commit poruke

## Komentari u kodu

**Jezik:** komentari su na crnogorskom (kao i UI), imena u kodu na engleskom.

**Pišemo komentar kad objašnjava _zašto_, a ne _šta_:**

```ts
// ✅ Dobro – razlog koji se ne vidi iz koda
// App se uvozi tek posle MSW-a: ruter odmah pokreće loadere, a oni moraju naići na mock API.
const { App } = await import('@/app/App')

// ❌ Loše – ponavlja kod
// uvozi App
const { App } = await import('@/app/App')
```

**Gdje je komentar obavezan:**

- Na vrhu svakog `*.mock.ts`: spisak ruta koje fajl obrađuje i ko smije šta (ugovor iz `docs/entities.md`).
- Na vrhu `types.ts`: šta je entitet i sa čim je povezan.
- JSDoc (`/** … */`) iznad izvezenih komponenti, hookova i funkcija čije ime ne kaže sve.
- Uz svako poslovno pravilo i „magični” broj (24 h otkazivanje, 14 dana bez mjerenja, 5 pokušaja prijave) – i to kao imenovana konstanta.
- Uz namjerna odstupanja od pravila (npr. kad mock sloj uvozi `*.db.ts` drugog feature-a).

**Šta ne radimo:**

- Zakomentarisan kod – briše se, git pamti istoriju.
- `TODO` bez imena i razloga. Ako baš treba: `// TODO(ime): šta i zašto`, a bolje je otvoriti issue.
- Komentari koji opisuju promjenu („dodato zbog buga”) – to ide u commit poruku.

## Commit poruke

Format (Conventional Commits, opis na crnogorskom):

```
<tip>(<oblast>): <kratko, u sadašnjem vremenu, do ~70 znakova>

<opciono: zašto i šta, u par rečenica>
```

| Tip        | Kada                                 |
| ---------- | ------------------------------------ |
| `feat`     | nova mogućnost                       |
| `fix`      | ispravka greške                      |
| `refactor` | promjena koda bez promjene ponašanja |
| `style`    | samo izgled (CSS, tokeni)            |
| `docs`     | dokumentacija (MD fajlovi)           |
| `chore`    | podešavanja, zavisnosti, alati       |
| `test`     | testovi                              |

Oblasti: `clients`, `appointments`, `measurements`, `auth`, `ui`, `app`, `mocks`, `docs`, `repo`.

Primjeri:

```
feat(appointments): klijent može da otkaže termin 24 h unaprijed
fix(app): pokreni MSW prije rutera da prvi loader ne zaobiđe mock
docs(entities): opiši 409 za preklapanje termina
```

Jedan commit = jedna logička promjena. Prije commita: `npm run check`.
