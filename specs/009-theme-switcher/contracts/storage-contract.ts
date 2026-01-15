/**
 * Storage Contract: localStorage Interface
 *
 * Feature: 009-theme-switcher
 * Stability: INTERNAL - Implementation detail, can change freely
 *
 * This contract defines how theme preferences are persisted to browser storage.
 * Marked as internal because external code should use useThemeMode(), not access storage directly.
 */

import type { ThemeMode } from './types-contract';

/**
 * localStorage key for theme preference
 *
 * @constant
 * @type {string}
 */
export const STORAGE_KEY = 'theme-mode';

/**
 * Storage value type
 *
 * @description
 * localStorage stores string values only.
 * ThemeMode values serialized as-is ('light', 'dark', 'system').
 */
export type StorageValue = string;

// =============================================================================
// STORAGE OPERATIONS
// =============================================================================

/**
 * Load theme preference from storage
 *
 * @function loadThemePreference
 * @returns {ThemeMode | null} Stored theme mode, or null if not found/unavailable
 *
 * @throws Never throws - all errors caught and handled internally
 *
 * @description
 * Attempts to read from localStorage.
 * Returns null on any error (unavailable, corrupted, etc.).
 * Caller responsible for defaulting to 'light'.
 *
 * @example
 * const stored = loadThemePreference();
 * const mode = stored ?? DEFAULT_THEME_MODE;
 */
export function loadThemePreference(): ThemeMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    // Invalid value treated as missing
    return null;
  } catch (error) {
    // localStorage unavailable (private browsing, disabled, quota exceeded, etc.)
    console.warn('Failed to load theme preference from localStorage:', error);
    return null;
  }
}

/**
 * Save theme preference to storage
 *
 * @function saveThemePreference
 * @param {ThemeMode} mode - Theme mode to persist
 * @returns {boolean} true if saved successfully, false if storage unavailable
 *
 * @throws Never throws - all errors caught and handled internally
 *
 * @description
 * Attempts to write to localStorage.
 * Silent failure if storage unavailable.
 * Caller does NOT need to check return value (theme works without persistence).
 *
 * @example
 * saveThemePreference('dark');
 * // Theme applied regardless of storage success
 */
export function saveThemePreference(mode: ThemeMode): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    return true;
  } catch (error) {
    // localStorage unavailable or quota exceeded
    console.warn('Failed to save theme preference to localStorage:', error);
    return false;
  }
}

/**
 * Clear theme preference from storage
 *
 * @function clearThemePreference
 * @returns {boolean} true if cleared successfully, false if storage unavailable
 *
 * @description
 * Removes theme-mode key from localStorage.
 * Used for testing or reset functionality.
 *
 * @example
 * clearThemePreference();
 * // On next load, defaults to 'light'
 */
export function clearThemePreference(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Failed to clear theme preference from localStorage:', error);
    return false;
  }
}

// =============================================================================
// ERROR SCENARIOS
// =============================================================================

/**
 * Error: localStorage unavailable
 *
 * CAUSES:
 * - Private browsing mode (Safari, Firefox)
 * - Third-party cookies disabled
 * - Storage quota exceeded
 * - Browser security policy
 * - Incognito mode (Chrome, Edge)
 *
 * BEHAVIOR:
 * - loadThemePreference() returns null
 * - saveThemePreference() returns false
 * - No exceptions thrown
 * - Console warning logged
 * - Theme switching works (session-only)
 */

/**
 * Error: Corrupted localStorage value
 *
 * EXAMPLES:
 * - localStorage['theme-mode'] = 'invalid'
 * - localStorage['theme-mode'] = '{"mode":"dark"}'
 * - localStorage['theme-mode'] = ''
 * - localStorage['theme-mode'] = 'null'
 *
 * BEHAVIOR:
 * - loadThemePreference() returns null (treats as missing)
 * - App defaults to 'light'
 * - Next save overwrites corrupted value
 * - No user-visible error
 */

/**
 * Error: Quota exceeded
 *
 * CAUSES:
 * - localStorage full (5-10MB limit)
 * - Other apps consuming storage
 *
 * BEHAVIOR:
 * - saveThemePreference() returns false
 * - Console warning logged
 * - Theme still applies (just doesn't persist)
 *
 * RECOMMENDATION:
 * - Theme preference is tiny (~10 bytes)
 * - Unlikely to cause quota issues
 * - If quota exceeded, other features already broken
 */

// =============================================================================
// STORAGE FORMAT
// =============================================================================

/**
 * Serialization format
 *
 * STORAGE:
 * localStorage['theme-mode'] = 'light'
 * localStorage['theme-mode'] = 'dark'
 * localStorage['theme-mode'] = 'system'
 *
 * NO JSON:
 * - Plain string values (not {"mode":"light"})
 * - No version field (not needed for simple enum)
 * - No timestamp (timestamp in-memory only if needed)
 *
 * RATIONALE:
 * - Simplest format
 * - Human-readable in DevTools
 * - Easy to manually edit for testing
 * - No parsing overhead
 */

/**
 * Storage size
 *
 * BYTES PER VALUE:
 * - 'light': 5 bytes
 * - 'dark': 4 bytes
 * - 'system': 6 bytes
 *
 * TOTAL STORAGE:
 * - Key: 'theme-mode' = 10 bytes
 * - Value: ~5 bytes
 * - Total: ~15 bytes
 *
 * IMPACT: Negligible (0.0003% of 5MB quota)
 */

// =============================================================================
// MIGRATION STRATEGY
// =============================================================================

/**
 * Version 1.0 (Initial)
 *
 * FORMAT: Plain string ('light', 'dark', 'system')
 * INTRODUCED: Feature 009-theme-switcher
 *
 * @example
 * localStorage['theme-mode'] = 'dark'
 */

/**
 * Future: Version 2.0 (Hypothetical)
 *
 * IF NEEDED (e.g., adding per-page themes):
 *
 * @example
 * localStorage['theme-mode'] = JSON.stringify({
 *   version: 2,
 *   global: 'dark',
 *   perPage: { '/dashboard': 'light' },
 * });
 *
 * MIGRATION:
 * function loadV2() {
 *   const raw = localStorage.getItem('theme-mode');
 *   if (raw === 'light' || raw === 'dark' || raw === 'system') {
 *     // V1 format - migrate to V2
 *     return { version: 2, global: raw, perPage: {} };
 *   }
 *   return JSON.parse(raw); // V2 format
 * }
 */

/**
 * Backward compatibility policy
 *
 * GUARANTEE:
 * - Current format ('light', 'dark', 'system') supported indefinitely
 * - Future versions can READ old format
 * - Future versions WRITE new format
 * - Seamless migration (no user action required)
 */

// =============================================================================
// TESTING UTILITIES
// =============================================================================

/**
 * Mock localStorage for tests
 *
 * @example
 * const mockStorage = {
 *   store: {} as Record<string, string>,
 *   getItem(key: string) {
 *     return this.store[key] ?? null;
 *   },
 *   setItem(key: string, value: string) {
 *     this.store[key] = value;
 *   },
 *   removeItem(key: string) {
 *     delete this.store[key];
 *   },
 *   clear() {
 *     this.store = {};
 *   },
 * };
 *
 * Object.defineProperty(window, 'localStorage', {
 *   value: mockStorage,
 * });
 */

/**
 * Simulate localStorage unavailable
 *
 * @example
 * Object.defineProperty(window, 'localStorage', {
 *   get() {
 *     throw new Error('localStorage unavailable');
 *   },
 * });
 *
 * // Now loadThemePreference() returns null
 * // Now saveThemePreference() returns false
 */

/**
 * Test storage persistence
 *
 * @example
 * test('theme persists across sessions', () => {
 *   saveThemePreference('dark');
 *   expect(localStorage.getItem('theme-mode')).toBe('dark');
 *
 *   // Simulate page reload
 *   const loaded = loadThemePreference();
 *   expect(loaded).toBe('dark');
 * });
 */

// =============================================================================
// SECURITY CONSIDERATIONS
// =============================================================================

/**
 * XSS Risk: None
 *
 * REASON:
 * - localStorage values never rendered as HTML
 * - Values validated before use (type guard)
 * - No dynamic code execution
 *
 * SAFE USAGE:
 * const mode = loadThemePreference(); // Safe - validated enum
 * setMode(mode ?? 'light');           // Safe - type-checked
 */

/**
 * Data Exposure: Low
 *
 * SENSITIVITY:
 * - Theme preference is not sensitive data
 * - No PII, credentials, or secrets
 * - Public information (visible in UI)
 *
 * RISK:
 * - Other scripts on same domain can read value
 * - User can inspect in DevTools
 * - No encryption needed
 */

/**
 * Tampering: No Impact
 *
 * USER EDITS STORAGE:
 * 1. User opens DevTools
 * 2. User edits localStorage['theme-mode'] to 'dark'
 * 3. User reloads page
 * 4. Theme changes to dark
 *
 * IMPACT: None - user can change theme via UI anyway
 * VALIDATION: Invalid values silently ignored (default to 'light')
 */

// =============================================================================
// BREAKING CHANGE POLICY
// =============================================================================
//
// ⚠️ INTERNAL API - Can change without notice
//
// External code MUST NOT:
// - Import these functions directly
// - Access localStorage['theme-mode'] directly
// - Depend on storage format
//
// External code MUST:
// - Use useThemeMode() hook
// - Let context handle persistence
//
// =============================================================================
