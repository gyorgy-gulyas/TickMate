/** Sound profile — the character of the run-time audio cues (spec §8). */

export type CountdownAccel = 'gentle' | 'normal' | 'aggressive';
export type PitchDir = 'up' | 'down' | 'flat';

export type SoundProfile = {
  /** Click timbre: 0 = soft sine … 1 = harsh square. */
  harshness: number;
  /** Base click pitch (Hz). */
  basePitch: number;
  /** Click length (ms). */
  clickMs: number;
  /** Distinct start sound on the button press. */
  startSound: boolean;
  /** Per-second tick. */
  secondsTick: boolean;
  /** Tick pitch (Hz) — set apart from the countdown clicks. */
  tickPitch: number;
  /** Countdown lead time before the gate (s). */
  leadSec: number;
  /** How sharply the beats accelerate toward the gate. */
  accel: CountdownAccel;
  /** Number of beats in the countdown. */
  beats: number;
  /** Play the final click exactly on the gate (0.00). */
  onGateClick: boolean;
  /** Distinct first beat ("get ready"). */
  readyMarker: boolean;
  /** Pitch contour across the countdown. */
  pitchDir: PitchDir;
  /** Pitch span of the contour (Hz). */
  pitchRange: number;
  /** Volume swells toward the gate. */
  crescendo: boolean;
  /** How much the final click stands out (0..1). */
  finalEmphasis: number;
  /** Accent the whole-second beats. */
  accentBeats: boolean;
  /** Timbre morphs soft → harsh toward the gate. */
  timbreMorph: boolean;
  /** In overlapping tasks, pitch-separate the A and B countdowns. */
  distinguishAB: boolean;
};

/** Default profile — equals the current (spec §8) sound; nothing changes until tweaked. */
export const DEFAULT_SOUND_PROFILE: SoundProfile = {
  harshness: 0,
  basePitch: 2000,
  clickMs: 8,
  startSound: true,
  secondsTick: true,
  tickPitch: 2000,
  leadSec: 4,
  accel: 'normal',
  beats: 7,
  onGateClick: true,
  readyMarker: false,
  pitchDir: 'up',
  pitchRange: 1800,
  crescendo: false,
  finalEmphasis: 1,
  accentBeats: false,
  timbreMorph: false,
  distinguishAB: false,
};

export type SoundPresetId = 'soft' | 'normal' | 'sharp';

/** Starting-point presets (the user can fine-tune any into a custom profile). */
export const SOUND_PRESETS: Record<SoundPresetId, SoundProfile> = {
  soft: { ...DEFAULT_SOUND_PROFILE, harshness: 0, basePitch: 1600, pitchRange: 500, finalEmphasis: 0.5 },
  normal: DEFAULT_SOUND_PROFILE,
  sharp: {
    ...DEFAULT_SOUND_PROFILE,
    harshness: 0.85,
    basePitch: 2400,
    pitchRange: 2600,
    finalEmphasis: 1,
    accentBeats: true,
    crescendo: true,
    timbreMorph: true,
  },
};

/** Identify which preset (if any) a profile currently matches. */
export function matchPreset(p: SoundProfile): SoundPresetId | null {
  const keys = Object.keys(SOUND_PRESETS) as SoundPresetId[];
  return keys.find(k => JSON.stringify(SOUND_PRESETS[k]) === JSON.stringify(p)) ?? null;
}
