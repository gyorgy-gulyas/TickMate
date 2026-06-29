/** Home "ready" status card. Maps to .hstat (readyBg + tinted tile + dot). */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Dot, IconTile } from '../primitives';

export type ReadyStatusCardProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Show the trailing status dot (default true). */
  showDot?: boolean;
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14 },
  body: { flex: 1 },
});

// Tile background: accent at 14% — matches the design's tinted ready tile.
const TILE_BG = 'rgba(79,185,138,0.14)';

export function ReadyStatusCard({ icon, title, subtitle, showDot = true }: ReadyStatusCardProps) {
  return (
    <Card variant="ready" style={styles.card}>
      {icon ? <IconTile icon={icon} size={38} background={TILE_BG} /> : null}
      <View style={styles.body}>
        <AppText preset="cardTitleSm" color="textPrimary">
          {title}
        </AppText>
        {subtitle ? (
          <AppText preset="cardSub" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {showDot ? <Dot size={8} color="accent" /> : null}
    </Card>
  );
}

export default ReadyStatusCard;
