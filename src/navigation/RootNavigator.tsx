/** Root navigation: native-stack with custom (in-screen) headers. */
import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DemoScreen } from '../screens/DemoScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { RacesScreen } from '../screens/RacesScreen';
import { RaceDetailScreen } from '../screens/RaceDetailScreen';
import { QuickTaskScreen } from '../screens/QuickTaskScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { BluetoothLatencyScreen } from '../screens/BluetoothLatencyScreen';
import { HelpScreen } from '../screens/HelpScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Stubbed routes (built out screen-by-screen). Titles use the "feladat" wording.
const STUBS: ReadonlyArray<{ name: keyof RootStackParamList; title: string }> = [
  { name: 'SectionTypes', title: 'Feladat típusok' },
  { name: 'SectionEditor', title: 'Feladat szerkesztő' },
  { name: 'SectionFromPhoto', title: 'Feladat fotóból' },
  { name: 'Practice', title: 'Gyakorló mód' },
  { name: 'Smartwatch', title: 'Okosóra' },
  { name: 'History', title: 'History' },
];

function makeStub(title: string) {
  const Stub = () => <PlaceholderScreen title={title} />;
  Stub.displayName = `Stub(${title})`;
  return Stub;
}

const STUB_COMPONENTS = STUBS.map(s => ({ name: s.name, component: makeStub(s.title) }));

export function RootNavigator() {
  const theme = useTheme();
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme: NavTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.bg,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.divider,
      primary: theme.colors.accent,
      notification: theme.colors.accent,
    },
  };

  const contentStyle = { backgroundColor: theme.colors.bg };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Races" component={RacesScreen} />
        <Stack.Screen name="RaceDetail" component={RaceDetailScreen} />
        <Stack.Screen name="QuickTask" component={QuickTaskScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="BluetoothLatency" component={BluetoothLatencyScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        {STUB_COMPONENTS.map(s => (
          <Stack.Screen key={s.name} name={s.name} component={s.component} />
        ))}
        <Stack.Screen name="Demo" component={DemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
