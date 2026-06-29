/** Per-section deviation bars diverging from a centre line. Maps to
 *  .dvrow/.dvtrack/.dvmid/.dvbar/.dvval. Negative = faster (accent),
 *  positive = slower (slower color). */
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';
import { fmtDelta } from '../../data/model';

export type DivergingItem = {
  name: string;
  /** Delta in seconds; + slower, − faster. */
  delta: number;
};

export type DivergingBarProps = {
  items: DivergingItem[];
};

/** Max half-width of a bar, in % of the track. */
const HALF = 45;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  name: { width: 60 },
  track: { flex: 1, height: 20, borderRadius: 5 },
  mid: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1 },
  bar: { position: 'absolute', top: 4, bottom: 4, borderRadius: 3 },
  value: { width: 46, textAlign: 'right' },
});

export function DivergingBar({ items }: DivergingBarProps) {
  const theme = useTheme();
  const maxAbs = Math.max(0.1, ...items.map(it => Math.abs(it.delta)));
  const midStyle: ViewStyle = { backgroundColor: theme.colors.divider };
  const trackStyle: ViewStyle = { backgroundColor: theme.colors.surface };

  return (
    <View>
      {items.map(it => {
        const w = (Math.abs(it.delta) / maxAbs) * HALF;
        const over = it.delta > 0;
        const barStyle: ViewStyle = {
          left: `${over ? 50 : 50 - w}%`,
          width: `${w}%`,
          backgroundColor: over ? theme.colors.slower : theme.colors.accent,
        };
        return (
          <View key={it.name} style={styles.row}>
            <AppText preset="cardTitleSm" color="textPrimary" style={styles.name} numberOfLines={1}>
              {it.name}
            </AppText>
            <View style={[styles.track, trackStyle]}>
              <View style={[styles.mid, midStyle]} />
              <View style={[styles.bar, barStyle]} />
            </View>
            <AppText preset="mono" color="monoSecondary" style={styles.value}>
              {fmtDelta(it.delta)}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

export default DivergingBar;
