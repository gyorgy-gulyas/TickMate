/** Horizontal progress bar (0..1). Maps to .htrack/.hfill. */
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type ProgressTrackProps = {
  /** Fill ratio 0..1. */
  value: number;
  height?: number;
  /** Fill color override (e.g. accentDark for the overlap secondary bar). */
  fillColor?: string;
};

const styles = StyleSheet.create({
  track: { borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});

export function ProgressTrack({ value, height = 9, fillColor }: ProgressTrackProps) {
  const theme = useTheme();
  const ratio = Math.min(1, Math.max(0, value));

  const track: ViewStyle = { height, backgroundColor: theme.colors.surface2 };
  const fill: ViewStyle = { width: `${ratio * 100}%`, backgroundColor: fillColor ?? theme.colors.accent };

  return (
    <View style={[styles.track, track]}>
      <View style={[styles.fill, fill]} />
    </View>
  );
}

export default ProgressTrack;
