/**
 * Web shadow of Icon.tsx — same API, but renders DOM SVG icons via
 * @phosphor-icons/react so the web bundle never pulls react-native-svg /
 * phosphor-react-native. Resolved ahead of Icon.tsx by Vite's .web.* extension.
 */
import React from 'react';
import {
  ArrowRight,
  ArrowsClockwise,
  ArrowsSplit,
  BluetoothConnected,
  Camera,
  CaretLeft,
  ChartBar,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  EnvelopeSimple,
  FlagCheckered,
  GearSix,
  Intersect,
  Lightning,
  LinkSimple,
  Metronome,
  Minus,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  Question,
  Scan,
  Stop,
  Target,
  Timer,
  Waveform,
  type Icon as PhosphorIcon,
  type IconWeight,
} from '@phosphor-icons/react';
import { useTheme } from '../../theme';
import type { ColorTokens } from '../../theme';

const MAP = {
  'arrow-right': ArrowRight,
  'arrows-clockwise': ArrowsClockwise,
  'arrows-split': ArrowsSplit,
  'bluetooth-connected': BluetoothConnected,
  camera: Camera,
  'caret-left': CaretLeft,
  'chart-bar': ChartBar,
  check: Check,
  'check-circle': CheckCircle,
  'clock-counter-clockwise': ClockCounterClockwise,
  'envelope-simple': EnvelopeSimple,
  'flag-checkered': FlagCheckered,
  'gear-six': GearSix,
  intersect: Intersect,
  lightning: Lightning,
  'link-simple': LinkSimple,
  metronome: Metronome,
  minus: Minus,
  play: Play,
  'play-circle': PlayCircle,
  plus: Plus,
  'plus-circle': PlusCircle,
  question: Question,
  scan: Scan,
  stop: Stop,
  target: Target,
  timer: Timer,
  waveform: Waveform,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof MAP;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: keyof ColorTokens | (string & {});
  weight?: IconWeight;
};

export function Icon({ name, size = 20, color = 'accentText', weight = 'regular' }: IconProps) {
  const theme = useTheme();
  const Cmp = MAP[name];
  const resolved = color in theme.colors ? theme.colors[color as keyof ColorTokens] : (color as string);
  return <Cmp size={size} color={resolved} weight={weight} />;
}

export default Icon;
