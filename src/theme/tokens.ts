/**
 * TickMate design tokens.
 *
 * Source of truth: docs/COMPONENT_PLAN.md (§1 dark tokens, §6 derived light palette).
 * Components consume only the SEMANTIC color names below (e.g. `colors.surface`,
 * `colors.accentText`) so that switching mode is a single ThemeProvider concern.
 */

export type ThemeMode = 'dark' | 'light';

/** Semantic color roles. Same keys for both modes. */
export type ColorTokens = {
  /** App background */
  bg: string;
  /** Elevated surface (card) */
  surface: string;
  /** Secondary surface (chip, input, icon tile) */
  surface2: string;
  /** Switch / slider rail */
  railAlt: string;
  /** Primary text */
  textPrimary: string;
  /** Secondary / muted text */
  textSecondary: string;
  /** Mono secondary (numbers) */
  monoSecondary: string;
  /** Green accent — fills (button bg, progress, toggle on) */
  accent: string;
  /** Green used as TEXT/ICON (needs darker green on light bg for AA contrast) */
  accentText: string;
  /** Darker accent — overlap secondary bar, accent overlay */
  accentDark: string;
  /** Text/icon on top of an accent fill */
  onAccent: string;
  /** "Ready" status card background + border */
  readyBg: string;
  readyBorder: string;
  /** Analysis: slower-than-target */
  slower: string;
  /** Hairline divider */
  divider: string;
  /** Subtle border (inputs, cards) */
  border: string;
  /** Stronger border (secondary/outline button) */
  borderStrong: string;
  /** Brightest numerals (big run counter) */
  numBright: string;
};

export const darkColors: ColorTokens = {
  bg: '#13151A',
  surface: '#1B1E23',
  surface2: '#23272E',
  railAlt: '#2A2F36',
  textPrimary: '#E9ECE9',
  textSecondary: '#8A938D',
  monoSecondary: '#C3CCC6',
  accent: '#4FB98A',
  accentText: '#4FB98A',
  accentDark: '#2C5F49',
  onAccent: '#0F1113',
  readyBg: '#15241D',
  readyBorder: 'rgba(79,185,138,0.22)',
  slower: '#CAA24A',
  divider: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  numBright: '#F1F4F1',
};

export const lightColors: ColorTokens = {
  bg: '#F4F6F4',
  surface: '#FFFFFF',
  surface2: '#E9EDE9',
  railAlt: '#D8DDD8',
  textPrimary: '#16191C',
  textSecondary: '#5B635D',
  monoSecondary: '#434A45',
  accent: '#4FB98A',
  accentText: '#2C5F49',
  accentDark: '#2C5F49',
  onAccent: '#0F1113',
  readyBg: '#E4F3EB',
  readyBorder: 'rgba(44,95,73,0.28)',
  slower: '#9A7521',
  divider: 'rgba(0,0,0,0.08)',
  border: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',
  numBright: '#16191C',
};

export const colorsByMode: Record<ThemeMode, ColorTokens> = {
  dark: darkColors,
  light: lightColors,
};

/**
 * Spacing scale (dp). The design uses 18 content side-padding, 11–16 element gaps.
 * Values map 1:1 to the raw px from the 300×640 reference — take proportions, not px.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 11,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
} as const;

/** Corner radii (dp). */
export const radii = {
  chip: 8,
  input: 12,
  tile: 11,
  button: 13,
  card: 14,
  statCard: 16,
  pill: 20,
  phone: 42,
  full: 999,
} as const;

/**
 * Font families. NOTE: these must be bundled (next build step — expo-font / assets
 * + react-native.config.js). Until linked, RN falls back to the system font.
 */
export const fonts = {
  /** UI text — Hanken Grotesk */
  ui: 'HankenGrotesk',
  /** Numbers + button labels — JetBrains Mono (tabular feel) */
  mono: 'JetBrainsMono',
} as const;

/** Weight values usable as fontWeight. Hanken: 500/600/700/800, Mono: 500/700/800. */
export const weights = {
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export type TextPreset = {
  fontFamily: string;
  fontSize: number;
  fontWeight: '500' | '600' | '700' | '800';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'uppercase' | 'none';
};

/**
 * Typography presets (color applied separately by the component).
 * letterSpacing converted from CSS em → dp at the given font size (em × size).
 */
export const type = {
  navTitle: { fontFamily: fonts.ui, fontSize: 16, fontWeight: '700' },
  cardTitle: { fontFamily: fonts.ui, fontSize: 16, fontWeight: '700' },
  cardTitleSm: { fontFamily: fonts.ui, fontSize: 14, fontWeight: '700' },
  cardSub: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  listName: { fontFamily: fonts.ui, fontSize: 15, fontWeight: '700' },
  listMeta: { fontFamily: fonts.ui, fontSize: 12, fontWeight: '600' },
  // Field label — 11/700 uppercase +.1em
  label: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
  muted: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '600', letterSpacing: 0.44 },
  // Phase — 13/700 uppercase +.24em (accent color applied by component)
  phase: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '700', letterSpacing: 3.12, textTransform: 'uppercase' },
  gate: { fontFamily: fonts.ui, fontSize: 14, fontWeight: '700', letterSpacing: 0.84 },
  // Button — 13/700 mono uppercase +.09em
  button: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '700', letterSpacing: 1.17, textTransform: 'uppercase' },
  // Big run counter — 84/800 mono -.03em
  bigNum: { fontFamily: fonts.mono, fontSize: 84, fontWeight: '800', letterSpacing: -2.52 },
  bigUnit: { fontFamily: fonts.mono, fontSize: 22, fontWeight: '700' },
  // Stat number — 30/800 mono
  statN: { fontFamily: fonts.mono, fontSize: 30, fontWeight: '800' },
  statUnit: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '700' },
  // Section list mono value
  mono: { fontFamily: fonts.mono, fontSize: 14, fontWeight: '700' },
  // List number (mono, accent)
  listNum: { fontFamily: fonts.mono, fontSize: 15, fontWeight: '800' },
  // Watch face number — 46/800 mono
  watchNum: { fontFamily: fonts.mono, fontSize: 46, fontWeight: '800' },
} satisfies Record<string, TextPreset>;

export type TypePreset = keyof typeof type;
