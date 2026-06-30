/** Modal confirmation for destructive actions. Works on web + native. */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../primitives';
import { useTheme } from '../../theme';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const SCRIM = 'rgba(0,0,0,0.55)';

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 340, borderRadius: 16, padding: 20, gap: 10 },
  message: { lineHeight: 19 },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const theme = useTheme();
  const overlayBg = { backgroundColor: SCRIM };
  const cardBg = { backgroundColor: theme.colors.surface };
  const cancelStyle = { borderWidth: 1.5, borderColor: theme.colors.borderStrong };
  const confirmStyle = { backgroundColor: theme.colors.danger };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <Pressable style={[styles.overlay, overlayBg]} onPress={onCancel}>
        <Pressable style={[styles.card, cardBg]} onPress={() => {}}>
          <AppText preset="cardTitleSm" color="textPrimary">
            {title}
          </AppText>
          {message ? (
            <AppText preset="muted" color="textSecondary" style={styles.message}>
              {message}
            </AppText>
          ) : null}
          <View style={styles.row}>
            <Pressable accessibilityRole="button" style={[styles.btn, cancelStyle]} onPress={onCancel}>
              <AppText preset="button" color="textPrimary">
                {cancelLabel}
              </AppText>
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.btn, confirmStyle]} onPress={onConfirm}>
              <AppText preset="button" color="onDanger">
                {confirmLabel}
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ConfirmDialog;
