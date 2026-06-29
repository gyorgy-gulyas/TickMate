/** Surface container. Maps to .mcard/.tcard/.note/.ovsec/.hstat in the design. */
import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type CardVariant = 'surface' | 'surface2' | 'ready';

export type CardProps = ViewProps & {
  variant?: CardVariant;
  /** Inner padding (dp). Default theme.spacing.lg (16). */
  padding?: number;
  /** Border radius (dp). Default theme.radii.card (14). */
  radius?: number;
  children?: React.ReactNode;
};

export function Card({ variant = 'surface', padding, radius, style, children, ...rest }: CardProps) {
  const theme = useTheme();

  const base: ViewStyle = {
    backgroundColor: variant === 'ready' ? theme.colors.readyBg : variant === 'surface2' ? theme.colors.surface2 : theme.colors.surface,
    borderRadius: radius ?? theme.radii.card,
    padding: padding ?? theme.spacing.lg,
    borderWidth: 1,
    borderColor: variant === 'ready' ? theme.colors.readyBorder : theme.colors.border,
  };

  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}

export default Card;
