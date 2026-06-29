/** Small uppercase chip. Maps to .chip in the run views. */
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

const styles = StyleSheet.create({
  label: { letterSpacing: 1.3 },
});

export type ChipProps = {
  label: string;
  /** Optional icon node before the label. */
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function Chip({ label, icon, style }: ChipProps) {
  const theme = useTheme();
  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radii.chip,
    paddingVertical: 7,
    paddingHorizontal: theme.spacing.md,
  };
  return (
    <View style={[base, style]}>
      {icon}
      <AppText preset="cardSub" color="textPrimary" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

export default Chip;
