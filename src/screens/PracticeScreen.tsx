/** Practice mode menu. Maps to "Gyakorló mód". Reaction/rhythm go live with the audio engine. */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Icon, MenuCard } from '../components';
import type { IconName } from '../components';
import { useT, type StringKey } from '../i18n';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const ITEMS: { icon: IconName; title: StringKey; subtitle: StringKey; route?: 'QuickTask' | 'Reaction' | 'Rhythm' }[] = [
  { icon: 'lightning', title: 'practice.reaction', subtitle: 'practice.reaction.sub', route: 'Reaction' },
  { icon: 'metronome', title: 'practice.rhythm', subtitle: 'practice.rhythm.sub', route: 'Rhythm' },
  { icon: 'timer', title: 'practice.quick', subtitle: 'practice.quick.sub', route: 'QuickTask' },
];

export function PracticeScreen() {
  const navigation = useNavigation<RootNav>();
  const t = useT();
  return (
    <Screen title={t('practice.title')} gap={11} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      {ITEMS.map(item => (
        <MenuCard
          key={item.title}
          icon={<Icon name={item.icon} size={22} color="accent" />}
          title={t(item.title)}
          subtitle={t(item.subtitle)}
          onPress={item.route ? () => navigation.navigate(item.route!) : undefined}
        />
      ))}
    </Screen>
  );
}

export default PracticeScreen;
