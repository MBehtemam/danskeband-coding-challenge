/**
 * ThemeContext Tests
 *
 * Feature: 009-theme-switcher
 * Tests theme state management, localStorage persistence, and system preference detection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ThemeContextProvider, useThemeMode } from './ThemeContext';
import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from '../types/theme';

describe('ThemeContext', () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    // Reset localStorage mock
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage[key] ?? null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockLocalStorage[key];
        },
        clear: () => {
          mockLocalStorage = {};
        },
      },
      writable: true,
    });

    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
    });
  });

  describe('Initialization', () => {
    it('defaults to light mode when no preference stored', () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.mode).toBe(DEFAULT_THEME_MODE);
      expect(result.current.mode).toBe('light');
    });

    it('loads saved preference from localStorage', () => {
      mockLocalStorage[THEME_STORAGE_KEY] = 'dark';

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.mode).toBe('dark');
    });

    it('defaults to light when localStorage has invalid value', () => {
      mockLocalStorage[THEME_STORAGE_KEY] = 'invalid-mode';

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.mode).toBe('light');
    });

    it('defaults to light when localStorage throws error', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage unavailable');
          },
          setItem: vi.fn(),
        },
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.mode).toBe('light');
    });
  });

  describe('Theme Mode Changes', () => {
    it('persists theme changes to localStorage', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      act(() => {
        result.current.setMode('dark');
      });

      // Wait for debounce (100ms)
      await waitFor(
        () => {
          expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('dark');
        },
        { timeout: 200 }
      );
    });

    it('updates mode state immediately', () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      act(() => {
        result.current.setMode('dark');
      });

      // State should update immediately (before debounce)
      expect(result.current.mode).toBe('dark');
    });

    it('handles rapid mode changes with debouncing', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      // Rapid clicks
      act(() => {
        result.current.setMode('dark');
        result.current.setMode('light');
        result.current.setMode('dark');
      });

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('dark');
        },
        { timeout: 200 }
      );

      // Only final value should be persisted
      expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('dark');
    });

    it('continues to work when localStorage throws on write', async () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {
            throw new Error('localStorage unavailable');
          },
        },
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      act(() => {
        result.current.setMode('dark');
      });

      // State should update even if localStorage fails
      expect(result.current.mode).toBe('dark');
    });
  });

  describe('System Preference Detection', () => {
    it('detects system dark mode preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.systemMode).toBe('dark');
    });

    it('detects system light mode preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query !== '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.systemMode).toBe('light');
    });

    it('updates systemMode when OS preference changes', () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: false,
          media: query,
          addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
            changeHandler = handler;
          },
          removeEventListener: vi.fn(),
        })),
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.systemMode).toBe('light');

      // Simulate OS theme change
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: true } as MediaQueryListEvent);
        }
      });

      expect(result.current.systemMode).toBe('dark');
    });

    it('defaults to light when prefers-color-scheme unsupported', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => ({
          matches: false,
          media: '',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
        writable: true,
      });

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ThemeContextProvider,
      });

      expect(result.current.systemMode).toBe('light');
    });
  });

  describe('Hook Error Handling', () => {
    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useThemeMode());
      }).toThrow('useThemeMode must be used within ThemeContextProvider');
    });
  });
});
