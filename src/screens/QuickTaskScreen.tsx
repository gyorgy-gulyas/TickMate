/** Quick, unsaved timing task — full editor (all types) with no persistence. Maps to "Gyors feladat". */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppText,
  AudioPreview,
  Button,
  Field,
  Icon,
  SegmentedControl,
  SettingsRow,
  TASK_TYPE_OPTIONS,
  TaskSchematic,
  Toggle,
} from '../components';
import { fmtSec, toNum, type SectionType } from '../data/model';
import { playTask } from '../audio';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const styles = StyleSheet.create({
  intro: { lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8 },
  group: { gap: 7 },
  flex1: { flex: 1, minWidth: 0 },
});

export function QuickTaskScreen() {
  const navigation = useNavigation<RootNav>();
  const [type, setType] = useState<SectionType>('normal');
  const [prep, setPrep] = useState('5.0');
  const [distA, setDistA] = useState('');
  const [timeA, setTimeA] = useState('7.0');
  const [distB, setDistB] = useState('');
  const [timeB, setTimeB] = useState('5.0');
  const [secondsTick, setSecondsTick] = useState(true);
  const [audioReady, setAudioReady] = useState(false);

  const isMulti = type !== 'normal';
  // Changing the timing/type invalidates the generated audio.
  const invalidate = () => setAudioReady(false);
  const changeType = (t: SectionType) => {
    setType(t);
    invalidate();
  };
  const changePrep = (v: string) => {
    setPrep(v);
    invalidate();
  };
  const changeTimeA = (v: string) => {
    setTimeA(v);
    invalidate();
  };
  const changeTimeB = (v: string) => {
    setTimeB(v);
    invalidate();
  };

  const totalSec = toNum(prep) + toNum(timeA) + (isMulti ? toNum(timeB) : 0);

  const segments = isMulti
    ? [
        { distanceM: toNum(distA), timeSec: toNum(timeA) },
        { distanceM: toNum(distB), timeSec: toNum(timeB) },
      ]
    : [{ distanceM: toNum(distA), timeSec: toNum(timeA) }];

  const footer = (
    <Button
      label="Start"
      variant="primary"
      icon={<Icon name="play" size={14} color="onAccent" />}
      onPress={() => navigation.navigate('Run', { quick: { type, prepSec: toNum(prep), segments, secondsTick } })}
    />
  );

  return (
    <Screen
      title="Gyors feladat"
      gap={13}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="muted" color="textSecondary" style={styles.intro}>
        Mentés nélküli, azonnali időzítés. Próbálj ki bármelyik típust.
      </AppText>

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Típus
        </AppText>
        <SegmentedControl options={TASK_TYPE_OPTIONS} value={type} onChange={changeType} />
      </View>

      <Field label="Előkészítés" value={prep} onChangeText={changePrep} unit="mp" keyboardType="decimal-pad" />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {isMulti ? 'Szakasz A' : 'Szakasz'}
        </AppText>
        <View style={styles.row}>
          <Field label="Távolság" value={distA} onChangeText={setDistA} unit="m" keyboardType="number-pad" style={styles.flex1} />
          <Field label="Idő" value={timeA} onChangeText={changeTimeA} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
        </View>
      </View>

      {isMulti ? (
        <View style={styles.group}>
          <AppText preset="label" color="textSecondary">
            Szakasz B
          </AppText>
          <View style={styles.row}>
            <Field label="Távolság" value={distB} onChangeText={setDistB} unit="m" keyboardType="number-pad" style={styles.flex1} />
            <Field label="Idő" value={timeB} onChangeText={changeTimeB} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
          </View>
        </View>
      ) : null}

      <TaskSchematic type={type} prepSec={toNum(prep)} timeA={toNum(timeA)} timeB={toNum(timeB)} />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Másodpercjelző
        </AppText>
        <SettingsRow
          label="Kattanás minden mp"
          right={<Toggle value={secondsTick} onValueChange={setSecondsTick} />}
          divider={false}
        />
      </View>

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Hang
        </AppText>
        <AudioPreview
          ready={audioReady}
          duration={`${fmtSec(totalSec)} mp`}
          onPlay={() =>
            playTask({ type, prepSec: toNum(prep), legs: isMulti ? [toNum(timeA), toNum(timeB)] : [toNum(timeA)], secondsTick })
          }
        />
        <Button
          label={audioReady ? 'Hang újragenerálása' : 'Hang generálása'}
          variant="secondary"
          icon={<Icon name="waveform" size={16} color="textPrimary" />}
          onPress={() => setAudioReady(true)}
        />
      </View>
    </Screen>
  );
}

export default QuickTaskScreen;
