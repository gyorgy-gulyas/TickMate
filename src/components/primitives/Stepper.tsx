/** Numeric stepper. Maps to .stepper/.stepbtn/.stepval (BT latency screen). */
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

const styles = StyleSheet.create({
  stepIcon: { fontSize: 20 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  stepValue: { fontSize: 26 },
  stepUnit: { fontSize: 14 },
});

export type StepperProps = {
  value: number;
  onChange?: (next: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Unit label shown after the value (e.g. "ms"). */
  unit?: string;
  /** Format the numeric value (default: String(value)). */
  format?: (value: number) => string;
  /** Custom icon nodes; fall back to "−" / "+" text. */
  decrementIcon?: React.ReactNode;
  incrementIcon?: React.ReactNode;
};

export function Stepper({ value, onChange, step = 1, min = -Infinity, max = Infinity, unit, format, decrementIcon, incrementIcon }: StepperProps) {
  const theme = useTheme();

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const dec = () => onChange?.(clamp(value - step));
  const inc = () => onChange?.(clamp(value + step));

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.input,
    padding: 6,
  };
  const btn: ViewStyle = {
    width: 46,
    height: 44,
    borderRadius: 9,
    backgroundColor: theme.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={container}>
      <Pressable accessibilityRole="button" accessibilityLabel="decrement" style={btn} onPress={dec} disabled={value <= min}>
        {decrementIcon ?? (
          <AppText preset="statN" color="accentText" style={styles.stepIcon}>
            −
          </AppText>
        )}
      </Pressable>
      <View style={styles.valueRow}>
        <AppText preset="statN" color="numBright" style={styles.stepValue}>
          {format ? format(value) : String(value)}
        </AppText>
        {unit ? (
          <AppText preset="statUnit" color="textSecondary" style={styles.stepUnit}>
            {unit}
          </AppText>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="increment" style={btn} onPress={inc} disabled={value >= max}>
        {incrementIcon ?? (
          <AppText preset="statN" color="accentText" style={styles.stepIcon}>
            +
          </AppText>
        )}
      </Pressable>
    </View>
  );
}

export default Stepper;
