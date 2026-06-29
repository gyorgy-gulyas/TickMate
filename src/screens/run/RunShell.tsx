/** Shared building blocks for the headerless run views. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Chip, Icon } from '../../components';
import { useTheme } from '../../theme';

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', padding: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dist: { fontSize: 12 },
});

export function RunFrame({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export function RunHeader({ chipLabel, chipIcon, dist }: { chipLabel: string; chipIcon?: React.ReactNode; dist: string }) {
  return (
    <View style={styles.header}>
      <Chip label={chipLabel} icon={chipIcon} />
      <AppText preset="mono" color="accentText" style={styles.dist}>
        {dist}
      </AppText>
    </View>
  );
}

export function RunStop({ onPress }: { onPress?: () => void }) {
  return (
    <Button label="STOP" variant="secondary" height={46} icon={<Icon name="stop" size={14} color="textPrimary" />} onPress={onPress} />
  );
}
