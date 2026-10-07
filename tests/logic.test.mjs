// Test logica di gioco. Esegui: node --test tests/
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

let g;
before(async () => {
  const dir = resolve('node_modules/.cache/escape-tests');
  mkdirSync(dir, { recursive: true });
  const outfile = resolve(dir, 'app.mjs');
  await build({
    entryPoints: ['src/App.tsx'], bundle: true, format: 'esm', platform: 'node',
    external: ['react', 'react-dom'], outfile, jsx: 'automatic', logLevel: 'silent',
  });
  g = await import(pathToFileURL(outfile).href);
});

const MIN = 60 * 1000;

test('calcRank: S solo con 0 vite perse, 0 hint e meno di 5 minuti', () => {
  assert.equal(g.calcRank(0, 0, 4 * MIN), 'S');
  assert.equal(g.calcRank(0, 0, 5 * MIN), 'A');
  assert.equal(g.calcRank(0, 1, 1 * MIN), 'A');
});
test('calcRank: soglie A/B/C/D', () => {
  assert.equal(g.calcRank(2, 2, 10 * MIN), 'A');
  assert.equal(g.calcRank(3, 0, 10 * MIN), 'B');
  assert.equal(g.calcRank(5, 5, 10 * MIN), 'B');
  assert.equal(g.calcRank(6, 0, 10 * MIN), 'C');
  assert.equal(g.calcRank(2, 6, 10 * MIN), 'C'); // 6 hint > 5: fuori da B
  assert.equal(g.calcRank(8, 99, 10 * MIN), 'C');
  assert.equal(g.calcRank(9, 0, 10 * MIN), 'D');
});
test('shuffledOrder: è una permutazione di 0..n-1', () => {
  for (let i = 0; i < 50; i++) {
    const o = g.shuffledOrder(6);
    assert.deepEqual([...o].sort(), [0, 1, 2, 3, 4, 5]);
  }
});
test('formatTime: mm:ss', () => {
  assert.equal(g.formatTime(0), '00:00');
  assert.equal(g.formatTime(65_000), '01:05');
  assert.equal(g.formatTime(-5), '00:00');
});
test('password finale = 7315 e missioni nell’ordine giusto', () => {
  assert.equal(g.FULL_PASSWORD, '7315');
  assert.deepEqual(g.MISSIONS.map((m) => m.id), ['analog-digital', 'binary-bits', 'conversions', 'group3']);
  assert.deepEqual(g.MISSIONS.map((m) => m.requiredMission), [undefined, 'analog-digital', 'binary-bits', 'conversions']);
});
test('numero domande: 4/5/5/6 e lezioni 3/3/4/3', () => {
  assert.deepEqual(g.MISSIONS.map((m) => m.questions.length), [4, 5, 5, 6]);
  assert.deepEqual(g.MISSIONS.map((m) => m.lessons.length), [3, 3, 4, 3]);
});
test('ogni domanda: 4 opzioni uniche, correctIndex valido, spiegazione presente', () => {
  for (const m of g.MISSIONS) for (const q of m.questions) {
    assert.equal(q.options.length, 4, q.text);
    assert.equal(new Set(q.options).size, 4, `opzioni duplicate: ${q.text}`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, q.text);
    assert.ok(q.explanation.length > 10, q.text);
  }
});
test('risposte corrette di "Converti X(b) in base" sono aritmeticamente giuste', () => {
  const conv = g.MISSIONS.find((m) => m.id === 'group3').questions;
  for (const q of conv) {
    const mm = q.text.match(/Converti (\w+)\((\d+)\) in (\w+)/);
    const value = parseInt(mm[1], Number(mm[2]));
    const base = { ottale: 8, esadecimale: 16 }[mm[3]];
    const expected = value.toString(base).toUpperCase() + `(${base})`;
    assert.equal(q.options[q.correctIndex], expected, q.text);
    // e nessuna altra opzione è corretta
    assert.equal(q.options.filter((o) => o === expected).length, 1, q.text);
  }
});
test('25 in binario = 11001 (M3 Q5) e lezione 1 coerente', () => {
  const q = g.MISSIONS[2].questions.find((x) => x.text.includes('25(10)'));
  assert.equal(q.options[q.correctIndex], (25).toString(2));
});
