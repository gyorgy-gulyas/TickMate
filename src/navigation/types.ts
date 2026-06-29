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
  /** Dev-only: the component UI-kit. Remove before release. */
  Demo: undefined;
};
