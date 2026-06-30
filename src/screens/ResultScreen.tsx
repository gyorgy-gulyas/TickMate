/** Result editor — record actual times, see the analysis, add a note. Maps to "Eredmények". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, DivergingBar, Field, Icon, Legend, StatCard, StatusView } from '../components';
import { fmtDelta, fmtSec, legDelta, runDeltas, toNum } from '../data/model';
import { useT, typeKey } from '../i18n';
import { useRunById, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  section: { gap: 7 },
  secHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  analysis: { gap: 8, marginTop: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export function ResultScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const navigation = useNavigation();
  const run = useRunById(route.params?.runId);
  const setRunActual = useStore(s => s.setRunActual);
  const setRunNote = useStore(s => s.setRunNote);
  const t = useT();

  if (!run) {
    return (
      <Screen title={t('result.title')} scroll={false}>
        <StatusView icon="chart-bar" title={t('result.none')} />
      </Screen>
    );
  }

  const footer = (
    <Button label={t('common.done')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={() => navigation.goBack()} />
  );

  // Live analysis — recomputes as actual times are edited above.
  const deltas = runDeltas(run);
  const avg = deltas.length ? deltas.reduce((s, d) => s + d.delta, 0) / deltas.length : 0;
  const best = deltas.length ? deltas.reduce((a, b) => (b.delta < a.delta ? b : a)) : null;

  return (
    <Screen title={run.raceName} gap={14} footer={footer}>
      <AppText preset="muted" color="textSecondary">
        {run.date ? `${run.date} · ` : ''}
        {t('result.recordTimes')}
      </AppText>

      {run.results.map((sec, si) => (
        <View key={`${sec.name}${si}`} style={styles.section}>
          <View style={styles.secHead}>
            <AppText preset="listName" color="textPrimary">
              {si + 1}. {sec.name}
            </AppText>
            <AppText preset="cardSub" color="textSecondary">
              {t(typeKey(sec.type))}
            </AppText>
          </View>
          {sec.legs.map((leg, li) => {
            const d = legDelta(leg);
            const legName = sec.legs.length > 1 ? t(li === 0 ? 'section.a' : 'section.b') : t('field.time');
            return (
              <Field
                key={li}
                label={`${legName} · ${t('result.target', { sec: fmtSec(leg.targetSec), u: t('unit.sec') })}`}
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
            {t('result.analysis')}
          </AppText>
          <StatCard
            left={{ label: t('result.avgDelta'), value: fmtDelta(avg), unit: t('unit.sec'), valueSize: 24 }}
            right={{
              label: t('result.best'),
              value: best ? `${best.name} ${fmtDelta(best.delta)}` : '—',
              valueSize: 14,
              valueColor: 'textPrimary',
            }}
          />
          <View style={styles.legendRow}>
            <AppText preset="label" color="textSecondary">
              {t('result.perSection')}
            </AppText>
            <Legend
              swatch={10}
              items={[
                { color: 'accent', label: t('result.faster') },
                { color: 'slower', label: t('result.slower') },
              ]}
            />
          </View>
          <DivergingBar items={deltas} />
        </View>
      ) : null}

      <Field label={t('result.note')} value={run.note} onChangeText={v => setRunNote(run.id, v)} placeholder={t('result.note.ph')} />
    </Screen>
  );
}

export default ResultScreen;
