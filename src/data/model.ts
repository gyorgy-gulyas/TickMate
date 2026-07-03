/**
 * Core data model: races, sections, settings, runs (results) and their helpers.
 * Sound-profile types live in ./soundProfile; sample data in ./seed — both are
 * re-exported here so `from '../data/model'` keeps resolving everything.
 */
import type { IconName } from '../components';
import { DEFAULT_SOUND_PROFILE, type SoundProfile } from './soundProfile';

export type SectionType = 'normal' | 'shared' | 'nested' | 'overlap';

/** A single measured leg: a distance and the time to complete it. `timeSec` is
 *  null when not yet known (e.g. imported from a photo without a printed time) —
 *  it must be filled before the section can run or generate audio. */
export type Segment = { distanceM: number; timeSec: number | null };

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
  /** Local uri of the roadbook photo this section was captured from, if any.
   *  One image per section; retaking replaces it. */
  imageUri?: string;
};

/** Number of measured legs a type uses. */
export const segmentCount = (type: SectionType): number => (type === 'normal' ? 1 : 2);

/** Total section time = prep + all leg times (unknown times count as 0). */
export const sectionTotalSec = (s: Section): number =>
  s.prepSec + s.segments.reduce((sum, g) => sum + (g.timeSec ?? 0), 0);

/** True once every leg has a usable time — required before running / audio. */
export const sectionTimesComplete = (s: Section): boolean =>
  s.segments.length > 0 && s.segments.every(g => g.timeSec != null && g.timeSec > 0);

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

// --- Settings ---

export type ThemeMode = 'dark' | 'light';

export type Settings = {
  themeMode: ThemeMode;
  language: Language;
  /** BT START button input latency (press → app detects), ms. Shifts the whole
   *  run-timeline origin earlier so audio + visuals move together. */
  btButtonLatencyMs: number;
  /** Audio output latency (playback → heard in the earpiece), ms. Used to lag
   *  the on-screen timeline so the picture matches what you hear. */
  btAudioLatencyMs: number;
  /** Watch output latency (trigger → felt vibration), ms. Aligns the watch's
   *  vibrating countdown / start cue with the audio. */
  watchLatencyMs: number;
  /** Audio-cue character (spec §8). Owns the seconds-tick toggle. */
  sound: SoundProfile;
};

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  language: 'Magyar',
  btButtonLatencyMs: 20,
  btAudioLatencyMs: 120,
  watchLatencyMs: 80,
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

/** Like toNum but empty / invalid → null (for optional times). */
export const toNumOrNull = (s: string): number | null => {
  const t = s.trim();
  if (t === '') return null;
  const n = parseFloat(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
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
        targetSec: g.timeSec ?? 0,
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

/** Illustrative timeline bar (the Idővonal demo). */
export type TimelineBarData = { label: string; leftPct: number; widthPct: number; variant: 'primary' | 'secondary' };

export * from './soundProfile';
export * from './seed';
