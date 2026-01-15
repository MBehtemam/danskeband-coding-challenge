/**
 * Danske Bank Theme Constants
 *
 * Immutable design tokens for the Danske Bank MUI visual design system.
 * Hybrid palette: official brand colors + refined status/severity + warm borders.
 *
 * Feature: 005-danske-brand-theme
 * Generated: 2026-01-14
 */

import type {
  BrandColors,
  BorderColors,
  TextColors,
  StatusColors,
  SeverityColors,
  TypographyConfig,
  SpacingConfig,
  ShapeConfig,
  BreakpointConfig,
  DanskeBankTheme,
} from './theme-types';

// =============================================================================
// COLOR TOKENS
// =============================================================================

/**
 * Official Danske Bank brand colors
 */
export const BRAND_COLORS: BrandColors = {
  primary: '#003755',
  primaryDark: '#002640',
  accent: '#009EDC',
  accentDark: '#0088C7',
  background: '#F6F4F2',
  surface: '#FFFFFF',
  onPrimary: '#FFFFFF',
} as const;

/**
 * Border and divider colors (warm Nordic tones)
 */
export const BORDER_COLORS: BorderColors = {
  default: '#ebece7',
  warm: '#ccc7b4',
  mutedSurface: '#ebece7',
} as const;

/**
 * Text colors
 */
export const TEXT_COLORS: TextColors = {
  primary: '#222222',
  muted: '#968d73',
  onLight: '#002346',
} as const;

/**
 * Workflow status colors
 */
export const STATUS_COLORS: StatusColors = {
  open: {
    background: '#4672c2',
    text: '#FFFFFF',
  },
  inProgress: {
    background: '#d8b463',
    text: '#002346',
  },
  resolved: {
    background: '#144a37',
    text: '#FFFFFF',
  },
} as const;

/**
 * Severity level colors
 */
export const SEVERITY_COLORS: SeverityColors = {
  critical: {
    background: '#7d3218',
    text: '#FFFFFF',
  },
  high: {
    background: '#cd6e42',
    text: '#FFFFFF',
  },
  medium: {
    background: '#d8b463',
    text: '#002346',
  },
  low: {
    background: '#144a37',
    text: '#FFFFFF',
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

/**
 * Typography configuration with Play font
 */
export const TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily:
    '"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
} as const;

// =============================================================================
// SPACING & SHAPE TOKENS
// =============================================================================

/**
 * Spacing scale (8px grid system)
 */
export const SPACING_CONFIG: SpacingConfig = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius configuration
 */
export const SHAPE_CONFIG: ShapeConfig = {
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINT_CONFIG: BreakpointConfig = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// =============================================================================
// COMPLETE THEME OBJECT
// =============================================================================

/**
 * Complete Danske Bank theme configuration
 */
export const DANSKE_BANK_THEME: DanskeBankTheme = {
  brand: BRAND_COLORS,
  borders: BORDER_COLORS,
  text: TEXT_COLORS,
  status: STATUS_COLORS,
  severity: SEVERITY_COLORS,
  typography: TYPOGRAPHY_CONFIG,
  spacing: SPACING_CONFIG,
  shape: SHAPE_CONFIG,
  breakpoints: BREAKPOINT_CONFIG,
} as const;

// =============================================================================
// EXTERNAL RESOURCES
// =============================================================================

/**
 * Google Fonts URL for Play font
 */
export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap';

/**
 * Google Fonts preconnect URLs
 */
export const GOOGLE_FONTS_PRECONNECT = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
] as const;
