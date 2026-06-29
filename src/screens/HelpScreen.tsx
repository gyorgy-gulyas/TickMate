/** Help: quick start, FAQ, contact. Maps to "Súgó". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, ListRow, MenuCard } from '../components';
import { Screen } from './Screen';

const STEPS = [
  'Párosítsd a Bluetooth gombot és a fülest',
  'Vidd fel a feladatokat, generáld a hangot',
  'Indítsd a futást a gombbal — figyeld a hangot',
];

const FAQ = [
  'Bluetooth eszközök párosítása',
  'Mit jelentenek a hangjelzések?',
  'Feladattípusok magyarázata',
  'Hang és késleltetés',
];

const styles = StyleSheet.create({
  card: { gap: 11 },
  steps: { gap: 11, marginTop: 9 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  num: { width: 18 },
  stepText: { flex: 1 },
  faqLabel: { marginTop: 2 },
});

export function HelpScreen() {
  return (
    <Screen title="Súgó" gap={9}>
      <Card style={styles.card}>
        <AppText preset="label" color="textSecondary">
          Gyors kezdés
        </AppText>
        <View style={styles.steps}>
          {STEPS.map((text, i) => (
            <View key={text} style={styles.step}>
              <AppText preset="listNum" color="accentText" style={styles.num}>
                {i + 1}
              </AppText>
              <AppText preset="listName" weight="600" color="textPrimary" style={styles.stepText}>
                {text}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <AppText preset="label" color="textSecondary" style={styles.faqLabel}>
        Gyakori kérdések
      </AppText>
      {FAQ.map((q, i) => (
        <ListRow key={q} name={q} divider={i < FAQ.length - 1} />
      ))}

      <MenuCard
        icon={<Icon name="envelope-simple" size={20} color="accent" />}
        title="Kapcsolat"
        subtitle="segitseg@tickmate.app"
      />
    </Screen>
  );
}

export default HelpScreen;
