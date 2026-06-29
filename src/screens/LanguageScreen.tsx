/** Language picker. Maps to "Nyelv". Persisted; audio cues are language-independent. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Icon, SettingsRow } from '../components';
import { LANGUAGES } from '../data/model';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  intro: { marginBottom: 4 },
});

export function LanguageScreen() {
  const selected = useSettings().language;
  const setSetting = useStore(s => s.setSetting);

  return (
    <Screen title="Nyelv" gap={0}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        Válaszd ki az alkalmazás nyelvét. A hangjelzések ettől függetlenül azonosak.
      </AppText>
      {LANGUAGES.map((lang, i) => (
        <SettingsRow
          key={lang}
          label={lang}
          onPress={() => setSetting('language', lang)}
          right={lang === selected ? <Icon name="check" size={19} color="accent" /> : null}
          divider={i < LANGUAGES.length - 1}
        />
      ))}
    </Screen>
  );
}

export default LanguageScreen;
