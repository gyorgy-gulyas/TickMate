/**
 * Section schematic — horizontal track with gate/dot markers and time/caption
 * labels. Maps to .schtrack/.schgate/.schdot/.schtime/.schcap. Pure Views
 * (no SVG): the track width is measured so markers position precisely.
 */
import React, { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';
import { fmtSec, type SectionType } from '../../data/mock';

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
};

const TIME_W = 48;
const CAP_W = 76;

const styles = StyleSheet.create({
  wrap: { paddingTop: 24, paddingBottom: 18, paddingHorizontal: 4 },
  track: { height: 3, borderRadius: 2 },
  dot: { position: 'absolute', top: -5, width: 13, height: 13, borderRadius: 7 },
  gate: { position: 'absolute', top: -9, width: 4, height: 21, borderRadius: 2 },
  time: { position: 'absolute', top: -22, width: TIME_W, textAlign: 'center', fontSize: 10 },
  cap: { position: 'absolute', top: 12, width: CAP_W, textAlign: 'center' },
});

export function TypeSchematic({ markers, times = [] }: TypeSchematicProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const x = (pct: number) => (pct / 100) * width;

  return (
    <View style={styles.wrap}>
      <View style={[styles.track, { backgroundColor: theme.colors.railAlt }]} onLayout={onLayout}>
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

/** Build a normal/shared schematic from a section's prep + section times. */
export function buildSchematic(type: Exclude<SectionType, 'overlap'>, prepSec: number, sectionSec: number): TypeSchematicProps {
  const total = prepSec + sectionSec || 1;
  const startPct = (prepSec / total) * 100;
  const shared = type === 'shared';
  return {
    markers: [
      { pct: 0, kind: 'dot', cap: 'Gomb' },
      { pct: startPct, kind: shared ? 'sharedGate' : 'gate', cap: shared ? 'Közös' : 'Start' },
      { pct: 100, kind: 'gate', cap: 'Cél' },
    ],
    times: [
      { pct: startPct / 2, label: `${fmtSec(prepSec)} mp` },
      { pct: startPct + (100 - startPct) / 2, label: `${fmtSec(sectionSec)} mp` },
    ],
  };
}

export default TypeSchematic;
