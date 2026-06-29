/**
 * Theme context + provider.
 *
 * Default mode is DARK (spec: dark is primary for driving). Components read the
 * resolved theme via `useTheme()` and never import raw palettes directly.
 */
import React, { createContext, useContext, useMemo } from 'react';
import {
  colorsByMode,
  radii,
  spacing,
  type,
  type ColorTokens,
  type ThemeMode,
} from './tokens';
import { useStore } from '../store/useStore';

export type Theme = {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  type: typeof type;
};

export type ThemeContextValue = Theme & {
  /** Toggle dark ⇄ light. */
  toggleMode: () => void;
  /** Set an explicit mode. */
  setMode: (mode: ThemeMode) => void;
};

function buildTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: colorsByMode[mode],
    spacing,
    radii,
    type,
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Theme mode is persisted in the store (survives restarts).
  const mode = useStore(s => s.settings.themeMode);
  const setMode = useStore(s => s.setThemeMode);
  const toggleMode = useStore(s => s.toggleThemeMode);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...buildTheme(mode), toggleMode, setMode }),
    [mode, toggleMode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the resolved theme. Throws if used outside <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
