/** Practice mode menu. Maps to "Gyakorló mód". Reaction/rhythm go live with the audio engine. */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Icon, MenuCard } from '../components';
import type { IconName } from '../components';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const ITEMS: { icon: IconName; title: string; subtitle: string; route?: 'QuickTask' | 'Reaction' }[] = [
  { icon: 'lightning', title: 'Reakcióidő', subtitle: 'Reagálj az indító hangra', route: 'Reaction' },
  { icon: 'metronome', title: 'Hangritmus', subtitle: 'Visszaszámlálás megszokása' },
  { icon: 'timer', title: 'Gyors feladat', subtitle: 'Azonnali időzítés mentés nélkül', route: 'QuickTask' },
];

export function PracticeScreen() {
  const navigation = useNavigation<RootNav>();
  return (
    <Screen title="Gyakorló mód" gap={11} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      {ITEMS.map(item => (
        <MenuCard
          key={item.title}
          icon={<Icon name={item.icon} size={22} color="accent" />}
          title={item.title}
          subtitle={item.subtitle}
          onPress={item.route ? () => navigation.navigate(item.route!) : undefined}
        />
      ))}
    </Screen>
  );
}

export default PracticeScreen;
