/** Earpiece (audio output) latency. Time from playback to what reaches the ear;
 *  the on-screen timeline is aligned to it so picture and sound stay together.
 *  Maps to "Fülhallgató (hangkimenet)". Persisted as settings.btAudioLatencyMs.
 *
 *  Test: play the calibration pattern (3 long beeps → 10 fast rhythmic clicks →
 *  3 long beeps) and flash the dot ON for each event's heard-time (emit +
 *  current latency). Tune the stepper until the flashes match what you hear —
 *  that value is the device's real output latency. */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Button, Icon, StatCard, Stepper } from '../components';
import { playLatencyTest, playTapBeat, latencyTestEvents, getOutputLatency, stopAudio, TAP_PERIOD_MS, TAP_BEATS } from '../audio';
import { useBluetoothStatus, openBluetoothSettings } from '../native/bluetooth';
import { useTheme } from '../theme';
import { useT } from '../i18n';
import { useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  intro: { lineHeight: 18 },
  field: { gap: 7 },
  hint: { marginLeft: 2 },
  pulseWrap: { alignItems: 'center', gap: 8, paddingVertical: 4 },
  dot: { width: 56, height: 56, borderRadius: 28 },
  testHint: { textAlign: 'center', lineHeight: 17 },
  note: { textAlign: 'center' },
  tapPad: { alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 30, borderRadius: 18 },
});

export function EarpieceScreen() {
  const navigation = useNavigation<RootNav>();
  const theme = useTheme();
  const saved = useSettings().btAudioLatencyMs;
  const sound = useSettings().sound;
  const earpiece = useBluetoothStatus().status.earpiece;
  const setSetting = useStore(s => s.setSetting);
  const t = useT();

  const events = useMemo(() => latencyTestEvents(), []);
  const [latency, setLatency] = useState(saved);
  const [pulse, setPulse] = useState(0);
  const [testing, setTesting] = useState(false);
  const [tapping, setTapping] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const latencyRef = useRef(latency);
  latencyRef.current = latency;
  const testStartRef = useRef(0);
  const tapStartRef = useRef(0);
  const tapOffsetsRef = useRef<number[]>([]);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stop audio (and any pending tap timer) when leaving the screen.
  useEffect(
    () => () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      stopAudio();
    },
    [],
  );

  // #1 — let the OS report the current output-route latency as a starting value.
  const autoMeasure = async () => {
    const ms = await getOutputLatency();
    if (ms == null) {
      setNote(t('bt.autoUnavailable'));
      return;
    }
    const v = Math.min(400, Math.max(0, Math.round(ms / 5) * 5));
    setLatency(v);
    setNote(t('bt.autoDone', { n: v }));
  };

  // #4 — tap-to-beat: the median (tap − scheduled-beat) offset is the latency,
  // since the user locks onto the beat they hear (delayed by exactly that much).
  const finishTap = () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = null;
    stopAudio();
    setTapping(false);
    const offs = tapOffsetsRef.current;
    if (offs.length < 4) {
      setNote(t('bt.tapTooFew'));
      return;
    }
    const sorted = [...offs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const v = Math.min(400, Math.max(0, Math.round(median / 5) * 5));
    setLatency(v);
    setNote(t('bt.tapDone', { n: v }));
  };

  const startTap = () => {
    stopAudio();
    tapOffsetsRef.current = [];
    setTapCount(0);
    setNote(null);
    playTapBeat(sound);
    tapStartRef.current = Date.now();
    setTapping(true);
    tapTimerRef.current = setTimeout(finishTap, TAP_BEATS * TAP_PERIOD_MS + 400);
  };

  const onTap = () => {
    const rel = Date.now() - tapStartRef.current; // ms since playback was requested
    const idx = Math.round(rel / TAP_PERIOD_MS); // nearest scheduled beat
    if (idx < 2 || idx >= TAP_BEATS) return; // skip entrainment + past the end
    const offset = rel - idx * TAP_PERIOD_MS;
    if (Math.abs(offset) > TAP_PERIOD_MS / 2) return; // not near any beat
    tapOffsetsRef.current.push(offset);
    const n = tapOffsetsRef.current.length;
    setTapCount(n);
    if (n >= 10) finishTap();
  };

  // While testing, flash the dot ON for each event's window (sharp edges),
  // shifted by the current latency — so its on/off matches what is heard.
  useEffect(() => {
    if (!testing) return;
    const id = setInterval(() => {
      const t0 = Date.now() - testStartRef.current;
      const lat = latencyRef.current;
      const last = events[events.length - 1];
      if (t0 > last.atSec * 1000 + last.flashMs + lat + 300) {
        setTesting(false);
        setPulse(0);
        return;
      }
      let on = 0;
      for (const e of events) {
        const start = e.atSec * 1000 + lat;
        if (t0 >= start && t0 < start + e.flashMs) {
          on = 1;
          break;
        }
      }
      setPulse(on);
    }, 16);
    return () => clearInterval(id);
  }, [testing, events]);

  const runTest = () => {
    playLatencyTest(sound);
    testStartRef.current = Date.now();
    setTesting(true);
  };

  const save = () => {
    setSetting('btAudioLatencyMs', latency);
    navigation.goBack();
  };

  const footer = (
    <>
      <Button label={t('bt.auto')} variant="secondary" icon={<Icon name="arrows-clockwise" size={15} color="textPrimary" />} onPress={autoMeasure} />
      <Button label={t('common.save')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} />
    </>
  );

  // Binary flash: fully on during the tone window, clearly dim otherwise — so
  // the boundary (start/end) is crisp, not a gradual ramp.
  const dotStyle = {
    backgroundColor: pulse ? theme.colors.accent : theme.colors.railAlt,
    opacity: pulse ? 1 : 0.5,
  };

  return (
    <Screen
      title={t('bt.title')}
      gap={14}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        {t('bt.intro')}
      </AppText>
      <StatCard
        left={{ label: t('bt.measured'), value: String(latency), unit: 'ms' }}
        right={{
          label: t('bt.device'),
          value: earpiece.name ?? t('btn.notPaired'),
          valueSize: 14,
          valueColor: earpiece.paired ? 'accent' : 'textSecondary',
        }}
      />
      <Button
        label={t('common.btSettings')}
        variant="secondary"
        icon={<Icon name="bluetooth" size={15} color="textPrimary" />}
        onPress={openBluetoothSettings}
      />
      <View style={styles.field}>
        <AppText preset="label" color="textSecondary">
          {t('bt.manual')}
        </AppText>
        <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
        <AppText preset="listMeta" color="textSecondary" style={styles.hint}>
          {t('bt.latencyHint')}
        </AppText>
      </View>
      {tapping ? (
        <Pressable style={[styles.tapPad, { backgroundColor: theme.colors.accent }]} onPressIn={onTap}>
          <Icon name="metronome" size={30} color="onAccent" />
          <AppText preset="bigNum" color="onAccent">
            {String(tapCount)}
          </AppText>
          <AppText preset="muted" color="onAccent" style={styles.testHint}>
            {t('bt.tapActive')}
          </AppText>
        </Pressable>
      ) : (
        <>
          <View style={styles.pulseWrap}>
            <View style={[styles.dot, dotStyle]} />
            <AppText preset="muted" color="textSecondary" style={styles.testHint}>
              {t('bt.testHint')}
            </AppText>
          </View>
          <Button
            label={t('bt.test')}
            variant="secondary"
            icon={<Icon name="play" size={14} color="textPrimary" />}
            onPress={runTest}
          />
          <Button
            label={t('bt.tap')}
            variant="secondary"
            icon={<Icon name="metronome" size={15} color="textPrimary" />}
            onPress={startTap}
          />
          {note ? (
            <AppText preset="muted" color="accentText" style={styles.note}>
              {note}
            </AppText>
          ) : null}
        </>
      )}
    </Screen>
  );
}

export default EarpieceScreen;
