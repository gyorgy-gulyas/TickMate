/** Settings, grouped by category. Maps to "Beállítások". Backed by the store. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Icon, SettingsRow, Toggle } from '../components';
import { useTheme } from '../theme';
import { useT, type StringKey } from '../i18n';
import { matchPreset } from '../data/model';
import { useSettings } from '../store/useStore';
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
  const t = useT();
  const presetId = matchPreset(settings.sound);
  const presetName = t(presetId ? (`sound.preset.${presetId}` as StringKey) : 'sound.preset.custom');

  return (
    <Screen title={t('settings.title')} gap={16} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <Category title={t('settings.cat.device')}>
        <SettingsRow
          label={t('settings.btButton')}
          value={`${settings.btButtonLatencyMs} ms`}
          chevron
          onPress={() => navigation.navigate('BluetoothButton')}
        />
        <SettingsRow
          label={t('settings.btHeadset')}
          value={`${settings.btAudioLatencyMs} ms`}
          chevron
          onPress={() => navigation.navigate('Earpiece')}
        />
        <SettingsRow label={t('settings.watch')} value="Apple Watch" chevron onPress={() => navigation.navigate('Smartwatch')} divider={false} />
      </Category>

      <Category title={t('settings.cat.general')}>
        <SettingsRow label={t('settings.soundProfile')} value={presetName} chevron onPress={() => navigation.navigate('SoundProfile')} />
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
