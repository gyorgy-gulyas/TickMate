/**
 * Assemble a task's full audio timeline into a PCM buffer, driven by the active
 * SoundProfile (spec §8). Timeline (seconds from the button press):
 *  - optional start sound at t=0
 *  - per-second clicks (when secondsTick is on), except inside a countdown
 *  - an accelerating countdown into EVERY gate, shaped by the profile
 * The countdown offsets come from data/timing so the on-screen beat markers
 * stay perfectly in sync with what is heard.
 */
import { SAMPLE_RATE, renderClickEx, renderStart } from './synth';
import { countdownOffsets, gateTimes, isSimultaneous, legWindows } from '../data/timing';
import type { Segment, SectionType, SoundProfile } from '../data/model';

export type TaskSpec = {
  type: SectionType;
  prepSec: number;
  /** Leg times: [tA] for normal, [tA, tB] otherwise. */
  legs: number[];
};

/** Build a TaskSpec from a section (or section-shaped form state). */
export const sectionSpec = (s: { type: SectionType; prepSec: number; segments: Segment[] }): TaskSpec => ({
  type: s.type,
  prepSec: s.prepSec,
  legs: s.segments.map(g => g.timeSec),
});

const MAX_SEC = 120;

type Place = (sample: Float32Array, atSec: number) => void;

function makePlace(out: Float32Array): Place {
  return (sample, atSec) => {
    const at = Math.round(atSec * SAMPLE_RATE);
    if (at < 0) return;
    for (let i = 0; i < sample.length; i++) {
      const idx = at + i;
      if (idx < out.length) out[idx] += sample[i];
    }
  };
}

function clampInPlace(out: Float32Array): void {
  for (let i = 0; i < out.length; i++) {
    if (out[i] > 1) out[i] = 1;
    else if (out[i] < -1) out[i] = -1;
  }
}

/** Place one accelerating countdown into the gate at `gateSec`, shaped by `p`.
 *  `pitchShift` (Hz) separates the B-leg gates when distinguishAB is on. */
function placeCountdown(place: Place, gateSec: number, p: SoundProfile, gateClick: boolean, pitchShift = 0): void {
  const offs = countdownOffsets(p);
  const n = offs.length;
  offs.forEach((off, i) => {
    const pos = i / (n - 1); // 0 (far) … 1 (gate)
    const isFinal = i === n - 1;
    if (isFinal && !gateClick) return;
    const t = gateSec - off;
    if (t < 0) return;

    // Distinct "get ready" tone on the first beat.
    if (i === 0 && p.readyMarker) {
      place(renderStart(), t);
      return;
    }

    // Pitch contour across the sequence (+ A/B separation shift).
    let freq = p.basePitch;
    if (p.pitchDir === 'up') freq = p.basePitch + pos * p.pitchRange;
    else if (p.pitchDir === 'down') freq = p.basePitch + (1 - pos) * p.pitchRange;
    freq = Math.max(200, freq + pitchShift);

    // Timbre morph (soft → harsh toward the gate).
    let harsh = p.timbreMorph ? Math.max(p.harshness, pos) : p.harshness;

    // Amplitude: crescendo + whole-second accent + final emphasis.
    let amp = p.crescendo ? 0.5 + 0.45 * pos : 0.9;
    const whole = Math.abs(off - Math.round(off)) < 0.04;
    if (p.accentBeats && whole && !isFinal) amp = Math.min(1, amp * 1.25);
    if (isFinal) {
      // Full square at finalEmphasis=1 — matches the original harsh gate click.
      harsh = Math.min(1, harsh + p.finalEmphasis);
      amp = Math.min(1, 0.9 + p.finalEmphasis * 0.4);
    }

    place(renderClickEx(freq, harsh, p.clickMs, amp), t);
  });
}

export function buildTaskPCM(spec: TaskSpec, p: SoundProfile): Float32Array {
  const gates = gateTimes(spec.type, spec.prepSec, spec.legs);
  const lastGate = gates.length ? gates[gates.length - 1] : Math.max(0, spec.prepSec || 0);
  const totalSec = Math.min(MAX_SEC, lastGate + 0.5);

  const out = new Float32Array(Math.ceil(totalSec * SAMPLE_RATE) + SAMPLE_RATE);
  const place = makePlace(out);

  if (p.startSound) place(renderStart(), 0);

  // Per-second tick — runs the whole time, including during a countdown.
  // Kept sharp (more square) so it stays crisp and distinct from the clicks.
  if (p.secondsTick) {
    const tick = renderClickEx(p.tickPitch, Math.max(p.harshness, 0.7), p.clickMs, 0.9);
    for (let s = 1; s <= Math.floor(lastGate); s++) place(tick, s);
  }

  // distinguishAB: the B-leg's own gates play lower so you can tell them apart.
  let bGates = new Set<number>();
  if (p.distinguishAB && isSimultaneous(spec.type)) {
    const legs = legWindows(spec.type, spec.prepSec, spec.legs);
    if (legs.length > 1) {
      const aTimes = new Set([legs[0].start, legs[0].end]);
      bGates = new Set([legs[1].start, legs[1].end].filter(t => !aTimes.has(t)));
    }
  }
  gates.forEach(g => placeCountdown(place, g, p, p.onGateClick, bGates.has(g) ? -350 : 0));

  clampInPlace(out);
  return out;
}

/**
 * A single accelerating countdown into one target gate at `targetSec` (Hangritmus
 * practice + profile preview). `muteFinal` silences the on-target click.
 */
export function buildCountdownPCM(targetSec: number, p: SoundProfile, muteFinal = false): Float32Array {
  const T = Math.max(p.leadSec, targetSec);
  const totalSec = Math.min(MAX_SEC, T + 0.6);
  const out = new Float32Array(Math.ceil(totalSec * SAMPLE_RATE) + SAMPLE_RATE);
  const place = makePlace(out);

  if (p.startSound) place(renderStart(), 0);
  placeCountdown(place, T, p, p.onGateClick && !muteFinal);

  clampInPlace(out);
  return out;
}
