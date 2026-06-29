/** Saved races list. Maps to "Versenyek". */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, ListRow } from '../components';
import { RACES, RACE_SECTION_COUNT } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

export function RacesScreen() {
  const navigation = useNavigation<RootNav>();

  const footer = <Button label="Új verseny" variant="primary" icon={<Icon name="plus" size={16} color="onAccent" />} />;

  return (
    <Screen
      title="Versenyek"
      gap={0}
      rightActions={<Icon name="plus" size={22} color="accentText" />}
      footer={footer}>
      {RACES.map((race, i) => (
        <ListRow
          key={race.id}
          name={race.name}
          meta={`${RACE_SECTION_COUNT[race.id]} feladat · ${race.date}`}
          onPress={() => navigation.navigate('RaceDetail', { raceId: race.id })}
          divider={i < RACES.length - 1}
        />
      ))}
    </Screen>
  );
}

export default RacesScreen;
