/**
 * Task timing — gate times and per-leg windows on a section's timeline
 * (seconds from the button press). Shared by the audio builder and the run
 * engine so the logic lives in one place.
 *
 * Multi-leg B offset is approximate (the model has durations, not B's start):
 * nested centres B inside A; overlap starts B at A's midpoint.
 */
import type { SectionType } from './mock';

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
