/** Stopwatch brand mark (native, react-native-svg). Source: design Home header SVG. */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../theme';

export type BrandMarkProps = {
  size?: number;
  color?: string;
};

export function BrandMark({ size = 22, color }: BrandMarkProps) {
  const theme = useTheme();
  const c = color ?? theme.colors.accent;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x={27.5} y={6} width={9} height={6} rx={2.5} fill={c} />
      <Path d="M32 12 V16" stroke={c} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={32} cy={36} r={18} stroke={c} strokeWidth={4} />
      <Path d="M32 36 L32 25" stroke={c} strokeWidth={4} strokeLinecap="round" />
      <Path d="M32 36 L40 40" stroke={c} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

export default BrandMark;
