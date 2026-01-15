/**
 * Hook Contract: useThemeMode
 *
 * Feature: 009-theme-switcher
 * Stability: STABLE - Return type can be extended, signature immutable
 *
 * This contract defines the custom React hook for theme state access.
 */

import type { ThemeMode, ResolvedThemeMode } from './types-contract';

/**
 * useThemeMode hook return value
 *
 * @interface UseThemeModeReturn
 *
 * @description
 * Provides theme state and control methods.
 * Must be called within ThemeContextProvider.
 */
export interface UseThemeModeReturn {
  /**
   * Current user-selected theme mode
   *
   * @type {ThemeMode}
   * @readonly
   */
  readonly mode: ThemeMode;

  /**
   * Function to change theme mode
   *
   * @param {ThemeMode} newMode - New mode to apply
   * @returns {void}
   *
   * @description
   * Debounced with 100ms delay.
   * Safe to call multiple times rapidly.
   */
  setMode: (newMode: ThemeMode) => void;

  /**
   * Detected OS theme preference
   *
   * @type {ResolvedThemeMode}
   * @readonly
   */
  readonly systemMode: ResolvedThemeMode;
}

// =============================================================================
// HOOK SIGNATURE
// =============================================================================

/**
 * Custom hook for theme mode management
 *
 * @hook
 * @returns {UseThemeModeReturn} Theme state and controls
 * @throws {Error} If called outside ThemeContextProvider
 *
 * @example
 * // Basic usage
 * function MyComponent() {
 *   const { mode, setMode } = useThemeMode();
 *
 *   return (
 *     <button onClick={() => setMode('dark')}>
 *       Current: {mode}
 *     </button>
 *   );
 * }
 *
 * @example
 * // Toggle between light and dark
 * function ThemeToggle() {
 *   const { mode, setMode, systemMode } = useThemeMode();
 *
 *   const activeMode = mode === 'system' ? systemMode : mode;
 *   const nextMode = activeMode === 'light' ? 'dark' : 'light';
 *
 *   return (
 *     <button onClick={() => setMode(nextMode)}>
 *       {activeMode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
 *     </button>
 *   );
 * }
 *
 * @example
 * // Conditional rendering based on theme
 * function ThemedIcon() {
 *   const { mode, systemMode } = useThemeMode();
 *   const isDark = (mode === 'system' ? systemMode : mode) === 'dark';
 *
 *   return isDark ? <DarkModeIcon /> : <LightModeIcon />;
 * }
 */
export type UseThemeModeHook = () => UseThemeModeReturn;

// =============================================================================
// USAGE PATTERNS
// =============================================================================

/**
 * Pattern 1: Simple toggle
 *
 * @example
 * const { mode, setMode } = useThemeMode();
 * const toggle = () => setMode(mode === 'light' ? 'dark' : 'light');
 */

/**
 * Pattern 2: Respecting system preference
 *
 * @example
 * const { mode, setMode, systemMode } = useThemeMode();
 * const activeMode = mode === 'system' ? systemMode : mode;
 * const toggle = () => setMode(activeMode === 'light' ? 'dark' : 'light');
 */

/**
 * Pattern 3: Three-way toggle (light → dark → system → light)
 *
 * @example
 * const { mode, setMode } = useThemeMode();
 * const cycle = () => {
 *   if (mode === 'light') setMode('dark');
 *   else if (mode === 'dark') setMode('system');
 *   else setMode('light');
 * };
 */

// =============================================================================
// BEHAVIOR SPECIFICATION
// =============================================================================

/**
 * Hook initialization
 *
 * 1. Component mounts and calls useThemeMode()
 * 2. Hook reads from ThemeContext
 * 3. If context undefined → throw Error
 * 4. If context valid → return current state
 * 5. Component re-renders when context updates
 */

/**
 * setMode() call
 *
 * 1. User calls setMode('dark')
 * 2. Function is debounced (100ms delay)
 * 3. If rapid calls → only last call executes
 * 4. Context state updates
 * 5. Hook returns new mode immediately (React state)
 * 6. localStorage persistence happens asynchronously
 * 7. All components using hook re-render
 */

/**
 * System preference change
 *
 * 1. OS theme changes
 * 2. Context detects change via media query listener
 * 3. systemMode updates in context
 * 4. Hook returns new systemMode
 * 5. Components re-render with new value
 * 6. If mode='system', active theme changes
 */

// =============================================================================
// ERROR CASES
// =============================================================================

/**
 * Error: Hook used outside provider
 *
 * @throws {Error} "useThemeMode must be used within ThemeContextProvider"
 *
 * WHEN:
 * - Component calls useThemeMode() without ThemeContextProvider ancestor
 *
 * HANDLING:
 * - Development: React throws immediately, visible in console
 * - Production: Error boundary catches (if configured)
 *
 * PREVENTION:
 * - Always wrap app root with ThemeContextProvider
 */

/**
 * Error: Invalid mode passed to setMode
 *
 * BEHAVIOR:
 * - TypeScript prevents at compile time
 * - If runtime JS call with invalid value, no type check
 * - Value stored as-is (localStorage accepts any string)
 * - On next load, invalid value treated as missing → defaults to 'light'
 *
 * RECOMMENDATION:
 * - Use TypeScript to enforce type safety
 * - Validate external input before calling setMode()
 */

// =============================================================================
// PERFORMANCE CONTRACT
// =============================================================================

/**
 * Re-render behavior
 *
 * TRIGGERS:
 * - mode changes → All consumers re-render
 * - systemMode changes → All consumers re-render
 * - setMode identity stable → No re-renders from function reference change
 *
 * OPTIMIZATIONS:
 * - setMode wrapped in useCallback → stable reference
 * - Debouncing prevents rapid successive re-renders
 * - Context value memoized → minimal re-render overhead
 *
 * EXPECTED FREQUENCY:
 * - mode changes: 1-5 times per session (user-initiated)
 * - systemMode changes: 0-2 times per session (OS-initiated)
 * - Total re-renders: <10 per session
 */

// =============================================================================
// TESTING CONTRACT
// =============================================================================

/**
 * Test Requirements
 *
 * UNIT TESTS:
 * 1. ✓ Hook returns initial mode from localStorage
 * 2. ✓ Hook defaults to 'light' when localStorage empty
 * 3. ✓ setMode updates mode correctly
 * 4. ✓ setMode persists to localStorage
 * 5. ✓ setMode is debounced (100ms)
 * 6. ✓ Hook throws when used outside provider
 * 7. ✓ systemMode reflects prefers-color-scheme
 * 8. ✓ systemMode updates when media query changes
 * 9. ✓ localStorage errors handled gracefully
 *
 * INTEGRATION TESTS:
 * 1. ✓ Theme changes apply to all components
 * 2. ✓ Theme persists across page reloads
 * 3. ✓ System preference respected when mode='system'
 */

/**
 * Test Utilities
 *
 * @example
 * // Mock ThemeContext for testing components
 * const mockUseThemeMode = () => ({
 *   mode: 'light',
 *   setMode: vi.fn(),
 *   systemMode: 'light',
 * });
 *
 * @example
 * // Render component with ThemeContext
 * const { result } = renderHook(() => useThemeMode(), {
 *   wrapper: ThemeContextProvider,
 * });
 *
 * expect(result.current.mode).toBe('light');
 * act(() => result.current.setMode('dark'));
 * expect(result.current.mode).toBe('dark');
 */

// =============================================================================
// BREAKING CHANGE POLICY
// =============================================================================
//
// ✅ ALLOWED:
// - Adding new optional fields to UseThemeModeReturn
// - Adding new helper methods
// - Improving performance without API changes
//
// ❌ FORBIDDEN:
// - Removing or renaming existing fields
// - Changing return type structure
// - Changing error throwing behavior
// - Adding required parameters
//
// =============================================================================
