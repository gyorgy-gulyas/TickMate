/**
 * Rhythm practice ("Hangritmus"). A 3-round set: a real accelerating gate
 * countdown plays into a target moment; press exactly on the final click.
 * Two levels — Vezetett (final click audible, sync) / Néma (final click muted,
 * internalise the rhythm). Signed ±ms error (early −/late +), session-only.
 * Single-button model during a round: a press anywhere is "the button".
 */
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BigNum, Button, Chip, Icon, NavBar, SegmentedControl, StatCard } from '../components';
import { playRhythm, stopAudio } from '../audio';
import { COUNTDOWN_OFFSETS } from '../data/timing';
import { useTheme, type ColorTokens } from '../theme';
import type { RootNav } from '../navigation/types';

type Phase = 'ready' | 'running' | 'result' | 'summary';
type Level = 'guided' | 'blind';

const ROUNDS = 3;
const T_MIN = 3.5;
const T_MAX = 5.5;
const TAIL = 0.8; // bar shows 0 … T + TAIL so the target isn't at the edge
const TICK = 80;
const RESULT_PAUSE = 1600;
const MISS_GRACE = 1.2; // s after the target with no press → auto-register a late miss

const LEVELS: ReadonlyArray<{ key: Level; label: string }> = [
  { key: 'guided', label: 'Vezetett' },
  { key: 'blind', label: 'Néma' },
];

const errColor = (ms: number): keyof ColorTokens => {
  const a = Math.abs(ms);
  return a < 60 ? 'accentText' : a < 150 ? 'numBright' : 'slower';
};
const signed = (ms: number) => `${ms > 0 ? '+' : ''}${Math.round(ms)}`;
const errLabel = (ms: number) => (Math.abs(ms) < 60 ? 'pontos' : ms < 0 ? 'korai' : 'késő');

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
  ready: { flex: 1, justifyContent: 'center', gap: 16, padding: 24 },
  summary: { flex: 1, justifyContent: 'center', gap: 16, padding: 24 },
  group: { gap: 7 },
  strip: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  actions: { gap: 10, marginTop: 4 },
  barWrap: { width: '100%', gap: 8 },
  track: { width: '100%', height: 8, borderRadius: 4 },
  barFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 4 },
  beatMark: { position: 'absolute', top: -2, bottom: -2, width: 0.5, marginLeft: -0.25 },
  gateMark: { position: 'absolute', top: -4, bottom: -4, width: 1.5, borderRadius: 1, marginLeft: -0.75 },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
});

export function RhythmScreen() {
  const navigation = useNavigation<RootNav>();
  const theme = useTheme();

  const [phase, setPhase] = useState<Phase>('ready');
  const [level, setLevel] = useState<Level>('guided');
  const [round, setRound] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef(0);
  const targetRef = useRef(T_MIN);
  const roundRef = useRef(0);
  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearAll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }

  useEffect(
    () => () => {
      clearAll();
      stopAudio();
    },
    [],
  );

  function beginRound() {
    clearAll();
    lockRef.current = false;
    const T = T_MIN + Math.random() * (T_MAX - T_MIN);
    targetRef.current = T;
    setLast(null);
    setElapsed(0);
    setPhase('running');
    playRhythm(T, level === 'blind');
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const e = (Date.now() - startRef.current) / 1000;
      setElapsed(e);
      if (e >= T + MISS_GRACE) registerResult(MISS_GRACE * 1000);
    }, TICK);
  }

  function registerResult(signedMs: number) {
    if (lockRef.current) return;
    lockRef.current = true;
    clearAll();
    stopAudio();
    setLast(signedMs);
    setAttempts(a => [...a, signedMs]);
    setPhase('result');
    const isLast = roundRef.current + 1 >= ROUNDS;
    timerRef.current = setTimeout(() => {
      if (isLast) {
        setPhase('summary');
      } else {
        roundRef.current += 1;
        setRound(roundRef.current);
        beginRound();
      }
    }, RESULT_PAUSE);
  }

  function startSet() {
    clearAll();
    setAttempts([]);
    roundRef.current = 0;
    setRound(0);
    beginRound();
  }

  function onPress() {
    if (phase !== 'running') return;
    const e = (Date.now() - startRef.current) / 1000;
    registerResult((e - targetRef.current) * 1000);
  }

  function abort() {
    clearAll();
    stopAudio();
    navigation.goBack();
  }

  const root = { backgroundColor: theme.colors.bg };

  // --- Ready: pick the level, then start ---
  if (phase === 'ready') {
    return (
      <View style={[styles.fill, root]}>
        <NavBar title="Hangritmus" onBack={abort} />
        <View style={styles.ready}>
          <View style={styles.center}>
            <Icon name="metronome" size={40} color="accent" />
            <AppText preset="phase" color="accentText">
              HANGRITMUS
            </AppText>
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {ROUNDS} kör. Halld a gyorsuló visszaszámlálást, és nyomj pontosan a kapu pillanatában.
            </AppText>
          </View>
          <View style={styles.group}>
            <AppText preset="label" color="textSecondary">
              Szint
            </AppText>
            <SegmentedControl options={LEVELS} value={level} onChange={setLevel} />
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {level === 'guided' ? 'Vezetett: a végkattanás is szól — vele együtt nyomsz.' : 'Néma: az utolsó kattanás néma — érezd, hová esne.'}
            </AppText>
          </View>
          <View style={styles.actions}>
            <Button label="Kezdés" variant="primary" icon={<Icon name="play" size={14} color="onAccent" />} onPress={startSet} />
          </View>
        </View>
      </View>
    );
  }

  // --- Summary ---
  if (phase === 'summary') {
    const absMean = attempts.length ? attempts.reduce((s, x) => s + Math.abs(x), 0) / attempts.length : 0;
    const best = attempts.length ? Math.min(...attempts.map(x => Math.abs(x))) : 0;
    const bias = attempts.length ? attempts.reduce((s, x) => s + x, 0) / attempts.length : 0;
    const biasText = Math.abs(bias) < 30 ? 'kiegyensúlyozott' : bias < 0 ? 'korán' : 'későn';
    return (
      <View style={[styles.fill, root]}>
        <NavBar title="Hangritmus" onBack={abort} />
        <View style={styles.summary}>
          <AppText preset="phase" color="accentText">
            SZETT KÉSZ
          </AppText>
          <StatCard
            left={{ label: 'Átl. hiba', value: String(Math.round(absMean)), unit: 'ms', valueSize: 24 }}
            right={{ label: 'Legjobb', value: String(Math.round(best)), unit: 'ms', valueSize: 24, valueColor: 'accentText' }}
          />
          <AppText preset="muted" color="textSecondary" style={styles.hint}>
            Torzítás: {signed(bias)} ms · {biasText}
          </AppText>
          <View style={styles.strip}>
            {attempts.map((a, i) => (
              <Chip key={i} label={`${i + 1}. ${signed(a)} ms`} />
            ))}
          </View>
          <View style={styles.actions}>
            <Button label="Újra" variant="primary" icon={<Icon name="arrows-clockwise" size={16} color="onAccent" />} onPress={startSet} />
            <Button label="Vissza" variant="secondary" icon={<Icon name="caret-left" size={16} color="textPrimary" />} onPress={abort} />
          </View>
        </View>
      </View>
    );
  }

  // --- Running / Result (press anywhere) ---
  const T = targetRef.current;
  const totalDur = T + TAIL;
  const headFrac = Math.min(1, Math.max(0, elapsed / totalDur));
  const beats = COUNTDOWN_OFFSETS.filter(o => o > 0)
    .map(o => T - o)
    .filter(t => t >= 0);
  const trackBg = { backgroundColor: theme.colors.railAlt };
  const fillColor = phase === 'result' && last != null ? theme.colors[errColor(last)] : theme.colors.accent;
  const fillStyle = { width: `${headFrac * 100}%` as const, backgroundColor: fillColor };
  const gateStyle = { left: `${(T / totalDur) * 100}%` as const, backgroundColor: theme.colors.textPrimary };
  const beatColor = { backgroundColor: theme.colors.textSecondary };
  const roundChip = `KÖR ${Math.min(round + 1, ROUNDS)} / ${ROUNDS}`;

  return (
    <View style={[styles.fill, root]}>
      <NavBar title="Hangritmus" onBack={abort} />
      <Pressable accessibilityRole="button" accessibilityLabel="ritmus gomb" style={styles.body} onPressIn={onPress}>
        <Chip label={roundChip} />

        {phase === 'running' ? (
          <View style={styles.center}>
            <AppText preset="phase" color="accentText">
              FIGYELD A RITMUST
            </AppText>
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              Nyomj a kapu pillanatában
            </AppText>
          </View>
        ) : null}

        {phase === 'result' && last != null ? (
          <View style={styles.center}>
            <BigNum value={`${signed(last)}`} unit="ms" color={errColor(last)} />
            <AppText preset="muted" color="textSecondary">
              {errLabel(last)}
            </AppText>
          </View>
        ) : null}

        <View style={styles.barWrap}>
          <View style={[styles.track, trackBg]}>
            <View style={[styles.barFill, fillStyle]} />
            {beats.map((t, i) => {
              const bs = { left: `${(t / totalDur) * 100}%` as const };
              return <View key={`b${i}`} style={[styles.beatMark, beatColor, bs]} />;
            })}
            <View style={[styles.gateMark, gateStyle]} />
          </View>
          <View style={styles.axis}>
            <AppText preset="muted" color="textSecondary">
              0 mp
            </AppText>
            <AppText preset="gate" color="textPrimary">
              KAPU
            </AppText>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default RhythmScreen;
