export * from './synth';
export * from './buildTask';
export { playPcm } from './player';

import { SAMPLE_RATE } from './synth';
import { buildTaskPCM, type TaskSpec } from './buildTask';
import { playPcm } from './player';

/** Build and play a task's audio (web: audible; native: no-op for now). */
export function playTask(spec: TaskSpec): void {
  playPcm(buildTaskPCM(spec), SAMPLE_RATE);
}
