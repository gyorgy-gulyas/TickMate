/** Earpiece (audio output) latency. Time from playback to what reaches the ear;
 *  the on-screen timeline is aligned to it so picture and sound stay together.
 *  Maps to "Fülhallgató (hangkimenet)". Persisted as settings.btAudioLatencyMs. */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Button, Icon, StatCard, Stepper } from '../components';
import { useT } from '../i18n';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  intro: { lineHeight: 18 },
  field: { gap: 7 },
  hint: { marginLeft: 2 },
});

export function EarpieceScreen() {
  const navigation = useNavigation<RootNav>();
  const saved = useSettings().btAudioLatencyMs;
  const setSetting = useStore(s => s.setSetting);
  const t = useT();
  const [latency, setLatency] = useState(saved);

  const save = () => {
    setSetting('btAudioLatencyMs', latency);
    navigation.goBack();
  };

  const footer = (
    <>
      <Button label={t('bt.auto')} variant="secondary" icon={<Icon name="arrows-clockwise" size={15} color="textPrimary" />} />
      <Button label={t('common.save')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} />
    </>
  );

  return (
    <Screen
      title={t('bt.title')}
      gap={14}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        {t('bt.intro')}
      </AppText>
      <StatCard
        left={{ label: t('bt.measured'), value: String(latency), unit: 'ms' }}
        right={{ label: t('bt.device'), value: 'AirPods Pro', valueSize: 14, valueColor: 'textPrimary' }}
      />
      <View style={styles.field}>
        <AppText preset="label" color="textSecondary">
          {t('bt.manual')}
        </AppText>
        <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
        <AppText preset="listMeta" color="textSecondary" style={styles.hint}>
          {t('bt.latencyHint')}
        </AppText>
      </View>
      <Button label={t('bt.test')} variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} />
    </Screen>
  );
}

export default EarpieceScreen;
