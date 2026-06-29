/** Segmented control. Maps to .seg3/.segopt (Normál / Követő / Átfedő). */
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

const styles = StyleSheet.create({
  segLabel: { fontSize: 12, letterSpacing: 0 },
});

export type SegmentOption<T extends string> = {
  key: T;
  label: string;
  /** Optional icon node; receives no theming — caller colors it. */
  icon?: React.ReactNode;
};

export type SegmentedControlProps<T extends string> = {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange?: (key: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const theme = useTheme();

  const container: ViewStyle = {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.tile,
    padding: 4,
  };

  return (
    <View style={container}>
      {options.map(opt => {
        const on = opt.key === value;
        const seg: ViewStyle = {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          height: 38,
          borderRadius: theme.radii.chip,
          backgroundColor: on ? theme.colors.accent : 'transparent',
        };
        return (
          <Pressable
            key={opt.key}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={seg}
            onPress={() => onChange?.(opt.key)}>
            {opt.icon}
            <AppText preset="cardSub" weight="700" color={on ? 'onAccent' : 'textSecondary'} style={styles.segLabel}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
