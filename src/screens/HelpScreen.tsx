/** Help: quick start, expandable FAQ, contact. Maps to "Súgó". */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, MenuCard } from '../components';
import { useTheme } from '../theme';
import { useT, type StringKey } from '../i18n';
import { Screen } from './Screen';

const STEPS: StringKey[] = ['help.step1', 'help.step2', 'help.step3'];
const FAQ: { q: StringKey; a: StringKey }[] = [1, 2, 3, 4, 5].map(n => ({
  q: `help.faq${n}` as StringKey,
  a: `help.faq${n}.a` as StringKey,
}));

const styles = StyleSheet.create({
  card: { gap: 11 },
  steps: { gap: 11, marginTop: 9 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  num: { width: 18 },
  stepText: { flex: 1 },
  faqLabel: { marginTop: 2 },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  qText: { flex: 1 },
  answer: { lineHeight: 19, paddingBottom: 13, paddingRight: 8 },
  divider: { height: StyleSheet.hairlineWidth },
});

/** One expandable FAQ entry (tap the question to reveal the answer). */
function FaqRow({ q, a, last }: { q: string; a: string; last: boolean }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(o => !o)}
        style={styles.qRow}>
        <AppText preset="listName" weight="600" color="textPrimary" style={styles.qText}>
          {q}
        </AppText>
        <Icon name={open ? 'caret-up' : 'caret-down'} size={16} color="textSecondary" />
      </Pressable>
      {open ? (
        <AppText preset="muted" color="textSecondary" style={styles.answer}>
          {a}
        </AppText>
      ) : null}
      {!last ? <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} /> : null}
    </View>
  );
}

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
      <Card>
        {FAQ.map((item, i) => (
          <FaqRow key={item.q} q={t(item.q)} a={t(item.a)} last={i === FAQ.length - 1} />
        ))}
      </Card>

      <MenuCard
        icon={<Icon name="envelope-simple" size={20} color="accent" />}
        title={t('help.contact')}
        subtitle="segitseg@tickmate.app"
      />
    </Screen>
  );
}

export default HelpScreen;
