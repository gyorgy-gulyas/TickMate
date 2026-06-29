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
} from '../components';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  card: { gap: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { flex: 1 },
  sub: { marginTop: 3 },
});

function TypeCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <IconTile icon={icon} size={34} />
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
        Háromféleképpen kapcsolódhatnak a feladatok.
      </AppText>

      <TypeCard icon={<Icon name="arrow-right" size={18} color="accent" />} title="Normál feladat" subtitle="Egy feladat, két kapu">
        <TypeSchematic {...buildSchematic('normal', 5, 7)} />
      </TypeCard>

      <TypeCard
        icon={<Icon name="link-simple" size={18} color="accent" />}
        title="Egymást követő"
        subtitle="Közös kapu zárja és indítja a következőt">
        <TypeSchematic
          markers={[
            { pct: 0, kind: 'gate', cap: '1 · Start' },
            { pct: 50, kind: 'sharedGate', cap: 'Közös' },
            { pct: 100, kind: 'gate', cap: '2 · Cél' },
          ]}
          times={[
            { pct: 25, label: '7 mp' },
            { pct: 75, label: '8 mp' },
          ]}
        />
      </TypeCard>

      <TypeCard icon={<Icon name="arrows-split" size={18} color="accent" />} title="Átfedő" subtitle="Két aktív időzítés egyszerre">
        <OverlapSchematic
          rows={[
            { label: 'A', leftPct: 0, widthPct: 55, variant: 'primary' },
            { label: 'B', leftPct: 35, widthPct: 65, variant: 'secondary' },
          ]}
        />
      </TypeCard>
    </Screen>
  );
}

export default SectionTypesScreen;
