/**
 * Type Contracts: Dark/Light Theme Switcher
 *
 * Feature: 009-theme-switcher
 * Stability: STABLE - No breaking changes allowed
 *
 * These types form the public API for theme state.
 * All consuming code must import from src/types/theme.ts
 */

/**
 * User-selectable theme modes
 *
 * @typedef {'light' | 'dark' | 'system'} ThemeMode
 *
 * @example
 * const mode: ThemeMode = 'light';
 * setMode('dark');
 * setMode('system'); // Defer to OS preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme mode (after system preference resolution)
 *
 * @typedef {'light' | 'dark'} ResolvedThemeMode
 *
 * @description
 * When mode='system', this represents the actual theme being displayed
 * based on the OS preference.
 *
 * @example
 * const mode: ThemeMode = 'system';
 * const systemMode: ResolvedThemeMode = 'dark';
 * const activeMode: ResolvedThemeMode = mode === 'system' ? systemMode : mode;
 */
export type ResolvedThemeMode = 'light' | 'dark';

/**
 * Type guard for ThemeMode validation
 *
 * @param value - Unknown value to check
 * @returns true if value is valid ThemeMode
 *
 * @example
 * const stored = localStorage.getItem('theme-mode');
 * if (isValidThemeMode(stored)) {
 *   setMode(stored); // Type-safe
 * }
 */
export function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Default theme mode when no preference exists
 *
 * @constant
 * @type {ThemeMode}
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

/**
 * localStorage key for theme preference
 *
 * @constant
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'theme-mode';

/**
 * Debounce delay for theme changes (milliseconds)
 *
 * @constant
 * @type {number}
 * @description
 * Prevents excessive re-renders when user rapidly clicks theme switcher
 */
export const THEME_DEBOUNCE_DELAY = 100;

// =============================================================================
// BREAKING CHANGE POLICY
// =============================================================================
//
// ✅ ALLOWED:
// - Adding new theme modes (e.g., 'auto', 'high-contrast')
// - Adding new constants
// - Adding new helper functions
//
// ❌ FORBIDDEN:
// - Removing existing modes ('light', 'dark', 'system')
// - Renaming types (breaks imports)
// - Changing constant values (breaks localStorage compatibility)
//
// =============================================================================
