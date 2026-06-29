/** Result editor — record actual times for a race's run. Maps to "Eredmény rögzítése". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Field, Icon } from '../components';
import { SECTION_TYPE_META, fmtDelta, fmtSec, legDelta, toNum } from '../data/model';
import { useRunById, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  section: { gap: 7 },
  secHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  empty: { paddingVertical: 18 },
});

export function ResultScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const navigation = useNavigation();
  const run = useRunById(route.params?.runId);
  const setRunActual = useStore(s => s.setRunActual);
  const setRunNote = useStore(s => s.setRunNote);

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
    <Button label="Kész" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={() => navigation.goBack()} />
  );

  return (
    <Screen title={run.raceName} gap={14} footer={footer}>
      <AppText preset="muted" color="textSecondary">
        {run.date ? `${run.date} · ` : ''}Valós idők rögzítése
      </AppText>

      {run.results.map((sec, si) => (
        <View key={`${sec.name}${si}`} style={styles.section}>
          <View style={styles.secHead}>
            <AppText preset="listName" color="textPrimary">
              {si + 1}. {sec.name}
            </AppText>
            <AppText preset="cardSub" color="textSecondary">
              {SECTION_TYPE_META[sec.type].label}
            </AppText>
          </View>
          {sec.legs.map((leg, li) => {
            const d = legDelta(leg);
            const legName = sec.legs.length > 1 ? `Szakasz ${li === 0 ? 'A' : 'B'}` : 'Idő';
            return (
              <Field
                key={li}
                label={`${legName} · cél ${fmtSec(leg.targetSec)} mp`}
                value={leg.actualSec != null ? String(leg.actualSec) : ''}
                onChangeText={v => setRunActual(run.id, si, li, v.trim() === '' ? null : toNum(v))}
                unit="mp"
                keyboardType="decimal-pad"
                rightAdornment={
                  d != null ? (
                    <AppText preset="mono" color={d > 0 ? 'slower' : 'accentText'}>
                      {fmtDelta(d)}
                    </AppText>
                  ) : undefined
                }
              />
            );
          })}
        </View>
      ))}

      <Field label="Megjegyzés" value={run.note} onChangeText={t => setRunNote(run.id, t)} placeholder="Hogyan ment?" />
    </Screen>
  );
}

export default ResultScreen;
