export * from './synth';
export * from './buildTask';
export { playPcm, stopAudio } from './player';

import { SAMPLE_RATE } from './synth';
import { buildTaskPCM, buildCountdownPCM, type TaskSpec } from './buildTask';
import { playPcm } from './player';

/** Build and play a task's audio (web: audible; native: no-op for now). */
export function playTask(spec: TaskSpec): void {
  playPcm(buildTaskPCM(spec), SAMPLE_RATE);
}

/** Play a single accelerating countdown into `targetSec` (Hangritmus practice). */
export function playRhythm(targetSec: number, muteFinal: boolean): void {
  playPcm(buildCountdownPCM(targetSec, muteFinal), SAMPLE_RATE);
}
