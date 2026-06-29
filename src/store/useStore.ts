/** Global app state (races + settings) with persistence. */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import {
  DEFAULT_SETTINGS,
  INITIAL_RACES,
  INITIAL_RUNS,
  snapshotResults,
  type Race,
  type Run,
  type Section,
  type Settings,
  type ThemeMode,
} from '../data/model';

let idCounter = 0;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`;
}

export function emptySection(): Section {
  return { id: newId('s'), name: '', type: 'normal', prepSec: 5, segments: [{ distanceM: 0, timeSec: 7 }], audioReady: false };
}

type AppState = {
  races: Race[];
  runs: Run[];
  settings: Settings;
  // race actions
  addRace: () => string;
  updateRace: (id: string, patch: Partial<Race>) => void;
  deleteRace: (id: string) => void;
  // run (result) actions — one run per race
  closeRace: (raceId: string) => string;
  setRunActual: (runId: string, sectionIndex: number, legIndex: number, actualSec: number | null) => void;
  setRunNote: (runId: string, note: string) => void;
  // section actions
  addSection: (raceId: string) => string;
  updateSection: (raceId: string, sectionId: string, patch: Partial<Section>) => void;
  deleteSection: (raceId: string, sectionId: string) => void;
  /** Mark every section's audio in a race as generated. */
  regenerateRaceAudio: (raceId: string) => void;
  // settings
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      races: INITIAL_RACES,
      runs: INITIAL_RUNS,
      settings: DEFAULT_SETTINGS,

      addRace: () => {
        const id = newId('r');
        const race: Race = { id, name: 'Új verseny', date: '', sections: [] };
        set(s => ({ races: [race, ...s.races] }));
        return id;
      },
      updateRace: (id, patch) => set(s => ({ races: s.races.map(r => (r.id === id ? { ...r, ...patch } : r)) })),
      deleteRace: id =>
        set(s => ({ races: s.races.filter(r => r.id !== id), runs: s.runs.filter(r => r.raceId !== id) })),

      closeRace: raceId => {
        const { races, runs } = get();
        const race = races.find(r => r.id === raceId);
        if (!race) return '';
        const prev = runs.find(run => run.raceId === raceId);
        const id = prev?.id ?? newId('run');
        const run: Run = { id, raceId, raceName: race.name, date: race.date, note: prev?.note ?? '', results: snapshotResults(race, prev) };
        set(s => ({ runs: [run, ...s.runs.filter(r => r.id !== id)] }));
        return id;
      },
      setRunActual: (runId, si, li, actualSec) =>
        set(s => ({
          runs: s.runs.map(run =>
            run.id === runId
              ? {
                  ...run,
                  results: run.results.map((sec, i) =>
                    i === si ? { ...sec, legs: sec.legs.map((leg, j) => (j === li ? { ...leg, actualSec } : leg)) } : sec,
                  ),
                }
              : run,
          ),
        })),
      setRunNote: (runId, note) => set(s => ({ runs: s.runs.map(run => (run.id === runId ? { ...run, note } : run)) })),

      addSection: raceId => {
        const sec = emptySection();
        set(s => ({ races: s.races.map(r => (r.id === raceId ? { ...r, sections: [...r.sections, sec] } : r)) }));
        return sec.id;
      },
      updateSection: (raceId, sectionId, patch) =>
        set(s => ({
          races: s.races.map(r =>
            r.id === raceId
              ? { ...r, sections: r.sections.map(sec => (sec.id === sectionId ? { ...sec, ...patch } : sec)) }
              : r,
          ),
        })),
      deleteSection: (raceId, sectionId) =>
        set(s => ({
          races: s.races.map(r => (r.id === raceId ? { ...r, sections: r.sections.filter(sec => sec.id !== sectionId) } : r)),
        })),
      regenerateRaceAudio: raceId =>
        set(s => ({
          races: s.races.map(r =>
            r.id === raceId ? { ...r, sections: r.sections.map(sec => ({ ...sec, audioReady: true })) } : r,
          ),
        })),

      setSetting: (key, value) => set(s => ({ settings: { ...s.settings, [key]: value } })),
      setThemeMode: mode => set(s => ({ settings: { ...s.settings, themeMode: mode } })),
      toggleThemeMode: () =>
        set(s => ({ settings: { ...s.settings, themeMode: s.settings.themeMode === 'dark' ? 'light' : 'dark' } })),
    }),
    {
      name: 'tickmate-store',
      // v3: sections now use a segments[] model — re-seed races, keep settings.
      version: 3,
      storage: createJSONStorage(() => storage),
      migrate: persisted => {
        const prev = (persisted ?? {}) as { settings?: Partial<Settings> };
        return {
          races: INITIAL_RACES,
          settings: { ...DEFAULT_SETTINGS, ...(prev.settings ?? {}) },
        } as unknown as AppState;
      },
    },
  ),
);

// --- Selectors ---
export const useRaces = () => useStore(s => s.races);
export const useRace = (id?: string) => useStore(s => s.races.find(r => r.id === id) ?? s.races[0]);
export const useSettings = () => useStore(s => s.settings);
export const useRuns = () => useStore(s => s.runs);
export const useRunById = (id?: string) => useStore(s => s.runs.find(r => r.id === id));
export const useRunByRace = (raceId?: string) => useStore(s => s.runs.find(r => r.raceId === raceId));
