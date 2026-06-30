/**
 * Themed icon wrapper over phosphor-react-native (regular set — matches the
 * prototype). Use kebab-case `name`s (the same names listed in CLAUDE_CODE.md).
 */
import React from 'react';
import {
  ArrowRight,
  ArrowsClockwise,
  ArrowsSplit,
  BluetoothConnected,
  Camera,
  CaretDown,
  CaretLeft,
  CaretUp,
  ChartBar,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  DotsSixVertical,
  EnvelopeSimple,
  FlagCheckered,
  GearSix,
  Info,
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
  Trash,
  Waveform,
  type Icon as PhosphorIcon,
  type IconWeight,
} from 'phosphor-react-native';
import { useTheme } from '../../theme';
import type { ColorTokens } from '../../theme';

const MAP = {
  'arrow-right': ArrowRight,
  'arrows-clockwise': ArrowsClockwise,
  'arrows-split': ArrowsSplit,
  'bluetooth-connected': BluetoothConnected,
  camera: Camera,
  'caret-down': CaretDown,
  'caret-left': CaretLeft,
  'caret-up': CaretUp,
  'chart-bar': ChartBar,
  check: Check,
  'check-circle': CheckCircle,
  'clock-counter-clockwise': ClockCounterClockwise,
  'dots-six-vertical': DotsSixVertical,
  'envelope-simple': EnvelopeSimple,
  'flag-checkered': FlagCheckered,
  'gear-six': GearSix,
  info: Info,
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
  trash: Trash,
  waveform: Waveform,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof MAP;

export type IconProps = {
  name: IconName;
  size?: number;
  /** Semantic color role (default accentText) or any raw color string. */
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
