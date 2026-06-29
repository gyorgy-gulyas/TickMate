/** Large run counter with unit. Maps to .bignum/.bigunit. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  unit: { marginBottom: 2 },
});

export type BigNumProps = {
  value: string;
  unit?: string;
};

export function BigNum({ value, unit }: BigNumProps) {
  return (
    <View style={styles.row}>
      <AppText preset="bigNum" color="numBright">
        {value}
      </AppText>
      {unit ? (
        <AppText preset="bigUnit" color="textSecondary" style={styles.unit}>
          {unit}
        </AppText>
      ) : null}
    </View>
  );
}

export default BigNum;
