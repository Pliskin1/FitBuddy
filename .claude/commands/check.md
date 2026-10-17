---
description: Provjeri projekat prije commita (tipovi, format, build) i sažmi rezultat
allowed-tools: Bash(npm run check), Bash(npm run typecheck), Bash(npm run build), Bash(npm run format), Bash(npm run format:check), Bash(git status), Bash(git diff:*)
---

1. Pokreni `npm run check` u korijenu repozitorijuma.
2. Ako padne:
   - greške TypeScript-a – ispravi ih u kodu (ne gasi provjere, ne dodaj `any`);
   - format – pokreni `npm run format`;
   - build – pročitaj grešku i ispravi uzrok.
     Zatim ponovo `npm run check`.
3. Pogledaj `git status` i `git diff`: ako je mijenjan tip, mock ruta ili validacija, a `docs/entities.md` nije – reci to.
4. Vrati kratak izvještaj: šta je prošlo, šta je ispravljeno, šta je ostalo.
