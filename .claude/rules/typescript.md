---
paths:
  - 'frontend/src/**/*.ts'
  - 'frontend/src/**/*.tsx'
---

# TypeScript

- `strict` je uključen. Nema `any`; za nepoznate podatke koristi `unknown` i suzi tip.
- Tipovi entiteta žive u `features/<feature>/types.ts` i prate `docs/entities.md` – to je ugovor sa backendom.
- Enum vrijednosti se pišu kao `as const` niz + izvedeni tip, da isti niz služi i za validaciju i za `<select>`:
  ```ts
  export const APPOINTMENT_STATUSES = ['pending', 'confirmed'] as const
  export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]
  ```
- Parametri upita ka API-ju su `type` (ne `interface`), da budu dodjeljivi `QueryParams`.
- Ulaz forme (`XxxInput`) se izvodi iz entiteta: `Omit<Xxx, 'id' | 'createdAt' | 'updatedAt'>`.
- Vrijednosti forme su stringovi (`XxxFormValues`); pretvaranje u `XxxInput` je u `model/validation.ts`.
- Opcioni broj ili datum je `null`, ne `undefined` i ne `0`.
- Uvozi sa aliasom `@/` (`@/shared/ui`), nikad `../../../`. Unutar istog feature-a relativno (`../model/labels`).
- `import type` za uvoz koji je samo tip.
- Ne koristi `!` (non-null) osim kad je vrijednost garantovana i to piše u komentaru ili je očigledno odmah iznad.
