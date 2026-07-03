/** Task from photo: capture / pick a roadbook page, OCR it, and prefill a new
 *  section (lengths → segments; 2 lengths → "követő"; times when printed, else
 *  left blank to fill before the run). The captured image is stored on the
 *  section. Then hands off to the editor to confirm. Maps to "Feladat fotóból". */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppText, Button, Icon, StatusView } from '../components';
import { useT } from '../i18n';
import { captureRoadbookPhoto, parseRoadbook, pickRoadbookPhoto, recognizeText } from '../native/roadbook';
import { useStore } from '../store/useStore';
import { Screen } from './Screen';
import type { RootNav, RootStackParamList } from '../navigation/types';

const styles = StyleSheet.create({
  intro: { lineHeight: 18 },
});

export function SectionFromPhotoScreen() {
  const navigation = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'SectionFromPhoto'>>();
  const raceId = route.params?.raceId;
  const addSection = useStore(s => s.addSection);
  const updateSection = useStore(s => s.updateSection);
  const t = useT();
  const [busy, setBusy] = useState(false);

  const run = async (getUri: () => Promise<string | null>) => {
    if (!raceId || busy) return;
    setBusy(true);
    try {
      const uri = await getUri();
      if (!uri) return;
      const parsed = parseRoadbook(await recognizeText(uri));
      const id = addSection(raceId);
      updateSection(raceId, id, {
        name: parsed.name || t('editor.title'),
        type: parsed.type,
        prepSec: 5,
        segments: parsed.segments,
        audioReady: false,
        imageUri: uri,
      });
      navigation.replace('SectionEditor', { raceId, sectionId: id });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen title={t('stub.photo')} gap={16} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      {busy ? (
        <StatusView loading title={t('photo.reading')} />
      ) : (
        <>
          <AppText preset="listMeta" color="textSecondary" style={styles.intro}>
            {t('photo.intro')}
          </AppText>
          <Button
            label={t('photo.camera')}
            variant="primary"
            icon={<Icon name="camera" size={16} color="onAccent" />}
            onPress={() => run(captureRoadbookPhoto)}
          />
          <Button
            label={t('photo.gallery')}
            variant="secondary"
            icon={<Icon name="image" size={16} color="textPrimary" />}
            onPress={() => run(pickRoadbookPhoto)}
          />
        </>
      )}
    </Screen>
  );
}

export default SectionFromPhotoScreen;
