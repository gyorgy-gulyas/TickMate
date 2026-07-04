/** PCM player (web) — Web Audio API. Lets the browser preview actually play. */
let ctx: AudioContext | null = null;
let current: AudioBufferSourceNode | null = null;

export function playPcm(pcm: Float32Array, sampleRate: number): void {
  if (typeof window === 'undefined') return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  stopAudio();
  const buffer = ctx.createBuffer(1, pcm.length, sampleRate);
  buffer.copyToChannel(pcm, 0);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.onended = () => {
    if (current === src) current = null;
  };
  current = src;
  src.start();
}

export function stopAudio(): void {
  if (!current) return;
  try {
    current.stop();
  } catch {
    /* already stopped */
  }
  current = null;
}

/** Web can't report an output-route latency; callers fall back to calibration. */
export async function getOutputLatency(): Promise<number | null> {
  return null;
}
