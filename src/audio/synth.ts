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
