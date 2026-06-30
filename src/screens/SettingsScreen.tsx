/** Settings list. Maps to "Beállítások". Backed by the persisted store. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, SettingsRow, Slider, Toggle } from '../components';
import { useTheme } from '../theme';
import { useT } from '../i18n';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  volume: { width: 120 },
});

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNav>();
  const settings = useSettings();
  const setSetting = useStore(s => s.setSetting);
  const t = useT();

  return (
    <Screen title={t('settings.title')} gap={0} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <SettingsRow label={t('settings.btButton')} statusDot value={t('settings.connected')} />
      <SettingsRow label={t('settings.btHeadset')} value="AirPods Pro" />
      <SettingsRow
        label={t('settings.btLatency')}
        value={`${settings.btLatencyMs} ms`}
        chevron
        onPress={() => navigation.navigate('BluetoothLatency')}
      />
      <SettingsRow label={t('settings.watch')} value="Apple Watch" chevron onPress={() => navigation.navigate('Smartwatch')} />
      <SettingsRow
        label={t('settings.volume')}
        right={<Slider value={settings.volume} onChange={v => setSetting('volume', v)} style={styles.volume} />}
      />
      <SettingsRow label={t('settings.soundProfile')} value={settings.soundProfile} chevron />
      <SettingsRow label={t('settings.language')} value={settings.language} chevron onPress={() => navigation.navigate('Language')} />
      <SettingsRow
        label={t('settings.secondsTick')}
        right={<Toggle value={settings.secondsTick} onValueChange={v => setSetting('secondsTick', v)} />}
      />
      <SettingsRow
        label={t('settings.darkMode')}
        right={<Toggle value={theme.mode === 'dark'} onValueChange={theme.toggleMode} />}
        divider={false}
      />
    </Screen>
  );
}

export default SettingsScreen;
