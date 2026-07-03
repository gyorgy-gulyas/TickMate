/** Unified empty / error / loading panel — one look across the app. */
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { Icon, type IconName } from '../icons';
import { useTheme } from '../../theme';

export type StatusViewProps = {
  /** Show a spinner instead of an icon (loading state). */
  loading?: boolean;
  icon?: IconName;
  title: string;
  message?: string;
  /** Optional action (e.g. a Button) shown below. */
  action?: React.ReactNode;
  /** Inline (within scroll content) — no flex fill, tighter padding. */
  inline?: boolean;
};

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48, paddingHorizontal: 28 },
  inline: { flex: undefined, paddingVertical: 26 },
  text: { textAlign: 'center' },
  message: { textAlign: 'center', lineHeight: 19 },
  action: { marginTop: 6, alignSelf: 'stretch' },
});

export function StatusView({ loading, icon, title, message, action, inline }: StatusViewProps) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, inline && styles.inline]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : icon ? (
        <Icon name={icon} size={38} color="textSecondary" />
      ) : null}
      <AppText preset={loading ? 'muted' : 'cardTitleSm'} color={loading ? 'textSecondary' : 'textPrimary'} style={styles.text}>
        {title}
      </AppText>
      {message ? (
        <AppText preset="muted" color="textSecondary" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

export default StatusView;
