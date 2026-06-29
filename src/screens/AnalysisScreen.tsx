/** Post-run analysis: average delta + per-leg deviation. Maps to "Futás elemzés". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, DivergingBar, Icon, Legend, StatCard } from '../components';
import { fmtDelta, runDeltas } from '../data/model';
import { useRunById } from '../store/useStore';
import { Screen } from './Screen';
import type { RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  empty: { paddingVertical: 18 },
});

export function AnalysisScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Analysis'>>();
  const run = useRunById(route.params?.runId);

  if (!run) {
    return (
      <Screen title="Elemzés">
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Nincs ilyen futás.
        </AppText>
      </Screen>
    );
  }

  const deltas = runDeltas(run);
  const hasData = deltas.length > 0;
  const avg = hasData ? deltas.reduce((s, d) => s + d.delta, 0) / deltas.length : 0;
  const best = hasData ? deltas.reduce((a, b) => (b.delta < a.delta ? b : a)) : null;

  return (
    <Screen title="Elemzés" gap={12} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <AppText preset="muted" color="textSecondary">
        {run.raceName}
        {run.date ? ` · ${run.date}` : ''}
      </AppText>
      {hasData ? (
        <>
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
        </>
      ) : (
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Ehhez a futáshoz még nincs rögzített idő. Az „Eredmény rögzítése" képernyőn add meg a valós időket.
        </AppText>
      )}
    </Screen>
  );
}

export default AnalysisScreen;
