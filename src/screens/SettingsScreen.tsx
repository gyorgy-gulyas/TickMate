/** Settings list. Maps to "Beállítások". Backed by the persisted store. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, SettingsRow, Slider, Toggle } from '../components';
import { useTheme } from '../theme';
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

  return (
    <Screen title="Beállítások" gap={0} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <SettingsRow label="Bluetooth gomb" statusDot value="Csatlakoztatva" />
      <SettingsRow label="Bluetooth füles" value="AirPods Pro" />
      <SettingsRow
        label="Bluetooth késleltetés"
        value={`${settings.btLatencyMs} ms`}
        chevron
        onPress={() => navigation.navigate('BluetoothLatency')}
      />
      <SettingsRow label="Okosóra" value="Apple Watch" chevron onPress={() => navigation.navigate('Smartwatch')} />
      <SettingsRow
        label="Hangerő"
        right={<Slider value={settings.volume} onChange={v => setSetting('volume', v)} style={styles.volume} />}
      />
      <SettingsRow label="Hangprofil" value={settings.soundProfile} chevron />
      <SettingsRow label="Nyelv" value={settings.language} chevron onPress={() => navigation.navigate('Language')} />
      <SettingsRow
        label="Másodpercjelző"
        right={<Toggle value={settings.secondsTick} onValueChange={v => setSetting('secondsTick', v)} />}
      />
      <SettingsRow
        label="Sötét mód"
        right={<Toggle value={theme.mode === 'dark'} onValueChange={theme.toggleMode} />}
        divider={false}
      />
    </Screen>
  );
}

export default SettingsScreen;
