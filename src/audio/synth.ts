/** Audio sample synthesis (platform-independent PCM). */

export const SAMPLE_RATE = 44100;

/** 8 ms dry, pitched click. Default 2 kHz; the gate countdown raises the pitch. */
export function renderClick(freq = 2000): Float32Array {
  const n = Math.round((8 / 1000) * SAMPLE_RATE);
  const buf = new Float32Array(n);
  const tau = 0.0022; // ~2.2 ms decay
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    buf[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t / tau) * 0.9;
  }
  return buf;
}

/** 8 ms harsh final click (at the gate) — a square wave, rich in harmonics,
 *  so it clearly stands out as the last one. */
export function renderFinalClick(): Float32Array {
  const n = Math.round((8 / 1000) * SAMPLE_RATE);
  const buf = new Float32Array(n);
  const freq = 3800;
  const tau = 0.003;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const square = Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
    buf[i] = square * Math.exp(-t / tau);
  }
  return buf;
}

/**
 * Parametric click — blends sine (soft) ↔ square (harsh) by `harshness`, with a
 * given length and amplitude. The profile-driven task/countdown audio uses this.
 */
export function renderClickEx(freq: number, harshness: number, ms: number, amp: number): Float32Array {
  const n = Math.max(1, Math.round((ms / 1000) * SAMPLE_RATE));
  const buf = new Float32Array(n);
  const tau = Math.max(0.001, (ms / 1000) * 0.28);
  const h = Math.min(1, Math.max(0, harshness));
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const sine = Math.sin(2 * Math.PI * freq * t);
    const square = sine >= 0 ? 1 : -1;
    buf[i] = ((1 - h) * sine + h * square) * Math.exp(-t / tau) * amp;
  }
  return buf;
}

/** Distinct start sound (button press) — a lower, slightly longer tone. */
export function renderStart(): Float32Array {
  const n = Math.round((90 / 1000) * SAMPLE_RATE);
  const buf = new Float32Array(n);
  const freq = 1000;
  const tau = 0.035;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    buf[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t / tau) * 0.8;
  }
  return buf;
}
