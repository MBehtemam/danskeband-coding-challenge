/**
 * ThemeContext
 *
 * Feature: 009-theme-switcher
 * Provides theme state management with localStorage persistence and system preference detection
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash-es';
import type { ThemeMode, ResolvedThemeMode } from '../types/theme';
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  THEME_DEBOUNCE_DELAY,
  isValidThemeMode,
} from '../types/theme';

/**
 * ThemeContext value interface
 */
interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemMode: ResolvedThemeMode;
}

/**
 * Create context with undefined default (forces provider usage)
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Load theme preference from localStorage
 */
function loadThemePreference(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidThemeMode(stored)) {
      return stored;
    }
    return DEFAULT_THEME_MODE;
  } catch {
    console.warn('localStorage unavailable, using default theme');
    return DEFAULT_THEME_MODE;
  }
}

/**
 * Save theme preference to localStorage
 */
function saveThemePreference(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    console.warn('localStorage unavailable, theme will not persist');
  }
}

/**
 * Detect system theme preference
 */
function detectSystemPreference(): ResolvedThemeMode {
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * ThemeContext Provider Component
 */
export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Initialize mode from localStorage or default
  const [mode, setModeState] = useState<ThemeMode>(loadThemePreference);

  // Track system preference
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(detectSystemPreference);

  // Detect system preference changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemMode(e.matches ? 'dark' : 'light');
      };

      // Set initial value
      setSystemMode(mediaQuery.matches ? 'dark' : 'light');

      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch {
      // matchMedia not supported, stay with default
      console.warn('prefers-color-scheme detection unavailable');
    }
  }, []);

  // Debounced setMode with localStorage persistence
  const setMode = useMemo(
    () =>
      debounce((newMode: ThemeMode) => {
        setModeState(newMode);
        saveThemePreference(newMode);
      }, THEME_DEBOUNCE_DELAY),
    []
  );

  // But also update state immediately for instant UI response
  const setModeImmediate = (newMode: ThemeMode) => {
    setModeState(newMode);
    setMode(newMode); // This will handle persistence after debounce
  };

  const value: ThemeContextValue = {
    mode,
    setMode: setModeImmediate,
    systemMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useThemeMode Hook
 *
 * @throws {Error} If used outside ThemeContextProvider
 */
export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
}
