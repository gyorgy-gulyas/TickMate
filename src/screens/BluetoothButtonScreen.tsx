/** BT START button (input) latency: time from pressing the button to the app
 *  detecting it. Wired into the run-timeline origin later, together with the
 *  actual BT button. Pairing/test are deferred (no hardware yet).
 *  Maps to "Bluetooth gomb". Persisted as settings.btButtonLatencyMs. */
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

export function BluetoothButtonScreen() {
  const navigation = useNavigation<RootNav>();
  const saved = useSettings().btButtonLatencyMs;
  const setSetting = useStore(s => s.setSetting);
  const t = useT();
  const [latency, setLatency] = useState(saved);

  const save = () => {
    setSetting('btButtonLatencyMs', latency);
    navigation.goBack();
  };

  const footer = (
    <Button label={t('common.save')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} />
  );

  return (
    <Screen
      title={t('btn.title')}
      gap={14}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        {t('btn.intro')}
      </AppText>
      <StatCard
        left={{ label: t('btn.connection'), value: t('btn.notPaired'), valueSize: 14, valueColor: 'textPrimary' }}
        right={{ label: t('btn.pair'), value: t('btn.soon'), valueSize: 14, valueColor: 'textSecondary' }}
      />
      <View style={styles.field}>
        <AppText preset="label" color="textSecondary">
          {t('btn.latency')}
        </AppText>
        <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
        <AppText preset="listMeta" color="textSecondary" style={styles.hint}>
          {t('btn.latencyHint')}
        </AppText>
      </View>
    </Screen>
  );
}

export default BluetoothButtonScreen;
