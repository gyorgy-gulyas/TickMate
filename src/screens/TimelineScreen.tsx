/** Sections timeline with overlap. Maps to "Szakaszok idővonala". */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Icon, Legend, Timeline } from '../components';
import { TAVASZI_TIMELINE } from '../data/mock';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  note: { lineHeight: 18 },
});

export function TimelineScreen() {
  return (
    <Screen title="Idővonal" gap={13} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <AppText preset="muted" color="textSecondary">
        Tavaszi Kupa · közös kapu és átfedés
      </AppText>
      <Legend
        items={[
          { color: 'accent', label: 'Szakasz' },
          { color: 'accentDark', label: 'Átfedő' },
        ]}
      />
      <Timeline bars={TAVASZI_TIMELINE} guidePct={58} axis={['0', '6', '12 mp']} />
      <AppText preset="listMeta" color="textSecondary" style={styles.note}>
        A 2. feladat a közös kapunál indul (7 mp), ahol az 1. véget ér. A 3. átfed a többivel — az app két aktív
        időzítést kezel egyszerre.
      </AppText>
    </Screen>
  );
}

export default TimelineScreen;
