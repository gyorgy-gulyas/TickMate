/** Past runs list. Maps to "History". Reads real runs from the store. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, ListRow } from '../components';
import { useRuns } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  empty: { paddingVertical: 18 },
});

export function HistoryScreen() {
  const navigation = useNavigation<RootNav>();
  const runs = useRuns();

  if (runs.length === 0) {
    return (
      <Screen title="History" gap={0}>
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Még nincs rögzített eredmény. Egy verseny részleteinél az „Eredmény rögzítése" gombbal zárhatod le.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen title="History" gap={0}>
      {runs.map((run, i) => (
        <ListRow
          key={run.id}
          name={run.raceName}
          meta={`${run.date ? `${run.date} · ` : ''}${run.results.length} feladat`}
          onPress={() => navigation.navigate('HistoryDetail', { runId: run.id })}
          divider={i < runs.length - 1}
        />
      ))}
    </Screen>
  );
}

export default HistoryScreen;
