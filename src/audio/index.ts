export * from './synth';
export * from './buildTask';
export { playPcm, stopAudio } from './player';

import { SAMPLE_RATE } from './synth';
import { buildTaskPCM, buildCountdownPCM, type TaskSpec } from './buildTask';
import { playPcm } from './player';
import type { SoundProfile } from '../data/model';

// Cache rendered task PCM by spec + profile, so a saved task's audio is built
// once (ideally pre-warmed on save) and Start has no synthesis delay; replays
// reuse the buffer. Auto-invalidates when the profile changes (part of the key).
const taskCache = new Map<string, Float32Array>();
const TASK_CACHE_MAX = 16;
const taskKey = (spec: TaskSpec, p: SoundProfile): string => JSON.stringify([spec.type, spec.prepSec, spec.legs, p]);

function getTaskPCM(spec: TaskSpec, profile: SoundProfile): Float32Array {
  const key = taskKey(spec, profile);
  let pcm = taskCache.get(key);
  if (!pcm) {
    pcm = buildTaskPCM(spec, profile);
    if (taskCache.size >= TASK_CACHE_MAX) {
      const oldest = taskCache.keys().next().value;
      if (oldest !== undefined) taskCache.delete(oldest);
    }
    taskCache.set(key, pcm);
  }
  return pcm;
}

/** Pre-render a task's audio (after generating/saving) so Start has no synth delay. */
export function prewarmTask(spec: TaskSpec, profile: SoundProfile): void {
  getTaskPCM(spec, profile);
}

/** Build (or reuse) and play a task's audio with the given profile. */
export function playTask(spec: TaskSpec, profile: SoundProfile): void {
  playPcm(getTaskPCM(spec, profile), SAMPLE_RATE);
}

/** Play a single accelerating countdown into `targetSec` (Hangritmus practice). */
export function playRhythm(targetSec: number, profile: SoundProfile, muteFinal = false): void {
  playPcm(buildCountdownPCM(targetSec, profile, muteFinal), SAMPLE_RATE);
}
