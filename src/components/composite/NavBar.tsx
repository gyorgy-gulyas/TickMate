/** Screen header with back caret, title, and optional right actions. Maps to .nav. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { Icon } from '../icons';
import { useTheme } from '../../theme';

export type NavBarProps = {
  title: string;
  /** Show a back caret when provided. */
  onBack?: () => void;
  /** Right-aligned actions (e.g. add / camera / help icons). */
  right?: React.ReactNode;
};

const styles = StyleSheet.create({
  bar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  title: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});

export function NavBar({ title, onBack, right }: NavBarProps) {
  const theme = useTheme();
  return (
    <View style={[styles.bar, { borderBottomColor: theme.colors.divider }]}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="back" hitSlop={8} onPress={onBack}>
          <Icon name="caret-left" size={22} color="textSecondary" />
        </Pressable>
      ) : null}
      <AppText preset="navTitle" color="textPrimary" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

export default NavBar;
