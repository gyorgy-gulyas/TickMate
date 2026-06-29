/** Overlap schematic — labeled parallel bars. Maps to the .tltrack/.tlbar pair
 *  on the "Átfedő" type card. Percentage widths, no measurement needed. */
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type OverlapRow = {
  label: string;
  leftPct: number;
  widthPct: number;
  variant: 'primary' | 'secondary';
};

export type OverlapSchematicProps = {
  rows: OverlapRow[];
};

const styles = StyleSheet.create({
  wrap: { gap: 7, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 14 },
  track: { flex: 1, height: 16, borderRadius: 5 },
  bar: { position: 'absolute', top: 4, bottom: 4, borderRadius: 4 },
});

export function OverlapSchematic({ rows }: OverlapSchematicProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {rows.map((r, i) => {
        const bar: ViewStyle = {
          left: `${r.leftPct}%`,
          width: `${r.widthPct}%`,
          backgroundColor: r.variant === 'primary' ? theme.colors.accent : theme.colors.accentDark,
        };
        return (
          <View key={`${r.label}${i}`} style={styles.row}>
            <AppText preset="listNum" color="accentText" style={styles.label}>
              {r.label}
            </AppText>
            <View style={[styles.track, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.bar, bar]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default OverlapSchematic;
