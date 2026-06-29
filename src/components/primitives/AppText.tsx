/**
 * Typed text primitive: applies a typography preset + semantic color role.
 * Every other component renders text through this so presets/colors stay central.
 */
import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { resolveFont, useTheme } from '../../theme';
import type { ColorTokens, FontWeight, TextPreset, TypePreset } from '../../theme';

export type AppTextProps = TextProps & {
  /** Typography preset from theme.type (default: listMeta body). */
  preset?: TypePreset;
  /** Semantic color role, or any raw color string. Default: textPrimary. */
  color?: keyof ColorTokens | (string & {});
  /** Override the preset weight (re-resolves the bundled font). */
  weight?: FontWeight;
  children?: React.ReactNode;
};

export function AppText({ preset = 'listMeta', color = 'textPrimary', weight, style, ...rest }: AppTextProps) {
  const theme = useTheme();
  const p = theme.type[preset] as TextPreset;
  const resolvedColor = color in theme.colors ? theme.colors[color as keyof ColorTokens] : (color as string);

  // Per-weight TTFs: set fontFamily only, never numeric fontWeight.
  const presetStyle: TextStyle = {
    fontFamily: resolveFont(p.family, weight ?? p.fontWeight),
    fontSize: p.fontSize,
    letterSpacing: p.letterSpacing,
    lineHeight: p.lineHeight,
    textTransform: p.textTransform,
    color: resolvedColor,
  };

  return <Text style={[presetStyle, style]} {...rest} />;
}

export default AppText;
