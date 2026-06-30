/** Help: quick start, FAQ, contact. Maps to "Súgó". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, ListRow, MenuCard } from '../components';
import { useT, type StringKey } from '../i18n';
import { Screen } from './Screen';

const STEPS: StringKey[] = ['help.step1', 'help.step2', 'help.step3'];
const FAQ: StringKey[] = ['help.faq1', 'help.faq2', 'help.faq3', 'help.faq4'];

const styles = StyleSheet.create({
  card: { gap: 11 },
  steps: { gap: 11, marginTop: 9 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  num: { width: 18 },
  stepText: { flex: 1 },
  faqLabel: { marginTop: 2 },
});

export function HelpScreen() {
  const t = useT();
  return (
    <Screen title={t('help.title')} gap={9}>
      <Card style={styles.card}>
        <AppText preset="label" color="textSecondary">
          {t('help.quickStart')}
        </AppText>
        <View style={styles.steps}>
          {STEPS.map((key, i) => (
            <View key={key} style={styles.step}>
              <AppText preset="listNum" color="accentText" style={styles.num}>
                {i + 1}
              </AppText>
              <AppText preset="listName" weight="600" color="textPrimary" style={styles.stepText}>
                {t(key)}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <AppText preset="label" color="textSecondary" style={styles.faqLabel}>
        {t('help.faq')}
      </AppText>
      {FAQ.map((key, i) => (
        <ListRow key={key} name={t(key)} divider={i < FAQ.length - 1} />
      ))}

      <MenuCard
        icon={<Icon name="envelope-simple" size={20} color="accent" />}
        title={t('help.contact')}
        subtitle="segitseg@tickmate.app"
      />
    </Screen>
  );
}

export default HelpScreen;
