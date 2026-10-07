import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

// ==================== GAME DATA ====================
// Compito 1 - Sistemi di Numerazione - Gruppo 3 (Loche, Cotza, Atzori)
// Prof. Concu - A.S. 2026/2027

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonPage {
  title: string;
  content: string[]; // ogni stringa è una riga, stringa vuota = spazio
}

interface Mission {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  lessons: LessonPage[];
  questions: Question[];
  passwordNumber: string;
  requiredMission?: string;
}

type Screen =
  | 'title'
  | 'menu'
  | 'missions'
  | 'mission-intro'
  | 'lesson'
  | 'playing'
  | 'correct'
  | 'wrong'
  | 'mission-complete'
  | 'game-over'
  | 'victory'
  | 'password';

type Rank = 'S' | 'A' | 'B' | 'C' | 'D';

const PINK = '#ff406f';
const GREEN = '#c2ff2d';
const BLUE = '#5da5fb';
const PURPLE = '#b157ce';
const YELLOW = '#ffd23f';

const MAX_LIVES = 3;
const TIME_LIMIT = 30;

const MISSIONS: Mission[] = [
  {
    id: 'analog-digital',
    name: 'ANALOGICO vs DIGITALE',
    icon: '📡',
    color: BLUE,
    description:
      "Scopri la differenza tra grandezze analogiche e digitali, e perché il digitale ha rivoluzionato l'informatica!",
    lessons: [
      {
        title: 'GRANDEZZE ANALOGICHE',
        content: [
          'Una grandezza ANALOGICA varia in modo CONTINUO nel tempo.',
          '',
          'Esempio: la temperatura esterna cambia gradualmente, passando per infiniti valori (20.1°, 20.15°, 20.153°...).',
          '',
          'Altri esempi: la pressione atmosferica, il suono (onde sonore), la velocità del vento.',
          '',
          "Un termometro a mercurio è un dispositivo ANALOGICO: il mercurio sale in modo fluido e continuo.",
        ],
      },
      {
        title: 'GRANDEZZE DIGITALI',
        content: [
          'Una grandezza DIGITALE assume solo valori DISCRETI (separati, distinti).',
          '',
          'Esempio: un display digitale mostra 20°C o 21°C, ma NON i valori intermedi.',
          '',
          'Il computer lavora solo con 2 valori: 0 e 1 (sistema BINARIO).',
          '',
          'Questi due stati rappresentano: acceso/spento, vero/falso, alto/basso.',
        ],
      },
      {
        title: 'PERCHÉ IL DIGITALE?',
        content: [
          '• PRECISIONE: i dati digitali si copiano senza perdita di qualità.',
          '• AFFIDABILITÀ: resistente al rumore e alle interferenze.',
          '• ELABORAZIONE: i computer possono processare i dati digitali velocemente.',
          '• MEMORIZZAZIONE: i dati digitali occupano meno spazio e durano di più.',
          '',
          'Per questo TUTTO oggi viene digitalizzato: musica, foto, video, testi!',
        ],
      },
    ],
    questions: [
      {
        text: 'Qual è la differenza principale tra una grandezza analogica e una digitale?',
        options: [
          "L'analogica è più veloce",
          "L'analogica varia in modo continuo, la digitale assume valori discreti",
          'La digitale è meno precisa',
          "Non c'è differenza",
        ],
        correctIndex: 1,
        explanation:
          'Analogico = continuo (infiniti valori), Digitale = discreto (valori separati e distinti). Il computer usa il digitale perché lavora con 0 e 1.',
      },
      {
        text: 'Quale tra questi è un esempio di grandezza ANALOGICA?',
        options: [
          'Il conteggio dei like su Instagram',
          'Il numero di studenti in classe',
          'La temperatura misurata con un termometro a mercurio',
          'Il punteggio di un videogioco',
        ],
        correctIndex: 2,
        explanation:
          'Il mercurio nel termometro sale in modo continuo e fluido: è un classico esempio analogico. Like, studenti e punteggi sono invece numeri discreti.',
      },
      {
        text: 'Perché i computer usano il sistema digitale (binario)?',
        options: [
          'Perché è più economico',
          'Perché è facile distinguere solo 2 stati (0 e 1)',
          "Perché l'analogico non esiste più",
          'Perché il binario è stato inventato dopo',
        ],
        correctIndex: 1,
        explanation:
          "I circuiti elettronici distinguono facilmente tra 'passa corrente' (1) e 'non passa corrente' (0). Due soli stati = massima affidabilità.",
      },
      {
        text: 'Quale vantaggio NON è del digitale?',
        options: [
          'Si può copiare senza perdita di qualità',
          'Resistente al rumore',
          'Può rappresentare infiniti valori continui senza conversione',
          'Facilmente elaborabile dai computer',
        ],
        correctIndex: 2,
        explanation:
          "Questa è proprio una caratteristica dell'ANALOGICO! Il digitale deve sempre 'campionare' e approssimare i valori continui.",
      },
    ],
    passwordNumber: '7',
  },
  {
    id: 'binary-bits',
    name: 'BINARIO & BIT',
    icon: '01',
    color: GREEN,
    description:
      'Immergiti nel mondo dei bit e dei byte! Scopri come i computer rappresentano ogni informazione con soli due simboli.',
    requiredMission: 'analog-digital',
    lessons: [
      {
        title: 'IL BIT',
        content: [
          "Il BIT (Binary Digit) è l'unità minima di informazione.",
          '',
          'Un bit può avere solo 2 valori: 0 oppure 1.',
          '',
          'Con 1 bit: 2 combinazioni (0, 1)',
          'Con 2 bit: 4 combinazioni (00, 01, 10, 11)',
          'Con 8 bit (= 1 BYTE): 256 combinazioni (da 0 a 255)',
          '',
          'Formula: con N bit si hanno 2^N combinazioni possibili.',
        ],
      },
      {
        title: 'I SISTEMI DI NUMERAZIONE',
        content: [
          'Un sistema di numerazione è un modo per rappresentare i numeri.',
          'Ogni sistema ha una BASE = numero di simboli disponibili.',
          '',
          'BINARIO (base 2): simboli 0, 1 → usato dai computer',
          'OTTALE (base 8): simboli 0-7 → scorciatoia per il binario',
          'DECIMALE (base 10): simboli 0-9 → il nostro sistema quotidiano',
          'ESADECIMALE (base 16): simboli 0-9, A-F → usato nella programmazione',
        ],
      },
      {
        title: 'CODIFICA BINARIA',
        content: [
          'Ogni tipo di dato viene codificato in binario:',
          '',
          'NUMERI: conversione diretta (es. 5 = 101 in binario)',
          '',
          'TESTO: ogni carattere ha un codice (ASCII/Unicode) — La lettera "A" = 01000001 (65 in decimale)',
          '',
          'IMMAGINI: ogni pixel è un insieme di bit (colore RGB)',
          '',
          'AUDIO: il suono viene campionato e ogni campione diventa bit',
        ],
      },
    ],
    questions: [
      {
        text: 'Quanti valori può assumere un singolo BIT?',
        options: ['1', '2', '8', '10'],
        correctIndex: 1,
        explanation: 'BIT = Binary Digit. Binario = 2 valori possibili: 0 e 1. Semplice ma fondamentale!',
      },
      {
        text: 'Quante combinazioni si possono rappresentare con 1 BYTE (8 bit)?',
        options: ['8', '64', '128', '256'],
        correctIndex: 3,
        explanation:
          '1 BYTE = 8 bit. Formula: 2^8 = 256 combinazioni (da 00000000 a 11111111, ovvero da 0 a 255).',
      },
      {
        text: 'Qual è la base del sistema ESADECIMALE?',
        options: ['6', '8', '10', '16'],
        correctIndex: 3,
        explanation:
          'ESA = 6, DECI = 10. Esadecimale = base 6+10 = 16. Usa i simboli: 0 1 2 3 4 5 6 7 8 9 A B C D E F.',
      },
      {
        text: 'Quali simboli usa il sistema OTTALE?',
        options: ['Da 0 a 8', 'Da 0 a 7', 'Da 1 a 8', 'Da 0 a 9'],
        correctIndex: 1,
        explanation: "OTTALE = base 8 → usa 8 simboli, da 0 a 7. Il simbolo 8 NON esiste nell'ottale!",
      },
      {
        text: "In quale codifica la lettera 'A' corrisponde al numero 65?",
        options: ['BCD', 'RGB', 'ASCII', 'JPEG'],
        correctIndex: 2,
        explanation:
          'ASCII (American Standard Code for Information Interchange) assegna un numero a ogni carattere. A=65, B=66, a=97, 0=48.',
      },
    ],
    passwordNumber: '3',
  },
  {
    id: 'conversions',
    name: 'LE CONVERSIONI',
    icon: '⇄',
    color: PINK,
    description:
      'Impara i metodi per convertire numeri tra basi diverse! Il metodo delle divisioni successive ti aprirà la strada.',
    requiredMission: 'binary-bits',
    lessons: [
      {
        title: 'METODO DELLE DIVISIONI SUCCESSIVE',
        content: [
          "Per convertire un numero DECIMALE in un'altra base:",
          '',
          '1. Dividi il numero per la base di destinazione',
          '2. Segna il RESTO',
          '3. Ripeti col QUOZIENTE fino ad arrivare a 0',
          "4. Leggi i resti DAL BASSO VERSO L'ALTO",
          '',
          'Es: 25 in binario (base 2):',
          '25 ÷ 2 = 12 resto 1',
          '12 ÷ 2 = 6 resto 0',
          '6 ÷ 2 = 3 resto 0',
          '3 ÷ 2 = 1 resto 1',
          '1 ÷ 2 = 0 resto 1',
          'Risultato: 11001',
        ],
      },
      {
        title: 'DECIMALE → OTTALE',
        content: [
          'Si usa lo STESSO metodo, ma dividendo per 8.',
          '',
          'Esempio: convertire 156 in ottale:',
          '156 ÷ 8 = 19 resto 4',
          '19 ÷ 8 = 2 resto 3',
          '2 ÷ 8 = 0 resto 2',
          '',
          'Letto dal basso: 156(10) = 234(8)',
          'I resti sono sempre tra 0 e 7 (i simboli dell\'ottale).',
        ],
      },
      {
        title: 'DECIMALE → ESADECIMALE',
        content: [
          'Stesso metodo, dividendo per 16.',
          'I resti da 10 a 15 si scrivono come lettere: A=10 B=11 C=12 D=13 E=14 F=15',
          '',
          'Esempio: convertire 255 in esadecimale:',
          '255 ÷ 16 = 15 resto 15 → resto = F',
          '15 ÷ 16 = 0 resto 15 → resto = F',
          '',
          'Letto dal basso: 255(10) = FF(16)',
          'Ecco perché il bianco in RGB è #FFFFFF!',
        ],
      },
      {
        title: 'BINARIO → ESADECIMALE',
        content: [
          'Questo è il metodo più veloce! Ogni GRUPPO DI 4 BIT = 1 cifra hex.',
          '',
          '0000=0  0001=1  0010=2  0011=3',
          '0100=4  0101=5  0110=6  0111=7',
          '1000=8  1001=9  1010=A  1011=B',
          '1100=C  1101=D  1110=E  1111=F',
          '',
          'Esempio: 11010110 in esadecimale:',
          '1101 | 0110 → D | 6 → D6(16)',
          '',
          'Se i bit non sono multiplo di 4, aggiungi zeri a sinistra!',
        ],
      },
    ],
    questions: [
      {
        text: 'Nel metodo delle divisioni successive, in che ordine si leggono i resti?',
        options: ["Dall'alto verso il basso", "Dal basso verso l'alto", 'Da sinistra a destra', "Non importa l'ordine"],
        correctIndex: 1,
        explanation:
          "Il PRIMO resto trovato è la cifra MENO significativa (più a destra). Quindi si legge dal basso (ultimo resto = prima cifra) verso l'alto.",
      },
      {
        text: 'Per convertire un numero decimale in OTTALE, per quale numero si divide?',
        options: ['2', '8', '10', '16'],
        correctIndex: 1,
        explanation: 'Ottale = base 8, quindi si divide per 8. Semplice: la base di destinazione è sempre il divisore!',
      },
      {
        text: 'Nel sistema esadecimale, quale lettera rappresenta il valore 12?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 2,
        explanation: 'A=10, B=11, C=12, D=13, E=14, F=15. La C è il terzo valore dopo il 9.',
      },
      {
        text: 'Per convertire da BINARIO a ESADECIMALE, quanti bit si raggruppano?',
        options: ['2', '3', '4', '8'],
        correctIndex: 2,
        explanation:
          '4 bit = 2^4 = 16 combinazioni = esattamente una cifra esadecimale! Ecco perché il raggruppamento a 4 funziona perfettamente.',
      },
      {
        text: 'Qual è il risultato di 25(10) convertito in binario?',
        options: ['10011', '11001', '10101', '11010'],
        correctIndex: 1,
        explanation: '25÷2=12 r.1 → 12÷2=6 r.0 → 6÷2=3 r.0 → 3÷2=1 r.1 → 1÷2=0 r.1. Dal basso: 11001.',
      },
    ],
    passwordNumber: '1',
  },
  {
    id: 'group3',
    name: 'CONVERSIONI GRUPPO 3',
    icon: '🎯',
    color: PURPLE,
    description:
      'Le conversioni assegnate al Gruppo 3: Decimale→Ottale, Decimale→Esadecimale, Binario→Esadecimale. Metti alla prova le tue abilità!',
    requiredMission: 'conversions',
    lessons: [
      {
        title: 'RIEPILOGO: DEC → OTTALE',
        content: [
          'Metodo: divisioni successive per 8',
          '',
          'Esercizio guidato: convertiamo 100(10) in ottale:',
          '100 ÷ 8 = 12 resto 4',
          '12 ÷ 8 = 1 resto 4',
          '1 ÷ 8 = 0 resto 1',
          '',
          'Risultato: 100(10) = 144(8)',
          'Verifica: 1×64 + 4×8 + 4×1 = 64+32+4 = 100 ✓',
        ],
      },
      {
        title: 'RIEPILOGO: DEC → ESADECIMALE',
        content: [
          'Metodo: divisioni successive per 16',
          'Ricorda: 10=A, 11=B, 12=C, 13=D, 14=E, 15=F',
          '',
          'Esercizio guidato: convertiamo 200(10) in hex:',
          '200 ÷ 16 = 12 resto 8',
          '12 ÷ 16 = 0 resto 12 → C',
          '',
          'Risultato: 200(10) = C8(16)',
          'Verifica: 12×16 + 8×1 = 192+8 = 200 ✓',
        ],
      },
      {
        title: 'RIEPILOGO: BIN → ESADECIMALE',
        content: [
          'Metodo: raggruppa i bit a 4 a 4 da destra',
          '',
          'Esercizio guidato: convertiamo 10110011(2) in hex:',
          '1011 | 0011',
          '1011 = 8+0+2+1 = 11 = B',
          '0011 = 0+0+2+1 = 3',
          '',
          'Risultato: 10110011(2) = B3(16)',
          'Trucco: se conosci la tabella 4bit→hex a memoria, è istantaneo!',
        ],
      },
    ],
    questions: [
      {
        text: 'Converti 83(10) in ottale. Qual è il risultato?',
        options: ['123(8)', '103(8)', '113(8)', '133(8)'],
        correctIndex: 0,
        explanation: '83÷8=10 r.3 → 10÷8=1 r.2 → 1÷8=0 r.1. Dal basso: 123(8). Verifica: 1×64+2×8+3=83 ✓',
      },
      {
        text: 'Converti 45(10) in ottale. Qual è il risultato?',
        options: ['54(8)', '45(8)', '55(8)', '53(8)'],
        correctIndex: 2,
        explanation: '45÷8=5 r.5 → 5÷8=0 r.5. Dal basso: 55(8). Verifica: 5×8+5=45 ✓',
      },
      {
        text: 'Converti 175(10) in esadecimale. Qual è il risultato?',
        options: ['AF(16)', 'BF(16)', 'AB(16)', 'FA(16)'],
        correctIndex: 0,
        explanation:
          '175÷16=10 r.15 → 10÷16=0 r.10. Resti: 10=A, 15=F. Dal basso: AF(16). Verifica: 10×16+15=175 ✓',
      },
      {
        text: 'Converti 255(10) in esadecimale. Qual è il risultato?',
        options: ['EF(16)', 'FE(16)', 'FF(16)', 'F5(16)'],
        correctIndex: 2,
        explanation: '255÷16=15 r.15 → 15÷16=0 r.15. Resto 15=F. Dal basso: FF(16). È il valore massimo di 1 byte!',
      },
      {
        text: 'Converti 11010110(2) in esadecimale. Qual è il risultato?',
        options: ['D6(16)', '6D(16)', 'B6(16)', 'D4(16)'],
        correctIndex: 0,
        explanation: 'Gruppi da 4: 1101=D, 0110=6. Risultato: D6(16). Basta conoscere la tabella 4bit→hex!',
      },
      {
        text: 'Converti 10101111(2) in esadecimale. Qual è il risultato?',
        options: ['FA(16)', 'AF(16)', 'AB(16)', 'BF(16)'],
        correctIndex: 1,
        explanation: 'Gruppi da 4: 1010=A, 1111=F. Risultato: AF(16).',
      },
    ],
    passwordNumber: '5',
  },
];

const FULL_PASSWORD = MISSIONS.map((m) => m.passwordNumber).join('');
const TOTAL_QUESTIONS = MISSIONS.reduce((n, m) => n + m.questions.length, 0);

const HEX_TABLE: [string, string][] = [
  ['0000', '0'], ['0001', '1'], ['0010', '2'], ['0011', '3'],
  ['0100', '4'], ['0101', '5'], ['0110', '6'], ['0111', '7'],
  ['1000', '8'], ['1001', '9'], ['1010', 'A'], ['1011', 'B'],
  ['1100', 'C'], ['1101', 'D'], ['1110', 'E'], ['1111', 'F'],
];

// ==================== UTILITIES ====================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffledOrder(count: number): number[] {
  return shuffle(Array.from({ length: count }, (_, i) => i));
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RANK_ORDER: Rank[] = ['D', 'C', 'B', 'A', 'S'];
const RANK_COLOR: Record<Rank, string> = { S: PINK, A: GREEN, B: BLUE, C: YELLOW, D: '#9ca3af' };

function calcRank(livesLost: number, hints: number, ms: number): Rank {
  if (livesLost === 0 && hints === 0 && ms < 5 * 60 * 1000) return 'S';
  if (livesLost <= 2 && hints <= 2) return 'A';
  if (livesLost <= 5 && hints <= 5) return 'B';
  if (livesLost <= 8) return 'C';
  return 'D';
}

// ---------- Salvataggio (localStorage) ----------

const SAVE_KEY = 'escape-numerazione-g3-v1';

interface SaveData {
  completed: string[];
  score: number;
  hiScore: number;
  bestRank: Rank | null;
  livesLost: number;
  hints: number;
  firstTry: number;
  elapsed: number;
}

const EMPTY_SAVE: SaveData = {
  completed: [],
  score: 0,
  hiScore: 0,
  bestRank: null,
  livesLost: 0,
  hints: 0,
  firstTry: 0,
  elapsed: 0,
};

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0;
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return EMPTY_SAVE;
    const p = JSON.parse(raw) as Partial<SaveData>;
    const ids = MISSIONS.map((m) => m.id);
    return {
      completed: Array.isArray(p.completed) ? p.completed.filter((id) => ids.includes(id)) : [],
      score: num(p.score),
      hiScore: num(p.hiScore),
      bestRank: RANK_ORDER.includes(p.bestRank as Rank) ? (p.bestRank as Rank) : null,
      livesLost: num(p.livesLost),
      hints: num(p.hints),
      firstTry: num(p.firstTry),
      elapsed: num(p.elapsed),
    };
  } catch {
    return EMPTY_SAVE;
  }
}

function writeSave(data: SaveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage non disponibile: si gioca senza salvataggio */
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignora */
  }
}

// ==================== SUONI 8-BIT (Web Audio API) ====================

type SoundName =
  | 'correct' | 'wrong' | 'click' | 'mission-complete' | 'game-over'
  | 'tick' | 'life-lost' | 'unlock' | 'typing' | 'special';

let audioCtx: AudioContext | null = null;
let soundOn = false;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function beep(freq: number, start: number, dur: number, type: OscillatorType = 'square', vol = 0.06, endFreq?: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function melody(notes: number[], step: number, dur: number, type: OscillatorType, vol = 0.06, lastDur?: number) {
  notes.forEach((f, i) => beep(f, i * step, i === notes.length - 1 && lastDur ? lastDur : dur, type, vol));
}

function play(name: SoundName) {
  if (!soundOn) return;
  try {
    switch (name) {
      case 'correct':
        beep(988, 0, 0.08, 'square');
        beep(1319, 0.08, 0.28, 'square');
        break;
      case 'wrong':
        beep(220, 0, 0.4, 'sawtooth', 0.07, 100);
        break;
      case 'click':
        beep(660, 0, 0.05, 'square', 0.04);
        break;
      case 'mission-complete':
        melody([523, 659, 784, 1047, 1319], 0.12, 0.12, 'square', 0.06, 0.45);
        break;
      case 'game-over':
        melody([392, 349, 311, 262], 0.32, 0.3, 'triangle', 0.09, 0.9);
        break;
      case 'tick':
        beep(1760, 0, 0.04, 'square', 0.03);
        break;
      case 'life-lost':
        beep(440, 0, 0.5, 'sawtooth', 0.08, 60);
        beep(180, 0.12, 0.4, 'square', 0.05, 40);
        break;
      case 'unlock':
        melody([440, 554, 659, 880], 0.09, 0.12, 'sine', 0.09, 0.3);
        break;
      case 'typing':
        beep(900 + Math.random() * 250, 0, 0.02, 'square', 0.012);
        break;
      case 'special':
        melody([784, 988, 1175, 1568, 1976], 0.1, 0.12, 'triangle', 0.09, 0.5);
        break;
    }
  } catch {
    /* audio non disponibile */
  }
}


// Tailwind v4 è caricato senza tema (index.css usa le direttive v3 e non va toccato):
// spaziature, dimensioni, colori e breakpoint `md:` non vengono generati.
// Li definiamo qui con le stesse classi usate nel JSX, così il layout funziona ovunque.
function utilityCss(): string {
  const esc = (n: string) => n.replace(/[:[\]./]/g, (m) => `\\${m}`);
  const base: [string, string][] = [];
  const md: [string, string][] = [];
  const sm: [string, string][] = [];
  const rem = (n: number) => `${n * 0.25}rem`;

  const spacing = (prefix: string, decl: (v: string) => string, values: number[], bucket = base, bp = '') =>
    values.forEach((n) => bucket.push([`${bp}${prefix}-${n}`, decl(rem(n))]));

  spacing('gap', (v) => `gap:${v}`, [1, 2, 3, 4, 5, 6]);
  spacing('gap', (v) => `gap:${v}`, [3, 4], md, 'md:');
  spacing('p', (v) => `padding:${v}`, [3, 4, 5]);
  spacing('p', (v) => `padding:${v}`, [4, 6], md, 'md:');
  spacing('px', (v) => `padding-left:${v};padding-right:${v}`, [3, 4, 5]);
  spacing('py', (v) => `padding-top:${v};padding-bottom:${v}`, [1, 2, 4]);
  spacing('pt', (v) => `padding-top:${v}`, [16]);
  spacing('pb', (v) => `padding-bottom:${v}`, [10]);
  spacing('pr', (v) => `padding-right:${v}`, [12, 14]);
  spacing('mt', (v) => `margin-top:${v}`, [1, 2, 3, 4, 6]);
  spacing('mb', (v) => `margin-bottom:${v}`, [2, 3, 4]);
  spacing('w', (v) => `width:${v}`, [3, 11, 12, 24, 64]);
  spacing('h', (v) => `height:${v}`, [3, 11, 12, 16, 28]);
  spacing('w', (v) => `width:${v}`, [14], md, 'md:');
  spacing('h', (v) => `height:${v}`, [20], md, 'md:');
  spacing('top', (v) => `top:${v}`, [1, 2, 3, 4, 24]);
  spacing('right', (v) => `right:${v}`, [2, 3, 4]);
  spacing('left', (v) => `left:${v}`, [4]);
  spacing('top', (v) => `top:${v}`, [6], md, 'md:');
  spacing('left', (v) => `left:${v}`, [6], md, 'md:');
  spacing('right', (v) => `right:${v}`, [6], md, 'md:');
  base.push(['inset-0', 'inset:0'], ['left-0', 'left:0'], ['right-0', 'right:0']);
  base.push(['min-w-0', 'min-width:0'], ['font-bold', 'font-weight:700']);
  base.push(['max-w-md', 'max-width:28rem'], ['max-w-lg', 'max-width:32rem'], ['max-w-2xl', 'max-width:42rem']);
  base.push(['max-w-3xl', 'max-width:48rem'], ['max-w-4xl', 'max-width:56rem']);
  base.push(['leading-relaxed', 'line-height:1.625'], ['leading-tight', 'line-height:1.25']);
  base.push(['bg-white', 'background-color:#fff'], ['text-white', 'color:#fff']);
  base.push(['border-white/10', 'border-color:rgba(255,255,255,.1)']);
  const gray: Record<number, string> = { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280' };
  Object.entries(gray).forEach(([k, v]) => base.push([`text-gray-${k}`, `color:${v}`]));
  const fs: Record<string, string> = {
    xs: '.75rem', sm: '.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
    '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem', '7xl': '4.5rem', '8xl': '6rem',
  };
  Object.entries(fs).forEach(([k, v]) => base.push([`text-${k}`, `font-size:${v}`]));
  Object.entries(fs).forEach(([k, v]) => md.push([`md:text-${k}`, `font-size:${v}`]));
  md.push(['md:text-[10px]', 'font-size:10px'], ['md:text-[11px]', 'font-size:11px']);
  md.push(['md:grid-cols-4', 'grid-template-columns:repeat(4,minmax(0,1fr))']);
  sm.push(['sm:grid-cols-4', 'grid-template-columns:repeat(4,minmax(0,1fr))']);

  const toCss = (rules: [string, string][]) => rules.map(([n, d]) => `.${esc(n)}{${d}}`).join('');
  return `${toCss(base)}@media (min-width:640px){${toCss(sm)}}@media (min-width:768px){${toCss(md)}}`;
}

const UTILITY_CSS = utilityCss();

// ==================== STILI GLOBALI (animazioni extra) ====================

function GlobalStyles() {
  return (
    <style>{`
      ${UTILITY_CSS}
      button { background: transparent; color: inherit; font-family: inherit; }
      .btn-retro, .btn-m {
        min-height: 44px;
        line-height: 1.6;
        text-align: center;
        touch-action: manipulation;
      }
      .btn-m {
        font-family: 'Press Start 2P', cursive;
        padding: 12px 24px;
        border: 2px solid var(--c);
        background: transparent;
        color: var(--c);
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        font-size: 10px;
      }
      .btn-m:hover {
        background: var(--c);
        color: #0a0a0a;
        box-shadow: 0 0 20px var(--c);
      }
      .btn-retro:disabled, .btn-m:disabled { opacity: .35; cursor: not-allowed; }
      .btn-retro:disabled:hover, .btn-m:disabled:hover { background: transparent; box-shadow: none; }
      .btn-retro:disabled:hover { color: var(--neon-green); }
      .btn-retro-pink:disabled:hover { color: var(--neon-pink); }
      .btn-m:disabled:hover { color: var(--c); }
      .btn-retro:focus-visible, .btn-m:focus-visible, .opt:focus-visible, .card:focus-visible {
        outline: 3px solid #fff; outline-offset: 3px;
      }
      .opt { transition: all .15s; }
      .opt:not(:disabled):hover { transform: translateY(-2px); background: rgba(255,255,255,.06); }

      @keyframes burst {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(.3) rotate(360deg); opacity: 0; }
      }
      @keyframes confettiFall {
        0% { transform: translateY(-8vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(112vh) rotate(720deg); opacity: .9; }
      }
      @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.18); }
      }
      @keyframes heartBreak {
        0% { transform: scale(1.5) rotate(0); filter: drop-shadow(0 0 8px #ff406f); opacity: 1; }
        30% { transform: scale(1.2) rotate(-18deg); }
        60% { transform: scale(1.3) rotate(14deg); }
        100% { transform: scale(.9) rotate(0); filter: none; opacity: .55; }
      }
      @keyframes glitch {
        0%   { transform: translate(0); filter: none; }
        15%  { transform: translate(-6px, 2px); filter: hue-rotate(90deg) saturate(3); }
        30%  { transform: translate(5px, -3px) skewX(6deg); filter: invert(.15); }
        45%  { transform: translate(-4px, -2px); filter: hue-rotate(-90deg) saturate(3); }
        60%  { transform: translate(6px, 3px) skewX(-6deg); filter: none; }
        80%  { transform: translate(-2px, 1px); filter: hue-rotate(180deg); }
        100% { transform: translate(0); filter: none; }
      }
      .glitch { animation: glitch .6s steps(2, end); }
      @keyframes glitchBars {
        0%   { opacity: .9; background-position: 0 0; }
        50%  { opacity: .5; background-position: 0 40px; }
        100% { opacity: 0; background-position: 0 80px; }
      }
      .glitch-bars {
        position: fixed; inset: 0; z-index: 150; pointer-events: none;
        background: repeating-linear-gradient(0deg, rgba(255,64,111,.35) 0 3px, rgba(93,165,251,.3) 3px 6px, transparent 6px 14px);
        animation: glitchBars .6s linear forwards;
      }
      @keyframes flash {
        0% { opacity: .95; }
        100% { opacity: 0; }
      }
      .flash { position: fixed; inset: 0; background: #fff; z-index: 220; pointer-events: none; animation: flash .6s ease-out forwards; }
      @keyframes rainbowText {
        0%   { color: #ff406f; }
        20%  { color: #ffd23f; }
        40%  { color: #c2ff2d; }
        60%  { color: #5da5fb; }
        80%  { color: #b157ce; }
        100% { color: #ff406f; }
      }
      .rainbow, .rainbow * { animation: rainbowText .7s linear infinite; text-shadow: 0 0 8px currentColor; }
      @keyframes popIn {
        0% { transform: scale(.3); opacity: 0; }
        70% { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); }
      }
      .pop-in { animation: popIn .5s ease-out both; }
      @keyframes trophy {
        0%, 100% { transform: translateY(0) rotate(-6deg) scale(1); }
        50% { transform: translateY(-14px) rotate(6deg) scale(1.15); }
      }
      .trophy { animation: trophy 1.6s ease-in-out infinite; display: inline-block; }
      @keyframes unlockGlow {
        0%, 100% { box-shadow: 0 0 10px var(--c); transform: scale(1); }
        50% { box-shadow: 0 0 40px var(--c), 0 0 80px var(--c); transform: scale(1.06); }
      }
      .unlocking { animation: unlockGlow .7s ease-in-out 3; }
      @keyframes lockOpen {
        0%   { transform: translateX(0) rotate(0); opacity: 1; }
        15%  { transform: translateX(-6px) rotate(-12deg); }
        30%  { transform: translateX(6px) rotate(12deg); }
        45%  { transform: translateX(-6px) rotate(-12deg); }
        60%  { transform: translateY(0) scale(1.3); opacity: 1; }
        100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
      }
      .lock-open { animation: lockOpen 2.2s ease-in-out forwards; }
      @keyframes rankGlow {
        0%, 100% { text-shadow: 0 0 12px currentColor, 0 0 24px currentColor; transform: scale(1); }
        50% { text-shadow: 0 0 28px currentColor, 0 0 60px currentColor; transform: scale(1.08); }
      }
      .rank-glow { animation: rankGlow 1.6s ease-in-out infinite; }
      @keyframes rankBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: .25; }
      }
      .rank-blink { animation: rankGlow 1.6s ease-in-out infinite, rankBlink .8s steps(1) infinite; }
      @keyframes caret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      .caret { animation: caret .7s steps(1) infinite; }
      @media (prefers-reduced-motion: reduce) {
        .animate-float, .trophy, .rank-glow, .rank-blink, .unlocking { animation: none !important; }
      }
    `}</style>
  );
}

// ==================== COMPONENTI BASE ====================

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-blink"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

function Frame({ children, top = false }: { children: ReactNode; top?: boolean }) {
  return (
    <div
      className="relative z-10 flex flex-col items-center gap-5 px-4 pt-16 pb-10 w-full"
      style={{ minHeight: '100dvh', justifyContent: top ? 'flex-start' : 'center' }}
    >
      {children}
    </div>
  );
}

function Btn({
  onClick,
  children,
  color,
  variant = 'green',
  disabled,
  className = '',
}: {
  onClick: () => void;
  children: ReactNode;
  color?: string;
  variant?: 'green' | 'pink';
  disabled?: boolean;
  className?: string;
}) {
  const cls = color ? 'btn-m' : variant === 'pink' ? 'btn-retro btn-retro-pink' : 'btn-retro';
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${cls} ${className}`}
      style={color ? ({ '--c': color } as CSSProperties) : undefined}
      onClick={() => {
        play('click');
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function Hearts({ lives, justLost }: { lives: number; justLost?: number | null }) {
  return (
    <div className="flex gap-1 text-xl md:text-2xl" aria-label={`Vite rimaste: ${lives} su ${MAX_LIVES}`} role="img">
      {Array.from({ length: MAX_LIVES }, (_, i) => {
        if (i < lives) {
          return (
            <span key={i} style={{ animation: 'heartBeat 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}>
              ❤️
            </span>
          );
        }
        if (justLost === i) {
          return (
            <span key={i} style={{ animation: 'heartBreak 1.2s ease-out forwards' }}>
              💔
            </span>
          );
        }
        return (
          <span key={i} style={{ opacity: 0.55 }}>
            🖤
          </span>
        );
      })}
    </div>
  );
}

const BURST_COLORS = [PINK, GREEN, BLUE, PURPLE, YELLOW, '#ffffff'];

function Burst({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 120 + Math.random() * 180;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 6 + Math.random() * 6,
          color: i % 3 === 0 ? '#ffffff' : color,
          delay: Math.random() * 0.12,
        };
      }),
    [color],
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={
            {
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animation: `burst 1.1s ease-out ${p.delay}s forwards`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ConfettiRain() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        dur: 3 + Math.random() * 3.5,
        delay: Math.random() * 5,
        color: BURST_COLORS[i % BURST_COLORS.length],
      })),
    [],
  );
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-40" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            top: 0,
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            background: p.color,
            opacity: 0.9,
            animation: `confettiFall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Banner({ text }: { text: string }) {
  return (
    <div className="fixed left-0 right-0 top-24 z-[250] flex justify-center px-4 pointer-events-none">
      <div
        className="animate-slide-up font-pixel text-center text-[11px] md:text-sm leading-relaxed px-5 py-4"
        style={{
          background: 'rgba(10,10,20,.95)',
          border: `2px solid ${PINK}`,
          boxShadow: `0 0 20px ${PINK}, inset 0 0 12px rgba(255,64,111,.2)`,
          color: '#fff',
        }}
        role="status"
      >
        {text}
      </div>
    </div>
  );
}

function ReferenceTable({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.8)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Tabella di riferimento 4 bit → esadecimale"
    >
      <div
        className="relative w-full max-w-md p-5"
        style={{
          background: 'rgba(10,10,30,.96)',
          border: `2px solid ${PURPLE}`,
          boxShadow: `0 0 24px ${PURPLE}, inset 0 0 14px rgba(177,87,206,.2)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            play('click');
            onClose();
          }}
          className="absolute top-2 right-2 font-pixel text-sm w-11 h-11 flex items-center justify-center"
          style={{ color: PINK, border: `2px solid ${PINK}` }}
          aria-label="Chiudi tabella"
        >
          X
        </button>
        <h3 className="font-pixel text-[11px] md:text-xs mb-4 pr-12" style={{ color: PURPLE }}>
          TABELLA 4 BIT → HEX
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HEX_TABLE.map(([bin, hex]) => (
            <div
              key={bin}
              className="font-pixel text-[10px] md:text-[11px] text-center py-2"
              style={{ border: '1px solid rgba(177,87,206,.5)' }}
            >
              <span className="text-gray-300">{bin}</span>
              <span className="text-gray-400">=</span>
              <span style={{ color: GREEN }}>{hex}</span>
            </div>
          ))}
        </div>
        <p className="font-pixel text-[10px] text-gray-400 mt-4 leading-relaxed">Clicca fuori o premi X per chiudere.</p>
      </div>
    </div>
  );
}

// ==================== SCHERMATE ====================

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function TitleScreen({
  hiScore,
  onStart,
  onKonami,
  onSecret,
}: {
  hiScore: number;
  onStart: () => void;
  onKonami: () => void;
  onSecret: () => void;
}) {
  const [clicks, setClicks] = useState<number[]>([]);
  const seq = useRef<string[]>([]);
  const konamiRef = useRef(onKonami);
  konamiRef.current = onKonami;
  const startRef = useRef(onStart);
  startRef.current = onStart;

  useEffect(() => {
    const push = (token: string) => {
      seq.current = [...seq.current, token].slice(-KONAMI.length);
      if (seq.current.length === KONAMI.length && seq.current.every((t, i) => t === KONAMI[i])) {
        seq.current = [];
        konamiRef.current();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      push(k);
    };

    // Mobile: swipe = frecce, tap = B poi A
    let sx = 0;
    let sy = 0;
    let tapB = true;
    const onStartTouch = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onEndTouch = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) < 25 && Math.abs(dy) < 25) {
        push(tapB ? 'b' : 'a');
        tapB = !tapB;
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) push(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
      else push(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onStartTouch, { passive: true });
    window.addEventListener('touchend', onEndTouch, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onStartTouch);
      window.removeEventListener('touchend', onEndTouch);
    };
  }, []);

  const handleGroupClick = () => {
    const now = Date.now();
    const recent = [...clicks, now].filter((t) => now - t < 5000);
    if (recent.length >= 10) {
      setClicks([]);
      onSecret();
    } else {
      setClicks(recent);
    }
  };

  return (
    <Frame>
      <p className="font-pixel text-[10px] text-gray-400">
        HI-SCORE <span style={{ color: YELLOW }}>{String(hiScore).padStart(6, '0')}</span>
      </p>

      <div className="animate-float text-center">
        <p className="font-pixel text-[10px] md:text-sm tracking-[0.2em] neon-text-green mb-3 leading-relaxed">
          SISTEMI DI NUMERAZIONE
        </p>
        <h1 className="font-pixel text-2xl md:text-5xl neon-text-pink animate-glow leading-tight">
          ESCAPE GAME
        </h1>
      </div>

      <button
        type="button"
        onClick={handleGroupClick}
        className="mt-4 text-center cursor-default select-none"
        aria-label="Gruppo 3: Loche, Cotza, Atzori"
      >
        <span className="block text-3xl mb-2">👾</span>
        <span className="block font-pixel text-[10px] md:text-xs tracking-[0.1em] neon-text-blue leading-relaxed">
          GRUPPO 3
        </span>
        <span className="block font-pixel text-[10px] md:text-xs neon-text-blue leading-relaxed mt-1">
          LOCHE • COTZA • ATZORI
        </span>
      </button>

      <div className="text-center">
        <p className="font-pixel text-[10px] text-gray-400">Prof. Concu</p>
        <p className="font-pixel text-[10px] text-gray-400 mt-2">Compito 1 • A.S. 2026/2027</p>
      </div>

      <button
        type="button"
        onClick={() => {
          play('click');
          onStart();
        }}
        className="font-pixel text-sm md:text-base mt-6 animate-blink min-h-[44px] px-4"
        style={{ color: PINK, textShadow: `0 0 10px ${PINK}` }}
      >
        PRESS START
      </button>
    </Frame>
  );
}

function MenuScreen({
  hasProgress,
  onNew,
  onContinue,
  onClear,
}: {
  hasProgress: boolean;
  onNew: () => void;
  onContinue: () => void;
  onClear: () => void;
}) {
  const [showClear, setShowClear] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <Frame>
      <h2 className="font-pixel text-2xl neon-text-pink animate-glow">MENU</h2>

      <div className="font-pixel text-[10px] md:text-xs text-gray-300 text-center max-w-md leading-[2.1]">
        <p>Completa 4 MISSIONI sui sistemi di numerazione.</p>
        <p className="mt-3">
          Ogni missione ha una <span style={{ color: GREEN }}>LEZIONE</span> e poi un{' '}
          <span style={{ color: BLUE }}>QUIZ</span>. Hai 3 vite per missione.
        </p>
        <p className="mt-3">
          Ogni missione ti rivela una cifra della <span style={{ color: PINK }}>PASSWORD</span> finale!
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-2 items-stretch w-64">
        {hasProgress && (
          <Btn onClick={onContinue} className="animate-slide-up">
            CONTINUA
          </Btn>
        )}
        <Btn onClick={onNew} variant={hasProgress ? 'pink' : 'green'} className="animate-slide-up">
          {hasProgress ? 'NUOVA PARTITA' : 'INIZIA'}
        </Btn>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setShowClear((v) => !v)}
          className="font-pixel text-[10px] text-gray-400 min-h-[44px] px-3"
        >
          &copy; Gruppo 3 • Escape Game
        </button>
        {showClear && (
          <div className="mt-2">
            <Btn
              variant="pink"
              onClick={() => {
                if (!confirm) {
                  setConfirm(true);
                  return;
                }
                onClear();
                setConfirm(false);
                setShowClear(false);
              }}
            >
              {confirm ? 'SICURO? CLICCA ANCORA' : 'CANCELLA DATI'}
            </Btn>
          </div>
        )}
      </div>
    </Frame>
  );
}

function MissionsScreen({
  missions,
  completedMissions,
  justUnlocked,
  onSelectMission,
  onBack,
  onPasswordScreen,
}: {
  missions: Mission[];
  completedMissions: string[];
  justUnlocked: string | null;
  onSelectMission: (mission: Mission) => void;
  onBack: () => void;
  onPasswordScreen: () => void;
}) {
  const allDone = missions.every((m) => completedMissions.includes(m.id));

  return (
    <Frame>
      <div className="flex flex-col items-center gap-5 w-full max-w-4xl">
        <h2 className="font-pixel text-xl neon-text-pink">MISSIONI</h2>
        <p className="font-pixel text-[10px] text-gray-400 text-center leading-relaxed">
          Completa le missioni in ordine per ottenere le cifre della password
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {missions.map((mission, i) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isUnlocked = !mission.requiredMission || completedMissions.includes(mission.requiredMission);
            const isLocked = !isUnlocked && !isCompleted;
            const unlocking = justUnlocked === mission.id;
            const color = isLocked ? '#555' : isCompleted ? '#22c55e' : mission.color;

            return (
              <button
                key={mission.id}
                type="button"
                disabled={isCompleted || isLocked}
                onClick={() => onSelectMission(mission)}
                aria-label={`Missione ${i + 1}: ${mission.name}${isCompleted ? ' (completata)' : isLocked ? ' (bloccata)' : ''}`}
                className={`card relative flex flex-col items-center justify-between gap-3 p-3 md:p-4 border-2 transition-all animate-slide-up ${
                  isCompleted || isLocked ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                } ${unlocking ? 'unlocking' : ''}`}
                style={
                  {
                    '--c': mission.color,
                    animationDelay: `${i * 0.1}s`,
                    borderColor: color,
                    borderStyle: isLocked ? 'dashed' : 'solid',
                    boxShadow: isCompleted || isLocked ? 'none' : `0 0 15px ${mission.color}55`,
                    minHeight: 150,
                    background: 'rgba(10,10,20,.7)',
                    filter: isLocked ? 'grayscale(1)' : undefined,
                    opacity: isLocked ? 0.6 : isCompleted ? 0.75 : 1,
                  } as CSSProperties
                }
              >
                <span className="font-pixel text-[10px]" style={{ color: isLocked ? '#777' : '#ddd' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-pixel text-3xl md:text-4xl" style={{ color: isLocked ? '#555' : mission.color }}>
                  {mission.icon}
                </span>
                <span
                  className="font-pixel text-[10px] md:text-[10px] text-center leading-relaxed"
                  style={{ color: isLocked ? '#777' : mission.color }}
                >
                  {mission.name}
                </span>
                <span className="font-pixel text-[10px] text-gray-400">
                  {isCompleted ? 'COMPLETATA' : isLocked ? 'BLOCCATA' : '▶ GIOCA'}
                </span>

                {isCompleted && (
                  <span className="absolute top-1 right-2 text-xl font-bold" style={{ color: '#22c55e' }}>
                    ✓
                  </span>
                )}
                {isLocked && <span className="absolute top-1 right-2 text-xl">🔒</span>}
                {unlocking && <span className="absolute top-1 right-2 text-2xl lock-open">🔓</span>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="font-pixel text-[10px] neon-text-green">PASSWORD</p>
          <div className="flex gap-2">
            {missions.map((m) => {
              const done = completedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="w-11 h-12 flex items-center justify-center font-pixel text-lg"
                  style={{
                    border: `2px solid ${done ? m.color : '#444'}`,
                    color: done ? m.color : '#666',
                    boxShadow: done ? `0 0 10px ${m.color}` : 'none',
                  }}
                >
                  {done ? m.passwordNumber : '?'}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <Btn onClick={onBack} variant="pink">
            ◀ MENU
          </Btn>
          {allDone && (
            <Btn onClick={onPasswordScreen} className="animate-glow">
              INSERT PASSWORD
            </Btn>
          )}
        </div>
      </div>
    </Frame>
  );
}

function MissionIntroScreen({
  mission,
  onStart,
  onBack,
}: {
  mission: Mission;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <Frame>
      <div className="flex flex-col items-center gap-6 max-w-lg text-center">
        <div className="animate-float font-pixel text-6xl md:text-7xl" style={{ color: mission.color, textShadow: `0 0 20px ${mission.color}` }}>
          {mission.icon}
        </div>
        <h2 className="font-pixel text-base md:text-xl leading-relaxed" style={{ color: mission.color, textShadow: `0 0 12px ${mission.color}` }}>
          {mission.name}
        </h2>
        <p className="font-pixel text-[10px] md:text-xs text-gray-300 leading-[2.1]">{mission.description}</p>
        <p className="font-pixel text-[10px] md:text-xs text-gray-400">
          📚 {mission.lessons.length} lezioni • ❓ {mission.questions.length} domande
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Btn onClick={onBack} variant="pink">
            ◀ INDIETRO
          </Btn>
          <Btn onClick={onStart} color={mission.color}>
            INIZIA LEZIONE
          </Btn>
        </div>
      </div>
    </Frame>
  );
}

// Evidenzia le parole in MAIUSCOLO con il colore della missione
function Highlighted({ text, color }: { text: string; color: string }) {
  const parts = text.split(/([A-ZÀÈÉÌÒÙ]{3,})/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color, textShadow: `0 0 6px ${color}88` }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function LessonScreen({
  mission,
  lessonPage,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onStartQuiz,
}: {
  mission: Mission;
  lessonPage: LessonPage;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onStartQuiz: () => void;
}) {
  const fullText = lessonPage.content.join('\n');
  const [count, setCount] = useState(0);
  const done = count >= fullText.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= fullText.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 20);
    return () => window.clearInterval(id);
  }, [fullText]);

  useEffect(() => {
    if (count > 0 && !done && count % 3 === 0 && fullText[count - 1] !== ' ') play('typing');
  }, [count, done, fullText]);

  const skip = () => setCount(fullText.length);
  const isLast = currentPage === totalPages - 1;
  const shown = fullText.slice(0, count);

  const advance = () => {
    if (!done) {
      skip();
      return;
    }
    if (isLast) onStartQuiz();
    else onNext();
  };

  return (
    <Frame>
      <div className="w-full max-w-2xl flex flex-col items-center gap-5">
        <p className="font-pixel text-[10px] text-gray-400">
          {mission.name} • LEZIONE {currentPage + 1}/{totalPages}
        </p>
        <h2
          className="font-pixel text-sm md:text-lg text-center leading-relaxed"
          style={{ color: mission.color, textShadow: `0 0 12px ${mission.color}` }}
        >
          {lessonPage.title}
        </h2>

        <div
          className="relative w-full p-4 md:p-6 cursor-pointer select-none animate-slide-up"
          style={{
            border: `2px solid ${mission.color}`,
            boxShadow: `0 0 18px ${mission.color}88, inset 0 0 14px ${mission.color}22`,
            background: 'rgba(10,10,22,.88)',
          }}
          onClick={skip}
          role="article"
        >
          {/* testo completo invisibile: riserva lo spazio e mantiene stabile il layout */}
          <div
            className="font-pixel text-[11px] md:text-xs leading-[2.2] whitespace-pre-wrap break-words"
            style={{ visibility: 'hidden' }}
            aria-hidden
          >
            {fullText}
          </div>
          <div
            className="absolute left-4 right-4 top-4 md:left-6 md:right-6 md:top-6 font-pixel text-[11px] md:text-xs leading-[2.2] whitespace-pre-wrap break-words text-gray-100"
            aria-hidden
          >
            <Highlighted text={shown} color={mission.color} />
            {!done && <span className="caret" style={{ color: mission.color }}>█</span>}
          </div>
          <p className="sr-only">{fullText}</p>
        </div>

        <p className="font-pixel text-[10px] text-gray-400 h-3">{done ? '' : 'Tocca il box per completare il testo'}</p>

        <div className="flex gap-3" role="group" aria-label={`Pagina ${currentPage + 1} di ${totalPages}`}>
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className="inline-block w-3 h-3"
              style={{
                background: i === currentPage ? mission.color : i < currentPage ? `${mission.color}88` : 'transparent',
                border: `2px solid ${mission.color}`,
                boxShadow: i === currentPage ? `0 0 8px ${mission.color}` : 'none',
              }}
            />
          ))}
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {currentPage > 0 && (
            <Btn onClick={onPrev} variant="pink">
              ◀ INDIETRO
            </Btn>
          )}
          <Btn onClick={advance} color={mission.color}>
            {isLast ? 'INIZIA IL QUIZ' : 'AVANTI'} ▶
          </Btn>
        </div>
      </div>
    </Frame>
  );
}

function QuestionScreen({
  mission,
  question,
  index,
  total,
  lives,
  onResolve,
  onHint,
}: {
  mission: Mission;
  question: Question;
  index: number;
  total: number;
  lives: number;
  onResolve: (answer: number, hintUsed: boolean) => void;
  onHint: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [removed, setRemoved] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const doneRef = useRef(false);
  const resolveRef = useRef(onResolve);
  resolveRef.current = onResolve;
  const hintRef = useRef(false);
  hintRef.current = removed !== null;
  const doneTimer = useRef<number | undefined>(undefined);

  const finish = useCallback(
    (idx: number) => {
      if (doneRef.current) return;
      doneRef.current = true;
      setSelected(idx);
      play(idx === question.correctIndex ? 'correct' : 'wrong');
      doneTimer.current = window.setTimeout(() => resolveRef.current(idx, hintRef.current), 1100);
    },
    [question],
  );

  useEffect(() => () => window.clearTimeout(doneTimer.current), []);

  useEffect(() => {
    const end = Date.now() + TIME_LIMIT * 1000;
    const id = window.setInterval(() => {
      if (doneRef.current) {
        window.clearInterval(id);
        return;
      }
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        window.clearInterval(id);
        finish(-1);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [finish]);

  useEffect(() => {
    if (!doneRef.current && timeLeft <= 10 && timeLeft > 0) play('tick');
  }, [timeLeft]);

  const applyHint = () => {
    if (doneRef.current || removed !== null) return;
    const wrong = question.options.map((_, i) => i).filter((i) => i !== question.correctIndex);
    setRemoved(wrong[Math.floor(Math.random() * wrong.length)]);
    onHint();
  };

  const answered = selected !== null;
  const timerColor = timeLeft > 15 ? GREEN : timeLeft > 10 ? YELLOW : PINK;
  const urgent = timeLeft <= 10;

  return (
    <Frame top>
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {/* vite + timer */}
        <div className="flex items-center justify-between pr-14">
          <Hearts lives={lives} />
          <div
            className={`font-pixel text-base md:text-xl ${urgent && !answered ? 'animate-blink' : ''}`}
            style={{ color: timerColor, textShadow: `0 0 10px ${timerColor}` }}
            role="timer"
            aria-label={`${timeLeft} secondi rimasti`}
          >
            ⏱ {String(timeLeft).padStart(2, '0')}s
          </div>
        </div>

        {/* barra timer */}
        <div className="w-full h-3" style={{ border: '2px solid #333', background: '#111' }}>
          <div
            className="h-full"
            style={{
              width: `${(timeLeft / TIME_LIMIT) * 100}%`,
              background: timerColor,
              boxShadow: `0 0 8px ${timerColor}`,
              transition: 'width 1s linear, background .3s',
            }}
          />
        </div>

        {/* barra progresso missione */}
        <div>
          <div className="flex justify-between font-pixel text-[10px] text-gray-400 mb-2">
            <span style={{ color: mission.color }}>{mission.name}</span>
            <span>
              {index + 1}/{total}
            </span>
          </div>
          <div className="w-full h-3" style={{ border: `2px solid ${mission.color}55`, background: '#111' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
                background: mission.color,
                boxShadow: `0 0 10px ${mission.color}`,
              }}
            />
          </div>
        </div>

        {/* domanda */}
        <div
          className="p-4 md:p-6 mt-1"
          style={{
            border: `2px solid ${mission.color}`,
            boxShadow: `0 0 16px ${mission.color}77, inset 0 0 12px ${mission.color}22`,
            background: 'rgba(10,10,22,.88)',
          }}
        >
          <p className="font-pixel text-[11px] md:text-sm leading-[2.0] text-white">{question.text}</p>
        </div>

        {/* opzioni */}
        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isRemoved = removed === i;
            const isWrongPick = answered && selected === i && !isCorrect;
            const showCorrect = answered && isCorrect;
            const border = showCorrect ? GREEN : isWrongPick ? PINK : isRemoved ? '#444' : `${mission.color}99`;
            return (
              <button
                key={i}
                type="button"
                disabled={answered || isRemoved}
                onClick={() => finish(i)}
                className={`opt text-left p-3 md:p-4 font-pixel text-[10px] md:text-xs leading-[1.9] flex gap-3 items-start ${
                  isWrongPick ? 'animate-shake' : ''
                }`}
                style={{
                  border: `2px solid ${border}`,
                  background: showCorrect ? 'rgba(194,255,45,.14)' : isWrongPick ? 'rgba(255,64,111,.16)' : 'rgba(10,10,22,.8)',
                  color: showCorrect ? GREEN : isWrongPick ? PINK : isRemoved ? '#555' : '#eee',
                  boxShadow: showCorrect ? `0 0 14px ${GREEN}` : isWrongPick ? `0 0 14px ${PINK}` : 'none',
                  textDecoration: isRemoved ? 'line-through' : 'none',
                  opacity: isRemoved ? 0.5 : 1,
                  minHeight: 56,
                  cursor: answered || isRemoved ? 'default' : 'pointer',
                }}
              >
                <span style={{ color: isRemoved ? '#555' : mission.color }}>{String.fromCharCode(65 + i)}.</span>
                <span className="break-words min-w-0">{opt}</span>
              </button>
            );
          })}
        </div>

        {selected === -1 && (
          <p className="font-pixel text-[11px] text-center animate-blink" style={{ color: PINK }}>
            ⏰ TEMPO SCADUTO!
          </p>
        )}

        {/* hint + tabella */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Btn onClick={applyHint} disabled={answered || removed !== null} color={YELLOW}>
            💡 HINT {removed !== null ? '(USATO)' : '(-50% PUNTI)'}
          </Btn>
          {mission.id === 'group3' && (
            <Btn onClick={() => setShowTable(true)} color={PURPLE}>
              📋 TABELLA
            </Btn>
          )}
        </div>
      </div>
      {showTable && <ReferenceTable onClose={() => setShowTable(false)} />}
    </Frame>
  );
}

interface LastResult {
  ok: boolean;
  timeout: boolean;
  points: number;
  question: Question;
  hintUsed: boolean;
  isLast: boolean;
}

function CorrectScreen({ result, color, onNext }: { result: LastResult; color: string; onNext: () => void }) {
  return (
    <Frame>
      <Burst color={color} />
      <div className="flex flex-col items-center gap-5 max-w-lg text-center">
        <div className="text-7xl pop-in">🎉</div>
        <h2 className="font-pixel text-2xl md:text-3xl neon-text-green animate-glow">CORRETTO!</h2>
        {result.points > 0 && (
          <p className="font-pixel text-sm" style={{ color: YELLOW }}>
            +{result.points} PUNTI{result.hintUsed ? ' (hint usato)' : ''}
          </p>
        )}
        <div
          className="p-4 text-left w-full"
          style={{ border: `2px solid ${GREEN}88`, background: 'rgba(10,10,22,.85)' }}
        >
          <p className="font-pixel text-[10px] mb-3" style={{ color: GREEN }}>
            PERCHÉ?
          </p>
          <p className="font-pixel text-[10px] md:text-xs leading-[2.0] text-gray-200">{result.question.explanation}</p>
        </div>
        <Btn onClick={onNext}>{result.isLast ? 'COMPLETA MISSIONE ▶' : 'AVANTI ▶'}</Btn>
      </div>
    </Frame>
  );
}

function WrongScreen({
  result,
  lives,
  onRetry,
}: {
  result: LastResult;
  lives: number;
  onRetry: () => void;
}) {
  const gameOver = lives <= 0;
  return (
    <Frame>
      <div className="flex flex-col items-center gap-5 max-w-lg text-center">
        <div className="text-7xl pop-in">{gameOver ? '☠️' : '💀'}</div>
        <h2 className="font-pixel text-2xl md:text-3xl neon-text-pink animate-glow">
          {result.timeout ? 'TEMPO SCADUTO!' : 'SBAGLIATO!'}
        </h2>
        <Hearts lives={lives} justLost={lives} />

        <div className="p-4 text-left w-full" style={{ border: `2px solid ${PINK}88`, background: 'rgba(10,10,22,.85)' }}>
          <p className="font-pixel text-[10px] mb-3" style={{ color: GREEN }}>
            RISPOSTA CORRETTA
          </p>
          <p className="font-pixel text-[10px] md:text-xs leading-[2.0] text-white mb-4">
            {String.fromCharCode(65 + result.question.correctIndex)}. {result.question.options[result.question.correctIndex]}
          </p>
          <p className="font-pixel text-[10px] mb-3" style={{ color: PINK }}>
            PERCHÉ?
          </p>
          <p className="font-pixel text-[10px] md:text-xs leading-[2.0] text-gray-200">{result.question.explanation}</p>
        </div>

        {gameOver ? (
          <>
            <p className="font-pixel text-sm leading-relaxed" style={{ color: PINK, textShadow: `0 0 10px ${PINK}` }}>
              GAME OVER
            </p>
            <p className="font-pixel text-[10px] md:text-xs text-gray-300 leading-[2.0]">
              Devi ricominciare la missione. Riparti dalla lezione con 3 vite nuove!
            </p>
            <Btn onClick={onRetry} variant="pink">
              RICOMINCIA
            </Btn>
          </>
        ) : (
          <>
            <p className="font-pixel text-[10px] md:text-xs text-gray-300 leading-[2.0]">
              Hai perso una vita! Torna a studiare...
            </p>
            <Btn onClick={onRetry} variant="pink">
              TORNA ALLA LEZIONE
            </Btn>
          </>
        )}
      </div>
    </Frame>
  );
}

function MissionCompleteScreen({
  mission,
  missionTime,
  errors,
  lives,
  hints,
  onContinue,
}: {
  mission: Mission;
  missionTime: number;
  errors: number;
  lives: number;
  hints: number;
  onContinue: () => void;
}) {
  useEffect(() => {
    play('mission-complete');
  }, []);

  return (
    <Frame>
      <Burst color={mission.color} />
      <div className="flex flex-col items-center gap-5 max-w-lg text-center">
        <div className="text-7xl trophy">🏆</div>
        <h2 className="font-pixel text-lg md:text-2xl neon-text-green animate-glow leading-relaxed">MISSIONE COMPLETATA!</h2>
        <p className="font-pixel text-[10px] text-gray-400">NUMERO SEGRETO</p>
        <div
          className="w-24 h-28 flex items-center justify-center font-pixel text-5xl pop-in"
          style={{
            border: `3px solid ${mission.color}`,
            color: mission.color,
            boxShadow: `0 0 24px ${mission.color}, inset 0 0 16px ${mission.color}44`,
            textShadow: `0 0 14px ${mission.color}`,
            background: 'rgba(10,10,22,.9)',
          }}
          aria-label={`Numero segreto ${mission.passwordNumber}`}
        >
          {mission.passwordNumber}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full font-pixel text-[10px] md:text-xs" style={{ lineHeight: 1.8 }}>
          <Stat label="⏱️ TEMPO" value={formatTime(missionTime)} color={BLUE} />
          <Stat label="💔 ERRORI" value={String(errors)} color={PINK} />
          <Stat label="❤️ VITE RIMASTE" value={`${lives}/${MAX_LIVES}`} color={GREEN} />
          <Stat label="💡 HINT" value={String(hints)} color={YELLOW} />
        </div>

        <Btn onClick={onContinue} color={mission.color}>
          CONTINUA ▶
        </Btn>
      </div>
    </Frame>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 text-center" style={{ border: `2px solid ${color}77`, background: 'rgba(10,10,22,.85)' }}>
      <p className="text-gray-400 text-[10px] md:text-[10px] mb-2">{label}</p>
      <p style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</p>
    </div>
  );
}

function PasswordScreen({
  onSubmit,
  onEgg,
  onBack,
}: {
  onSubmit: () => void;
  onEgg: () => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (input === 'CONCU') {
      onEgg();
      setInput('');
      return;
    }
    if (input === FULL_PASSWORD) {
      onSubmit();
      return;
    }
    play('wrong');
    setError(true);
    window.setTimeout(() => {
      setError(false);
      setInput('');
    }, 600);
  };

  const boxes = Math.max(FULL_PASSWORD.length, input.length);

  return (
    <Frame>
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <h2 className="font-pixel text-xl neon-text-pink animate-glow">PASSWORD</h2>
        <p className="font-pixel text-[10px] md:text-xs text-gray-300 leading-[2.0]">
          Inserisci le {FULL_PASSWORD.length} cifre segrete nell&apos;ordine delle missioni!
        </p>

        <div
          className={`relative flex gap-2 md:gap-3 cursor-text ${error ? 'animate-shake' : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {Array.from({ length: boxes }, (_, i) => {
            const ch = input[i];
            const active = i === input.length;
            return (
              <div
                key={i}
                className="w-12 h-16 md:w-14 md:h-20 flex items-center justify-center font-pixel text-2xl"
                style={{
                  border: `3px solid ${error ? PINK : active ? GREEN : '#555'}`,
                  color: error ? PINK : GREEN,
                  boxShadow: error ? `0 0 14px ${PINK}` : active ? `0 0 12px ${GREEN}` : 'none',
                  background: 'rgba(10,10,22,.9)',
                }}
              >
                {ch ?? (active ? <span className="caret">_</span> : '')}
              </div>
            );
          })}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
            aria-label="Inserisci la password"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={5}
          />
        </div>

        {error && (
          <p className="font-pixel text-[10px] animate-blink" style={{ color: PINK }}>
            PASSWORD ERRATA!
          </p>
        )}

        <div className="flex gap-4 flex-wrap justify-center">
          <Btn onClick={onBack} variant="pink">
            ◀ BACK
          </Btn>
          <Btn onClick={submit}>SUBMIT</Btn>
        </div>
      </div>
    </Frame>
  );
}

interface FinalStats {
  time: number;
  livesLost: number;
  hints: number;
  firstTry: number;
  score: number;
  rank: Rank;
  newRecord: boolean;
}

function VictoryScreen({ stats, onRestart }: { stats: FinalStats; onRestart: () => void }) {
  useEffect(() => {
    play('mission-complete');
  }, []);
  const rankColor = RANK_COLOR[stats.rank];

  return (
    <Frame>
      <ConfettiRain />
      <div className="flex flex-col items-center gap-5 max-w-lg w-full text-center">
        <div className="text-7xl trophy">🎊</div>
        <h2 className="font-pixel text-2xl md:text-4xl neon-text-green animate-glow">HAI VINTO!</h2>
        <p className="font-pixel text-[10px] md:text-xs text-gray-300 leading-[2.1]">
          Password {FULL_PASSWORD} decifrata! Hai completato tutte le missioni sui sistemi di numerazione.
        </p>

        <div
          className="w-full p-4"
          style={{ border: `2px solid ${BLUE}`, boxShadow: `0 0 16px ${BLUE}66`, background: 'rgba(10,10,22,.9)' }}
        >
          <p className="font-pixel text-[10px] mb-4" style={{ color: BLUE }}>
            STATISTICHE
          </p>
          <ul className="font-pixel text-[10px] md:text-xs leading-[2.4] text-left">
            <StatRow label="⏱️ Tempo totale" value={formatTime(stats.time)} />
            <StatRow label="✅ Corrette al 1° tentativo" value={`${stats.firstTry}/${TOTAL_QUESTIONS}`} />
            <StatRow label="💔 Vite perse" value={String(stats.livesLost)} />
            <StatRow label="💡 Hint usati" value={String(stats.hints)} />
            <StatRow label="🏆 Punteggio finale" value={String(stats.score)} highlight />
          </ul>
          {stats.newRecord && (
            <p className="font-pixel text-[10px] mt-3 animate-blink" style={{ color: YELLOW }}>
              ★ NUOVO RECORD! ★
            </p>
          )}
        </div>

        <div>
          <p className="font-pixel text-[10px] text-gray-400 mb-3">⭐ VOTO</p>
          <div
            className={`font-pixel text-7xl md:text-8xl ${stats.rank === 'S' ? 'rank-blink' : 'rank-glow'}`}
            style={{ color: rankColor }}
            aria-label={`Rank ${stats.rank}`}
          >
            {stats.rank}
          </div>
        </div>

        <div className="font-pixel text-[10px] text-gray-400 leading-[2.1]">
          <p style={{ color: PURPLE }}>Gruppo 3: Loche • Cotza • Atzori</p>
          <p>Prof. Concu • A.S. 2026/2027</p>
        </div>

        <Btn onClick={onRestart} variant="pink">
          RICOMINCIA
        </Btn>
      </div>
    </Frame>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <li className="flex justify-between gap-3 border-b border-white/10 last:border-0 py-1">
      <span className="text-gray-300">{label}</span>
      <span style={{ color: highlight ? YELLOW : '#fff' }}>{value}</span>
    </li>
  );
}

// ==================== APP ====================

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [fading, setFading] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentLessonPage, setCurrentLessonPage] = useState(0);
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [totalLivesLost, setTotalLivesLost] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [missionHints, setMissionHints] = useState(0);
  const [missionErrors, setMissionErrors] = useState(0);
  const [missionTime, setMissionTime] = useState(0);
  const [failedQuestions, setFailedQuestions] = useState<string[]>([]);
  const [scoredQuestions, setScoredQuestions] = useState<string[]>([]);
  const [gameStartTime, setGameStartTime] = useState(() => Date.now());
  const [missionStartTime, setMissionStartTime] = useState(() => Date.now());
  const [isMuted, setIsMuted] = useState(true);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [rainbow, setRainbow] = useState(false);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [finalStats, setFinalStats] = useState<FinalStats | null>(null);
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [shake, setShake] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);

  const goTimer = useRef<number | undefined>(undefined);
  const bannerTimer = useRef<number | undefined>(undefined);

  // Cambio schermata con fade (150ms out + 150ms in = 300ms)
  const go = useCallback((next: Screen, apply?: () => void) => {
    window.clearTimeout(goTimer.current);
    setFading(true);
    goTimer.current = window.setTimeout(() => {
      apply?.();
      setScreen(next);
      setFading(false);
    }, 150);
  }, []);

  const showBanner = useCallback((text: string, ms = 3000) => {
    window.clearTimeout(bannerTimer.current);
    setBanner(text);
    bannerTimer.current = window.setTimeout(() => setBanner(null), ms);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(goTimer.current);
      window.clearTimeout(bannerTimer.current);
    },
    [],
  );

  const persist = useCallback((patch: Partial<SaveData>) => {
    setSave((prev) => {
      const next = { ...prev, ...patch };
      writeSave(next);
      return next;
    });
  }, []);

  // Suono di sblocco quando si torna alla griglia missioni
  useEffect(() => {
    if (screen !== 'missions' || !justUnlocked) return;
    play('unlock');
    const t = window.setTimeout(() => setJustUnlocked(null), 2600);
    return () => window.clearTimeout(t);
  }, [screen, justUnlocked]);

  // ---------- audio ----------
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundOn = !nextMuted;
    if (!nextMuted) {
      getCtx();
      play('click');
    }
  };

  // ---------- easter egg ----------
  const handleKonami = () => {
    if (konamiActivated) return;
    setKonamiActivated(true);
    play('special');
    setFlashKey((k) => k + 1);
    showBanner('CHEAT ACTIVATED ✨  +1000 PUNTI', 3000);
    setRainbow(true);
    window.setTimeout(() => setRainbow(false), 3000);
  };

  const handleSecretClick = useCallback(() => {
    play('special');
    showBanner('Made with 💜 by Loche, Cotza & Atzori', 3500);
  }, [showBanner]);

  const handleConcuEgg = useCallback(() => {
    play('special');
    setFlashKey((k) => k + 1);
    showBanner('Prof. Concu approved! 🎓', 2500);
  }, [showBanner]);

  // ---------- flusso ----------
  const resetProgress = (bonus: boolean) => {
    setCompletedMissions([]);
    setScore(bonus ? 1000 : 0);
    setLives(MAX_LIVES);
    setTotalLivesLost(0);
    setFirstTryCorrect(0);
    setHintsUsed(0);
    setMissionHints(0);
    setMissionErrors(0);
    setFailedQuestions([]);
    setScoredQuestions([]);
    setJustUnlocked(null);
    setFinalStats(null);
    setLastResult(null);
  };

  const handleNewGame = () => {
    const bonus = konamiActivated;
    persist({ completed: [], score: 0, livesLost: 0, hints: 0, firstTry: 0, elapsed: 0 });
    go('missions', () => {
      resetProgress(bonus);
      setGameStartTime(Date.now());
    });
  };

  const handleContinue = () => {
    const s = save;
    go('missions', () => {
      setCompletedMissions(s.completed);
      setScore(s.score + (konamiActivated ? 1000 : 0));
      setTotalLivesLost(s.livesLost);
      setHintsUsed(s.hints);
      setFirstTryCorrect(s.firstTry);
      setLives(MAX_LIVES);
      setFailedQuestions([]);
      setScoredQuestions([]);
      setFinalStats(null);
      setGameStartTime(Date.now() - s.elapsed);
    });
  };

  const handleClearData = () => {
    clearSave();
    setSave(EMPTY_SAVE);
    showBanner('DATI CANCELLATI', 2000);
  };

  const handleSelectMission = (mission: Mission) => {
    go('mission-intro', () => {
      setCurrentMission(mission);
      setLives(MAX_LIVES);
      setMissionErrors(0);
      setMissionHints(0);
      setCurrentLessonPage(0);
      setCurrentQuestionIndex(0);
      setQuizOrder(shuffledOrder(mission.questions.length));
    });
  };

  const handleStartMission = () => {
    go('lesson', () => {
      setMissionStartTime(Date.now());
      setCurrentLessonPage(0);
    });
  };

  const handleStartQuiz = () => {
    go('playing', () => setCurrentQuestionIndex(0));
  };

  const handleResolve = (answer: number, hintUsed: boolean) => {
    if (!currentMission) return;
    const origIdx = quizOrder[currentQuestionIndex];
    const q = currentMission.questions[origIdx];
    const key = `${currentMission.id}:${origIdx}`;
    const isLast = currentQuestionIndex + 1 >= quizOrder.length;

    if (answer === q.correctIndex) {
      let pts = 0;
      if (!scoredQuestions.includes(key)) {
        const failedBefore = failedQuestions.includes(key);
        pts = failedBefore ? 50 : 100;
        if (hintUsed) pts = Math.floor(pts / 2);
        if (!failedBefore) setFirstTryCorrect((n) => n + 1);
        setScore((s) => s + pts);
        setScoredQuestions((arr) => [...arr, key]);
      }
      setLastResult({ ok: true, timeout: false, points: pts, question: q, hintUsed, isLast });
      go('correct');
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setTotalLivesLost((n) => n + 1);
      setMissionErrors((n) => n + 1);
      setFailedQuestions((arr) => (arr.includes(key) ? arr : [...arr, key]));
      setLastResult({ ok: false, timeout: answer === -1, points: 0, question: q, hintUsed, isLast });

      play('life-lost');
      if (newLives <= 0) window.setTimeout(() => play('game-over'), 450);
      setShake(true);
      setGlitch(true);
      window.setTimeout(() => setShake(false), 500);
      window.setTimeout(() => setGlitch(false), 700);
      go('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (!currentMission) return;
    if (currentQuestionIndex + 1 < quizOrder.length) {
      go('playing', () => setCurrentQuestionIndex((i) => i + 1));
      return;
    }
    // missione completata
    const mission = currentMission;
    const newCompleted = completedMissions.includes(mission.id) ? completedMissions : [...completedMissions, mission.id];
    const elapsed = Date.now() - gameStartTime;
    persist({
      completed: newCompleted,
      score,
      livesLost: totalLivesLost,
      hints: hintsUsed,
      firstTry: firstTryCorrect,
      elapsed,
    });
    go('mission-complete', () => {
      setCompletedMissions(newCompleted);
      setMissionTime(Date.now() - missionStartTime);
      const next = MISSIONS.find((m) => m.requiredMission === mission.id);
      setJustUnlocked(next ? next.id : null);
    });
  };

  const handleWrongContinue = () => {
    if (!currentMission) return;
    const mission = currentMission;
    go('lesson', () => {
      if (lives <= 0) setLives(MAX_LIVES);
      setCurrentLessonPage(0);
      setCurrentQuestionIndex(0);
      setQuizOrder(shuffledOrder(mission.questions.length));
    });
  };

  const handleVictory = () => {
    const time = Date.now() - gameStartTime;
    const rank = calcRank(totalLivesLost, hintsUsed, time);
    const newRecord = score > save.hiScore;
    const bestRank =
      save.bestRank && RANK_ORDER.indexOf(save.bestRank) >= RANK_ORDER.indexOf(rank) ? save.bestRank : rank;
    persist({
      hiScore: Math.max(save.hiScore, score),
      bestRank,
      completed: MISSIONS.map((m) => m.id),
      score,
      livesLost: totalLivesLost,
      hints: hintsUsed,
      firstTry: firstTryCorrect,
      elapsed: time,
    });
    setFinalStats({ time, livesLost: totalLivesLost, hints: hintsUsed, firstTry: firstTryCorrect, score, rank, newRecord });
    go('victory');
  };

  const handleRestart = () => {
    persist({ completed: [], score: 0, livesLost: 0, hints: 0, firstTry: 0, elapsed: 0 });
    go('title', () => {
      resetProgress(false);
      setKonamiActivated(false);
      setCurrentMission(null);
    });
  };

  // ---------- render ----------
  const renderScreen = () => {
    switch (screen) {
      case 'title':
        return (
          <TitleScreen
            hiScore={save.hiScore}
            onStart={() => go('menu')}
            onKonami={handleKonami}
            onSecret={handleSecretClick}
          />
        );

      case 'menu':
        return (
          <MenuScreen
            hasProgress={save.completed.length > 0}
            onNew={handleNewGame}
            onContinue={handleContinue}
            onClear={handleClearData}
          />
        );

      case 'missions':
        return (
          <MissionsScreen
            missions={MISSIONS}
            completedMissions={completedMissions}
            justUnlocked={justUnlocked}
            onSelectMission={handleSelectMission}
            onBack={() => go('menu')}
            onPasswordScreen={() => go('password')}
          />
        );

      case 'mission-intro':
        return currentMission ? (
          <MissionIntroScreen mission={currentMission} onStart={handleStartMission} onBack={() => go('missions')} />
        ) : null;

      case 'lesson':
        return currentMission ? (
          <LessonScreen
            key={`${currentMission.id}-${currentLessonPage}`}
            mission={currentMission}
            lessonPage={currentMission.lessons[currentLessonPage]}
            currentPage={currentLessonPage}
            totalPages={currentMission.lessons.length}
            onPrev={() => go('lesson', () => setCurrentLessonPage((p) => Math.max(0, p - 1)))}
            onNext={() => go('lesson', () => setCurrentLessonPage((p) => p + 1))}
            onStartQuiz={handleStartQuiz}
          />
        ) : null;

      case 'playing': {
        if (!currentMission || quizOrder.length === 0) return null;
        const q = currentMission.questions[quizOrder[currentQuestionIndex]];
        if (!q) return null;
        return (
          <QuestionScreen
            key={`${currentMission.id}-${currentQuestionIndex}-${quizOrder.join('')}`}
            mission={currentMission}
            question={q}
            index={currentQuestionIndex}
            total={quizOrder.length}
            lives={lives}
            onResolve={handleResolve}
            onHint={() => {
              setHintsUsed((n) => n + 1);
              setMissionHints((n) => n + 1);
            }}
          />
        );
      }

      case 'correct':
        return lastResult && currentMission ? (
          <CorrectScreen result={lastResult} color={currentMission.color} onNext={handleNextQuestion} />
        ) : null;

      case 'wrong':
      case 'game-over':
        return lastResult ? <WrongScreen result={lastResult} lives={lives} onRetry={handleWrongContinue} /> : null;

      case 'mission-complete':
        return currentMission ? (
          <MissionCompleteScreen
            mission={currentMission}
            missionTime={missionTime}
            errors={missionErrors}
            lives={lives}
            hints={missionHints}
            onContinue={() => go('missions')}
          />
        ) : null;

      case 'password':
        return <PasswordScreen onSubmit={handleVictory} onEgg={handleConcuEgg} onBack={() => go('missions')} />;

      case 'victory':
        return finalStats ? <VictoryScreen stats={finalStats} onRestart={handleRestart} /> : null;

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-screen overflow-hidden font-pixel text-white crt-effect pixel-grid scanline ${
        shake ? 'animate-shake' : ''
      } ${rainbow ? 'rainbow' : ''}`}
      style={{ height: '100dvh', background: 'var(--dark-bg)' }}
    >
      <GlobalStyles />
      <StarField />

      <button
        type="button"
        onClick={toggleMute}
        className="fixed top-3 right-3 z-[200] w-11 h-11 flex items-center justify-center text-xl"
        style={{
          border: `2px solid ${isMuted ? '#555' : GREEN}`,
          background: 'rgba(10,10,22,.85)',
          boxShadow: isMuted ? 'none' : `0 0 10px ${GREEN}`,
        }}
        aria-label={isMuted ? 'Attiva audio' : 'Disattiva audio'}
        aria-pressed={!isMuted}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <div
          className={glitch ? 'glitch' : ''}
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 150ms linear' }}
        >
          {renderScreen()}
        </div>
      </div>

      {glitch && <div className="glitch-bars" />}
      {flashKey > 0 && <div key={flashKey} className="flash" />}
      {banner && <Banner text={banner} />}
    </div>
  );
}
