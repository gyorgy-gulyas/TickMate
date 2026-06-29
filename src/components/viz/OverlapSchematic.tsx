/** Overlap schematic — two stacked section tracks. Uses the exact same visual
 *  language as TypeSchematic (3px track, 4×21 gates, 11px captions, time labels
 *  above) so all type cards look consistent. Shows nested / crossing overlaps. */
import React from 'react';
import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type OverlapTrack = {
  label: string;
  /** Active span start/end as % of the full width. */
  startPct: number;
  endPct: number;
  variant: 'primary' | 'secondary';
  startCap?: string;
  endCap?: string;
  /** Duration label shown above the active span (e.g. "7 mp"). */
  timeLabel?: string;
};

export type OverlapSchematicProps = {
  tracks: OverlapTrack[];
  /** Show a "Gomb" (button) marker at 0% on the first track. */
  showGomb?: boolean;
};

const CAP_W = 44;
const TIME_W = 48;
const AREA_H = 50;
const LINE_TOP = 24; // gate (height 21) is vertically centred on the line

const styles = StyleSheet.create({
  wrap: { gap: 6, paddingTop: 2, paddingBottom: 6 },
  row: { flexDirection: 'row', gap: 10 },
  label: { width: 14, marginTop: LINE_TOP - 8 },
  area: { flex: 1, height: AREA_H },
  track: { position: 'absolute', left: 0, right: 0, top: LINE_TOP, height: 3, borderRadius: 2 },
  span: { position: 'absolute', top: LINE_TOP, height: 3, borderRadius: 2 },
  gate: { position: 'absolute', top: LINE_TOP - 9, width: 4, height: 21, borderRadius: 2, marginLeft: -2 },
  dot: { position: 'absolute', left: 0, top: LINE_TOP - 5, width: 13, height: 13, borderRadius: 7 },
  time: { position: 'absolute', top: 2, width: TIME_W, textAlign: 'center', fontSize: 10 },
  cap: { position: 'absolute', top: LINE_TOP + 13, width: CAP_W, textAlign: 'center' },
  gombCap: { position: 'absolute', left: 0, top: LINE_TOP + 13, width: CAP_W, marginLeft: -CAP_W / 2 + 6, textAlign: 'center' },
});

export function OverlapSchematic({ tracks, showGomb }: OverlapSchematicProps) {
  const theme = useTheme();
  const trackBase: ViewStyle = { backgroundColor: theme.colors.railAlt };
  const gombColor: ViewStyle = { backgroundColor: theme.colors.accent };

  return (
    <View style={styles.wrap}>
      {tracks.map((t, i) => {
        const color = t.variant === 'primary' ? theme.colors.accent : theme.colors.accentDark;
        const span: ViewStyle = { left: `${t.startPct}%`, width: `${Math.max(0, t.endPct - t.startPct)}%`, backgroundColor: color };
        const startGate: ViewStyle = { left: `${t.startPct}%`, backgroundColor: color };
        const endGate: ViewStyle = { left: `${t.endPct}%`, backgroundColor: color };
        const startCap: TextStyle = { left: `${t.startPct}%`, marginLeft: -CAP_W / 2 };
        const endCap: TextStyle = { left: `${t.endPct}%`, marginLeft: -CAP_W / 2 };
        const timeStyle: TextStyle = { left: `${(t.startPct + t.endPct) / 2}%`, marginLeft: -TIME_W / 2 };
        return (
          <View key={`${t.label}${i}`} style={styles.row}>
            <AppText preset="listNum" color="accentText" style={styles.label}>
              {t.label}
            </AppText>
            <View style={styles.area}>
              <View style={[styles.track, trackBase]} />
              <View style={[styles.span, span]} />
              {showGomb && i === 0 ? <View style={[styles.dot, gombColor]} /> : null}
              {showGomb && i === 0 ? (
                <AppText preset="cardSub" color="textSecondary" style={styles.gombCap}>
                  Gomb
                </AppText>
              ) : null}
              <View style={[styles.gate, startGate]} />
              <View style={[styles.gate, endGate]} />
              {t.timeLabel ? (
                <AppText preset="mono" color="monoSecondary" style={[styles.time, timeStyle]}>
                  {t.timeLabel}
                </AppText>
              ) : null}
              <AppText preset="cardSub" color="textSecondary" style={[styles.cap, startCap]}>
                {t.startCap ?? 'Start'}
              </AppText>
              <AppText preset="cardSub" color="textSecondary" style={[styles.cap, endCap]}>
                {t.endCap ?? 'Cél'}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default OverlapSchematic;
