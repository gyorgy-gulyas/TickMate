/** Quick, unsaved timing task — full editor (all types) with no persistence. Maps to "Gyors feladat". */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppText,
  AudioPreview,
  Button,
  Card,
  Field,
  Icon,
  OverlapSchematic,
  SegmentedControl,
  SettingsRow,
  Toggle,
  TypeSchematic,
  buildSchematic,
  buildSharedSchematic,
} from '../components';
import { SECTION_TYPE_META, fmtSec, type SectionType } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const TYPE_OPTIONS = (['normal', 'shared', 'nested', 'overlap'] as SectionType[]).map(t => ({
  key: t,
  label: SECTION_TYPE_META[t].short,
  icon: <Icon name={SECTION_TYPE_META[t].icon} size={15} color="textSecondary" />,
}));

const styles = StyleSheet.create({
  intro: { lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8 },
  group: { gap: 7 },
  flex1: { flex: 1, minWidth: 0 },
  preview: { gap: 0 },
});

const toNum = (s: string) => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

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

  const overlapTracks =
    type === 'nested'
      ? [
          { label: 'A', startPct: 20, endPct: 94, variant: 'primary' as const, timeLabel: `${fmtSec(toNum(timeA))} mp` },
          { label: 'B', startPct: 42, endPct: 70, variant: 'secondary' as const, timeLabel: `${fmtSec(toNum(timeB))} mp` },
        ]
      : [
          { label: 'A', startPct: 20, endPct: 62, variant: 'primary' as const, timeLabel: `${fmtSec(toNum(timeA))} mp` },
          { label: 'B', startPct: 44, endPct: 94, variant: 'secondary' as const, timeLabel: `${fmtSec(toNum(timeB))} mp` },
        ];

  const footer = (
    <Button
      label="Start"
      variant="primary"
      icon={<Icon name="play" size={14} color="onAccent" />}
      onPress={() => navigation.navigate('RunStandby')}
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
        <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={changeType} />
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

      <Card style={styles.preview}>
        <AppText preset="label" color="textSecondary">
          Előnézet · {SECTION_TYPE_META[type].label}
        </AppText>
        {type === 'nested' || type === 'overlap' ? (
          <OverlapSchematic showGomb tracks={overlapTracks} />
        ) : type === 'shared' ? (
          <TypeSchematic {...buildSharedSchematic(toNum(prep), toNum(timeA), toNum(timeB))} />
        ) : (
          <TypeSchematic {...buildSchematic(toNum(prep), toNum(timeA))} />
        )}
      </Card>

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
        <AudioPreview ready={audioReady} duration={`${fmtSec(totalSec)} mp`} />
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
