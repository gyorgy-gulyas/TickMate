/** Timeline of sections with overlap + a vertical guide. Maps to
 *  .tlwrap/.tltrack/.tlbar/.tlsec/.vguide/.tlaxis. */
import React from 'react';
import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type TimelineBar = {
  label: string;
  leftPct: number;
  widthPct: number;
  variant: 'primary' | 'secondary';
};

export type TimelineProps = {
  bars: TimelineBar[];
  /** Vertical guide position (0..100), e.g. a shared gate. */
  guidePct?: number;
  /** Axis labels spread across the bottom. */
  axis: string[];
};

const SECONDARY_TEXT = '#BFE8D6';

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  track: { height: 34, borderRadius: 7 },
  bar: { position: 'absolute', top: 5, bottom: 5, borderRadius: 5, justifyContent: 'center', paddingHorizontal: 9, overflow: 'hidden' },
  barLabel: { fontSize: 10 },
  guide: { position: 'absolute', top: -3, bottom: -3, width: 2 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  axisLabel: { fontSize: 10 },
});

export function Timeline({ bars, guidePct, axis }: TimelineProps) {
  const theme = useTheme();
  const trackStyle: ViewStyle = { backgroundColor: theme.colors.surface };
  const guideStyle: ViewStyle | null =
    guidePct != null ? { left: `${guidePct}%`, backgroundColor: theme.colors.textSecondary } : null;

  return (
    <View>
      <View style={styles.wrap}>
        {bars.map((b, i) => {
          const isPrimary = b.variant === 'primary';
          const barStyle: ViewStyle = {
            left: `${b.leftPct}%`,
            width: `${b.widthPct}%`,
            backgroundColor: isPrimary ? theme.colors.accent : theme.colors.accentDark,
          };
          const labelColor: TextStyle = { color: isPrimary ? theme.colors.onAccent : SECONDARY_TEXT };
          return (
            <View key={`${b.label}${i}`} style={[styles.track, trackStyle]}>
              <View style={[styles.bar, barStyle]}>
                <AppText preset="mono" style={[styles.barLabel, labelColor]} numberOfLines={1}>
                  {b.label}
                </AppText>
              </View>
            </View>
          );
        })}
        {guideStyle ? <View style={[styles.guide, guideStyle]} /> : null}
      </View>
      <View style={styles.axis}>
        {axis.map((a, i) => (
          <AppText key={`a${i}`} preset="mono" color="textSecondary" style={styles.axisLabel}>
            {a}
          </AppText>
        ))}
      </View>
    </View>
  );
}

export default Timeline;
