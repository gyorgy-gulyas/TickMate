/** Section-type explainer with schematics. Maps to "Feladat típusok". */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  Icon,
  IconTile,
  OverlapSchematic,
  TypeSchematic,
  buildSchematic,
  buildSharedSchematic,
} from '../components';
import { SECTION_TYPE_META } from '../data/model';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  card: { gap: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { flex: 1 },
  sub: { marginTop: 3 },
});

function TypeCard({
  iconName,
  title,
  subtitle,
  children,
}: {
  iconName: Parameters<typeof Icon>[0]['name'];
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <IconTile icon={<Icon name={iconName} size={18} color="accent" />} size={34} />
        <View style={styles.body}>
          <AppText preset="cardTitleSm" color="textPrimary">
            {title}
          </AppText>
          <AppText preset="cardSub" color="textSecondary" style={styles.sub}>
            {subtitle}
          </AppText>
        </View>
      </View>
      {children}
    </Card>
  );
}

export function SectionTypesScreen() {
  return (
    <Screen title="Feladat típusok" gap={11} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <AppText preset="muted" color="textSecondary">
        Négyféleképpen kapcsolódhatnak a feladatok.
      </AppText>

      <TypeCard iconName={SECTION_TYPE_META.normal.icon} title="Normál feladat" subtitle="Egy feladat, két kapu">
        <TypeSchematic {...buildSchematic(5, 7)} />
      </TypeCard>

      <TypeCard
        iconName={SECTION_TYPE_META.shared.icon}
        title="Egymást követő"
        subtitle="A vége = a következő kezdete (közös kapu)">
        <TypeSchematic {...buildSharedSchematic(5, 7, 8)} />
      </TypeCard>

      <TypeCard
        iconName={SECTION_TYPE_META.nested.icon}
        title="Egymásba fonódó"
        subtitle="A start → B start → B cél → A cél (B az A-n belül)">
        <OverlapSchematic
          showGomb
          tracks={[
            { label: 'A', startPct: 20, endPct: 94, variant: 'primary', timeLabel: '9 mp' },
            { label: 'B', startPct: 42, endPct: 70, variant: 'secondary', timeLabel: '5 mp' },
          ]}
        />
      </TypeCard>

      <TypeCard
        iconName={SECTION_TYPE_META.overlap.icon}
        title="Átfedő"
        subtitle="A start → B start → A cél → B cél (keresztező)">
        <OverlapSchematic
          showGomb
          tracks={[
            { label: 'A', startPct: 20, endPct: 62, variant: 'primary', timeLabel: '6 mp' },
            { label: 'B', startPct: 44, endPct: 94, variant: 'secondary', timeLabel: '8 mp' },
          ]}
        />
      </TypeCard>
    </Screen>
  );
}

export default SectionTypesScreen;
