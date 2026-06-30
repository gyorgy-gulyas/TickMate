/**
 * TickMate app root.
 * @format
 */
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusView } from './src/components';
import { useHydrated } from './src/store/useStore';
import { useT } from './src/i18n';

function Root() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hydrated = useHydrated();
  const t = useT();
  const containerStyle = { backgroundColor: theme.colors.bg, paddingTop: insets.top };
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bg}
      />
      {hydrated ? <RootNavigator /> : <StatusView loading title={t('common.loading')} />}
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
