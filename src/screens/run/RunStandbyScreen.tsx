/** Run · standby. Maps to "Futás · készenlét". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BTButton, StatCard, UpcomingRow } from '../../components';
import { RunFrame, RunHeader } from './RunShell';
import type { RootNav } from '../../navigation/types';

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
  upLabel: { marginBottom: 4 },
});

export function RunStandbyScreen() {
  const navigation = useNavigation<RootNav>();
  return (
    <RunFrame>
      <RunHeader chipLabel="FELADAT 12" dist="20 m" />
      <StatCard left={{ label: 'Előkészítés', value: '5.0', unit: 'mp' }} right={{ label: 'Szakasz', value: '7.0', unit: 'mp' }} />
      <View style={styles.center}>
        <BTButton label="START" onPress={() => navigation.navigate('RunNormal')} />
        <AppText preset="muted" color="textSecondary" style={styles.hint}>
          Nyomd meg a Bluetooth gombot
        </AppText>
      </View>
      <View>
        <AppText preset="label" color="textSecondary" style={styles.upLabel}>
          Következő feladatok
        </AppText>
        <UpcomingRow label="13" value="3 / 8 mp" />
        <UpcomingRow label="14" value="4 / 5 mp" />
      </View>
    </RunFrame>
  );
}

export default RunStandbyScreen;
