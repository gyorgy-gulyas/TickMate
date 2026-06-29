/**
 * Horizontal slider (0..1). Maps to .slider/.sfill/.sknob.
 * Minimal self-contained implementation (PanResponder) — no native dep.
 */
import React, { useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

const styles = StyleSheet.create({
  wrap: { paddingVertical: 9 },
});

export type SliderProps = {
  /** Current value, 0..1. */
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const KNOB = 18;

export function Slider({ value, onChange, disabled, style }: SliderProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);

  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: e => {
        if (widthRef.current > 0) {
          onChange?.(clamp01(e.nativeEvent.locationX / widthRef.current));
        }
      },
      onPanResponderMove: e => {
        if (widthRef.current > 0) {
          onChange?.(clamp01(e.nativeEvent.locationX / widthRef.current));
        }
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  const v = clamp01(value);
  const fillW = width * v;
  const knobLeft = Math.max(0, Math.min(width - KNOB, fillW - KNOB / 2));

  const track: ViewStyle = {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.railAlt,
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };
  const fill: ViewStyle = {
    height: '100%',
    width: fillW,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  };
  const knob: ViewStyle = {
    position: 'absolute',
    left: knobLeft,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.textPrimary,
  };

  return (
    <View onLayout={onLayout} style={[styles.wrap, style]} {...responder.panHandlers}>
      <View style={track}>
        <View style={fill} />
        <View style={knob} />
      </View>
    </View>
  );
}

export default Slider;
