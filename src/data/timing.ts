/**
 * Task timing — gate times and per-leg windows on a section's timeline
 * (seconds from the button press). Shared by the audio builder and the run
 * engine so the logic lives in one place.
 *
 * Multi-leg B offset is approximate (the model has durations, not B's start):
 * nested centres B inside A; overlap starts B at A's midpoint.
 */
import type { SectionType, SoundProfile } from './model';

export type LegWindow = { label: string; start: number; end: number };

export function legWindows(type: SectionType, prepSec: number, legTimes: number[]): LegWindow[] {
  const P = Math.max(0, prepSec || 0);
  const tA = Math.max(0, legTimes[0] || 0);
  const tB = legTimes.length > 1 ? Math.max(0, legTimes[1] || 0) : null;

  if (tB == null || type === 'normal') return [{ label: '', start: P, end: P + tA }];
  if (type === 'shared') {
    return [
      { label: 'A', start: P, end: P + tA },
      { label: 'B', start: P + tA, end: P + tA + tB },
    ];
  }
  const bStart = type === 'nested' ? P + Math.max(0, (tA - tB) / 2) : P + tA / 2;
  return [
    { label: 'A', start: P, end: P + tA },
    { label: 'B', start: bStart, end: bStart + tB },
  ];
}

/** Gate times = every leg start/end, deduped and sorted. */
export function gateTimes(type: SectionType, prepSec: number, legTimes: number[]): number[] {
  const ws = legWindows(type, prepSec, legTimes);
  return [...new Set(ws.flatMap(l => [l.start, l.end]))].sort((a, b) => a - b);
}

/** Total timeline length of the task (s). */
export const taskDuration = (type: SectionType, prepSec: number, legTimes: number[]): number =>
  Math.max(prepSec, ...legWindows(type, prepSec, legTimes).map(l => l.end));

/** True when two legs run at the same time (nested / overlap). */
export const isSimultaneous = (type: SectionType): boolean => type === 'nested' || type === 'overlap';

/** Geometric ratio per beat — each offset is this fraction of the previous, so
 *  the gaps between beats shrink by the same ratio. 'normal' = 0.5 (exact
 *  halving: 1, 0.5, 0.25, 0.125 …); gentler/sharper deviate from it. */
const accelRatio = (a: SoundProfile['accel']): number => (a === 'gentle' ? 0.62 : a === 'aggressive' ? 0.4 : 0.5);

/**
 * Offsets (s) before a gate where a countdown beat fires — a precise geometric
 * sequence `leadSec * ratio^i` (the gaps halve at 'normal'), plus an on-gate
 * beat (0). Index 0 is the first/far beat (= leadSec). Exact floating-point
 * values, placed to sample precision (~0.02 ms). THE single source the audio
 * builder and the on-screen beat markers share, so they stay in sync.
 */
export function countdownOffsets(p: SoundProfile): number[] {
  const r = accelRatio(p.accel);
  const n = Math.max(1, Math.round(p.beats));
  const offs: number[] = [];
  for (let i = 0; i < n; i++) offs.push(p.leadSec * Math.pow(r, i));
  offs.push(0); // on-gate beat
  return offs;
}

/**
 * All countdown beat times (s) across every gate. `includeGate=false` drops the
 * on-gate beat (already drawn as a solid boundary mark).
 */
export function countdownBeats(gates: number[], p: SoundProfile, includeGate = true): number[] {
  const offs = countdownOffsets(p).filter(off => includeGate || off > 1e-6);
  const ts = gates.flatMap(g => offs.map(off => g - off).filter(t => t >= 0));
  return [...new Set(ts)].sort((a, b) => a - b);
}
