/** Saved races list. Maps to "Versenyek". Reads/creates races from the store. */
import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, ListRow } from '../components';
import { useT } from '../i18n';
import { useRaces, useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

export function RacesScreen() {
  const navigation = useNavigation<RootNav>();
  const races = useRaces();
  const addRace = useStore(s => s.addRace);
  const t = useT();

  const createRace = () => {
    const id = addRace();
    navigation.navigate('RaceDetail', { raceId: id });
  };

  const footer = <Button label={t('races.new')} variant="primary" icon={<Icon name="plus" size={16} color="onAccent" />} onPress={createRace} />;

  return (
    <Screen
      title={t('races.title')}
      gap={0}
      rightActions={
        <Pressable accessibilityRole="button" accessibilityLabel={t('races.new')} onPress={createRace}>
          <Icon name="plus" size={22} color="accentText" />
        </Pressable>
      }
      footer={footer}>
      {races.map((race, i) => (
        <ListRow
          key={race.id}
          name={race.name}
          meta={`${t('tasks.count', { n: race.sections.length })}${race.date ? ` · ${race.date}` : ''}`}
          onPress={() => navigation.navigate('RaceDetail', { raceId: race.id })}
          divider={i < races.length - 1}
        />
      ))}
    </Screen>
  );
}

export default RacesScreen;
