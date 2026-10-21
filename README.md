# 🕹️ Sistemi di Numerazione — Escape Game

**Compito 1 — Sistemi di numerazione e conversione di numeri reali in basi differenti**

Gruppo 3: **Loche** · **Cotza** — Prof. Concu — A.S. 2026/2027

## 🎮 Gioca

**→ [giococoncu.vercel.app](https://giococoncu.vercel.app)**

Un escape game creato in vibecoding con uno stile arcade retro (pixel art, effetti CRT, neon glow) che
insegna i sistemi di numerazione con 4 missioni — ognuna con una lezione e un
quiz — e poi verifica l'apprendimento. Completando tutte le missioni si
ottiene una password a 4 cifre che sblocca la vittoria.

- 4 missioni: analogico/digitale, bit e binario, metodi di conversione,
  conversioni assegnate al gruppo (Decimale→Ottale, Decimale→Esadecimale,
  Binario→Esadecimale)
- 3 vite per missione, timer per domanda, hint, tabella di riferimento
- Audio 8-bit, confetti, salvataggio dei progressi, easter egg

## 🛠️ Stack e sviluppo locale

React 18 + TypeScript + Vite 6 + Tailwind CSS 4. Tutto il gioco è
contenuto in un unico file, [`src/App.tsx`](./src/App.tsx).

```bash
npm install
npm run dev        # sviluppo, http://localhost:3000
npm run build       # build di produzione in dist/
npm run typecheck   # controllo TypeScript
node --test tests/  # test della logica di gioco (rank, password, conversioni)
```

## 📂 Struttura

```
src/App.tsx    gioco completo (dati missioni, componenti, stato)
src/index.css  stile base, variabili neon, animazioni (non toccare)
tests/         test automatici sulla logica (node:test)
```
