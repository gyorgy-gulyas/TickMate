/** Past run detail: measured times + note. Maps to "History · részletek". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Card, Icon, SectionRow } from '../components';
import { SECTION_TYPE_META, getRun } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav, RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  thead: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 1, marginTop: 2 },
  note: { gap: 6 },
  empty: { paddingVertical: 18 },
});

export function HistoryDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'HistoryDetail'>>();
  const navigation = useNavigation<RootNav>();
  const run = getRun(route.params?.runId);
  const hasData = run.results.length > 0;

  const footer = hasData ? (
    <Button
      label="Elemzés"
      variant="secondary"
      icon={<Icon name="chart-bar" size={16} color="textPrimary" />}
      onPress={() => navigation.navigate('Analysis', { runId: run.id })}
    />
  ) : undefined;

  return (
    <Screen title={run.raceName} gap={10} footer={footer}>
      <AppText preset="muted" color="textSecondary">
        {run.date} · {run.sectionCount} feladat
      </AppText>
      {hasData ? (
        <>
          <View>
            <View style={styles.thead}>
              <AppText preset="label" color="textSecondary">
                Feladat
              </AppText>
              <AppText preset="label" color="textSecondary">
                Típus · idő
              </AppText>
            </View>
            {run.results.map((r, i) => (
              <SectionRow
                key={`${r.name}${i}`}
                index={i + 1}
                typeIcon={<Icon name={SECTION_TYPE_META[r.type].icon} size={15} color="textSecondary" />}
                name={r.name}
                value={`${r.measuredSec.toFixed(2)} mp`}
                divider={i < run.results.length - 1}
              />
            ))}
          </View>
          {run.note ? (
            <Card style={styles.note}>
              <AppText preset="label" color="textSecondary">
                Megjegyzés
              </AppText>
              <AppText preset="listName" weight="600" color="monoSecondary">
                {run.note}
              </AppText>
            </Card>
          ) : null}
        </>
      ) : (
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Ehhez a futáshoz nincs részletes adat.
        </AppText>
      )}
    </Screen>
  );
}

export default HistoryDetailScreen;
