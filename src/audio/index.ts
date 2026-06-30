export * from './synth';
export * from './buildTask';
export { playPcm, stopAudio } from './player';

import { SAMPLE_RATE } from './synth';
import { buildTaskPCM, buildCountdownPCM, type TaskSpec } from './buildTask';
import { playPcm } from './player';
import type { SoundProfile } from '../data/model';

/** Build and play a task's audio with the given profile (web: audible; native: no-op for now). */
export function playTask(spec: TaskSpec, profile: SoundProfile): void {
  playPcm(buildTaskPCM(spec, profile), SAMPLE_RATE);
}

/** Play a single accelerating countdown into `targetSec` (Hangritmus practice). */
export function playRhythm(targetSec: number, profile: SoundProfile, muteFinal = false): void {
  playPcm(buildCountdownPCM(targetSec, profile, muteFinal), SAMPLE_RATE);
}
