/** Upcoming-task row with a top divider. Maps to .uprow. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type UpcomingRowProps = {
  /** Left label (task number). */
  label: string;
  /** Right mono value, e.g. "3 / 8 mp". */
  value: string;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderTopWidth: 1,
  },
});

export function UpcomingRow({ label, value }: UpcomingRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderTopColor: theme.colors.divider }]}>
      <AppText preset="mono" color="monoSecondary">
        {label}
      </AppText>
      <AppText preset="mono" color="accentText">
        {value}
      </AppText>
    </View>
  );
}

export default UpcomingRow;
