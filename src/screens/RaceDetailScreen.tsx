/** Race detail: audio status + section list. Maps to "Verseny részletei". */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Icon, Pill, SectionRow } from '../components';
import { SECTION_TYPE_META, fmtSec, getRace } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav, RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  thead: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 1, marginTop: 2 },
  empty: { paddingVertical: 18 },
});

export function RaceDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'RaceDetail'>>();
  const navigation = useNavigation<RootNav>();
  const race = getRace(route.params?.raceId);
  const totalSec = race.sections.reduce((sum, s) => sum + s.prepSec + s.sectionSec, 0);

  const footer = (
    <>
      <Button
        label="Hang újragenerálása"
        variant="secondary"
        icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />}
      />
      <Button label="Start" variant="primary" icon={<Icon name="play" size={14} color="onAccent" />} />
    </>
  );

  return (
    <Screen
      title={race.name}
      gap={10}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Timeline')}>
        <Pill
          label={`${race.audioReady ? 'Hang kész' : 'Hang nincs'} · ${race.sections.length} feladat · ${totalSec} mp`}
          dotColor={race.audioReady ? 'accent' : 'slower'}
        />
      </Pressable>
      {race.sections.length > 0 ? (
        <View>
          <View style={styles.thead}>
            <AppText preset="label" color="textSecondary">
              Feladat
            </AppText>
            <AppText preset="label" color="textSecondary">
              Elők / szakasz
            </AppText>
          </View>
          {race.sections.map((s, i) => (
            <SectionRow
              key={s.id}
              index={i + 1}
              typeIcon={<Icon name={SECTION_TYPE_META[s.type].icon} size={15} color="textSecondary" />}
              name={s.name}
              value={`${fmtSec(s.prepSec)} / ${fmtSec(s.sectionSec)} mp`}
              divider={i < race.sections.length - 1}
              onPress={() => navigation.navigate('SectionEditor', { sectionId: s.id })}
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
