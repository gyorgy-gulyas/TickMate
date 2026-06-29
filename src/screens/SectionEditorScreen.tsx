/** Section editor with a live schematic preview. Maps to "Feladat szerkesztő". */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  AppText,
  AudioPreview,
  Button,
  Card,
  Field,
  Icon,
  OverlapSchematic,
  SegmentedControl,
  TypeSchematic,
  buildSchematic,
  buildSharedSchematic,
} from '../components';
import { SECTION_TYPE_META, fmtSec, type SectionType } from '../data/mock';
import { useRace, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav, RootStackParamList } from '../navigation/types';

const TYPE_OPTIONS = (['normal', 'shared', 'nested', 'overlap'] as SectionType[]).map(t => ({
  key: t,
  label: SECTION_TYPE_META[t].short,
  icon: <Icon name={SECTION_TYPE_META[t].icon} size={15} color="textSecondary" />,
}));

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  group: { gap: 7 },
  flex1: { flex: 1, minWidth: 0 },
  preview: { gap: 0 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});

const toNum = (s: string) => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

export function SectionEditorScreen() {
  const navigation = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'SectionEditor'>>();
  const raceId = route.params?.raceId;
  const sectionId = route.params?.sectionId;
  const race = useRace(raceId);
  const updateSection = useStore(s => s.updateSection);

  const index = race.sections.findIndex(s => s.id === sectionId);
  const existing = index >= 0 ? race.sections[index] : undefined;
  const segA = existing?.segments[0];
  const segB = existing?.segments[1];

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<SectionType>(existing?.type ?? 'normal');
  const [prep, setPrep] = useState(existing ? String(existing.prepSec) : '5.0');
  const [distA, setDistA] = useState(segA ? String(segA.distanceM) : '');
  const [timeA, setTimeA] = useState(segA ? String(segA.timeSec) : '7.0');
  const [distB, setDistB] = useState(segB ? String(segB.distanceM) : '');
  const [timeB, setTimeB] = useState(segB ? String(segB.timeSec) : '5.0');

  const isMulti = type !== 'normal';
  const segments = isMulti
    ? [
        { distanceM: toNum(distA), timeSec: toNum(timeA) },
        { distanceM: toNum(distB), timeSec: toNum(timeB) },
      ]
    : [{ distanceM: toNum(distA), timeSec: toNum(timeA) }];

  const timingChanged =
    !!existing &&
    (type !== existing.type ||
      toNum(prep) !== existing.prepSec ||
      JSON.stringify(segments) !== JSON.stringify(existing.segments));

  const commit = (audioReady: boolean) => {
    if (existing && raceId) {
      updateSection(raceId, existing.id, { name: name.trim() || existing.name, type, prepSec: toNum(prep), segments, audioReady });
    }
  };
  // Editing the timing/type/segments invalidates the section's audio.
  const save = () => {
    commit(timingChanged ? false : existing?.audioReady ?? false);
    navigation.goBack();
  };
  const generateAudio = () => commit(true);
  const audioCurrent = !!existing?.audioReady && !timingChanged;

  // Two-track preview (nested/overlap) with each leg's time.
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

  const footer = <Button label="Mentés" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} />;

  const rightActions = (
    <View style={styles.rightActions}>
      <Pressable accessibilityRole="button" accessibilityLabel="típusok" onPress={() => navigation.navigate('SectionTypes')}>
        <Icon name="question" size={19} color="textSecondary" />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="fotó" onPress={() => navigation.navigate('SectionFromPhoto')}>
        <Icon name="camera" size={20} color="accentText" />
      </Pressable>
    </View>
  );

  return (
    <Screen
      title={index >= 0 ? `Feladat · ${index + 1}` : 'Feladat szerkesztő'}
      gap={13}
      rightActions={rightActions}
      footer={footer}>
      <Field label="Név" value={name} onChangeText={setName} />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Típus
        </AppText>
        <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} />
      </View>

      <Field label="Előkészítés" value={prep} onChangeText={setPrep} unit="mp" keyboardType="decimal-pad" />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {isMulti ? 'Szakasz A' : 'Szakasz'}
        </AppText>
        <View style={styles.row}>
          <Field label="Távolság" value={distA} onChangeText={setDistA} unit="m" keyboardType="number-pad" style={styles.flex1} />
          <Field label="Idő" value={timeA} onChangeText={setTimeA} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
        </View>
      </View>

      {isMulti ? (
        <View style={styles.group}>
          <AppText preset="label" color="textSecondary">
            Szakasz B
          </AppText>
          <View style={styles.row}>
            <Field label="Távolság" value={distB} onChangeText={setDistB} unit="m" keyboardType="number-pad" style={styles.flex1} />
            <Field label="Idő" value={timeB} onChangeText={setTimeB} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
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
          Hang
        </AppText>
        <AudioPreview ready={audioCurrent} duration={`${fmtSec(toNum(prep) + segments.reduce((s, g) => s + g.timeSec, 0))} mp`} />
        <Button
          label={audioCurrent ? 'Hang újragenerálása' : 'Hang generálása'}
          variant="secondary"
          icon={<Icon name="waveform" size={16} color="textPrimary" />}
          onPress={generateAudio}
        />
      </View>
    </Screen>
  );
}

export default SectionEditorScreen;
