/** Result editor — record actual times, see the analysis, add a note. Maps to "Eredmények". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, DivergingBar, Field, Icon, Legend, StatCard } from '../components';
import { SECTION_TYPE_META, fmtDelta, fmtSec, legDelta, runDeltas, toNum } from '../data/model';
import { useRunById, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  section: { gap: 7 },
  secHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  analysis: { gap: 8, marginTop: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
      <Screen title="Eredmények">
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Nincs ilyen futás.
        </AppText>
      </Screen>
    );
  }

  const footer = (
    <Button label="Kész" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={() => navigation.goBack()} />
  );

  // Live analysis — recomputes as actual times are edited above.
  const deltas = runDeltas(run);
  const avg = deltas.length ? deltas.reduce((s, d) => s + d.delta, 0) / deltas.length : 0;
  const best = deltas.length ? deltas.reduce((a, b) => (b.delta < a.delta ? b : a)) : null;

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

      {deltas.length ? (
        <View style={styles.analysis}>
          <AppText preset="label" color="textSecondary">
            Elemzés
          </AppText>
          <StatCard
            left={{ label: 'Átl. eltérés', value: fmtDelta(avg), unit: 'mp', valueSize: 24 }}
            right={{
              label: 'Legjobb',
              value: best ? `${best.name} ${fmtDelta(best.delta)}` : '—',
              valueSize: 14,
              valueColor: 'textPrimary',
            }}
          />
          <View style={styles.legendRow}>
            <AppText preset="label" color="textSecondary">
              Szakaszonkénti eltérés
            </AppText>
            <Legend
              swatch={10}
              items={[
                { color: 'accent', label: 'Gyorsabb' },
                { color: 'slower', label: 'Lassabb' },
              ]}
            />
          </View>
          <DivergingBar items={deltas} />
        </View>
      ) : null}

      <Field label="Megjegyzés" value={run.note} onChangeText={t => setRunNote(run.id, t)} placeholder="Hogyan ment?" />
    </Screen>
  );
}

export default ResultScreen;
