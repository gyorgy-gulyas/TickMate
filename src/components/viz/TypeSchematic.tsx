/**
 * Section schematic — horizontal track with gate/dot markers and time/caption
 * labels. Maps to .schtrack/.schgate/.schdot/.schtime/.schcap. Pure Views
 * (no SVG): the track width is measured so markers position precisely.
 */
import React, { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';
import { fmtSec } from '../../data/mock';

export type SchematicMarker = {
  pct: number;
  kind: 'dot' | 'gate' | 'sharedGate';
  cap?: string;
};

export type SchematicTime = {
  pct: number;
  label: string;
};

export type TypeSchematicProps = {
  markers: SchematicMarker[];
  times?: SchematicTime[];
  /** Green "active section" span (% range) drawn over the grey prep track. */
  greenFrom?: number;
  greenTo?: number;
};

const TIME_W = 48;
const CAP_W = 76;

const styles = StyleSheet.create({
  wrap: { paddingTop: 24, paddingBottom: 18, paddingHorizontal: 4 },
  track: { height: 3, borderRadius: 2 },
  green: { position: 'absolute', top: 0, height: 3, borderRadius: 2 },
  dot: { position: 'absolute', top: -5, width: 13, height: 13, borderRadius: 7 },
  gate: { position: 'absolute', top: -9, width: 4, height: 21, borderRadius: 2 },
  time: { position: 'absolute', top: -22, width: TIME_W, textAlign: 'center', fontSize: 10 },
  cap: { position: 'absolute', top: 12, width: CAP_W, textAlign: 'center' },
});

export function TypeSchematic({ markers, times = [], greenFrom, greenTo }: TypeSchematicProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const x = (pct: number) => (pct / 100) * width;
  const greenStyle =
    width > 0 && greenFrom != null && greenTo != null
      ? { left: x(greenFrom), width: x(greenTo) - x(greenFrom), backgroundColor: theme.colors.accent }
      : null;

  return (
    <View style={styles.wrap}>
      <View style={[styles.track, { backgroundColor: theme.colors.railAlt }]} onLayout={onLayout}>
        {greenStyle ? <View style={[styles.green, greenStyle]} /> : null}
        {width > 0 &&
          markers.map((m, i) => {
            if (m.kind === 'dot') {
              const s: ViewStyle = { left: x(m.pct) - 6.5, backgroundColor: theme.colors.accent };
              return <View key={`m${i}`} style={[styles.dot, s]} />;
            }
            const color = m.kind === 'sharedGate' ? theme.colors.textPrimary : theme.colors.accent;
            const s: ViewStyle = { left: x(m.pct) - 2, backgroundColor: color };
            return <View key={`m${i}`} style={[styles.gate, s]} />;
          })}

        {width > 0 &&
          times.map((t, i) => {
            const ts = { left: x(t.pct) - TIME_W / 2 };
            return (
              <AppText key={`t${i}`} preset="mono" color="monoSecondary" style={[styles.time, ts]}>
                {t.label}
              </AppText>
            );
          })}

        {width > 0 &&
          markers.map((m, i) => {
            if (!m.cap) return null;
            const cs = { left: x(m.pct) - CAP_W / 2 };
            return (
              <AppText
                key={`c${i}`}
                preset="cardSub"
                color={m.kind === 'sharedGate' ? 'textPrimary' : 'textSecondary'}
                style={[styles.cap, cs]}>
                {m.cap}
              </AppText>
            );
          })}
      </View>
    </View>
  );
}

/** End of the section on the track; the small tail after it stays grey. */
const CEL_PCT = 94;

/** Normal section: Gomb → grey prep → Start → green section → Cél → grey tail. */
export function buildSchematic(prepSec: number, sectionSec: number): TypeSchematicProps {
  const total = prepSec + sectionSec || 1;
  const startPct = (prepSec / total) * CEL_PCT;
  return {
    markers: [
      { pct: 0, kind: 'dot', cap: 'Gomb' },
      { pct: startPct, kind: 'gate', cap: 'Start' },
      { pct: CEL_PCT, kind: 'gate', cap: 'Cél' },
    ],
    times: [
      { pct: startPct / 2, label: `${fmtSec(prepSec)} mp` },
      { pct: startPct + (CEL_PCT - startPct) / 2, label: `${fmtSec(sectionSec)} mp` },
    ],
    greenFrom: startPct,
    greenTo: CEL_PCT,
  };
}

/**
 * Shared (egymást követő) section: prep, then two legs joined at a common gate.
 * Gomb → grey prep → Start → green A → Közös (A end = B start) → green B → Cél → tail.
 */
export function buildSharedSchematic(prepSec: number, timeA: number, timeB: number): TypeSchematicProps {
  const total = prepSec + timeA + timeB || 1;
  const startPct = (prepSec / total) * CEL_PCT; // Start gate (end of prep)
  const kozosPct = ((prepSec + timeA) / total) * CEL_PCT; // Közös gate (A end = B start)
  return {
    markers: [
      { pct: 0, kind: 'dot', cap: 'Gomb' },
      { pct: startPct, kind: 'gate', cap: 'Start' },
      { pct: kozosPct, kind: 'sharedGate', cap: 'Közös' },
      { pct: CEL_PCT, kind: 'gate', cap: 'Cél' },
    ],
    times: [
      { pct: (startPct + kozosPct) / 2, label: `${fmtSec(timeA)} mp` },
      { pct: (kozosPct + CEL_PCT) / 2, label: `${fmtSec(timeB)} mp` },
    ],
    greenFrom: startPct,
    greenTo: CEL_PCT,
  };
}

export default TypeSchematic;
