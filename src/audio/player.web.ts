/** PCM player (web) — Web Audio API. Lets the browser preview actually play. */
let ctx: AudioContext | null = null;

export function playPcm(pcm: Float32Array, sampleRate: number): void {
  if (typeof window === 'undefined') return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const buffer = ctx.createBuffer(1, pcm.length, sampleRate);
  buffer.copyToChannel(pcm, 0);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
}
