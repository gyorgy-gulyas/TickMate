/** Seed (sample) data for first-run state — races, one run, the demo timeline. */
import type { Race, Run, Section, TimelineBarData } from './model';

const tavasziSections: Section[] = [
  { id: 's1', name: 'Rajt szakasz', type: 'normal', prepSec: 5, segments: [{ distanceM: 20, timeSec: 7 }], audioReady: true },
  { id: 's2', name: 'Szlalom', type: 'shared', prepSec: 3, segments: [{ distanceM: 20, timeSec: 8 }, { distanceM: 15, timeSec: 5 }], audioReady: true },
  { id: 's3', name: 'Garázs', type: 'nested', prepSec: 4, segments: [{ distanceM: 15, timeSec: 9 }, { distanceM: 8, timeSec: 4 }], audioReady: true },
  { id: 's4', name: 'Tolatás', type: 'overlap', prepSec: 6, segments: [{ distanceM: 30, timeSec: 9 }, { distanceM: 20, timeSec: 7 }], audioReady: true },
  { id: 's5', name: 'Cikcakk', type: 'shared', prepSec: 4, segments: [{ distanceM: 25, timeSec: 6 }, { distanceM: 18, timeSec: 5 }], audioReady: false },
];

const balatonSections: Section[] = [
  { id: 'b1', name: 'Rajt', type: 'normal', prepSec: 5, segments: [{ distanceM: 25, timeSec: 8 }], audioReady: false },
  { id: 'b2', name: 'Kerülő', type: 'shared', prepSec: 4, segments: [{ distanceM: 40, timeSec: 10 }, { distanceM: 22, timeSec: 7 }], audioReady: false },
  { id: 'b3', name: 'Mólófej', type: 'normal', prepSec: 3, segments: [{ distanceM: 18, timeSec: 6 }], audioReady: false },
];

const matraSections: Section[] = [
  { id: 'm1', name: 'Start', type: 'normal', prepSec: 5, segments: [{ distanceM: 20, timeSec: 7 }], audioReady: false },
  { id: 'm2', name: 'Hajtű', type: 'overlap', prepSec: 4, segments: [{ distanceM: 35, timeSec: 9 }, { distanceM: 24, timeSec: 7 }], audioReady: false },
];

/** Seed races (initial store state). */
export const INITIAL_RACES: Race[] = [
  { id: 'r1', name: 'Tavaszi Oldtimer Kupa', date: '2026.04.12', sections: tavasziSections },
  { id: 'r2', name: 'Balaton Klasszik', date: '2026.05.03', sections: balatonSections },
  { id: 'r3', name: 'Őszi Ügyességi', date: '2025.10.19', sections: matraSections },
  { id: 'r4', name: 'Edzés – Mátra', date: '2026.03.30', sections: [] },
];

// One seed run so Results/Analysis show data on first load.
const SEED_OFFS = [0.1, -0.2, -0.4, 0.9, 0.2];
export const INITIAL_RUNS: Run[] = [
  {
    id: 'run1',
    raceId: 'r1',
    raceName: 'Tavaszi Oldtimer Kupa',
    date: '2026.04.12',
    note: 'Jó ritmus, a 4. kapunál késtem.',
    results: tavasziSections.map((s, si) => ({
      sectionId: s.id,
      name: s.name,
      type: s.type,
      legs: s.segments.map(g => ({
        targetSec: g.timeSec ?? 0,
        actualSec: Math.round(((g.timeSec ?? 0) + SEED_OFFS[si % SEED_OFFS.length]) * 10) / 10,
      })),
    })),
  },
];

/** Illustrative timeline for the Tavaszi Kupa (shared gate + overlap). */
export const TAVASZI_TIMELINE: TimelineBarData[] = [
  { label: '1 · Rajt · 0–7', leftPct: 0, widthPct: 58, variant: 'primary' },
  { label: '2 · Szlalom · 7–12', leftPct: 58, widthPct: 42, variant: 'primary' },
  { label: '3 · Garázs · 4–10', leftPct: 33, widthPct: 50, variant: 'secondary' },
];
