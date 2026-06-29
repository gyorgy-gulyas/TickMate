/** Rounded icon tile. Maps to .micon (42×42, surface2 bg, accent icon). */
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type IconTileProps = {
  /** Icon node (color/size set by the caller, typically accent). */
  icon?: React.ReactNode;
  /** Tile size (dp). Default 42; some cards use 34/38. */
  size?: number;
  /** Background override (e.g. ready card uses a tinted accent). */
  background?: string;
  style?: ViewStyle;
};

export function IconTile({ icon, size = 42, background, style }: IconTileProps) {
  const theme = useTheme();
  const base: ViewStyle = {
    width: size,
    height: size,
    borderRadius: theme.radii.tile,
    backgroundColor: background ?? theme.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  };
  return <View style={[base, style]}>{icon}</View>;
}

export default IconTile;
