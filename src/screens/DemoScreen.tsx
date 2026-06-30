/**
 * UI-kit demo screen — exercises every primitive and composite in both themes.
 * Not a product screen; a visual smoke test for the component library.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootNav } from '../navigation/types';
import {
  AppText,
  BigNum,
  Button,
  Card,
  Chip,
  Field,
  Icon,
  IconTile,
  ListRow,
  MenuCard,
  NavBar,
  Pill,
  ProgressTrack,
  ReadyStatusCard,
  SectionRow,
  SegmentedControl,
  SettingsRow,
  Slider,
  StatCard,
  Stepper,
  Toggle,
  UpcomingRow,
  useTaskTypeOptions,
  type IconName,
} from '../components';
import { useTheme } from '../theme';
import { SECTION_TYPE_META, type SectionType } from '../data/model';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText preset="label" color="textSecondary">
        {title}
      </AppText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function DemoScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNav>();
  const typeOptions = useTaskTypeOptions();
  const [secsOn, setSecsOn] = useState(true);
  const [vol, setVol] = useState(0.72);
  const [latency, setLatency] = useState(120);
  const [type, setType] = useState<SectionType>('normal');
  const [name, setName] = useState('Szlalom');

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.bg }]}>
      <NavBar
        title="TickMate · UI Kit"
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        right={
          <View style={styles.modeToggle}>
            <AppText preset="cardSub" color="textSecondary">
              {theme.mode === 'dark' ? 'Sötét' : 'Világos'}
            </AppText>
            <Toggle value={theme.mode === 'dark'} onValueChange={theme.toggleMode} />
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Status">
          <ReadyStatusCard
            icon={<Icon name="bluetooth-connected" size={19} color="accent" />}
            title="Készen állsz"
            subtitle="Gomb és füles csatlakoztatva"
          />
        </Section>

        <Section title="Buttons">
          <Button label="Start" variant="primary" icon={<Icon name="play" size={14} color="onAccent" />} />
          <Button label="Hang újragenerálása" variant="secondary" icon={<Icon name="arrows-clockwise" size={16} color="textPrimary" />} />
        </Section>

        <Section title="Menu cards">
          <MenuCard icon={<Icon name="flag-checkered" size={22} color="accent" />} title="Versenyek" subtitle="4 mentett verseny" />
          <MenuCard icon={<Icon name="timer" size={22} color="accent" />} title="Gyors feladat" subtitle="Azonnali időzítés" />
        </Section>

        <Section title="List rows">
          <ListRow name="Tavaszi Oldtimer Kupa" meta="8 feladat · 2026.04.12" />
          <ListRow name="Balaton Klasszik" meta="12 feladat · 2026.05.03" divider={false} />
        </Section>

        <Section title="Section rows">
          {(['normal', 'shared', 'overlap'] as SectionType[]).map((t, i) => (
            <SectionRow
              key={t}
              index={i + 1}
              typeIcon={<Icon name={SECTION_TYPE_META[t].icon} size={15} color="textSecondary" />}
              name={t === 'normal' ? 'Rajt feladat' : t === 'shared' ? 'Szlalom' : 'Garázs'}
              value="5 / 7 mp"
              divider={i < 2}
            />
          ))}
        </Section>

        <Section title="Fields & type">
          <Field label="Név" value={name} onChangeText={setName} />
          <View style={styles.row}>
            <Field
              label="Távolság"
              value="20"
              unit="m"
              rightAdornment={<Icon name="check-circle" size={14} color="accent" />}
              style={styles.flex1}
            />
            <Field label="Elők." value="5.0" unit="mp" style={styles.flex1} />
          </View>
          <SegmentedControl options={typeOptions} value={type} onChange={setType} />
        </Section>

        <Section title="Controls">
          <SettingsRow label="Másodpercjelző" right={<Toggle value={secsOn} onValueChange={setSecsOn} />} />
          <SettingsRow label="Hangerő" right={<Slider value={vol} onChange={setVol} style={styles.slider} />} />
          <SettingsRow label="Nyelv" value="Magyar" chevron />
          <SettingsRow label="Bluetooth gomb" value="Csatlakoztatva" statusDot divider={false} />
          <View style={styles.stepperWrap}>
            <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
          </View>
        </Section>

        <Section title="Chips & pills">
          <View style={styles.rowWrap}>
            <Chip label="FELADAT 12" icon={<Icon name="arrow-right" size={11} color="textPrimary" />} />
            <Pill label="Hang kész · 8 feladat · 54 mp" />
          </View>
        </Section>

        <Section title="Run readouts">
          <Card style={styles.runCard}>
            <Chip label="FELADAT 12" />
            <View style={styles.phaseRow}>
              <AppText preset="phase" color="accentText">
                SZAKASZ
              </AppText>
            </View>
            <BigNum value="2.50" unit="mp" />
            <ProgressTrack value={0.62} />
            <View style={styles.gateRow}>
              <AppText preset="muted" color="textSecondary">
                RAJT
              </AppText>
              <AppText preset="gate" color="textPrimary">
                CÉL KAPU
              </AppText>
            </View>
          </Card>
          <StatCard
            left={{ label: 'Előkészítés', value: '5.0', unit: 'mp' }}
            right={{ label: 'Szakasz', value: '7.0', unit: 'mp' }}
          />
          <View>
            <UpcomingRow label="13" value="3 / 8 mp" />
            <UpcomingRow label="14" value="4 / 5 mp" />
          </View>
        </Section>

        <Section title="Icon tiles">
          <View style={styles.rowWrap}>
            {(['target', 'gear-six', 'camera', 'chart-bar', 'question'] as IconName[]).map(n => (
              <IconTile key={n} icon={<Icon name={n} size={22} color="accent" />} />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 18, gap: 22, paddingBottom: 48 },
  section: { gap: 11 },
  sectionBody: { gap: 11 },
  modeToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  flex1: { flex: 1 },
  slider: { width: 120 },
  stepperWrap: { marginTop: 4 },
  runCard: { gap: 14, alignItems: 'center', paddingVertical: 22 },
  phaseRow: { marginTop: 2 },
  gateRow: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' },
});

export default DemoScreen;
