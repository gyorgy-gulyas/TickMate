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

// --- Sound profile: the character of the run-time audio cues (spec §8) ---
export type CountdownAccel = 'gentle' | 'normal' | 'aggressive';
export type PitchDir = 'up' | 'down' | 'flat';

export type SoundProfile = {
  /** Click timbre: 0 = soft sine … 1 = harsh square. */
  harshness: number;
  /** Base click pitch (Hz). */
  basePitch: number;
  /** Click length (ms). */
  clickMs: number;
  /** Distinct start sound on the button press. */
  startSound: boolean;
  /** Per-second tick. */
  secondsTick: boolean;
  /** Tick pitch (Hz) — set apart from the countdown clicks. */
  tickPitch: number;
  /** Countdown lead time before the gate (s). */
  leadSec: number;
  /** How sharply the beats accelerate toward the gate. */
  accel: CountdownAccel;
  /** Number of beats in the countdown. */
  beats: number;
  /** Play the final click exactly on the gate (0.00). */
  onGateClick: boolean;
  /** Distinct first beat ("get ready"). */
  readyMarker: boolean;
  /** Pitch contour across the countdown. */
  pitchDir: PitchDir;
  /** Pitch span of the contour (Hz). */
  pitchRange: number;
  /** Volume swells toward the gate. */
  crescendo: boolean;
  /** How much the final click stands out (0..1). */
  finalEmphasis: number;
  /** Accent the whole-second beats. */
  accentBeats: boolean;
  /** Timbre morphs soft → harsh toward the gate. */
  timbreMorph: boolean;
  /** In overlapping tasks, pitch-separate the A and B countdowns. */
  distinguishAB: boolean;
};

/** Default profile — equals the current (spec §8) sound; nothing changes until tweaked. */
export const DEFAULT_SOUND_PROFILE: SoundProfile = {
  harshness: 0,
  basePitch: 2000,
  clickMs: 8,
  startSound: true,
  secondsTick: true,
  tickPitch: 2000,
  leadSec: 3,
  accel: 'normal',
  beats: 10,
  onGateClick: true,
  readyMarker: false,
  pitchDir: 'up',
  pitchRange: 1800,
  crescendo: false,
  finalEmphasis: 1,
  accentBeats: false,
  timbreMorph: false,
  distinguishAB: false,
};

export type SoundPresetId = 'soft' | 'normal' | 'sharp';

/** Starting-point presets (the user can fine-tune any into a custom profile). */
export const SOUND_PRESETS: Record<SoundPresetId, SoundProfile> = {
  soft: { ...DEFAULT_SOUND_PROFILE, harshness: 0, basePitch: 1600, pitchRange: 500, finalEmphasis: 0.5 },
  normal: DEFAULT_SOUND_PROFILE,
  sharp: {
    ...DEFAULT_SOUND_PROFILE,
    harshness: 0.85,
    basePitch: 2400,
    pitchRange: 2600,
    finalEmphasis: 1,
    accentBeats: true,
    crescendo: true,
    timbreMorph: true,
  },
};

/** Identify which preset (if any) a profile currently matches. */
export function matchPreset(p: SoundProfile): SoundPresetId | null {
  const keys = Object.keys(SOUND_PRESETS) as SoundPresetId[];
  return keys.find(k => JSON.stringify(SOUND_PRESETS[k]) === JSON.stringify(p)) ?? null;
}

export type Settings = {
  themeMode: ThemeMode;
  language: Language;
  btLatencyMs: number;
  /** Audio-cue character (spec §8). Owns the seconds-tick toggle. */
  sound: SoundProfile;
};

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  language: 'Magyar',
  btLatencyMs: 120,
  sound: DEFAULT_SOUND_PROFILE,
};

export const LANGUAGES = ['Magyar', 'English', 'Deutsch', 'Español'] as const;
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
/** `sectionId` ties the snapshot back to its source section so reordering the
 *  race re-maps recorded times by identity, not by position. Optional for
 *  backward-compat with results saved before this field existed. */
export type RunSection = { sectionId?: string; name: string; type: SectionType; legs: RunLeg[] };

export type Run = {
  id: string;
  raceId: string;
  raceName: string; // snapshot — survives race rename/delete
  date: string;
  note: string;
  results: RunSection[];
};

/**
 * Snapshot a race's plan into run results (targets set, actuals preserved from
 * prev). Previous actuals are matched by `sectionId` so reordering the race
 * keeps each time with its section. Old results without ids fall back to
 * position matching (they predate reordering, so order is unchanged).
 */
export function snapshotResults(race: Race, prev?: Run): RunSection[] {
  const byPosition = !!prev && prev.results.every(r => r.sectionId === undefined);
  return race.sections.map((s, si) => {
    const prevSec = byPosition ? prev!.results[si] : prev?.results.find(r => r.sectionId === s.id);
    return {
      sectionId: s.id,
      name: s.name,
      type: s.type,
      legs: s.segments.map((g, li) => ({
        targetSec: g.timeSec,
        actualSec: prevSec?.legs[li]?.actualSec ?? null,
      })),
    };
  });
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
      sectionId: s.id,
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
