/** Quick, unsaved timing task. Maps to "Gyors feladat". */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Field, Icon, SettingsRow, Toggle } from '../components';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  intro: { lineHeight: 20 },
  group: { gap: 7 },
});

export function QuickTaskScreen() {
  const [prep, setPrep] = useState('5.0');
  const [section, setSection] = useState('7.0');
  const [secondsTick, setSecondsTick] = useState(true);

  const footer = <Button label="Start" variant="primary" icon={<Icon name="play" size={14} color="onAccent" />} />;

  return (
    <Screen
      title="Gyors feladat"
      gap={16}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="muted" color="textSecondary" style={styles.intro}>
        Mentés nélküli, azonnali időzítés. A hang azonnal elkészül a Start előtt.
      </AppText>
      <Field label="Előkészítési idő" value={prep} onChangeText={setPrep} unit="mp" keyboardType="decimal-pad" />
      <Field label="Szakasz idő" value={section} onChangeText={setSection} unit="mp" keyboardType="decimal-pad" />
      <View style={styles.group}>
        <AppText preset="label" color="textSecondary">
          Másodpercjelző
        </AppText>
        <SettingsRow
          label="Kattanás minden mp"
          right={<Toggle value={secondsTick} onValueChange={setSecondsTick} />}
          divider={false}
        />
      </View>
    </Screen>
  );
}

export default QuickTaskScreen;
