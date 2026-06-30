/**
 * Lightweight i18n. `useT()` reads the persisted language from the store and
 * returns a `t(key, vars?)` function with `{name}` interpolation. No provider —
 * components re-render on language change via the store selector.
 */
import { hu, type StringKey } from './hu';
import { en } from './en';
import { de } from './de';
import { es } from './es';
import { useSettings } from '../store/useStore';
import type { Language, SectionType } from '../data/model';

const DICTS: Record<Language, Record<StringKey, string>> = {
  Magyar: hu,
  English: en,
  Deutsch: de,
  Español: es,
};

export type Vars = Record<string, string | number>;
export type TFunc = (key: StringKey, vars?: Vars) => string;

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function useT(): TFunc {
  const language = useSettings().language;
  const dict = DICTS[language] ?? hu;
  return (key, vars) => interpolate(dict[key] ?? hu[key] ?? key, vars);
}

/** StringKey for a section type's label / short name. */
export function typeKey(type: SectionType, kind: 'label' | 'short' = 'label'): StringKey {
  return (kind === 'label' ? `type.${type}` : `type.${type}.short`) as StringKey;
}

export type { StringKey };
