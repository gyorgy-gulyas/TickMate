/* eslint-disable no-bitwise */
/** PCM player (native) — AudioTrack low-latency via the TmAudio module.
 *  Shadowed by player.web.ts on web. The task is pre-rendered in JS into one
 *  mono Float32 buffer; we ship its little-endian bytes to native as base64
 *  (no ArrayBuffer over the legacy bridge) and let AudioTrack stream it out. */
import { NativeModules } from 'react-native';

const TmAudio = NativeModules.TmAudio as
  | { play(base64Pcm: string, sampleRate: number): void; stop(): void; getOutputLatency?(): Promise<number> }
  | undefined;

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Base64-encode the raw bytes of a Float32Array (RN has no btoa/Buffer). */
function floatsToBase64(pcm: Float32Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  const out: string[] = [];
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out.push(B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63]);
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i] << 16;
    out.push(B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + '==');
  } else if (rem === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out.push(B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + '=');
  }
  return out.join('');
}

export function playPcm(pcm: Float32Array, sampleRate: number): void {
  if (!TmAudio || pcm.length === 0) return;
  try {
    TmAudio.play(floatsToBase64(pcm), sampleRate);
  } catch {
    /* native module unavailable — stay silent rather than crash */
  }
}

export function stopAudio(): void {
  if (!TmAudio) return;
  try {
    TmAudio.stop();
  } catch {
    /* ignore */
  }
}

/** The device's current audio-output latency in ms (play → ear), as reported by
 *  the OS for the active route (incl. a BT earpiece). Null when the platform
 *  can't provide it (Android, web, or module unavailable) — callers then fall
 *  back to the tap-to-beat / manual calibration. */
export async function getOutputLatency(): Promise<number | null> {
  if (!TmAudio?.getOutputLatency) return null;
  try {
    const ms = await TmAudio.getOutputLatency();
    return typeof ms === 'number' && ms >= 0 ? Math.round(ms) : null;
  } catch {
    return null;
  }
}
