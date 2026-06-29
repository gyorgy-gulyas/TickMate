/**
 * Placeholder data mirroring the prototype. Replaced by a real data model
 * (race/section store) in a later step — do not build persistence on this.
 */
import type { IconName } from '../components';

export type SectionType = 'normal' | 'shared' | 'overlap';

export type Section = {
  id: string;
  name: string;
  type: SectionType;
  distanceM?: number;
  prepSec: number;
  sectionSec: number;
};

export type Race = {
  id: string;
  name: string;
  date: string;
  audioReady: boolean;
  sections: Section[];
};

export const SECTION_TYPE_META: Record<SectionType, { label: string; icon: IconName }> = {
  normal: { label: 'Normál', icon: 'arrow-right' },
  shared: { label: 'Követő', icon: 'link-simple' },
  overlap: { label: 'Átfedő', icon: 'arrows-split' },
};

const tavasziSections: Section[] = [
  { id: 's1', name: 'Rajt szakasz', type: 'normal', distanceM: 20, prepSec: 5, sectionSec: 7 },
  { id: 's2', name: 'Szlalom', type: 'shared', distanceM: 20, prepSec: 3, sectionSec: 8 },
  { id: 's3', name: 'Garázs', type: 'overlap', distanceM: 15, prepSec: 4, sectionSec: 5 },
  { id: 's4', name: 'Tolatás', type: 'normal', distanceM: 30, prepSec: 6, sectionSec: 9 },
  { id: 's5', name: 'Cikcakk', type: 'shared', distanceM: 25, prepSec: 4, sectionSec: 6 },
];

export const RACES: Race[] = [
  { id: 'r1', name: 'Tavaszi Oldtimer Kupa', date: '2026.04.12', audioReady: true, sections: tavasziSections },
  { id: 'r2', name: 'Balaton Klasszik', date: '2026.05.03', audioReady: false, sections: [] },
  { id: 'r3', name: 'Őszi Ügyességi', date: '2025.10.19', audioReady: false, sections: [] },
  { id: 'r4', name: 'Edzés – Mátra', date: '2026.03.30', audioReady: false, sections: [] },
];

/** Counts shown in the list (mocked for races with no expanded sections). */
export const RACE_SECTION_COUNT: Record<string, number> = {
  r1: 8,
  r2: 12,
  r3: 6,
  r4: 4,
};

export function getRace(id?: string): Race {
  return RACES.find(r => r.id === id) ?? RACES[0];
}

export const LANGUAGES = ['Magyar', 'English', 'Deutsch', 'Slovenčina', 'Italiano'] as const;
export type Language = (typeof LANGUAGES)[number];

export const fmtSec = (n: number): string => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

/** Signed delta with a real minus sign, e.g. "+0.3" / "−0.4". */
export const fmtDelta = (n: number): string => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`;

// --- Past runs (History / analysis) ---

export type RunResult = {
  name: string;
  type: SectionType;
  /** Measured section time (s). */
  measuredSec: number;
  /** Delta vs target (s); + = slower, − = faster. */
  delta: number;
};

export type RunRecord = {
  id: string;
  raceName: string;
  date: string;
  sectionCount: number;
  results: RunResult[];
  note: string;
  avgDelta: number;
  bestName: string;
  bestDelta: number;
};

const tavasziResults: RunResult[] = [
  { name: 'Rajt szakasz', type: 'normal', measuredSec: 7.04, delta: 0.1 },
  { name: 'Szlalom', type: 'shared', measuredSec: 8.12, delta: -0.2 },
  { name: 'Garázs', type: 'overlap', measuredSec: 5.03, delta: -0.4 },
  { name: 'Tolatás', type: 'normal', measuredSec: 9.2, delta: 0.9 },
];

export const HISTORY: RunRecord[] = [
  {
    id: 'h1',
    raceName: 'Tavaszi Kupa',
    date: '2026.04.12',
    sectionCount: 8,
    results: tavasziResults,
    note: 'Jó ritmus, a 4. kapunál késtem.',
    avgDelta: 0.3,
    bestName: 'Garázs',
    bestDelta: -0.4,
  },
  { id: 'h2', raceName: 'Balaton Klasszik', date: '2026.05.03', sectionCount: 12, results: [], note: '', avgDelta: 0, bestName: '', bestDelta: 0 },
  { id: 'h3', raceName: 'Edzés – Mátra', date: '2026.03.30', sectionCount: 4, results: [], note: '', avgDelta: 0, bestName: '', bestDelta: 0 },
  { id: 'h4', raceName: 'Őszi Ügyességi', date: '2025.10.19', sectionCount: 6, results: [], note: '', avgDelta: 0, bestName: '', bestDelta: 0 },
];

export function getRun(id?: string): RunRecord {
  return HISTORY.find(r => r.id === id) ?? HISTORY[0];
}

/** Illustrative timeline for the Tavaszi Kupa (shared gate + overlap). */
export type TimelineBarData = { label: string; leftPct: number; widthPct: number; variant: 'primary' | 'secondary' };
export const TAVASZI_TIMELINE: TimelineBarData[] = [
  { label: '1 · Rajt · 0–7', leftPct: 0, widthPct: 58, variant: 'primary' },
  { label: '2 · Szlalom · 7–12', leftPct: 58, widthPct: 42, variant: 'primary' },
  { label: '3 · Garázs · 4–10', leftPct: 33, widthPct: 50, variant: 'secondary' },
];
