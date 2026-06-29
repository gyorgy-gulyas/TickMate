/** Settings list row: label + value/chevron or a custom control. Maps to .srow. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Dot } from '../primitives';
import { Chevron } from './Chevron';
import { useTheme } from '../../theme';

export type SettingsRowProps = {
  label: string;
  /** Right-side value text (e.g. "120 ms", "Magyar"). */
  value?: string;
  /** Show a chevron after the value. */
  chevron?: boolean;
  /** Leading status dot before the value (e.g. connected). */
  statusDot?: boolean;
  /** Custom right control (Toggle / Slider). Overrides value/chevron. */
  right?: React.ReactNode;
  onPress?: () => void;
  divider?: boolean;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  label: { flex: 1 },
  rightWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

export function SettingsRow({ label, value, chevron, statusDot, right, onPress, divider = true }: SettingsRowProps) {
  const theme = useTheme();
  const dividerStyle = { borderBottomColor: divider ? theme.colors.divider : 'transparent' };
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, dividerStyle]}>
      <AppText preset="listName" weight="600" color="textPrimary" style={styles.label}>
        {label}
      </AppText>
      {right ?? (
        <View style={styles.rightWrap}>
          {statusDot ? <Dot size={8} color="accent" /> : null}
          {value ? (
            <AppText preset="listMeta" color="textSecondary">
              {value}
            </AppText>
          ) : null}
          {chevron ? <Chevron /> : null}
        </View>
      )}
    </Pressable>
  );
}

export default SettingsRow;
