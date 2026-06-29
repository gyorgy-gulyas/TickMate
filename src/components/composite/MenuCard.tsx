/** Icon tile + title + subtitle + chevron. Maps to .mcard. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card, IconTile } from '../primitives';
import { Chevron } from './Chevron';

export type MenuCardProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  /** Override the right affordance (default: chevron). */
  right?: React.ReactNode;
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, paddingHorizontal: 16 },
  body: { flex: 1 },
  sub: { marginTop: 3 },
});

export function MenuCard({ icon, title, subtitle, onPress, right }: MenuCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        {icon ? <IconTile icon={icon} /> : null}
        <View style={styles.body}>
          <AppText preset="cardTitle" color="textPrimary">
            {title}
          </AppText>
          {subtitle ? (
            <AppText preset="cardSub" color="textSecondary" style={styles.sub}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right ?? <Chevron />}
      </Card>
    </Pressable>
  );
}

export default MenuCard;
