/**
 * TickMate app root.
 * @format
 */
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';

function Root() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const containerStyle = { backgroundColor: theme.colors.bg, paddingTop: insets.top };
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bg}
      />
      <RootNavigator />
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="dark">
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
