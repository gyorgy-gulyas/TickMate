/** Color-swatch legend. Maps to .lgd/.lgdt. */
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';
import type { ColorTokens } from '../../theme';

export type LegendItem = {
  color: keyof ColorTokens | (string & {});
  label: string;
};

export type LegendProps = {
  items: LegendItem[];
  /** Swatch size (dp). Default 12. */
  swatch?: number;
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { borderRadius: 3 },
});

export function Legend({ items, swatch = 12 }: LegendProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {items.map(it => {
        const color = it.color in theme.colors ? theme.colors[it.color as keyof ColorTokens] : (it.color as string);
        const sw: ViewStyle = { width: swatch, height: swatch, backgroundColor: color };
        return (
          <View key={it.label} style={styles.item}>
            <View style={[styles.swatch, sw]} />
            <AppText preset="cardSub" color="textSecondary">
              {it.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

export default Legend;
