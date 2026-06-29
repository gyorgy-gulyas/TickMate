/** Index + type icon + name + mono value. Maps to .srow2. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { Icon } from '../icons';
import { useTheme } from '../../theme';

export type SectionRowProps = {
  index: number | string;
  /** Type icon node (normal / shared-gate / overlap). */
  typeIcon?: React.ReactNode;
  name: string;
  /** Small sub-label under the name (e.g. the section type). */
  meta?: string;
  /** Right mono value, e.g. "5 / 7 mp" or "7.04 mp". */
  value?: string;
  /** Show a waveform marker when this section's audio is generated. */
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
  nameWrap: { flex: 1 },
  meta: { marginTop: 2 },
  valueWrap: { flexDirection: 'row', alignItems: 'center', gap: 7 },
});

export function SectionRow({ index, typeIcon, name, meta, value, audioReady, divider = true, onPress }: SectionRowProps) {
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
      <View style={styles.nameWrap}>
        <AppText preset="listName" color="textPrimary" numberOfLines={1}>
          {name}
        </AppText>
        {meta ? (
          <AppText preset="cardSub" color="textSecondary" style={styles.meta} numberOfLines={1}>
            {meta}
          </AppText>
        ) : null}
      </View>
      <View style={styles.valueWrap}>
        {audioReady ? <Icon name="waveform" size={15} color="accent" /> : null}
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
