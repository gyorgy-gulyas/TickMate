/**
 * Theme context + provider.
 *
 * Default mode is DARK (spec: dark is primary for driving). Components read the
 * resolved theme via `useTheme()` and never import raw palettes directly.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  colorsByMode,
  radii,
  spacing,
  type,
  fonts,
  weights,
  type ColorTokens,
  type ThemeMode,
} from './tokens';

export type Theme = {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  type: typeof type;
  fonts: typeof fonts;
  weights: typeof weights;
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
    fonts,
    weights,
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: React.ReactNode;
  /** Initial mode; defaults to 'dark'. */
  initialMode?: ThemeMode;
};

export function ThemeProvider({ children, initialMode = 'dark' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...buildTheme(mode), toggleMode, setMode }),
    [mode, toggleMode],
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
