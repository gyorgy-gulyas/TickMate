/** Practice mode menu. Maps to "Gyakorló mód". Sub-modes are a later plan. */
import React from 'react';
import { Icon, MenuCard } from '../components';
import { Screen } from './Screen';

const ITEMS = [
  { icon: 'lightning', title: 'Reakcióidő', subtitle: 'Reagálj az indító hangra' },
  { icon: 'metronome', title: 'Hangritmus', subtitle: 'Visszaszámlálás megszokása' },
  { icon: 'play-circle', title: 'Teljes feladatsor', subtitle: 'Végigjátszás hanggal' },
  { icon: 'plus-circle', title: 'Saját feladat', subtitle: 'Hozz létre gyakorlót' },
] as const;

export function PracticeScreen() {
  return (
    <Screen title="Gyakorló mód" gap={11} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      {ITEMS.map(item => (
        <MenuCard
          key={item.title}
          icon={<Icon name={item.icon} size={22} color="accent" />}
          title={item.title}
          subtitle={item.subtitle}
        />
      ))}
    </Screen>
  );
}

export default PracticeScreen;
