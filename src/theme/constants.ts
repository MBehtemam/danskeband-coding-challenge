/**
 * Danske Bank Theme Constants
 *
 * Immutable design tokens for the Danske Bank MUI visual design system.
 * Hybrid palette: official brand colors + refined status/severity + warm borders.
 *
 * Feature: 005-danske-brand-theme
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
  ButtonConfig,
  TableTypography,
  DanskeBankTheme,
} from './types';

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
  background: '#FFFFFF',
  surface: '#FFFFFF',
  onPrimary: '#FFFFFF',
  primaryButton: '#0A5EF0',
  primaryButtonHover: '#0852D1',
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
  primary: '#002447',
  muted: '#968d73',
  onLight: '#002346',
} as const;

/**
 * Workflow status colors
 * Updated for 008-layout-filters-fix feature
 * All colors meet WCAG AA contrast requirements (≥4.5:1)
 */
export const STATUS_COLORS: StatusColors = {
  open: {
    background: '#4672c2',
    text: '#FFFFFF',
  },
  inProgress: {
    background: '#bad7f5',
    text: '#002346',
  },
  resolved: {
    background: '#ebece7',
    text: '#002346',
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
 * Updated to match Danske Bank website specifications
 */
export const TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily:
    '"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.22 },
  h2: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.3 },
  h3: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.17 },
  h4: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.3 },
  h5: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.3 },
  h6: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.3 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
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
  borderRadiusButton: 48,
} as const;

/**
 * Button styling configuration
 */
export const BUTTON_CONFIG: ButtonConfig = {
  borderRadius: 48,
  minHeight: 48,
  paddingHorizontal: 24,
  fontSize: '1rem',
  fontWeight: 400,
} as const;

/**
 * Table typography configuration
 */
export const TABLE_TYPOGRAPHY: TableTypography = {
  header: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
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
  button: BUTTON_CONFIG,
  tableTypography: TABLE_TYPOGRAPHY,
} as const;

// =============================================================================
// EXTERNAL RESOURCES
// =============================================================================

/**
 * Google Fonts URL for Play font
 */
export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Play:wght@400;500;700&display=swap';

/**
 * Google Fonts preconnect URLs
 */
export const GOOGLE_FONTS_PRECONNECT = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
] as const;

// =============================================================================
// DARK MODE COLORS (Feature: 009-theme-switcher)
// =============================================================================

/**
 * Dark mode color palette
 * All colors meet WCAG AA contrast requirements (≥4.5:1)
 */
export const DARK_MODE_COLORS = {
  primary: '#009EDC',
  primaryDark: '#0088C7',
  background: '#1a1a1a',
  paper: '#242424',
  surface: '#242424',
  textPrimary: '#FFFFFF',
  textSecondary: '#b3b3b3',
  divider: '#424242',
  primaryButton: '#009EDC',
  primaryButtonHover: '#0088C7',
} as const;

/**
 * Dark mode status colors
 * Adjusted for better contrast on dark backgrounds
 */
export const DARK_STATUS_COLORS = {
  open: {
    background: '#5a8fd9',
    text: '#FFFFFF',
  },
  inProgress: {
    background: '#7ca3d4',
    text: '#002346',
  },
  resolved: {
    background: '#4a4a4a',
    text: '#FFFFFF',
  },
} as const;
