/** BT audio latency calibration. Maps to "Bluetooth késleltetés". */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, StatCard, Stepper } from '../components';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  intro: { lineHeight: 18 },
  field: { gap: 7 },
});

export function BluetoothLatencyScreen() {
  const [latency, setLatency] = useState(120);

  const footer = (
    <>
      <Button label="Automatikus mérés" variant="secondary" icon={<Icon name="arrows-clockwise" size={15} color="textPrimary" />} />
      <Button label="Mentés" variant="primary" icon={<Icon name="check" size={16} color="onAccent" />} />
    </>
  );

  return (
    <Screen
      title="Bluetooth késleltetés"
      gap={14}
      rightActions={<Icon name="question" size={19} color="textSecondary" />}
      footer={footer}>
      <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
        A fülhallgató hangkésleltetését mérjük és kompenzáljuk, hogy a kattanások pontosak legyenek.
      </AppText>
      <StatCard
        left={{ label: 'Mért késleltetés', value: String(latency), unit: 'ms' }}
        right={{ label: 'Eszköz', value: 'AirPods Pro', valueSize: 14, valueColor: 'textPrimary' }}
      />
      <View style={styles.field}>
        <AppText preset="label" color="textSecondary">
          Kézi korrekció
        </AppText>
        <Stepper value={latency} onChange={setLatency} step={5} min={0} max={400} unit="ms" />
      </View>
      <Button label="Teszt hang lejátszása" variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} />
    </Screen>
  );
}

export default BluetoothLatencyScreen;
