/** Past run detail: actual times + note. Maps to "History · részletek". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Card, Icon, SectionRow } from '../components';
import { SECTION_TYPE_META, fmtSec } from '../data/mock';
import { useRunById } from '../store/useStore';
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
  const run = useRunById(route.params?.runId);

  if (!run) {
    return (
      <Screen title="Eredmény">
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Nincs ilyen futás.
        </AppText>
      </Screen>
    );
  }

  const footer = (
    <Button
      label="Elemzés"
      variant="secondary"
      icon={<Icon name="chart-bar" size={16} color="textPrimary" />}
      onPress={() => navigation.navigate('Analysis', { runId: run.id })}
    />
  );

  return (
    <Screen title={run.raceName} gap={10} footer={footer}>
      <AppText preset="muted" color="textSecondary">
        {run.date ? `${run.date} · ` : ''}
        {run.results.length} feladat
      </AppText>
      <View>
        <View style={styles.thead}>
          <AppText preset="label" color="textSecondary">
            Feladat
          </AppText>
          <AppText preset="label" color="textSecondary">
            Valós idő
          </AppText>
        </View>
        {run.results.map((sec, i) => (
          <SectionRow
            key={`${sec.name}${i}`}
            index={i + 1}
            typeIcon={<Icon name={SECTION_TYPE_META[sec.type].icon} size={15} color="textSecondary" />}
            name={sec.name}
            meta={SECTION_TYPE_META[sec.type].label}
            value={`${sec.legs.map(l => (l.actualSec != null ? fmtSec(l.actualSec) : '—')).join(' + ')} mp`}
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
    </Screen>
  );
}

export default HistoryDetailScreen;
