/** Section editor with a live schematic preview. Maps to "Feladat szerkesztő". */
import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, AudioPreview, Button, ConfirmDialog, Field, Icon, SegmentedControl, TaskSchematic, useTaskTypeOptions } from '../components';
import { fmtSec, toNum, toNumOrNull, type SectionType } from '../data/model';
import { useT } from '../i18n';
import { playTask, prewarmTask, sectionSpec } from '../audio';
import { useRace, useSettings, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav, RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  group: { gap: 7 },
  flex1: { flex: 1, minWidth: 0 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  photo: { width: '100%', height: 150, borderRadius: 12 },
  viewerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  viewerImg: { width: '100%', height: '85%' },
});

export function SectionEditorScreen() {
  const navigation = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'SectionEditor'>>();
  const raceId = route.params?.raceId;
  const sectionId = route.params?.sectionId;
  const race = useRace(raceId);
  const updateSection = useStore(s => s.updateSection);
  const deleteSection = useStore(s => s.deleteSection);
  const sound = useSettings().sound;
  const t = useT();
  const typeOptions = useTaskTypeOptions();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const index = race.sections.findIndex(s => s.id === sectionId);
  const existing = index >= 0 ? race.sections[index] : undefined;
  const segA = existing?.segments[0];
  const segB = existing?.segments[1];

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<SectionType>(existing?.type ?? 'normal');
  const [prep, setPrep] = useState(existing ? String(existing.prepSec) : '5.0');
  const [distA, setDistA] = useState(segA ? String(segA.distanceM) : '');
  const [timeA, setTimeA] = useState(segA ? (segA.timeSec == null ? '' : String(segA.timeSec)) : '');
  const [distB, setDistB] = useState(segB ? String(segB.distanceM) : '');
  const [timeB, setTimeB] = useState(segB ? (segB.timeSec == null ? '' : String(segB.timeSec)) : '');
  const [viewer, setViewer] = useState(false);

  const isMulti = type !== 'normal';
  const segments = isMulti
    ? [
        { distanceM: toNum(distA), timeSec: toNumOrNull(timeA) },
        { distanceM: toNum(distB), timeSec: toNumOrNull(timeB) },
      ]
    : [{ distanceM: toNum(distA), timeSec: toNumOrNull(timeA) }];

  // Validation: name required, prep/distances ≥ 0. Times are optional here (a
  // photo import may lack them) — but if entered they must be > 0. A section
  // with a missing time saves fine; it just can't generate audio or run until
  // the time is filled in (blocked before start).
  const nameErr = name.trim() === '';
  const prepErr = toNum(prep) < 0;
  const distAErr = toNum(distA) < 0;
  const timeAErr = timeA.trim() !== '' && toNum(timeA) <= 0;
  const distBErr = isMulti && toNum(distB) < 0;
  const timeBErr = isMulti && timeB.trim() !== '' && toNum(timeB) <= 0;
  const invalid = nameErr || prepErr || distAErr || timeAErr || distBErr || timeBErr;
  const timesComplete = segments.every(g => g.timeSec != null && g.timeSec > 0);

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
  const generateAudio = () => {
    commit(true);
    prewarmTask(sectionSpec({ type, prepSec: toNum(prep), segments }), sound);
  };
  const audioCurrent = !!existing?.audioReady && !timingChanged;

  const removeSection = () => {
    setConfirmDelete(false);
    if (existing && raceId) deleteSection(raceId, existing.id);
    navigation.goBack();
  };

  const footer = (
    <Button label={t('common.save')} variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} onPress={save} disabled={invalid} />
  );

  const rightActions = (
    <View style={styles.rightActions}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('a11y.types')} onPress={() => navigation.navigate('SectionTypes')}>
        <Icon name="question" size={19} color="textSecondary" />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('a11y.photo')} onPress={() => navigation.navigate('SectionFromPhoto', { raceId })}>
        <Icon name="camera" size={20} color="accentText" />
      </Pressable>
      {existing ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('section.delete')} onPress={() => setConfirmDelete(true)}>
          <Icon name="trash" size={19} color="textSecondary" />
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <Screen
      title={index >= 0 ? t('editor.titleN', { n: index + 1 }) : t('editor.title')}
      gap={13}
      rightActions={rightActions}
      footer={footer}>
      <Field
        label={t('field.name')}
        value={name}
        onChangeText={setName}
        error={nameErr}
        errorText={t('valid.required')}
      />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {t('field.type')}
        </AppText>
        <SegmentedControl options={typeOptions} value={type} onChange={setType} />
      </View>

      <Field
        label={t('field.prep')}
        value={prep}
        onChangeText={setPrep}
        unit={t('unit.sec')}
        keyboardType="decimal-pad"
        error={prepErr}
        errorText={t('valid.nonNeg')}
      />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {isMulti ? t('section.a') : t('section.label')}
        </AppText>
        <View style={styles.row}>
          <Field label={t('field.distance')} value={distA} onChangeText={setDistA} unit="m" keyboardType="number-pad" style={styles.flex1} error={distAErr} errorText={t('valid.nonNeg')} />
          <Field label={t('field.time')} value={timeA} onChangeText={setTimeA} unit={t('unit.sec')} keyboardType="decimal-pad" style={styles.flex1} error={timeAErr} errorText={t('valid.positive')} />
        </View>
      </View>

      {isMulti ? (
        <View style={styles.group}>
          <AppText preset="label" color="textSecondary">
            {t('section.b')}
          </AppText>
          <View style={styles.row}>
            <Field label={t('field.distance')} value={distB} onChangeText={setDistB} unit="m" keyboardType="number-pad" style={styles.flex1} error={distBErr} errorText={t('valid.nonNeg')} />
            <Field label={t('field.time')} value={timeB} onChangeText={setTimeB} unit={t('unit.sec')} keyboardType="decimal-pad" style={styles.flex1} error={timeBErr} errorText={t('valid.positive')} />
          </View>
        </View>
      ) : null}

      <TaskSchematic type={type} prepSec={toNum(prep)} timeA={toNum(timeA)} timeB={toNum(timeB)} />

      {existing?.imageUri ? (
        <View style={styles.group}>
          <AppText preset="label" color="textSecondary">
            {t('photo.saved')}
          </AppText>
          <Pressable accessibilityRole="imagebutton" accessibilityLabel={t('photo.saved')} onPress={() => setViewer(true)}>
            <Image source={{ uri: existing.imageUri }} style={styles.photo} resizeMode="cover" />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          {t('audio.label')}
        </AppText>
        <AudioPreview
          ready={audioCurrent}
          duration={`${fmtSec(toNum(prep) + segments.reduce((s, g) => s + (g.timeSec ?? 0), 0))} ${t('unit.sec')}`}
          onPlay={() => timesComplete && playTask(sectionSpec({ type, prepSec: toNum(prep), segments }), sound)}
        />
        <Button
          label={audioCurrent ? t('audio.regen') : t('audio.gen')}
          variant="secondary"
          icon={<Icon name="waveform" size={16} color="textPrimary" />}
          onPress={generateAudio}
          disabled={invalid || !timesComplete}
        />
        {!timesComplete ? (
          <AppText preset="muted" color="danger">
            {t('photo.needTime')}
          </AppText>
        ) : null}
      </View>

      {existing?.imageUri ? (
        <Modal visible={viewer} transparent animationType="fade" onRequestClose={() => setViewer(false)}>
          <Pressable style={styles.viewerBackdrop} onPress={() => setViewer(false)}>
            <Image source={{ uri: existing.imageUri }} style={styles.viewerImg} resizeMode="contain" />
          </Pressable>
        </Modal>
      ) : null}

      <ConfirmDialog
        visible={confirmDelete}
        title={t('section.delete')}
        message={t('section.deleteConfirm')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={removeSection}
        onCancel={() => setConfirmDelete(false)}
      />
    </Screen>
  );
}

export default SectionEditorScreen;
