/** Run · normal section. Maps to "Futás · normál". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BigNum, Icon, ProgressTrack } from '../../components';
import { RunFrame, RunHeader, RunStop } from './RunShell';
import type { RootNav } from '../../navigation/types';

const styles = StyleSheet.create({
  mid: { alignItems: 'center', gap: 20 },
  progress: { width: '100%', gap: 8 },
  gateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bottom: { gap: 10 },
  nextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export function RunNormalScreen() {
  const navigation = useNavigation<RootNav>();
  return (
    <RunFrame>
      <RunHeader chipLabel="FELADAT 12" chipIcon={<Icon name="arrow-right" size={11} color="textPrimary" />} dist="20 m" />
      <View style={styles.mid}>
        <AppText preset="phase" color="accentText">
          SZAKASZ
        </AppText>
        <BigNum value="2.50" unit="mp" />
        <View style={styles.progress}>
          <ProgressTrack value={0.62} />
          <View style={styles.gateRow}>
            <AppText preset="muted" color="textSecondary">
              RAJT
            </AppText>
            <AppText preset="gate" color="textPrimary">
              CÉL KAPU
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.nextRow}>
          <AppText preset="muted" color="textSecondary">
            Következő
          </AppText>
          <AppText preset="mono" color="accentText">
            13 · 3 / 8 mp
          </AppText>
        </View>
        <RunStop onPress={() => navigation.goBack()} />
      </View>
    </RunFrame>
  );
}

export default RunNormalScreen;
