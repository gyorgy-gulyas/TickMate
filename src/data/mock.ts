/**
 * Placeholder data mirroring the prototype. Replaced by a real data model
 * (race/section store) in a later step — do not build persistence on this.
 */
import type { IconName } from '../components';

export type SectionType = 'normal' | 'shared' | 'nested' | 'overlap';

/** A single measured leg: a distance and the time to complete it. */
export type Segment = { distanceM: number; timeSec: number };

export type Section = {
  id: string;
  name: string;
  type: SectionType;
  /** Preparation time (s) before the first measurement — all types. */
  prepSec: number;
  /** Measured legs: 1 for normal, 2 (A, B) for shared / nested / overlap. */
  segments: Segment[];
  /** Whether this section's audio (clicks + countdown) has been generated. */
  audioReady: boolean;
};

/** Number of measured legs a type uses. */
export const segmentCount = (type: SectionType): number => (type === 'normal' ? 1 : 2);

/** Total section time = prep + all leg times. */
export const sectionTotalSec = (s: Section): number => s.prepSec + s.segments.reduce((sum, g) => sum + g.timeSec, 0);

export type Race = {
  id: string;
  name: string;
  date: string;
  sections: Section[];
};

export const SECTION_TYPE_META: Record<SectionType, { label: string; short: string; icon: IconName }> = {
  normal: { label: 'Normál', short: 'Normál', icon: 'arrow-right' },
  shared: { label: 'Egymást követő', short: 'Követő', icon: 'link-simple' },
  nested: { label: 'Egymásba fonódó', short: 'Fonódó', icon: 'intersect' },
  overlap: { label: 'Átfedő', short: 'Átfedő', icon: 'arrows-split' },
};

/** Section types that use the single-track schematic (vs the two-track overlap one). */
export const SINGLE_TRACK_TYPES: SectionType[] = ['normal', 'shared'];

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

// --- Settings ---

export type ThemeMode = 'dark' | 'light';

export type Settings = {
  themeMode: ThemeMode;
  language: Language;
  secondsTick: boolean;
  /** 0..1 */
  volume: number;
  btLatencyMs: number;
  soundProfile: string;
};

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  language: 'Magyar',
  secondsTick: true,
  volume: 0.72,
  btLatencyMs: 120,
  soundProfile: 'Profil v1',
};

export const LANGUAGES = ['Magyar', 'English', 'Deutsch', 'Slovenčina', 'Italiano'] as const;
export type Language = (typeof LANGUAGES)[number];

export const fmtSec = (n: number): string => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

/** Parse a user-typed number (accepts comma decimals); 0 when invalid. */
export const toNum = (s: string): number => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

/** Signed delta with a real minus sign, e.g. "+0.3" / "−0.4". */
export const fmtDelta = (n: number): string => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`;

// --- Runs (results of completing a race) — one run per race ---

export type RunLeg = { targetSec: number; actualSec: number | null };
export type RunSection = { name: string; type: SectionType; legs: RunLeg[] };

export type Run = {
  id: string;
  raceId: string;
  raceName: string; // snapshot — survives race rename/delete
  date: string;
  note: string;
  results: RunSection[];
};

/** Snapshot a race's plan into run results (targets set, actuals preserved from prev). */
export function snapshotResults(race: Race, prev?: Run): RunSection[] {
  return race.sections.map((s, si) => ({
    name: s.name,
    type: s.type,
    legs: s.segments.map((g, li) => ({
      targetSec: g.timeSec,
      actualSec: prev?.results[si]?.legs[li]?.actualSec ?? null,
    })),
  }));
}

/** Per-leg delta = actual − target (null until an actual is entered). */
export const legDelta = (leg: RunLeg): number | null => (leg.actualSec == null ? null : leg.actualSec - leg.targetSec);

/** Flatten all entered legs to { name, delta } for analysis. */
export function runDeltas(run: Run): { name: string; delta: number }[] {
  const out: { name: string; delta: number }[] = [];
  run.results.forEach(sec => {
    sec.legs.forEach((leg, li) => {
      const d = legDelta(leg);
      if (d != null) out.push({ name: sec.legs.length > 1 ? `${sec.name} ${li === 0 ? 'A' : 'B'}` : sec.name, delta: d });
    });
  });
  return out;
}

// One seed run so History/Analysis show data on first load.
const SEED_OFFS = [0.1, -0.2, -0.4, 0.9, 0.2];
export const INITIAL_RUNS: Run[] = [
  {
    id: 'run1',
    raceId: 'r1',
    raceName: 'Tavaszi Oldtimer Kupa',
    date: '2026.04.12',
    note: 'Jó ritmus, a 4. kapunál késtem.',
    results: tavasziSections.map((s, si) => ({
      name: s.name,
      type: s.type,
      legs: s.segments.map(g => ({
        targetSec: g.timeSec,
        actualSec: Math.round((g.timeSec + SEED_OFFS[si % SEED_OFFS.length]) * 10) / 10,
      })),
    })),
  },
];

/** Illustrative timeline for the Tavaszi Kupa (shared gate + overlap). */
export type TimelineBarData = { label: string; leftPct: number; widthPct: number; variant: 'primary' | 'secondary' };
export const TAVASZI_TIMELINE: TimelineBarData[] = [
  { label: '1 · Rajt · 0–7', leftPct: 0, widthPct: 58, variant: 'primary' },
  { label: '2 · Szlalom · 7–12', leftPct: 58, widthPct: 42, variant: 'primary' },
  { label: '3 · Garázs · 4–10', leftPct: 33, widthPct: 50, variant: 'secondary' },
];
