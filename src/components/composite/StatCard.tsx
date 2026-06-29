/** Two-stat card with a vertical divider. Maps to .statcard/.statn/.vline. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';
import type { ColorTokens } from '../../theme';

export type Stat = {
  label: string;
  value: string;
  unit?: string;
  /** Override value font size (default 30). */
  valueSize?: number;
  valueColor?: keyof ColorTokens;
};

export type StatCardProps = {
  left: Stat;
  right: Stat;
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, padding: 16 },
  col: { flex: 1, gap: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  vline: { width: 1, alignSelf: 'stretch' },
  unit: { marginLeft: 3 },
});

function StatCol({ stat }: { stat: Stat }) {
  const valueStyle = stat.valueSize ? { fontSize: stat.valueSize } : undefined;
  return (
    <View style={styles.col}>
      <AppText preset="label" color="textSecondary">
        {stat.label}
      </AppText>
      <View style={styles.valueRow}>
        <AppText preset="statN" color={stat.valueColor ?? 'numBright'} style={valueStyle}>
          {stat.value}
        </AppText>
        {stat.unit ? (
          <AppText preset="statUnit" color="textSecondary" style={styles.unit}>
            {stat.unit}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export function StatCard({ left, right }: StatCardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <StatCol stat={left} />
      <View style={[styles.vline, { backgroundColor: theme.colors.divider }]} />
      <StatCol stat={right} />
    </View>
  );
}

export default StatCard;
