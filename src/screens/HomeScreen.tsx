/** Home screen — brand header, ready status, and the main menu. Maps to "Főképernyő". */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandLockup, Icon, MenuCard, ReadyStatusCard } from '../components';
import { useTheme } from '../theme';
import { useT } from '../i18n';
import { useRaces } from '../store/useStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { height: 50, justifyContent: 'center', paddingHorizontal: 18, borderBottomWidth: 1 },
  content: { padding: 18, paddingTop: 12, gap: 8, paddingBottom: 32 },
});

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const t = useT();
  const races = useRaces();
  const bg = { backgroundColor: theme.colors.bg };
  const headerBorder = { borderBottomColor: theme.colors.divider };

  return (
    <View style={[styles.fill, bg]}>
      <View style={[styles.header, headerBorder]}>
        <BrandLockup />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ReadyStatusCard
          icon={<Icon name="bluetooth-connected" size={19} color="accent" />}
          title={t('home.ready.title')}
          subtitle={t('home.ready.sub')}
        />
        <MenuCard
          icon={<Icon name="flag-checkered" size={22} color="accent" />}
          title={t('home.races')}
          subtitle={t('home.races.sub', { n: races.length })}
          onPress={() => navigation.navigate('Races')}
        />
        <MenuCard
          icon={<Icon name="target" size={22} color="accent" />}
          title={t('home.practice')}
          subtitle={t('home.practice.sub')}
          onPress={() => navigation.navigate('Practice')}
        />
        <MenuCard
          icon={<Icon name="gear-six" size={22} color="accent" />}
          title={t('home.settings')}
          subtitle={t('home.settings.sub')}
          onPress={() => navigation.navigate('Settings')}
        />
        <MenuCard
          icon={<Icon name="question" size={22} color="accent" />}
          title={t('home.help')}
          subtitle={t('home.help.sub')}
          onPress={() => navigation.navigate('Help')}
        />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
