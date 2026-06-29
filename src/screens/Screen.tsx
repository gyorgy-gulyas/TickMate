/** Shared screen frame: themed background + NavBar + scroll body + optional footer. */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBar } from '../components';
import { useTheme } from '../theme';

export type ScreenProps = {
  title: string;
  /** Right-aligned NavBar actions. */
  rightActions?: React.ReactNode;
  /** Show the back caret (default: true when navigation can go back). */
  showBack?: boolean;
  /** Sticky bottom footer (e.g. action buttons). */
  footer?: React.ReactNode;
  /** Gap between body children (default 11). */
  gap?: number;
  /** Disable the ScrollView (for non-scrolling layouts). */
  scroll?: boolean;
  children: React.ReactNode;
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { padding: 18, paddingTop: 16 },
  footer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 16, gap: 10, borderTopWidth: 1 },
});

export function Screen({ title, rightActions, showBack, footer, gap = 11, scroll = true, children }: ScreenProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const canBack = showBack ?? navigation.canGoBack();

  const bg = { backgroundColor: theme.colors.bg };
  const bodyGap = { gap };
  const footerBorder = { borderTopColor: theme.colors.divider };

  const body = scroll ? (
    <ScrollView contentContainerStyle={[styles.body, bodyGap]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, styles.body, bodyGap]}>{children}</View>
  );

  return (
    <View style={[styles.fill, bg]}>
      <NavBar title={title} onBack={canBack ? () => navigation.goBack() : undefined} right={rightActions} />
      {body}
      {footer ? <View style={[styles.footer, footerBorder]}>{footer}</View> : null}
    </View>
  );
}

export default Screen;
