/** Index + type icon + name + mono value. Maps to .srow2. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Dot } from '../primitives';
import { useTheme } from '../../theme';

export type SectionRowProps = {
  index: number | string;
  /** Type icon node (normal / shared-gate / overlap). */
  typeIcon?: React.ReactNode;
  name: string;
  /** Right mono value, e.g. "5 / 7 mp" or "7.04 mp". */
  value?: string;
  /** Per-section audio status dot; omit to hide. */
  audioReady?: boolean;
  divider?: boolean;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  num: { width: 18 },
  tico: { width: 16, alignItems: 'center' },
  name: { flex: 1 },
  valueWrap: { flexDirection: 'row', alignItems: 'center', gap: 7 },
});

export function SectionRow({ index, typeIcon, name, value, audioReady, divider = true, onPress }: SectionRowProps) {
  const theme = useTheme();
  const dividerStyle = { borderBottomColor: divider ? theme.colors.divider : 'transparent' };
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, dividerStyle]}>
      <AppText preset="listNum" color="accentText" style={styles.num}>
        {index}
      </AppText>
      {typeIcon ? <View style={styles.tico}>{typeIcon}</View> : null}
      <AppText preset="listName" color="textPrimary" style={styles.name} numberOfLines={1}>
        {name}
      </AppText>
      <View style={styles.valueWrap}>
        {audioReady !== undefined ? <Dot size={7} color={audioReady ? 'accent' : 'railAlt'} /> : null}
        {value ? (
          <AppText preset="mono" color="monoSecondary">
            {value}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export default SectionRow;
