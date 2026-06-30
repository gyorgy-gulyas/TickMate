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
  TaskSchematic,
  Toggle,
  useTaskTypeOptions,
} from '../components';
import { fmtSec, toNum, type SectionType } from '../data/model';
import { useT } from '../i18n';
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
  const t = useT();
  const typeOptions = useTaskTypeOptions();
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
  const changeType = (next: SectionType) => {
    setType(next);
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
      label={t('common.start')}
      variant="primary"
      icon={<Icon name="play" size={14} color="onAccent" />}
      onPress={() => navigation.navigate('Run', { quick: { type, prepSec: toNum(prep), segments, secondsTick } })}
    />
  );

  return (
    <Screen
      title={t('quick.title')}
      gap={13}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="muted" color="textSecondary" style={styles.intro}>
        {t('quick.intro')}
      </AppText>

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {t('field.type')}
        </AppText>
        <SegmentedControl options={typeOptions} value={type} onChange={changeType} />
      </View>

      <Field label={t('field.prep')} value={prep} onChangeText={changePrep} unit={t('unit.sec')} keyboardType="decimal-pad" />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {isMulti ? t('section.a') : t('section.label')}
        </AppText>
        <View style={styles.row}>
          <Field label={t('field.distance')} value={distA} onChangeText={setDistA} unit="m" keyboardType="number-pad" style={styles.flex1} />
          <Field label={t('field.time')} value={timeA} onChangeText={changeTimeA} unit={t('unit.sec')} keyboardType="decimal-pad" style={styles.flex1} />
        </View>
      </View>

      {isMulti ? (
        <View style={styles.group}>
          <AppText preset="label" color="textSecondary">
            {t('section.b')}
          </AppText>
          <View style={styles.row}>
            <Field label={t('field.distance')} value={distB} onChangeText={setDistB} unit="m" keyboardType="number-pad" style={styles.flex1} />
            <Field label={t('field.time')} value={timeB} onChangeText={changeTimeB} unit={t('unit.sec')} keyboardType="decimal-pad" style={styles.flex1} />
          </View>
        </View>
      ) : null}

      <TaskSchematic type={type} prepSec={toNum(prep)} timeA={toNum(timeA)} timeB={toNum(timeB)} />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {t('quick.secondsLabel')}
        </AppText>
        <SettingsRow
          label={t('quick.secondsRow')}
          right={<Toggle value={secondsTick} onValueChange={setSecondsTick} />}
          divider={false}
        />
      </View>

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {t('audio.label')}
        </AppText>
        <AudioPreview
          ready={audioReady}
          duration={`${fmtSec(totalSec)} ${t('unit.sec')}`}
          onPlay={() =>
            playTask({ type, prepSec: toNum(prep), legs: isMulti ? [toNum(timeA), toNum(timeB)] : [toNum(timeA)], secondsTick })
          }
        />
        <Button
          label={audioReady ? t('audio.regen') : t('audio.gen')}
          variant="secondary"
          icon={<Icon name="waveform" size={16} color="textPrimary" />}
          onPress={() => setAudioReady(true)}
        />
      </View>
    </Screen>
  );
}

export default QuickTaskScreen;
