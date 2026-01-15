/**
 * Theme Type Definitions
 *
 * Feature: 009-theme-switcher
 * Defines shared types for theme state management
 */

/**
 * User-selectable theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme mode (after system preference resolution)
 */
export type ResolvedThemeMode = 'light' | 'dark';

/**
 * System detected theme mode
 */
export type SystemThemeMode = 'light' | 'dark';

/**
 * Type guard for ThemeMode validation
 */
export function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Default theme mode when no preference exists
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

/**
 * localStorage key for theme preference
 */
export const THEME_STORAGE_KEY = 'theme-mode';

/**
 * Debounce delay for theme changes (milliseconds)
 */
export const THEME_DEBOUNCE_DELAY = 100;
