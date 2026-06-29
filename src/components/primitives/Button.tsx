/** Footer button. Maps to .btn .pri / .btn .sec in the design. */
import React from 'react';
import { Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  /** Optional icon node rendered before the label. */
  icon?: React.ReactNode;
  /** Button height (dp). Default 50; STOP uses 46. */
  height?: number;
  disabled?: boolean;
};

export function Button({ label, variant = 'primary', icon, height, disabled, style, ...rest }: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  const base: ViewStyle = {
    height: height ?? 50,
    borderRadius: theme.radii.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: isPrimary ? theme.colors.accent : 'transparent',
    borderWidth: isPrimary ? 0 : 1.5,
    borderColor: isPrimary ? undefined : theme.colors.borderStrong,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [base, pressed && !disabled ? { opacity: 0.85 } : null, style as ViewStyle]}
      {...rest}>
      {icon ? <View>{icon}</View> : null}
      <AppText preset="button" color={isPrimary ? 'onAccent' : 'textPrimary'}>
        {label}
      </AppText>
    </Pressable>
  );
}

export default Button;
