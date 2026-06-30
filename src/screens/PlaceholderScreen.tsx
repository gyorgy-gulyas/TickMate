/** Stub screen for routes not yet built — header + "coming soon" note. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, NavBar } from '../components';
import { useTheme } from '../theme';
import { useT, type StringKey } from '../i18n';

export type PlaceholderScreenProps = {
  titleKey: StringKey;
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export function PlaceholderScreen({ titleKey }: PlaceholderScreenProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const t = useT();
  const bg = { backgroundColor: theme.colors.bg };

  return (
    <View style={[styles.fill, bg]}>
      <NavBar title={t(titleKey)} onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined} />
      <View style={styles.center}>
        <AppText preset="muted" color="textSecondary">
          {t('common.soon')}
        </AppText>
      </View>
    </View>
  );
}

export default PlaceholderScreen;
