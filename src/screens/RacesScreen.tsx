/** Saved races list. Maps to "Versenyek". Reads/creates races from the store. */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, ListRow } from '../components';
import { useRaces, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

export function RacesScreen() {
  const navigation = useNavigation<RootNav>();
  const races = useRaces();
  const addRace = useStore(s => s.addRace);

  const createRace = () => {
    const id = addRace();
    navigation.navigate('RaceDetail', { raceId: id });
  };

  const footer = <Button label="Új verseny" variant="primary" icon={<Icon name="plus" size={16} color="onAccent" />} onPress={createRace} />;

  return (
    <Screen title="Versenyek" gap={0} rightActions={<Icon name="plus" size={22} color="accentText" />} footer={footer}>
      {races.map((race, i) => (
        <ListRow
          key={race.id}
          name={race.name}
          meta={`${race.sections.length} feladat${race.date ? ` · ${race.date}` : ''}`}
          onPress={() => navigation.navigate('RaceDetail', { raceId: race.id })}
          divider={i < races.length - 1}
        />
      ))}
    </Screen>
  );
}

export default RacesScreen;
