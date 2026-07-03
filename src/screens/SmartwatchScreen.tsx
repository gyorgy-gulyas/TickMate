/** Smartwatch (companion) status + output latency. The watch pairs to the
 *  phone in the system Bluetooth / Wear settings, not here — we only report
 *  whether a wearable is paired. Its latency aligns the vibrating countdown /
 *  start cue with the audio. Maps to "Okosóra".
 *  Persisted as settings.watchLatencyMs. */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Button, Icon, StatCard, Stepper } from '../components';
import { useT } from '../i18n';
import { useBluetoothStatus, openBluetoothSettings } from '../native/bluetooth';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  intro: { lineHeight: 18 },
  field: { gap: 7 },
  hint: { marginLeft: 2 },
});

export function SmartwatchScreen() {
  const navigation = useNavigation<RootNav>();
  const saved = useSettings().watchLatencyMs;
  const setSetting = useStore(s => s.setSetting);
  const t = useT();
  const watch = useBluetoothStatus(true).status.watch;
  const [latency, setLatency] = useState(saved);

  const save = () => {
    setSetting('watchLatencyMs', latency);
    navigation.goBack();
  };

  const footer = (
    <Button label={t('common.save')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} />
  );

  return (
    <Screen
      title={t('watch.title')}
      gap={14}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        {t('watch.intro')}
      </AppText>
      <StatCard
        left={{
          label: t('btn.connection'),
          value: watch.paired ? t('btn.paired') : t('btn.notPaired'),
          valueSize: 14,
          valueColor: watch.paired ? 'accent' : 'textPrimary',
        }}
        right={{ label: t('btn.device'), value: watch.name ?? '—', valueSize: 14, valueColor: 'textPrimary' }}
      />
      <Button
        label={t('common.btSettings')}
        variant="secondary"
        icon={<Icon name="bluetooth" size={15} color="textPrimary" />}
        onPress={openBluetoothSettings}
      />
      <View style={styles.field}>
        <AppText preset="label" color="textSecondary">
          {t('watch.latency')}
        </AppText>
        <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
        <AppText preset="listMeta" color="textSecondary" style={styles.hint}>
          {t('watch.latencyHint')}
        </AppText>
      </View>
    </Screen>
  );
}

export default SmartwatchScreen;
