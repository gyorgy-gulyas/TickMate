/**
 * Labeled input field. Maps to .field/.flabel/.finput/.funit.
 * Editable when `onChangeText` is provided; otherwise renders a static value box.
 */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { resolveFont, useTheme } from '../../theme';
import { AppText } from './AppText';

const styles = StyleSheet.create({
  container: { gap: 7 },
  adornments: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  unit: { fontFamily: resolveFont('mono', '500'), fontSize: 13 },
});

export type FieldProps = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** Unit suffix (e.g. "mp", "m", "ms"). */
  unit?: string;
  /** Node rendered at the right edge (e.g. an OCR confidence check icon). */
  rightAdornment?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  style?: ViewStyle;
};

export function Field({ label, value, onChangeText, placeholder, unit, rightAdornment, keyboardType, editable, style }: FieldProps) {
  const theme = useTheme();
  const isEditable = editable ?? !!onChangeText;

  const box: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.input,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: 13,
  };
  const valueText: TextStyle = {
    flex: 1,
    fontFamily: resolveFont('ui', '600'),
    fontSize: 15,
    color: theme.colors.textPrimary,
    padding: 0,
  };

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <AppText preset="label" color="textSecondary">
          {label}
        </AppText>
      ) : null}
      <View style={box}>
        {isEditable ? (
          <TextInput
            style={valueText}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType={keyboardType}
          />
        ) : (
          <AppText style={valueText} numberOfLines={1}>
            {value ?? placeholder ?? ''}
          </AppText>
        )}
        <View style={styles.adornments}>
          {unit ? (
            <AppText color="textSecondary" style={styles.unit}>
              {unit}
            </AppText>
          ) : null}
          {rightAdornment}
        </View>
      </View>
    </View>
  );
}

export default Field;
