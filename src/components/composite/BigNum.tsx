/** Large run counter with unit. Maps to .bignum/.bigunit. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import type { ColorTokens } from '../../theme';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  unit: { marginBottom: 2 },
});

export type BigNumProps = {
  value: string;
  unit?: string;
  color?: keyof ColorTokens;
};

export function BigNum({ value, unit, color = 'numBright' }: BigNumProps) {
  return (
    <View style={styles.row}>
      <AppText preset="bigNum" color={color}>
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
