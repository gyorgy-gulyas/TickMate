/** Settings list. Maps to "Beállítások". Dark-mode row toggles the live theme. */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, SettingsRow, Slider, Toggle } from '../components';
import { useTheme } from '../theme';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  volume: { width: 120 },
});

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNav>();
  const [volume, setVolume] = useState(0.72);
  const [secondsTick, setSecondsTick] = useState(true);

  return (
    <Screen title="Beállítások" gap={0} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <SettingsRow label="Bluetooth gomb" statusDot value="Csatlakoztatva" />
      <SettingsRow label="Bluetooth füles" value="AirPods Pro" />
      <SettingsRow
        label="Bluetooth késleltetés"
        value="120 ms"
        chevron
        onPress={() => navigation.navigate('BluetoothLatency')}
      />
      <SettingsRow label="Okosóra" value="Apple Watch" chevron onPress={() => navigation.navigate('Smartwatch')} />
      <SettingsRow label="Hangerő" right={<Slider value={volume} onChange={setVolume} style={styles.volume} />} />
      <SettingsRow label="Hangprofil" value="Profil v1" chevron />
      <SettingsRow label="Nyelv" value="Magyar" chevron onPress={() => navigation.navigate('Language')} />
      <SettingsRow label="Másodpercjelző" right={<Toggle value={secondsTick} onValueChange={setSecondsTick} />} />
      <SettingsRow
        label="Sötét mód"
        right={<Toggle value={theme.mode === 'dark'} onValueChange={theme.toggleMode} />}
        divider={false}
      />
    </Screen>
  );
}

export default SettingsScreen;
