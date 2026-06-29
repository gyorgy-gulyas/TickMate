/** Name + meta + chevron, with a bottom divider. Maps to .lrow. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { Chevron } from './Chevron';
import { useTheme } from '../../theme';

export type ListRowProps = {
  name: string;
  meta?: string;
  onPress?: () => void;
  /** Override the right affordance (default: chevron). */
  right?: React.ReactNode;
  /** Hide the bottom divider (e.g. last row). */
  divider?: boolean;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  meta: { marginTop: 3 },
});

export function ListRow({ name, meta, onPress, right, divider = true }: ListRowProps) {
  const theme = useTheme();
  const dividerStyle = { borderBottomColor: divider ? theme.colors.divider : 'transparent' };
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={!onPress} style={[styles.row, dividerStyle]}>
      <View>
        <AppText preset="listName" color="textPrimary">
          {name}
        </AppText>
        {meta ? (
          <AppText preset="listMeta" color="textSecondary" style={styles.meta}>
            {meta}
          </AppText>
        ) : null}
      </View>
      {right ?? <Chevron />}
    </Pressable>
  );
}

export default ListRow;
