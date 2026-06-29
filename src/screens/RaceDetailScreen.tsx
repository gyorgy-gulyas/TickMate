/** Race detail: audio status + section list. Maps to "Verseny részletei". */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Field, Icon, Pill, SectionRow } from '../components';
import { SECTION_TYPE_META, fmtSec, sectionTotalSec } from '../data/mock';
import { useRace, useRunByRace, useStore } from '../store/useStore';
import { Screen } from './Screen';
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
  const existingRun = useRunByRace(race.id);

  const recordResult = () => {
    const runId = closeRace(race.id);
    if (runId) navigation.navigate('Result', { runId });
  };
  const totalSec = race.sections.reduce((sum, s) => sum + sectionTotalSec(s), 0);
  const total = race.sections.length;
  const audioReadyCount = race.sections.filter(s => s.audioReady).length;
  const allAudioReady = total > 0 && audioReadyCount === total;

  const footer = (
    <>
      <Button
        label="Hang újragenerálása"
        variant="secondary"
        icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />}
        onPress={() => regenerateRaceAudio(race.id)}
      />
      <Button
        label={existingRun ? 'Eredmény szerkesztése' : 'Eredmény rögzítése'}
        variant="secondary"
        icon={<Icon name="flag-checkered" size={16} color="textPrimary" />}
        onPress={recordResult}
      />
      <Button
        label="Start"
        variant="primary"
        icon={<Icon name="play" size={14} color="onAccent" />}
        onPress={() => navigation.navigate('RunStandby', { raceId: race.id })}
      />
    </>
  );

  return (
    <Screen
      title={race.name}
      gap={10}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <View style={styles.header}>
        <Field label="Név" value={race.name} onChangeText={n => updateRace(race.id, { name: n })} />
        <Field
          label="Verseny napja"
          value={race.date}
          onChangeText={d => updateRace(race.id, { date: d })}
          placeholder="ÉÉÉÉ.HH.NN"
        />
      </View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Timeline')}>
        <Pill
          label={`Hang ${audioReadyCount}/${total} kész · ${total} feladat · ${totalSec} mp`}
          dotColor={allAudioReady ? 'accent' : 'slower'}
        />
      </Pressable>
      {race.sections.length > 0 ? (
        <View>
          <View style={styles.thead}>
            <AppText preset="label" color="textSecondary">
              Feladat
            </AppText>
            <AppText preset="label" color="textSecondary">
              Szakasz idő
            </AppText>
          </View>
          {race.sections.map((s, i) => (
            <SectionRow
              key={s.id}
              index={i + 1}
              typeIcon={<Icon name={SECTION_TYPE_META[s.type].icon} size={15} color="textSecondary" />}
              name={s.name}
              meta={SECTION_TYPE_META[s.type].label}
              value={`${s.segments.map(g => fmtSec(g.timeSec)).join(' + ')} mp`}
              audioReady={s.audioReady}
              divider={i < race.sections.length - 1}
              onPress={() => navigation.navigate('SectionEditor', { raceId: race.id, sectionId: s.id })}
            />
          ))}
        </View>
      ) : (
        <AppText preset="muted" color="textSecondary" style={styles.empty}>
          Még nincs feladat felvéve.
        </AppText>
      )}
    </Screen>
  );
}

export default RaceDetailScreen;
