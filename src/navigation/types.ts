import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/** Root stack route list. Run/analysis screens are added as the build progresses. */
export type RootStackParamList = {
  Home: undefined;
  Races: undefined;
  RaceDetail: { raceId?: string } | undefined;
  SectionTypes: undefined;
  SectionEditor: { sectionId?: string } | undefined;
  SectionFromPhoto: undefined;
  QuickTask: undefined;
  Practice: undefined;
  Settings: undefined;
  Language: undefined;
  BluetoothLatency: undefined;
  Smartwatch: undefined;
  Help: undefined;
  History: undefined;
  HistoryDetail: { runId?: string } | undefined;
  Analysis: { runId?: string } | undefined;
  Timeline: { runId?: string } | undefined;
  /** Dev-only: the component UI-kit. Remove before release. */
  Demo: undefined;
};

/** Navigation prop for any root screen. */
export type RootNav = NativeStackNavigationProp<RootStackParamList>;
