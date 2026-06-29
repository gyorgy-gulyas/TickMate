/** Past runs list. Maps to "History". */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ListRow } from '../components';
import { HISTORY } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

export function HistoryScreen() {
  const navigation = useNavigation<RootNav>();
  return (
    <Screen title="History" gap={0}>
      {HISTORY.map((run, i) => (
        <ListRow
          key={run.id}
          name={run.raceName}
          meta={`${run.date} · ${run.sectionCount} feladat`}
          onPress={() => navigation.navigate('HistoryDetail', { runId: run.id })}
          divider={i < HISTORY.length - 1}
        />
      ))}
    </Screen>
  );
}

export default HistoryScreen;
