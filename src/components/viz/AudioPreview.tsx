/** Generated-audio preview: a waveform pattern with a play button. */
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { AppText } from '../primitives';
import { Icon } from '../icons';
import { useTheme } from '../../theme';

export type AudioPreviewProps = {
  onPlay?: () => void;
  /** Optional duration label (e.g. "12 mp"). */
  duration?: string;
  /** Whether audio is generated; when false the control is shown muted/disabled. */
  ready?: boolean;
};

// Static waveform bar heights (dp) — a calm, audio-like shape.
const BARS = [5, 9, 14, 8, 18, 22, 12, 7, 16, 20, 10, 6, 13, 19, 24, 15, 9, 5, 11, 17, 21, 14, 8, 12, 18, 10, 6, 9, 15, 7];

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 10 },
  play: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  wave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 26, overflow: 'hidden' },
  bar: { width: 2.5, borderRadius: 2 },
});

export function AudioPreview({ onPlay, duration, ready = true }: AudioPreviewProps) {
  const theme = useTheme();
  const container: ViewStyle = { backgroundColor: theme.colors.surface2 };
  const play: ViewStyle = { backgroundColor: ready ? theme.colors.accent : theme.colors.railAlt };

  return (
    <View style={[styles.container, container]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="hang lejátszása"
        disabled={!ready}
        onPress={onPlay}
        style={[styles.play, play]}>
        <Icon name="play" size={15} color={ready ? 'onAccent' : 'textSecondary'} />
      </Pressable>
      <View style={styles.wave}>
        {BARS.map((h, i) => {
          const color = ready ? (i % 4 === 0 ? theme.colors.accent : theme.colors.monoSecondary) : theme.colors.railAlt;
          const bar: ViewStyle = { height: h, backgroundColor: color };
          return <View key={i} style={[styles.bar, bar]} />;
        })}
      </View>
      {duration ? (
        <AppText preset="mono" color={ready ? 'textSecondary' : 'railAlt'}>
          {duration}
        </AppText>
      ) : null}
    </View>
  );
}

export default AudioPreview;
