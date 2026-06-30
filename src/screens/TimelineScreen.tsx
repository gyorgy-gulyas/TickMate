/** Sections timeline with overlap. Maps to "Szakaszok idővonala". */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Icon, Legend, Timeline } from '../components';
import { TAVASZI_TIMELINE } from '../data/model';
import { useT } from '../i18n';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  note: { lineHeight: 18 },
});

export function TimelineScreen() {
  const t = useT();
  return (
    <Screen title={t('timeline.title')} gap={13} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <AppText preset="muted" color="textSecondary">
        {t('timeline.sub')}
      </AppText>
      <Legend
        items={[
          { color: 'accent', label: t('timeline.legend.section') },
          { color: 'accentDark', label: t('timeline.legend.overlap') },
        ]}
      />
      <Timeline bars={TAVASZI_TIMELINE} guidePct={58} axis={['0', '6', `12 ${t('unit.sec')}`]} />
      <AppText preset="listMeta" color="textSecondary" style={styles.note}>
        {t('timeline.note')}
      </AppText>
    </Screen>
  );
}

export default TimelineScreen;
