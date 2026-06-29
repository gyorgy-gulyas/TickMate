/** Live run flow for a race: standby → running (audio + counter) → done
 *  (optional time entry) → finished (save). Maps to the four run views. */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, BTButton, BigNum, Button, Card, Field, Icon, ProgressTrack, StatCard } from '../../components';
import { SECTION_TYPE_META, fmtSec, toNum, type Section } from '../../data/model';
import { isSimultaneous, legWindows, taskDuration } from '../../data/timing';
import { playTask, stopAudio } from '../../audio';
import { useRace, useRunByRace, useSettings, useStore } from '../../store/useStore';
import { useTheme } from '../../theme';
import { RunFrame, RunHeader, RunStop } from './RunShell';
import type { RootNav, RootStackParamList } from '../../navigation/types';

type Phase = 'standby' | 'running' | 'done' | 'finished';

const legsOf = (s: Section) => legWindows(s.type, s.prepSec, s.segments.map(g => g.timeSec));
const durationOf = (s: Section) => taskDuration(s.type, s.prepSec, s.segments.map(g => g.timeSec));
const legName = (s: Section, li: number) => (s.segments.length > 1 ? `Szakasz ${li === 0 ? 'A' : 'B'}` : 'Idő');
const counter = (v: number) => Math.max(0, v).toFixed(2);

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: 16 },
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
  runMid: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18 },
  subBar: { width: 160 },
  progressWrap: { width: '100%', gap: 8 },
  gateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secVal: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  secNum: { fontSize: 23 },
  legsWrap: { width: '100%', gap: 6 },
  legRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legLabel: { width: 14 },
  legTrack: { flex: 1, height: 8, borderRadius: 4 },
  legBar: { position: 'absolute', top: 0, bottom: 0, borderRadius: 4 },
  legHead: { position: 'absolute', top: -3, bottom: -3, width: 2, marginLeft: -1 },
  legAxis: { flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginTop: 2 },
});

/** Live full-section timeline (multi-leg): leg bars + a moving playhead. */
function RunLegsBar({ section, duration, elapsed }: { section: Section; duration: number; elapsed: number }) {
  const theme = useTheme();
  const legs = legsOf(section);
  const head = duration > 0 ? Math.min(1, Math.max(0, elapsed / duration)) : 0;
  const headStyle = { left: `${head * 100}%` as const, backgroundColor: theme.colors.textPrimary };
  const trackBg = { backgroundColor: theme.colors.railAlt };
  return (
    <View style={styles.legsWrap}>
      {legs.map((l, i) => {
        const barStyle = {
          left: `${(l.start / duration) * 100}%` as const,
          width: `${((l.end - l.start) / duration) * 100}%` as const,
          backgroundColor: i === 0 ? theme.colors.accent : theme.colors.accentDark,
        };
        return (
          <View key={`${l.label}${i}`} style={styles.legRow}>
            <AppText preset="listNum" color="accentText" style={styles.legLabel}>
              {l.label}
            </AppText>
            <View style={[styles.legTrack, trackBg]}>
              <View style={[styles.legBar, barStyle]} />
              <View style={[styles.legHead, headStyle]} />
            </View>
          </View>
        );
      })}
      <View style={styles.legAxis}>
        <AppText preset="muted" color="textSecondary">
          0
        </AppText>
        <AppText preset="muted" color="textSecondary">
          {fmtSec(duration)} mp
        </AppText>
      </View>
    </View>
  );
}

export function RunScreen() {
  const navigation = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Run'>>();
  const quick = route.params?.quick;
  const isQuick = !!quick;
  const race = useRace(route.params?.raceId);
  const settingsTick = useSettings().secondsTick;
  const closeRace = useStore(s => s.closeRace);
  const setRunActual = useStore(s => s.setRunActual);
  const finishedRun = useRunByRace(race.id);
  const theme = useTheme();

  const [si, setSi] = useState(0);
  const [phase, setPhase] = useState<Phase>('standby');
  const [elapsed, setElapsed] = useState(0);
  const [actuals, setActuals] = useState<Record<string, string>>({});
  const startRef = useRef(0);

  const sections: Section[] = quick
    ? [{ id: 'quick', name: quick.name || 'Gyors feladat', type: quick.type, prepSec: quick.prepSec, segments: quick.segments, audioReady: true }]
    : race.sections;
  const tick = quick ? quick.secondsTick : settingsTick;
  const section = sections[si];
  const duration = section ? durationOf(section) : 0;

  useEffect(() => {
    if (phase !== 'running' || !section) return;
    const id = setInterval(() => {
      const e = (Date.now() - startRef.current) / 1000;
      if (e >= duration) {
        setElapsed(duration);
        setPhase('done');
      } else {
        setElapsed(e);
      }
    }, 80);
    return () => clearInterval(id);
  }, [phase, section, duration]);

  // Stop any audio when leaving the run.
  useEffect(() => () => stopAudio(), []);

  const abort = () => {
    stopAudio();
    navigation.goBack();
  };

  if (!section) {
    return (
      <RunFrame>
        <RunHeader chipLabel="FUTÁS" dist="" onBack={abort} />
        <View style={styles.body}>
          <AppText preset="muted" color="textSecondary">
            Nincs feladat ehhez a versenyhez.
          </AppText>
        </View>
      </RunFrame>
    );
  }

  const meta = SECTION_TYPE_META[section.type];
  const isLast = si >= sections.length - 1;

  const start = () => {
    playTask({ type: section.type, prepSec: section.prepSec, legs: section.segments.map(g => g.timeSec), secondsTick: tick });
    startRef.current = Date.now();
    setElapsed(0);
    setPhase('running');
  };

  const restart = () => {
    setElapsed(0);
    setPhase('standby');
  };

  const finish = () => {
    const runId = closeRace(race.id);
    if (runId) {
      sections.forEach((sec, sIdx) =>
        sec.segments.forEach((_g, lIdx) => {
          const v = actuals[`${sIdx}-${lIdx}`];
          if (v != null && v.trim() !== '') setRunActual(runId, sIdx, lIdx, toNum(v));
        }),
      );
    }
    setPhase('finished');
  };

  const next = () => {
    if (!isLast) {
      setSi(si + 1);
      setPhase('standby');
      setElapsed(0);
    } else {
      finish();
    }
  };

  // --- Standby ---
  if (phase === 'standby') {
    return (
      <RunFrame>
        <RunHeader
          chipLabel={`${meta.short.toUpperCase()} · ${si + 1}`}
          chipIcon={<Icon name={meta.icon} size={11} color="textPrimary" />}
          dist={`${section.segments[0].distanceM} m`}
          onBack={abort}
        />
        <View style={styles.body}>
          <StatCard
            left={{ label: 'Előkészítés', value: fmtSec(section.prepSec), unit: 'mp' }}
            right={{ label: 'Szakasz', value: section.segments.map(g => fmtSec(g.timeSec)).join(' + '), unit: 'mp' }}
          />
          <View style={styles.center}>
            <BTButton label="START" onPress={start} />
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              Nyomd meg a Bluetooth gombot
            </AppText>
          </View>
        </View>
      </RunFrame>
    );
  }

  // --- Running ---
  if (phase === 'running') {
    const inPrep = elapsed < section.prepSec;
    const legs = legsOf(section);
    const isMulti = section.segments.length > 1;
    // "two times at once" = nested/overlap. Shared is sequential.
    const simultaneous = isSimultaneous(section.type);

    const seqActive = legs.filter(l => elapsed >= l.start && elapsed < l.end)[0];
    const primary = simultaneous ? legs[0] : seqActive;
    const bigVal = inPrep ? section.prepSec - elapsed : primary ? Math.max(0, primary.end - elapsed) : 0;
    const bigColor = inPrep ? 'numBright' : 'slower';
    const phaseLabel = inPrep ? 'ELŐKÉSZÍTÉS' : simultaneous ? 'SZAKASZ A' : primary?.label ? `SZAKASZ ${primary.label}` : 'SZAKASZ';
    const subSecond = elapsed - Math.floor(elapsed);
    const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

    // Secondary (B) timer — always present for simultaneous tasks.
    const bLeg = simultaneous ? legs[1] : undefined;
    const bStatus = bLeg ? (elapsed < bLeg.start ? 'hamarosan' : elapsed < bLeg.end ? 'folyamatban' : 'kész') : '';
    const bVal = bLeg ? (elapsed < bLeg.start ? bLeg.end - bLeg.start : Math.max(0, bLeg.end - elapsed)) : 0;

    return (
      <RunFrame>
        <RunHeader
          chipLabel={`${meta.short.toUpperCase()} · ${si + 1}`}
          chipIcon={<Icon name={meta.icon} size={11} color="textPrimary" />}
          dist={`${section.segments[0].distanceM} m`}
          onBack={abort}
        />
        <View style={styles.runMid}>
          <AppText preset="phase" color="accentText">
            {phaseLabel}
          </AppText>
          <View style={styles.subBar}>
            <ProgressTrack value={subSecond} height={4} fillColor={theme.colors[bigColor]} />
          </View>
          <BigNum value={counter(bigVal)} unit="mp" color={bigColor} />
          {!isMulti ? (
            <View style={styles.progressWrap}>
              <ProgressTrack value={progress} />
              <View style={styles.gateRow}>
                <AppText preset="muted" color="textSecondary">
                  RAJT
                </AppText>
                <AppText preset="gate" color="textPrimary">
                  CÉL
                </AppText>
              </View>
            </View>
          ) : null}
          {bLeg ? (
            <Card padding={13} style={styles.progressWrap}>
              <View style={styles.secRow}>
                <AppText preset="label" color="textSecondary">
                  {bLeg.label} · {bStatus}
                </AppText>
                <View style={styles.secVal}>
                  <AppText preset="statN" color={bStatus === 'folyamatban' ? 'numBright' : 'textSecondary'} style={styles.secNum}>
                    {counter(bVal)}
                  </AppText>
                  <AppText preset="statUnit" color="textSecondary">
                    mp
                  </AppText>
                </View>
              </View>
            </Card>
          ) : null}
          {isMulti ? (
            <View style={styles.progressWrap}>
              <RunLegsBar section={section} duration={duration} elapsed={elapsed} />
            </View>
          ) : null}
        </View>
        <RunStop onPress={abort} />
      </RunFrame>
    );
  }

  // --- Done (quick task: no save) ---
  if (phase === 'done' && isQuick) {
    return (
      <RunFrame>
        <RunHeader chipLabel="KÉSZ" dist="" onBack={abort} />
        <View style={styles.body}>
          <AppText preset="phase" color="accentText">
            FELADAT KÉSZ
          </AppText>
          <AppText preset="muted" color="textSecondary">
            Gyakorló feladat — nincs mentés.
          </AppText>
          <Button label="Újra" variant="secondary" icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />} onPress={restart} />
          <Button label="Vissza" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={() => navigation.goBack()} />
        </View>
      </RunFrame>
    );
  }

  // --- Done (race: enter actual time) ---
  if (phase === 'done') {
    return (
      <RunFrame>
        <RunHeader chipLabel={`FELADAT ${si + 1} · KÉSZ`} dist="" onBack={abort} />
        <View style={styles.body}>
          <AppText preset="phase" color="accentText">
            FELADAT KÉSZ
          </AppText>
          <AppText preset="muted" color="textSecondary">
            Valós idő (opcionális)
          </AppText>
          {section.segments.map((g, li) => (
            <Field
              key={li}
              label={`${legName(section, li)} · cél ${fmtSec(g.timeSec)} mp`}
              value={actuals[`${si}-${li}`] ?? ''}
              onChangeText={v => setActuals(prev => ({ ...prev, [`${si}-${li}`]: v }))}
              unit="mp"
              keyboardType="decimal-pad"
            />
          ))}
        </View>
        <Button
          label={isLast ? 'Befejezés' : 'Következő feladat'}
          variant="primary"
          icon={<Icon name={isLast ? 'check' : 'arrow-right'} size={16} color="onAccent" />}
          onPress={next}
        />
      </RunFrame>
    );
  }

  // --- Finished ---
  return (
    <RunFrame>
      <RunHeader chipLabel="BEFEJEZVE" dist="" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <AppText preset="phase" color="accentText">
          BEFEJEZVE
        </AppText>
        <AppText preset="muted" color="textSecondary">
          A beírt idők mentve a futás eredményébe.
        </AppText>
        <Button
          label="Eredmény megtekintése"
          variant="secondary"
          icon={<Icon name="chart-bar" size={16} color="textPrimary" />}
          onPress={() => (finishedRun ? navigation.navigate('HistoryDetail', { runId: finishedRun.id }) : navigation.goBack())}
        />
        <Button label="Vissza" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={() => navigation.goBack()} />
      </View>
    </RunFrame>
  );
}

export default RunScreen;
