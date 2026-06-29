/** Small status dot (accent by default). Maps to .pdot/.dot in the design. */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import type { ColorTokens } from '../../theme';

export type DotProps = {
  size?: number;
  color?: keyof ColorTokens | (string & {});
};

export function Dot({ size = 8, color = 'accent' }: DotProps) {
  const theme = useTheme();
  const bg = color in theme.colors ? theme.colors[color as keyof ColorTokens] : (color as string);
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg }} />;
}

export default Dot;
