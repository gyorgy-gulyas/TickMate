/** Brand lockup: stopwatch mark + "Tick" (primary) + "Mate" (accent). Home header. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { BrandMark } from '../viz';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export type BrandLockupProps = {
  size?: number;
};

export function BrandLockup({ size = 22 }: BrandLockupProps) {
  return (
    <View style={styles.row}>
      <BrandMark size={size} />
      <AppText preset="navTitle" color="textPrimary">
        Tick
        <AppText preset="navTitle" color="accentText">
          Mate
        </AppText>
      </AppText>
    </View>
  );
}

export default BrandLockup;
