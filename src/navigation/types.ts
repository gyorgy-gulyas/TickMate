import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Segment, SectionType } from '../data/model';

/** Root stack route list. Run/analysis screens are added as the build progresses. */
export type RootStackParamList = {
  Home: undefined;
  Races: undefined;
  RaceDetail: { raceId?: string } | undefined;
  SectionTypes: undefined;
  SectionEditor: { raceId?: string; sectionId?: string } | undefined;
  SectionFromPhoto: undefined;
  QuickTask: undefined;
  Practice: undefined;
  /** Reaction-time practice (a set of rounds: react to a sudden cue). */
  Reaction: undefined;
  Settings: undefined;
  Language: undefined;
  BluetoothLatency: undefined;
  Smartwatch: undefined;
  Help: undefined;
  Timeline: { runId?: string } | undefined;
  /** Result editor — record actual times for a race's run. */
  Result: { runId?: string } | undefined;
  /** Live run flow. With `quick`, runs a single unsaved task (Gyors feladat). */
  Run:
    | { raceId?: string; quick?: { name?: string; type: SectionType; prepSec: number; segments: Segment[]; secondsTick: boolean } }
    | undefined;
  /** Dev-only: the component UI-kit. Remove before release. */
  Demo: undefined;
};

/** Navigation prop for any root screen. */
export type RootNav = NativeStackNavigationProp<RootStackParamList>;
