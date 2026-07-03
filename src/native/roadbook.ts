/**
 * "Task from photo": capture/pick a roadbook page, OCR it on-device (ML Kit),
 * and pull out what we can from the text — the section lengths (and times, when
 * printed). We deliberately do NOT interpret the route diagram; the type is
 * inferred only from the count of lengths (2 → shared/"követő") and stays
 * user-editable. Extraction is unit-based (number + unit), not tied to any one
 * event's layout, so different roadbooks still yield their numbers.
 */
import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, type Asset } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import type { Section, SectionType } from '../data/model';

export type RoadbookParse = {
  name: string;
  type: SectionType;
  segments: Section['segments'];
};

function firstAssetUri(assets?: Asset[]): string | null {
  const uri = assets?.[0]?.uri;
  return uri && uri.length > 0 ? uri : null;
}

/** Capture a roadbook photo with the camera. Returns its uri, or null if
 *  cancelled / permission denied. */
export async function captureRoadbookPhoto(): Promise<string | null> {
  if (Platform.OS === 'android') {
    const ok = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (ok !== PermissionsAndroid.RESULTS.GRANTED) return null;
  }
  const res = await launchCamera({ mediaType: 'photo', saveToPhotos: false, quality: 0.9 });
  if (res.didCancel || res.errorCode) return null;
  return firstAssetUri(res.assets);
}

/** Pick a roadbook photo from the gallery. Returns its uri, or null. */
export async function pickRoadbookPhoto(): Promise<string | null> {
  const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.9, selectionLimit: 1 });
  if (res.didCancel || res.errorCode) return null;
  return firstAssetUri(res.assets);
}

/** On-device OCR of an image uri → recognized text (empty string on failure). */
export async function recognizeText(uri: string): Promise<string> {
  try {
    const result = await TextRecognition.recognize(uri);
    return result?.text ?? '';
  } catch {
    return '';
  }
}

/** Unit-based extraction from OCR text: lengths (`N m`) and times (`mm:ss` or
 *  `N s` / `N mp`). Order is left as-is; caller aligns times to legs. */
export function extractNumbers(text: string): { lengths: number[]; times: number[] } {
  const t = text.replace(/,/g, '.');
  const lengths: number[] = [];
  const times: number[] = [];
  let m: RegExpExecArray | null;

  // A number followed by "m" that is NOT the start of another word (mp, min,
  // ms, mm) — i.e. a metre length.
  const lenRe = /(\d+(?:\.\d+)?)\s*m(?![a-z])/gi;
  while ((m = lenRe.exec(t))) lengths.push(parseFloat(m[1]));

  // Times as mm:ss.
  const clockRe = /(\d{1,2}):(\d{2})\b/g;
  while ((m = clockRe.exec(t))) times.push(parseInt(m[1], 10) * 60 + parseInt(m[2], 10));

  // Times as seconds: "N s" / "N mp" / "N sec".
  const secRe = /(\d+(?:\.\d+)?)\s*(?:mp|sec|s)(?![a-z])/gi;
  while ((m = secRe.exec(t))) times.push(parseFloat(m[1]));

  return { lengths, times };
}

/** Build a draft section from OCR text. Two lengths → shared ("követő"); one →
 *  normal. Missing times stay null (must be filled before the run starts). */
export function parseRoadbook(text: string): RoadbookParse {
  const { lengths, times } = extractNumbers(text);
  const used = lengths.slice(0, 2);
  const type: SectionType = used.length >= 2 ? 'shared' : 'normal';
  const legCount = Math.max(1, used.length);
  const segments: Section['segments'] = Array.from({ length: legCount }, (_, i) => ({
    distanceM: used[i] ?? 0,
    timeSec: times[i] ?? null,
  }));
  const firstLine = text.split('\n').map(l => l.trim()).find(l => l.length > 0) ?? '';
  return { name: firstLine.slice(0, 60), type, segments };
}
