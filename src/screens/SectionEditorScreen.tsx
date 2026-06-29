/** Section editor with a live schematic preview. Maps to "Feladat szerkesztő". */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppText,
  Button,
  Card,
  Field,
  Icon,
  OverlapSchematic,
  SegmentedControl,
  TypeSchematic,
  buildSchematic,
} from '../components';
import { SECTION_TYPE_META, type SectionType } from '../data/mock';
import { Screen } from './Screen';
import type { RootNav } from '../navigation/types';

const TYPE_OPTIONS = (['normal', 'shared', 'overlap'] as SectionType[]).map(t => ({
  key: t,
  label: SECTION_TYPE_META[t].label,
  icon: <Icon name={SECTION_TYPE_META[t].icon} size={15} color="textSecondary" />,
}));

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  group: { gap: 7 },
  flex1: { flex: 1 },
  preview: { gap: 0 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});

const toNum = (s: string) => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

export function SectionEditorScreen() {
  const navigation = useNavigation<RootNav>();
  const [name, setName] = useState('Szlalom');
  const [type, setType] = useState<SectionType>('normal');
  const [distance, setDistance] = useState('20');
  const [prep, setPrep] = useState('5.0');
  const [section, setSection] = useState('7.0');

  const footer = <Button label="Mentés" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} />;

  const rightActions = (
    <View style={styles.rightActions}>
      <Pressable accessibilityRole="button" accessibilityLabel="típusok" onPress={() => navigation.navigate('SectionTypes')}>
        <Icon name="question" size={19} color="textSecondary" />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="fotó" onPress={() => navigation.navigate('SectionFromPhoto')}>
        <Icon name="camera" size={20} color="accentText" />
      </Pressable>
    </View>
  );

  return (
    <Screen title="Feladat · 2" gap={13} rightActions={rightActions} footer={footer}>
      <Field label="Név" value={name} onChangeText={setName} />

      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Típus
        </AppText>
        <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} />
      </View>

      <View style={styles.row}>
        <Field label="Távolság" value={distance} onChangeText={setDistance} unit="m" keyboardType="number-pad" style={styles.flex1} />
        <Field label="Elők." value={prep} onChangeText={setPrep} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
        <Field label="Szakasz" value={section} onChangeText={setSection} unit="mp" keyboardType="decimal-pad" style={styles.flex1} />
      </View>

      <Card style={styles.preview}>
        <AppText preset="label" color="textSecondary">
          Előnézet · {SECTION_TYPE_META[type].label}
        </AppText>
        {type === 'overlap' ? (
          <OverlapSchematic
            rows={[
              { label: 'A', leftPct: 0, widthPct: 60, variant: 'primary' },
              { label: 'B', leftPct: 35, widthPct: 65, variant: 'secondary' },
            ]}
          />
        ) : (
          <TypeSchematic {...buildSchematic(type, toNum(prep), toNum(section))} />
        )}
      </Card>
    </Screen>
  );
}

export default SectionEditorScreen;
