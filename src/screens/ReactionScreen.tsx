/**
 * Reaction-time practice. A set of 3 rounds: arm → random silent wait → sudden
 * cue (harsh gate click) → press as fast as possible. Press during the wait is a
 * false start (re-arms the same round). Raw measured ms, session-only stats.
 * Single-button model: a press anywhere is "the button".
 */
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, BigNum, Button, Chip, Icon, NavBar, StatCard } from '../components';
import { SAMPLE_RATE, playPcm, renderClick, renderFinalClick, renderStart, stopAudio } from '../audio';
import { useTheme, type ColorTokens } from '../theme';
import { useT } from '../i18n';
import type { RootNav } from '../navigation/types';

type Phase = 'ready' | 'waiting' | 'early' | 'go' | 'result' | 'summary';

const ROUNDS = 3;
const DELAY_MIN = 1500;
const DELAY_MAX = 4000;
const RESULT_PAUSE = 1100; // ms the reaction stays up before auto-advancing
const EARLY_PAUSE = 900; // ms the "too early" message stays up before re-arming

const msColor = (ms: number): keyof ColorTokens => (ms < 250 ? 'accentText' : ms <= 350 ? 'numBright' : 'slower');

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  center: { alignItems: 'center', gap: 12 },
  hint: { textAlign: 'center' },
  summary: { flex: 1, justifyContent: 'center', gap: 16, padding: 24 },
  strip: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  actions: { gap: 10, marginTop: 4 },
});

export function ReactionScreen() {
  const navigation = useNavigation<RootNav>();
  const theme = useTheme();
  const t = useT();

  const [phase, setPhase] = useState<Phase>('ready');
  const [round, setRound] = useState(0); // 0-based index of the current round
  const [attempts, setAttempts] = useState<number[]>([]);
  const [falseStarts, setFalseStarts] = useState(0);
  const [last, setLast] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cueAtRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  // Tidy up on unmount.
  useEffect(
    () => () => {
      clearTimer();
      stopAudio();
    },
    [],
  );

  // Arm a round: signal "get ready", then fire the cue after a random silent wait.
  const arm = () => {
    clearTimer();
    setPhase('waiting');
    playPcm(renderStart(), SAMPLE_RATE);
    const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    timerRef.current = setTimeout(() => {
      cueAtRef.current = Date.now();
      playPcm(renderFinalClick(), SAMPLE_RATE);
      setPhase('go');
    }, delay);
  };

  const startSet = () => {
    clearTimer();
    setAttempts([]);
    setFalseStarts(0);
    setLast(null);
    setRound(0);
    arm();
  };

  const falseStart = () => {
    clearTimer();
    setFalseStarts(f => f + 1);
    setPhase('early');
    timerRef.current = setTimeout(arm, EARLY_PAUSE);
  };

  const react = () => {
    const r = Date.now() - cueAtRef.current;
    clearTimer();
    playPcm(renderClick(1400), SAMPLE_RATE);
    setLast(r);
    setAttempts(a => [...a, r]);
    setPhase('result');
    const isLast = round + 1 >= ROUNDS;
    timerRef.current = setTimeout(() => {
      if (isLast) {
        setPhase('summary');
      } else {
        setRound(round + 1);
        arm();
      }
    }, RESULT_PAUSE);
  };

  // Single-button dispatch — a press means different things per phase.
  const press = () => {
    if (phase === 'ready') startSet();
    else if (phase === 'waiting') falseStart();
    else if (phase === 'go') react();
    // early / result auto-advance; ignore presses there.
  };

  const abort = () => {
    clearTimer();
    stopAudio();
    navigation.goBack();
  };

  const root = { backgroundColor: theme.colors.bg };
  const goBg = phase === 'go' ? { backgroundColor: theme.colors.accent } : undefined;
  const roundChip = t('round.label', { n: Math.min(round + 1, ROUNDS), total: ROUNDS });

  if (phase === 'summary') {
    const avg = attempts.length ? attempts.reduce((s, x) => s + x, 0) / attempts.length : 0;
    const best = attempts.length ? Math.min(...attempts) : 0;
    return (
      <View style={[styles.fill, root]}>
        <NavBar title={t('reaction.title')} onBack={abort} />
        <View style={styles.summary}>
          <AppText preset="phase" color="accentText">
            {t('reaction.setDone')}
          </AppText>
          <StatCard
            left={{ label: t('reaction.avg'), value: String(Math.round(avg)), unit: 'ms', valueSize: 24 }}
            right={{ label: t('reaction.best'), value: String(Math.round(best)), unit: 'ms', valueSize: 24, valueColor: 'accentText' }}
          />
          <View style={styles.strip}>
            {attempts.map((a, i) => (
              <Chip key={i} label={`${i + 1}. ${Math.round(a)} ms`} />
            ))}
          </View>
          {falseStarts > 0 ? (
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {t('reaction.falseStarts', { n: falseStarts })}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button label={t('common.again')} variant="primary" icon={<Icon name="arrows-clockwise" size={16} color="onAccent" />} onPress={startSet} />
            <Button label={t('common.back')} variant="secondary" icon={<Icon name="caret-left" size={16} color="textPrimary" />} onPress={abort} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fill, root]}>
      <NavBar title={t('reaction.title')} onBack={abort} />
      <Pressable accessibilityRole="button" accessibilityLabel={t('reaction.title')} style={[styles.body, goBg]} onPressIn={press}>
        {phase !== 'ready' ? <Chip label={roundChip} /> : null}

        {phase === 'ready' ? (
          <View style={styles.center}>
            <Icon name="lightning" size={40} color="accent" />
            <AppText preset="phase" color="accentText">
              {t('reaction.heading')}
            </AppText>
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {t('reaction.intro', { n: ROUNDS })}
            </AppText>
            <AppText preset="label" color="textSecondary">
              {t('reaction.tapToStart')}
            </AppText>
          </View>
        ) : null}

        {phase === 'waiting' ? (
          <View style={styles.center}>
            <AppText preset="phase" color="textSecondary">
              {t('reaction.watch')}
            </AppText>
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {t('reaction.waitCue')}
            </AppText>
          </View>
        ) : null}

        {phase === 'early' ? (
          <View style={styles.center}>
            <AppText preset="phase" color="slower">
              {t('reaction.tooEarly')}
            </AppText>
            <AppText preset="muted" color="textSecondary" style={styles.hint}>
              {t('reaction.tooEarly.sub')}
            </AppText>
          </View>
        ) : null}

        {phase === 'go' ? (
          <AppText preset="bigNum" color="onAccent">
            {t('reaction.now')}
          </AppText>
        ) : null}

        {phase === 'result' && last != null ? (
          <View style={styles.center}>
            <BigNum value={String(Math.round(last))} unit="ms" color={msColor(last)} />
            <AppText preset="muted" color="textSecondary">
              {round + 1 >= ROUNDS ? t('reaction.lastRound') : t('reaction.getReady')}
            </AppText>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

export default ReactionScreen;
