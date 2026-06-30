/** Live run flow for a race: standby → running (audio + counter) → done
 *  (optional time entry) → finished (save). Maps to the four run views.
 *  RunScreen owns the state/logic; each phase renders via a focused view below. */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, BTButton, BigNum, Button, Card, Field, Icon, ProgressTrack, StatCard } from '../../components';
import { SECTION_TYPE_META, fmtSec, toNum, type Section } from '../../data/model';
import { countdownBeats, gateTimes, isSimultaneous, legWindows, taskDuration } from '../../data/timing';
import { playTask, stopAudio } from '../../audio';
import { useRace, useRunByRace, useSettings, useStore } from '../../store/useStore';
import { useTheme } from '../../theme';
import { useT, typeKey, type TFunc } from '../../i18n';
import { RunFrame, RunHeader, RunStop } from './RunShell';
import type { RootNav, RootStackParamList } from '../../navigation/types';

type Phase = 'standby' | 'running' | 'done' | 'finished';
type TypeMeta = (typeof SECTION_TYPE_META)[Section['type']];

const legsOf = (s: Section) => legWindows(s.type, s.prepSec, s.segments.map(g => g.timeSec));
const durationOf = (s: Section) => taskDuration(s.type, s.prepSec, s.segments.map(g => g.timeSec));
const legName = (t: TFunc, s: Section, li: number) =>
  s.segments.length > 1 ? t(li === 0 ? 'section.a' : 'section.b') : t('field.time');
const counter = (v: number) => Math.max(0, v).toFixed(2);

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: 16 },
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
  runMid: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18 },
  subBar: { width: 160 },
  subTick: { position: 'absolute', top: -3, bottom: -3, width: 1.5, borderRadius: 1 },
  subTickLeft: { left: 0 },
  subTickRight: { right: 0 },
  progressWrap: { width: '100%', gap: 8 },
  secTrack: { width: '100%', height: 8, borderRadius: 4 },
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
  gateMark: { position: 'absolute', top: -4, bottom: -4, width: 1.5, borderRadius: 1, marginLeft: -0.75 },
  beatMark: { position: 'absolute', top: -2, bottom: -2, width: 0.5, marginLeft: -0.25 },
  legAxis: { flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginTop: 2 },
});

/** Live full-section timeline (multi-leg): leg bars + a moving playhead. */
function RunLegsBar({ section, duration, elapsed }: { section: Section; duration: number; elapsed: number }) {
  const theme = useTheme();
  const tr = useT();
  const legs = legsOf(section);
  const gates = gateTimes(section.type, section.prepSec, section.segments.map(g => g.timeSec));
  const beats = countdownBeats(gates, false);
  const head = duration > 0 ? Math.min(1, Math.max(0, elapsed / duration)) : 0;
  const headStyle = { left: `${head * 100}%` as const, backgroundColor: theme.colors.textPrimary };
  const trackBg = { backgroundColor: theme.colors.railAlt };
  const beatColor = { backgroundColor: theme.colors.textSecondary };
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
              {beats.map((t, bi) => {
                const beatStyle = { left: `${(t / duration) * 100}%` as const };
                return <View key={`b${bi}`} style={[styles.beatMark, beatColor, beatStyle]} />;
              })}
              {gates.map((t, gi) => {
                const markStyle = { left: `${(t / duration) * 100}%` as const, backgroundColor: theme.colors.textPrimary };
                return <View key={`g${gi}`} style={[styles.gateMark, markStyle]} />;
              })}
              <View style={[styles.legHead, headStyle]} />
            </View>
          </View>
        );
      })}
      <View style={styles.legAxis}>
        <AppText preset="muted" color="textSecondary">
          {`0 ${tr('unit.sec')}`}
        </AppText>
        <AppText preset="muted" color="textSecondary">
          {`${fmtSec(duration)} ${tr('unit.sec')}`}
        </AppText>
      </View>
    </View>
  );
}

/** Empty race (no sections to run). */
function EmptyView({ onBack }: { onBack: () => void }) {
  const t = useT();
  return (
    <RunFrame>
      <RunHeader chipLabel={t('run.chip')} dist="" onBack={onBack} />
      <View style={styles.body}>
        <AppText preset="muted" color="textSecondary">
          {t('run.empty')}
        </AppText>
      </View>
    </RunFrame>
  );
}

/** Standby: section summary + START prompt. */
function StandbyView({
  section,
  si,
  meta,
  onStart,
  onBack,
}: {
  section: Section;
  si: number;
  meta: TypeMeta;
  onStart: () => void;
  onBack: () => void;
}) {
  const t = useT();
  return (
    <RunFrame>
      <RunHeader
        chipLabel={`${t(typeKey(section.type, 'short')).toUpperCase()} · ${si + 1}`}
        chipIcon={<Icon name={meta.icon} size={11} color="textPrimary" />}
        dist={`${section.segments[0].distanceM} m`}
        onBack={onBack}
      />
      <View style={styles.body}>
        <StatCard
          left={{ label: t('run.statPrep'), value: fmtSec(section.prepSec), unit: t('unit.sec') }}
          right={{ label: t('run.statSection'), value: section.segments.map(g => fmtSec(g.timeSec)).join(' + '), unit: t('unit.sec') }}
        />
        <View style={styles.center}>
          <BTButton label={t('run.bt')} onPress={onStart} />
          <AppText preset="muted" color="textSecondary" style={styles.hint}>
            {t('run.btHint')}
          </AppText>
        </View>
      </View>
    </RunFrame>
  );
}

/** Running: live big counter, sub-second bar, gates/leg timeline, optional B timer. */
function RunningView({
  section,
  si,
  meta,
  duration,
  elapsed,
  onBack,
}: {
  section: Section;
  si: number;
  meta: TypeMeta;
  duration: number;
  elapsed: number;
  onBack: () => void;
}) {
  const theme = useTheme();
  const t = useT();
  const inPrep = elapsed < section.prepSec;
  const legs = legsOf(section);
  const isMulti = section.segments.length > 1;
  // "two times at once" = nested/overlap. Shared is sequential.
  const simultaneous = isSimultaneous(section.type);

  const seqActive = legs.filter(l => elapsed >= l.start && elapsed < l.end)[0];
  const primary = simultaneous ? legs[0] : seqActive;
  const bigVal = inPrep ? section.prepSec - elapsed : primary ? Math.max(0, primary.end - elapsed) : 0;
  const bigColor = inPrep ? 'numBright' : 'slower';
  const phaseLabel = inPrep
    ? t('run.phase.prep')
    : simultaneous
      ? t('run.phase.sectionA')
      : primary?.label
        ? t('run.phase.sectionX', { leg: primary.label })
        : t('run.phase.section');
  const subSecond = elapsed - Math.floor(elapsed);
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  // Normal task: show the section as a distinct band (prep = empty rail) with a moving head.
  const single = legs[0];
  const secTrackBg = { backgroundColor: theme.colors.railAlt };
  const secBarStyle = {
    left: `${(single.start / duration) * 100}%` as const,
    width: `${((single.end - single.start) / duration) * 100}%` as const,
    backgroundColor: theme.colors.accent,
  };
  const secHeadStyle = { left: `${progress * 100}%` as const, backgroundColor: theme.colors.textPrimary };
  const tickColor = { backgroundColor: theme.colors.textPrimary };
  // Section boundaries (gate times) marked on the bar.
  const gates = gateTimes(section.type, section.prepSec, section.segments.map(g => g.timeSec));
  // Accelerating countdown beats (the audio's intermediate clicks into each gate).
  const beats = countdownBeats(gates, false);
  const beatColor = { backgroundColor: theme.colors.textSecondary };
  // On the per-second bar: only the beats falling inside the current second, as fractions.
  const floorSec = Math.floor(elapsed);
  const subBeats = beats.filter(x => x >= floorSec && x < floorSec + 1).map(x => x - floorSec);

  // Secondary (B) timer — always present for simultaneous tasks.
  const bLeg = simultaneous ? legs[1] : undefined;
  const bStatusKey = bLeg && elapsed >= bLeg.end ? 'run.b.done' : bLeg && elapsed >= bLeg.start ? 'run.b.running' : 'run.b.soon';
  const bVal = bLeg ? (elapsed < bLeg.start ? bLeg.end - bLeg.start : Math.max(0, bLeg.end - elapsed)) : 0;

  return (
    <RunFrame>
      <RunHeader
        chipLabel={`${t(typeKey(section.type, 'short')).toUpperCase()} · ${si + 1}`}
        chipIcon={<Icon name={meta.icon} size={11} color="textPrimary" />}
        dist={`${section.segments[0].distanceM} m`}
        onBack={onBack}
      />
      <View style={styles.runMid}>
        <AppText preset="phase" color="accentText">
          {phaseLabel}
        </AppText>
        <View style={styles.subBar}>
          <ProgressTrack value={subSecond} height={4} fillColor={theme.colors[bigColor]} />
          {subBeats.map((f, bi) => {
            const beatStyle = { left: `${f * 100}%` as const };
            return <View key={`sb${bi}`} style={[styles.beatMark, beatColor, beatStyle]} />;
          })}
          <View style={[styles.subTick, styles.subTickLeft, tickColor]} />
          <View style={[styles.subTick, styles.subTickRight, tickColor]} />
        </View>
        <BigNum value={counter(bigVal)} unit={t('unit.sec')} color={bigColor} />
        {!isMulti ? (
          <View style={styles.progressWrap}>
            <View style={[styles.secTrack, secTrackBg]}>
              <View style={[styles.legBar, secBarStyle]} />
              {beats.map((bt, i) => {
                const beatStyle = { left: `${(bt / duration) * 100}%` as const };
                return <View key={`b${i}`} style={[styles.beatMark, beatColor, beatStyle]} />;
              })}
              {gates.map((gt, i) => {
                const markStyle = { left: `${(gt / duration) * 100}%` as const, backgroundColor: theme.colors.textPrimary };
                return <View key={`g${i}`} style={[styles.gateMark, markStyle]} />;
              })}
              <View style={[styles.legHead, secHeadStyle]} />
            </View>
            <View style={styles.gateRow}>
              <AppText preset="muted" color="textSecondary">
                {t('run.gate.start')}
              </AppText>
              <AppText preset="gate" color="textPrimary">
                {t('run.gate.finish')}
              </AppText>
            </View>
            <View style={styles.gateRow}>
              <AppText preset="muted" color="textSecondary">
                {`0 ${t('unit.sec')}`}
              </AppText>
              <AppText preset="muted" color="textSecondary">
                {`${fmtSec(duration)} ${t('unit.sec')}`}
              </AppText>
            </View>
          </View>
        ) : null}
        {bLeg ? (
          <Card padding={13} style={styles.progressWrap}>
            <View style={styles.secRow}>
              <AppText preset="label" color="textSecondary">
                {bLeg.label} · {t(bStatusKey)}
              </AppText>
              <View style={styles.secVal}>
                <AppText preset="statN" color={bStatusKey === 'run.b.running' ? 'numBright' : 'textSecondary'} style={styles.secNum}>
                  {counter(bVal)}
                </AppText>
                <AppText preset="statUnit" color="textSecondary">
                  {t('unit.sec')}
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
      <RunStop onPress={onBack} />
    </RunFrame>
  );
}

/** Done, quick task: no save — restart or leave. */
function DoneQuickView({ onRestart, onBack, onHome }: { onRestart: () => void; onBack: () => void; onHome: () => void }) {
  const t = useT();
  return (
    <RunFrame>
      <RunHeader chipLabel={t('run.kesz')} dist="" onBack={onBack} />
      <View style={styles.body}>
        <AppText preset="phase" color="accentText">
          {t('run.doneHeading')}
        </AppText>
        <AppText preset="muted" color="textSecondary">
          {t('run.quickSub')}
        </AppText>
        <Button label={t('common.again')} variant="secondary" icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />} onPress={onRestart} />
        <Button label={t('common.back')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={onHome} />
      </View>
    </RunFrame>
  );
}

/** Done, race task: enter optional actual times, then next/finish. */
function DoneRaceView({
  section,
  si,
  isLast,
  actuals,
  setActuals,
  onNext,
  onBack,
}: {
  section: Section;
  si: number;
  isLast: boolean;
  actuals: Record<string, string>;
  setActuals: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useT();
  return (
    <RunFrame>
      <RunHeader chipLabel={t('run.doneChip', { n: si + 1 })} dist="" onBack={onBack} />
      <View style={styles.body}>
        <AppText preset="phase" color="accentText">
          {t('run.doneHeading')}
        </AppText>
        <AppText preset="muted" color="textSecondary">
          {t('run.realTime')}
        </AppText>
        {section.segments.map((g, li) => (
          <Field
            key={li}
            label={`${legName(t, section, li)} · ${t('result.target', { sec: fmtSec(g.timeSec), u: t('unit.sec') })}`}
            value={actuals[`${si}-${li}`] ?? ''}
            onChangeText={v => setActuals(prev => ({ ...prev, [`${si}-${li}`]: v }))}
            unit={t('unit.sec')}
            keyboardType="decimal-pad"
          />
        ))}
      </View>
      <Button
        label={isLast ? t('run.finish') : t('run.next')}
        variant="primary"
        icon={<Icon name={isLast ? 'check' : 'arrow-right'} size={16} color="onAccent" />}
        onPress={onNext}
      />
    </RunFrame>
  );
}

/** Finished: run saved — view result or leave. */
function FinishedView({ onViewResult, onHome }: { onViewResult: () => void; onHome: () => void }) {
  const t = useT();
  return (
    <RunFrame>
      <RunHeader chipLabel={t('run.finishedChip')} dist="" onBack={onHome} />
      <View style={styles.body}>
        <AppText preset="phase" color="accentText">
          {t('run.finishedChip')}
        </AppText>
        <AppText preset="muted" color="textSecondary">
          {t('run.finishedSub')}
        </AppText>
        <Button
          label={t('run.viewResult')}
          variant="secondary"
          icon={<Icon name="chart-bar" size={16} color="textPrimary" />}
          onPress={onViewResult}
        />
        <Button label={t('common.back')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={onHome} />
      </View>
    </RunFrame>
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
  const goHome = () => navigation.goBack();

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

  const isLast = section ? si >= sections.length - 1 : true;
  const next = () => {
    if (!isLast) {
      setSi(si + 1);
      setPhase('standby');
      setElapsed(0);
    } else {
      finish();
    }
  };

  if (!section) return <EmptyView onBack={abort} />;

  const meta = SECTION_TYPE_META[section.type];

  if (phase === 'standby') return <StandbyView section={section} si={si} meta={meta} onStart={start} onBack={abort} />;
  if (phase === 'running') {
    return <RunningView section={section} si={si} meta={meta} duration={duration} elapsed={elapsed} onBack={abort} />;
  }
  if (phase === 'done' && isQuick) return <DoneQuickView onRestart={restart} onBack={abort} onHome={goHome} />;
  if (phase === 'done') {
    return (
      <DoneRaceView section={section} si={si} isLast={isLast} actuals={actuals} setActuals={setActuals} onNext={next} onBack={abort} />
    );
  }

  return (
    <FinishedView
      onViewResult={() => (finishedRun ? navigation.navigate('Result', { runId: finishedRun.id }) : goHome())}
      onHome={goHome}
    />
  );
}

export default RunScreen;
