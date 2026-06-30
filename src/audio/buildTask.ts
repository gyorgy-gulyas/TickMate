/**
 * Assemble a task's full audio timeline into a PCM buffer.
 * Timeline (seconds from the button press):
 *  - start sound at t=0
 *  - per-second clicks throughout (when secondsTick is on), except inside a countdown
 *  - an accelerating countdown ending at EVERY gate (Start, Közös, A-cél, B-cél, Cél)
 */
import { SAMPLE_RATE, renderClick, renderFinalClick, renderStart } from './synth';
import { COUNTDOWN_OFFSETS, gateTimes } from '../data/timing';
import type { SectionType } from '../data/model';

export type TaskSpec = {
  type: SectionType;
  prepSec: number;
  /** Leg times: [tA] for normal, [tA, tB] otherwise. */
  legs: number[];
  secondsTick: boolean;
};

const COUNTDOWN = COUNTDOWN_OFFSETS;

const MAX_SEC = 120;

export function buildTaskPCM(spec: TaskSpec): Float32Array {
  const gates = gateTimes(spec.type, spec.prepSec, spec.legs);
  const lastGate = gates.length ? gates[gates.length - 1] : Math.max(0, spec.prepSec || 0);
  const totalSec = Math.min(MAX_SEC, lastGate + 0.5);

  const out = new Float32Array(Math.ceil(totalSec * SAMPLE_RATE) + SAMPLE_RATE);
  const click = renderClick();
  const start = renderStart();
  // Countdown clicks rise in pitch toward the gate (2 kHz → ~3.8 kHz); the
  // very last one (0.00, at the gate) is a harsh square-wave click.
  const countdownClicks = COUNTDOWN.map((_, i) =>
    i === COUNTDOWN.length - 1 ? renderFinalClick() : renderClick(2000 + (i / (COUNTDOWN.length - 1)) * 1800),
  );

  const place = (sample: Float32Array, atSec: number) => {
    const at = Math.round(atSec * SAMPLE_RATE);
    if (at < 0) return;
    for (let i = 0; i < sample.length; i++) {
      const idx = at + i;
      if (idx < out.length) out[idx] += sample[i];
    }
  };

  place(start, 0);

  const windows = gates.map(g => [g - 3, g] as const);
  const inCountdown = (t: number) => windows.some(([a, b]) => t > a + 1e-6 && t <= b + 1e-6);

  if (spec.secondsTick) {
    for (let s = 1; s <= Math.floor(lastGate); s++) {
      if (!inCountdown(s)) place(click, s);
    }
  }

  gates.forEach(g => {
    COUNTDOWN.forEach((off, i) => {
      const t = g - off;
      if (t >= 0) place(countdownClicks[i], t);
    });
  });

  for (let i = 0; i < out.length; i++) {
    if (out[i] > 1) out[i] = 1;
    else if (out[i] < -1) out[i] = -1;
  }
  return out;
}
