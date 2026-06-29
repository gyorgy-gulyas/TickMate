/** Persistence adapter (web: localStorage). Keeps AsyncStorage out of the web bundle. */
import type { StateStorage } from 'zustand/middleware';

const hasLS = typeof localStorage !== 'undefined';

export const storage: StateStorage = {
  getItem: name => (hasLS ? localStorage.getItem(name) : null),
  setItem: (name, value) => {
    if (hasLS) localStorage.setItem(name, value);
  },
  removeItem: name => {
    if (hasLS) localStorage.removeItem(name);
  },
};
