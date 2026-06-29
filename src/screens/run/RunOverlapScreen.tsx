/** Run · overlap (two active timers). Maps to "Futás · átfedő". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BigNum, Card, Icon, ProgressTrack } from '../../components';
import { useTheme } from '../../theme';
import { RunFrame, RunHeader, RunStop } from './RunShell';
import type { RootNav } from '../../navigation/types';

const styles = StyleSheet.create({
  mid: { alignItems: 'center', gap: 14 },
  full: { width: '100%' },
  bottom: { gap: 10 },
  secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secValue: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  secNum: { fontSize: 23 },
  secProgress: { marginTop: 9 },
});

export function RunOverlapScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNav>();
  return (
    <RunFrame>
      <RunHeader chipLabel="ÁTFEDŐ · 2 AKTÍV" chipIcon={<Icon name="arrows-split" size={11} color="textPrimary" />} dist="20 m" />
      <View style={styles.mid}>
        <AppText preset="phase" color="accentText">
          A · SZLALOM → CÉL
        </AppText>
        <BigNum value="2.50" unit="mp" />
        <View style={styles.full}>
          <ProgressTrack value={0.62} />
        </View>
      </View>
      <View style={styles.bottom}>
        <Card padding={13}>
          <View style={styles.secRow}>
            <AppText preset="label" color="textSecondary">
              B · Garázs → Rajt
            </AppText>
            <View style={styles.secValue}>
              <AppText preset="statN" color="numBright" style={styles.secNum}>
                1.20
              </AppText>
              <AppText preset="statUnit" color="textSecondary">
                mp
              </AppText>
            </View>
          </View>
          <View style={styles.secProgress}>
            <ProgressTrack value={0.3} height={6} fillColor={theme.colors.accentDark} />
          </View>
        </Card>
        <RunStop onPress={() => navigation.goBack()} />
      </View>
    </RunFrame>
  );
}

export default RunOverlapScreen;
