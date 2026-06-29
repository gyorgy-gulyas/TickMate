/** Stopwatch brand mark (web, DOM <svg>). Shadows BrandMark.tsx on web so the
 *  web bundle never pulls react-native-svg. */
import React from 'react';
import { useTheme } from '../../theme';

export type BrandMarkProps = {
  size?: number;
  color?: string;
};

export function BrandMark({ size = 22, color }: BrandMarkProps) {
  const theme = useTheme();
  const c = color ?? theme.colors.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round">
      <rect x="27.5" y="6" width="9" height="6" rx="2.5" fill={c} stroke="none" />
      <path d="M32 12 V16" />
      <circle cx="32" cy="36" r="18" />
      <path d="M32 36 L32 25" />
      <path d="M32 36 L40 40" />
    </svg>
  );
}

export default BrandMark;
