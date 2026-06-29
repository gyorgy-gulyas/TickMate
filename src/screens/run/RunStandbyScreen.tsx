/** Run · standby. Maps to "Futás · készenlét". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, BTButton, StatCard } from '../../components';
import { fmtSec } from '../../data/mock';
import { useRace } from '../../store/useStore';
import { RunFrame, RunHeader } from './RunShell';
import type { RootNav, RootStackParamList } from '../../navigation/types';

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: 28 },
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
});

export function RunStandbyScreen() {
  const navigation = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'RunStandby'>>();
  const race = useRace(route.params?.raceId);
  const first = race.sections[0];

  return (
    <RunFrame>
      <RunHeader chipLabel="FELADAT 1" dist={first ? `${first.segments[0].distanceM} m` : ''} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        {first ? (
          <StatCard
            left={{ label: 'Előkészítés', value: fmtSec(first.prepSec), unit: 'mp' }}
            right={{ label: 'Szakasz', value: fmtSec(first.segments[0].timeSec), unit: 'mp' }}
          />
        ) : null}
        <View style={styles.center}>
          <BTButton label="START" onPress={() => navigation.navigate('RunNormal')} />
          <AppText preset="muted" color="textSecondary" style={styles.hint}>
            Nyomd meg a Bluetooth gombot
          </AppText>
        </View>
      </View>
    </RunFrame>
  );
}

export default RunStandbyScreen;
