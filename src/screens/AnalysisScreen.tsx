/** Post-run analysis: average delta + per-section deviation. Maps to "Futás elemzés". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, DivergingBar, Icon, Legend, StatCard } from '../components';
import { fmtDelta, getRun } from '../data/mock';
import { Screen } from './Screen';
import type { RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  empty: { paddingVertical: 18 },
});

export function AnalysisScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Analysis'>>();
  const run = getRun(route.params?.runId);
  const hasData = run.results.length > 0;

  return (
    <Screen title="Elemzés" gap={12} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <AppText preset="muted" color="textSecondary">
        {run.raceName} · {run.date}
      </AppText>
      {hasData ? (
        <>
          <StatCard
            left={{ label: 'Átl. eltérés', value: fmtDelta(run.avgDelta), unit: 'mp', valueSize: 24 }}
            right={{ label: 'Legjobb', value: `${run.bestName} ${fmtDelta(run.bestDelta)}`, valueSize: 14, valueColor: 'textPrimary' }}
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
          <DivergingBar items={run.results.map(r => ({ name: r.name, delta: r.delta }))} />
        </>
      ) : (
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Ehhez a futáshoz nincs elemzés.
        </AppText>
      )}
    </Screen>
  );
}

export default AnalysisScreen;
