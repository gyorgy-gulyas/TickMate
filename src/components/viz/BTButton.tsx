/** Large circular start control. Maps to .btbtn (116px ring + faint glow). */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type BTButtonProps = {
  label?: string;
  onPress?: () => void;
};

const GLOW = 'rgba(79,185,138,0.08)';

const styles = StyleSheet.create({
  glow: { width: 132, height: 132, borderRadius: 66, backgroundColor: GLOW, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 116, height: 116, borderRadius: 58, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 18, letterSpacing: 1.8 },
});

export function BTButton({ label = 'START', onPress }: BTButtonProps) {
  const theme = useTheme();
  const ring = { borderColor: theme.colors.accent };
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      <View style={styles.glow}>
        <View style={[styles.ring, ring]}>
          <AppText preset="statN" color="accentText" style={styles.label}>
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

export default BTButton;
