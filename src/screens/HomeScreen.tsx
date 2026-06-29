/** Home screen — brand header, ready status, and the main menu. Maps to "Főképernyő". */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandLockup, Icon, MenuCard, ReadyStatusCard } from '../components';
import { useTheme } from '../theme';
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
          title="Készen állsz"
          subtitle="Gomb és füles csatlakoztatva"
        />
        <MenuCard
          icon={<Icon name="flag-checkered" size={22} color="accent" />}
          title="Versenyek"
          subtitle="4 mentett verseny"
          onPress={() => navigation.navigate('Races')}
        />
        <MenuCard
          icon={<Icon name="timer" size={22} color="accent" />}
          title="Gyors feladat"
          subtitle="Azonnali időzítés mentés nélkül"
          onPress={() => navigation.navigate('QuickTask')}
        />
        <MenuCard
          icon={<Icon name="target" size={22} color="accent" />}
          title="Gyakorló mód"
          subtitle="Reakció és ritmus"
          onPress={() => navigation.navigate('Practice')}
        />
        <MenuCard
          icon={<Icon name="clock-counter-clockwise" size={22} color="accent" />}
          title="History"
          subtitle="Korábbi futások"
          onPress={() => navigation.navigate('History')}
        />
        <MenuCard
          icon={<Icon name="gear-six" size={22} color="accent" />}
          title="Beállítások"
          subtitle="Bluetooth, hang, mód"
          onPress={() => navigation.navigate('Settings')}
        />
        <MenuCard
          icon={<Icon name="question" size={22} color="accent" />}
          title="Súgó"
          subtitle="Útmutató és gyakori kérdések"
          onPress={() => navigation.navigate('Help')}
        />
        <MenuCard
          icon={<Icon name="lightning" size={22} color="slower" />}
          title="UI Kit (dev)"
          subtitle="Komponens-katalógus — fejlesztői"
          onPress={() => navigation.navigate('Demo')}
        />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
