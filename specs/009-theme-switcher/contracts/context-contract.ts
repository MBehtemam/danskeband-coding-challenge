/**
 * Context Contract: ThemeContext API
 *
 * Feature: 009-theme-switcher
 * Stability: STABLE - No breaking changes allowed
 *
 * This contract defines the React Context API for theme state management.
 */

import type { ThemeMode, ResolvedThemeMode } from './types-contract';

/**
 * ThemeContext value shape
 *
 * @interface ThemeContextValue
 *
 * @description
 * Provides theme state and controls to consuming components.
 * Must be accessed via useThemeMode() hook, not directly.
 */
export interface ThemeContextValue {
  /**
   * Current user-selected theme mode
   *
   * @type {ThemeMode}
   * @readonly
   *
   * @description
   * Can be 'light', 'dark', or 'system'.
   * When 'system', actual displayed theme determined by systemMode.
   */
  readonly mode: ThemeMode;

  /**
   * Function to update theme mode
   *
   * @param {ThemeMode} newMode - New theme mode to apply
   * @returns {void}
   *
   * @description
   * Internally debounced with 100ms delay.
   * Updates React state immediately but persists to localStorage after debounce.
   * Does not throw on localStorage errors (fails silently).
   *
   * @example
   * setMode('dark');
   * setMode('system');
   */
  setMode: (newMode: ThemeMode) => void;

  /**
   * Detected operating system theme preference
   *
   * @type {ResolvedThemeMode}
   * @readonly
   *
   * @description
   * Automatically updated when OS theme changes.
   * Always 'light' or 'dark' (never 'system').
   * Defaults to 'light' if prefers-color-scheme unsupported.
   *
   * @example
   * // If mode='system' and systemMode='dark', active theme is dark
   * const activeMode = mode === 'system' ? systemMode : mode;
   */
  readonly systemMode: ResolvedThemeMode;
}

/**
 * ThemeContext provider props
 *
 * @interface ThemeContextProviderProps
 */
export interface ThemeContextProviderProps {
  /**
   * Child components to wrap with theme context
   */
  children: React.ReactNode;
}

// =============================================================================
// USAGE CONTRACT
// =============================================================================

/**
 * Provider component signature
 *
 * @component
 * @param {ThemeContextProviderProps} props - Provider props
 * @returns {JSX.Element}
 *
 * @example
 * // Wrap app root with provider
 * <ThemeContextProvider>
 *   <App />
 * </ThemeContextProvider>
 */
export type ThemeContextProviderComponent = React.FC<ThemeContextProviderProps>;

/**
 * Hook signature
 *
 * @hook
 * @returns {ThemeContextValue}
 * @throws {Error} If used outside ThemeContextProvider
 *
 * @example
 * function MyComponent() {
 *   const { mode, setMode, systemMode } = useThemeMode();
 *
 *   return (
 *     <button onClick={() => setMode('dark')}>
 *       Current: {mode}
 *     </button>
 *   );
 * }
 */
export type UseThemeModeHook = () => ThemeContextValue;

// =============================================================================
// BEHAVIOR CONTRACT
// =============================================================================

/**
 * Context initialization behavior
 *
 * 1. Provider mounts
 * 2. Attempts to read localStorage['theme-mode']
 * 3. If found and valid → sets initial mode
 * 4. If not found or invalid → defaults to 'light'
 * 5. If localStorage throws → defaults to 'light'
 * 6. Registers prefers-color-scheme listener
 * 7. Sets initial systemMode from media query
 */

/**
 * setMode() behavior
 *
 * 1. User calls setMode('dark')
 * 2. Debounced function queued (100ms delay)
 * 3. If another call within 100ms → previous call cancelled
 * 4. After 100ms → React state updated
 * 5. Attempts to persist to localStorage['theme-mode']
 * 6. If localStorage throws → silent fail, state still updated
 * 7. Context consumers re-render with new mode
 */

/**
 * System preference change behavior
 *
 * 1. OS theme changes (e.g., macOS auto dark mode at sunset)
 * 2. window.matchMedia fires 'change' event
 * 3. systemMode state updates ('light' or 'dark')
 * 4. If mode='system' → active theme changes automatically
 * 5. If mode='light' or 'dark' → no change (explicit preference overrides)
 * 6. ThemeProvider receives new theme object
 * 7. All components re-render with new theme
 */

// =============================================================================
// ERROR HANDLING CONTRACT
// =============================================================================

/**
 * localStorage unavailable (private browsing, disabled cookies)
 *
 * BEHAVIOR:
 * - Initial load: Defaults to 'light'
 * - setMode(): Updates React state successfully but doesn't persist
 * - No user-visible error
 * - Console warning logged: "localStorage unavailable, theme will not persist"
 */

/**
 * Invalid stored value (corrupted localStorage)
 *
 * BEHAVIOR:
 * - Treats as missing value
 * - Defaults to 'light'
 * - No user-visible error
 * - Console warning logged: "Invalid theme mode, using default"
 */

/**
 * Hook used outside provider
 *
 * BEHAVIOR:
 * - Throws Error: "useThemeMode must be used within ThemeContextProvider"
 * - React error boundary catches (if configured)
 * - Fails fast during development
 */

// =============================================================================
// BREAKING CHANGE POLICY
// =============================================================================
//
// ✅ ALLOWED:
// - Adding new optional fields to ThemeContextValue
// - Adding new methods (e.g., resetMode(), getActiveMode())
// - Extending behavior (e.g., cross-tab synchronization)
//
// ❌ FORBIDDEN:
// - Removing or renaming existing fields
// - Changing method signatures
// - Making optional fields required
// - Changing error throwing behavior
//
// =============================================================================
