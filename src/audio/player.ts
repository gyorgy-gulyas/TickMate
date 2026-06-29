/** PCM player (native). Low-latency native playback arrives with the device
 *  build (roadmap §4). Shadowed by player.web.ts on web. */
export function playPcm(_pcm: Float32Array, _sampleRate: number): void {
  // no-op until the native audio layer is wired
}
