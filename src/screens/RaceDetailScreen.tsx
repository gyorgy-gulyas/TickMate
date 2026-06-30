/** Race detail: audio status + section list. Maps to "Verseny részletei". */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, ConfirmDialog, Field, Icon, Pill } from '../components';
import { sectionTotalSec } from '../data/model';
import { useT } from '../i18n';
import { useRace, useStore } from '../store/useStore';
import { Screen } from './Screen';
import { SectionReorderList } from './SectionReorderList';
import type { RootNav, RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  header: { gap: 11 },
  thead: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 1, marginTop: 2 },
  empty: { paddingVertical: 18 },
});

export function RaceDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'RaceDetail'>>();
  const navigation = useNavigation<RootNav>();
  const race = useRace(route.params?.raceId);
  const regenerateRaceAudio = useStore(s => s.regenerateRaceAudio);
  const updateRace = useStore(s => s.updateRace);
  const closeRace = useStore(s => s.closeRace);
  const addSection = useStore(s => s.addSection);
  const deleteRace = useStore(s => s.deleteRace);
  const t = useT();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const recordResult = () => {
    const runId = closeRace(race.id);
    if (runId) navigation.navigate('Result', { runId });
  };
  const addTask = () => {
    const id = addSection(race.id);
    navigation.navigate('SectionEditor', { raceId: race.id, sectionId: id });
  };
  const removeRace = () => {
    setConfirmDelete(false);
    deleteRace(race.id);
    navigation.goBack();
  };

  const totalSec = race.sections.reduce((sum, s) => sum + sectionTotalSec(s), 0);
  const total = race.sections.length;
  const audioReadyCount = race.sections.filter(s => s.audioReady).length;
  const allAudioReady = total > 0 && audioReadyCount === total;

  const footer = (
    <>
      <Button
        label={t('race.regen')}
        variant="secondary"
        icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />}
        onPress={() => regenerateRaceAudio(race.id)}
      />
      <Button
        label={t('race.results')}
        variant="secondary"
        icon={<Icon name="flag-checkered" size={16} color="textPrimary" />}
        onPress={recordResult}
      />
      <Button
        label={t('common.start')}
        variant="primary"
        icon={<Icon name="play" size={14} color="onAccent" />}
        onPress={() => navigation.navigate('Run', { raceId: race.id })}
      />
    </>
  );

  return (
    <Screen
      title={race.name}
      gap={10}
      rightActions={
        <Pressable accessibilityRole="button" accessibilityLabel={t('race.delete')} onPress={() => setConfirmDelete(true)}>
          <Icon name="trash" size={19} color="textSecondary" />
        </Pressable>
      }
      footer={footer}>
      <View style={styles.header}>
        <Field label={t('field.name')} value={race.name} onChangeText={n => updateRace(race.id, { name: n })} />
        <Field
          label={t('race.date')}
          value={race.date}
          onChangeText={d => updateRace(race.id, { date: d })}
          placeholder={t('race.date.ph')}
        />
      </View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Timeline')}>
        <Pill
          label={t('race.audioPill', { ready: audioReadyCount, total, sec: totalSec, u: t('unit.sec') })}
          dotColor={allAudioReady ? 'accent' : 'slower'}
        />
      </Pressable>
      {race.sections.length > 0 ? (
        <View>
          <View style={styles.thead}>
            <AppText preset="label" color="textSecondary">
              {t('col.task')}
            </AppText>
            <AppText preset="label" color="textSecondary">
              {t('race.col.time')}
            </AppText>
          </View>
          <SectionReorderList
            raceId={race.id}
            sections={race.sections}
            onOpen={id => navigation.navigate('SectionEditor', { raceId: race.id, sectionId: id })}
          />
        </View>
      ) : (
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          {t('race.empty')}
        </AppText>
      )}

      <Button
        label={t('race.addTask')}
        variant="secondary"
        icon={<Icon name="plus" size={16} color="textPrimary" />}
        onPress={addTask}
      />

      <ConfirmDialog
        visible={confirmDelete}
        title={t('race.delete')}
        message={t('race.deleteConfirm')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={removeRace}
        onCancel={() => setConfirmDelete(false)}
      />
    </Screen>
  );
}

export default RaceDetailScreen;
