/** Run · shared gate (auto-advance). Maps to "Futás · közös kapu". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BigNum, Card, Icon, ProgressTrack } from '../../components';
import { RunFrame, RunHeader, RunStop } from './RunShell';
import type { RootNav } from '../../navigation/types';

const styles = StyleSheet.create({
  mid: { alignItems: 'center', gap: 16 },
  progress: { width: '100%', gap: 8 },
  gateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bottom: { gap: 10 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { flex: 1, lineHeight: 16 },
});

export function RunSharedGateScreen() {
  const navigation = useNavigation<RootNav>();
  return (
    <RunFrame>
      <RunHeader chipLabel="KÖZÖS KAPU" chipIcon={<Icon name="link-simple" size={11} color="textPrimary" />} dist="1 → 2" />
      <View style={styles.mid}>
        <AppText preset="phase" color="accentText">
          CÉL = KÖVETKEZŐ START
        </AppText>
        <BigNum value="0.40" unit="mp" />
        <View style={styles.progress}>
          <ProgressTrack value={0.92} />
          <View style={styles.gateRow}>
            <AppText preset="muted" color="textSecondary">
              SZLALOM
            </AppText>
            <AppText preset="gate" color="textPrimary">
              GARÁZS
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <Card padding={13}>
          <View style={styles.info}>
            <Icon name="arrows-clockwise" size={16} color="accent" />
            <AppText preset="muted" color="textSecondary" style={styles.infoText}>
              Automatikus váltás a következő feladatra a közös kapunál.
            </AppText>
          </View>
        </Card>
        <RunStop onPress={() => navigation.goBack()} />
      </View>
    </RunFrame>
  );
}

export default RunSharedGateScreen;
