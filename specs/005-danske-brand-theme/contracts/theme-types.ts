/**
 * Danske Bank Theme Type Definitions
 *
 * TypeScript interfaces for the Danske Bank MUI design system.
 * Hybrid palette combining official brand colors with refined status/severity colors.
 *
 * Feature: 005-danske-brand-theme
 * Generated: 2026-01-14
 */

/**
 * Brand color palette - official Danske Bank colors
 */
export interface BrandColors {
  /** Primary brand color - AppBar, primary buttons (#003755) */
  readonly primary: string;
  /** Primary hover state (#002640) */
  readonly primaryDark: string;
  /** Accent color - secondary buttons, links, focus (#009EDC) */
  readonly accent: string;
  /** Accent hover state (#0088C7) */
  readonly accentDark: string;
  /** Page background - warm Nordic (#F6F4F2) */
  readonly background: string;
  /** Surface color - cards, tables (#FFFFFF) */
  readonly surface: string;
  /** Text on primary/dark backgrounds (#FFFFFF) */
  readonly onPrimary: string;
}

/**
 * Border and divider colors - warm Nordic tones
 */
export interface BorderColors {
  /** Standard border color (#ebece7) */
  readonly default: string;
  /** Warm border for selections (#ccc7b4) */
  readonly warm: string;
  /** Muted surface for hover states (#ebece7) */
  readonly mutedSurface: string;
}

/**
 * Text colors
 */
export interface TextColors {
  /** Primary text color (#222222) */
  readonly primary: string;
  /** Secondary/muted text (#968d73) */
  readonly muted: string;
  /** Dark text for light backgrounds like gold (#002346) */
  readonly onLight: string;
}

/**
 * Workflow status color with text pairing
 */
export interface StatusColor {
  /** Background color */
  readonly background: string;
  /** Text color for contrast */
  readonly text: string;
}

/**
 * Workflow status colors (Open → In Progress → Resolved)
 */
export interface StatusColors {
  /** Open status - blue (#4672c2) */
  readonly open: StatusColor;
  /** In Progress status - gold (#d8b463) */
  readonly inProgress: StatusColor;
  /** Resolved status - green (#144a37) */
  readonly resolved: StatusColor;
}

/**
 * Severity colors (Critical → High → Medium → Low)
 */
export interface SeverityColors {
  /** Critical severity - dark red (#7d3218) */
  readonly critical: StatusColor;
  /** High severity - orange (#cd6e42) */
  readonly high: StatusColor;
  /** Medium severity - gold (#d8b463) */
  readonly medium: StatusColor;
  /** Low severity - green (#144a37) */
  readonly low: StatusColor;
}

/**
 * Typography heading configuration
 */
export interface HeadingConfig {
  /** Font size in rem */
  readonly fontSize: string;
  /** Font weight (400, 600, 700) */
  readonly fontWeight: number;
  /** Line height multiplier */
  readonly lineHeight: number;
}

/**
 * Complete typography configuration
 */
export interface TypographyConfig {
  /** Font family stack with fallbacks */
  readonly fontFamily: string;
  /** Regular weight (400) */
  readonly fontWeightRegular: 400;
  /** Semi-bold weight (600) */
  readonly fontWeightMedium: 600;
  /** Bold weight (700) */
  readonly fontWeightBold: 700;
  /** Heading configurations */
  readonly h1: HeadingConfig;
  readonly h2: HeadingConfig;
  readonly h3: HeadingConfig;
  readonly h4: HeadingConfig;
  readonly body1: HeadingConfig;
  readonly body2: HeadingConfig;
}

/**
 * Spacing scale (8px grid system)
 */
export interface SpacingConfig {
  /** 4px - minimal spacing */
  readonly xs: 4;
  /** 8px - tight spacing */
  readonly sm: 8;
  /** 16px - standard spacing */
  readonly md: 16;
  /** 24px - section spacing */
  readonly lg: 24;
  /** 32px - large gaps */
  readonly xl: 32;
  /** 48px - page-level spacing */
  readonly xxl: 48;
}

/**
 * Border radius configuration
 */
export interface ShapeConfig {
  /** Small radius for buttons, inputs (4px) */
  readonly borderRadiusSmall: 4;
  /** Medium radius for cards (8px) */
  readonly borderRadiusMedium: 8;
}

/**
 * Responsive breakpoints in pixels
 */
export interface BreakpointConfig {
  /** Extra small - mobile portrait (0px) */
  readonly xs: 0;
  /** Small - mobile landscape (600px) */
  readonly sm: 600;
  /** Medium - tablet, navigation collapse (960px) */
  readonly md: 960;
  /** Large - desktop (1280px) */
  readonly lg: 1280;
  /** Extra large - wide desktop (1920px) */
  readonly xl: 1920;
}

/**
 * Complete Danske Bank theme configuration
 */
export interface DanskeBankTheme {
  readonly brand: BrandColors;
  readonly borders: BorderColors;
  readonly text: TextColors;
  readonly status: StatusColors;
  readonly severity: SeverityColors;
  readonly typography: TypographyConfig;
  readonly spacing: SpacingConfig;
  readonly shape: ShapeConfig;
  readonly breakpoints: BreakpointConfig;
}

/**
 * Type guard to validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
