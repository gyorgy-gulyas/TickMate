/** Settings, grouped by category. Maps to "Beállítások". Backed by the store. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Icon, SettingsRow, Toggle } from '../components';
import { useTheme } from '../theme';
import { useT } from '../i18n';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  cat: { gap: 6 },
  catTitle: { marginLeft: 2 },
});

function Category({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.cat}>
      <AppText preset="label" color="textSecondary" style={styles.catTitle}>
        {title}
      </AppText>
      <View>{children}</View>
    </View>
  );
}

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNav>();
  const settings = useSettings();
  const setSetting = useStore(s => s.setSetting);
  const t = useT();

  return (
    <Screen title={t('settings.title')} gap={16} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <Category title={t('settings.cat.device')}>
        <SettingsRow label={t('settings.btButton')} statusDot value={t('settings.connected')} />
        <SettingsRow label={t('settings.btHeadset')} value="AirPods Pro" />
        <SettingsRow
          label={t('settings.btLatency')}
          value={`${settings.btLatencyMs} ms`}
          chevron
          onPress={() => navigation.navigate('BluetoothLatency')}
        />
        <SettingsRow label={t('settings.watch')} value="Apple Watch" chevron onPress={() => navigation.navigate('Smartwatch')} divider={false} />
      </Category>

      <Category title={t('settings.cat.sound')}>
        <SettingsRow label={t('settings.soundProfile')} value={settings.soundProfile} chevron />
        <SettingsRow
          label={t('settings.secondsTick')}
          right={<Toggle value={settings.secondsTick} onValueChange={v => setSetting('secondsTick', v)} />}
          divider={false}
        />
      </Category>

      <Category title={t('settings.cat.appearance')}>
        <SettingsRow label={t('settings.language')} value={settings.language} chevron onPress={() => navigation.navigate('Language')} />
        <SettingsRow
          label={t('settings.darkMode')}
          right={<Toggle value={theme.mode === 'dark'} onValueChange={theme.toggleMode} />}
          divider={false}
        />
      </Category>
    </Screen>
  );
}

export default SettingsScreen;
