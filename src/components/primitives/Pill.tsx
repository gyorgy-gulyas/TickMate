/** Status pill with a leading dot. Maps to .pill/.pdot ("Hang kész …"). */
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';
import { Dot } from './Dot';

export type PillProps = {
  label: string;
  /** Dot color role; omit dot with `showDot={false}`. */
  dotColor?: string;
  showDot?: boolean;
  style?: ViewStyle;
};

export function Pill({ label, dotColor = 'accent', showDot = true, style }: PillProps) {
  const theme = useTheme();
  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
  };
  return (
    <View style={[base, style]}>
      {showDot ? <Dot size={8} color={dotColor} /> : null}
      <AppText preset="listMeta" color="monoSecondary">
        {label}
      </AppText>
    </View>
  );
}

export default Pill;
