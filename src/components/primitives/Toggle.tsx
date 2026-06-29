/** On/off switch. Maps to .tog/.knob (46×28 track, 22 knob). */
import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type ToggleProps = {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  const theme = useTheme();

  const track: ViewStyle = {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: value ? theme.colors.accent : theme.colors.railAlt,
    opacity: disabled ? 0.5 : 1,
  };
  const knob: ViewStyle = {
    position: 'absolute',
    top: 3,
    left: value ? 21 : 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: value ? theme.colors.onAccent : theme.colors.textPrimary,
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange?.(!value)}>
      <View style={track}>
        <View style={knob} />
      </View>
    </Pressable>
  );
}

export default Toggle;
