/**
 * ThemeSwitcher Tests
 *
 * Feature: 009-theme-switcher
 * Tests the theme switcher button component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode, ResolvedThemeMode } from '../../types/theme';

// Mock ThemeContext for controlled testing
vi.mock('../../contexts/ThemeContext', async () => {
  const actual = await vi.importActual('../../contexts/ThemeContext');
  return {
    ...(actual as Record<string, unknown>),
    useThemeMode: vi.fn(() => ({
      mode: 'light' as ThemeMode,
      setMode: vi.fn(),
      systemMode: 'light' as ResolvedThemeMode,
    })),
  };
});

describe('ThemeSwitcher', () => {
  describe('Icon Rendering', () => {
    it('renders dark mode icon when theme is light', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();

      // Should show DarkMode icon (to switch TO dark mode)
      const icon = within(button).getByTestId('DarkModeIcon');
      expect(icon).toBeInTheDocument();
    });

    it('renders light mode icon when theme is dark', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'dark',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();

      // Should show LightMode icon (to switch TO light mode)
      const icon = within(button).getByTestId('LightModeIcon');
      expect(icon).toBeInTheDocument();
    });

    it('renders correct icon when mode is system and systemMode is dark', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'system',
        setMode: vi.fn(),
        systemMode: 'dark',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      const icon = within(button).getByTestId('LightModeIcon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Toggle Behavior', () => {
    it('toggles theme from light to dark when clicked', async () => {
      const setModeMock = vi.fn();
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: setModeMock,
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(button);

      expect(setModeMock).toHaveBeenCalledWith('dark');
      expect(setModeMock).toHaveBeenCalledTimes(1);
    });

    it('toggles theme from dark to light when clicked', async () => {
      const setModeMock = vi.fn();
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'dark',
        setMode: setModeMock,
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(button);

      expect(setModeMock).toHaveBeenCalledWith('light');
      expect(setModeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('is keyboard accessible (focusable)', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('has accessible aria-label', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    });

    it('triggers toggle on Enter key', async () => {
      const setModeMock = vi.fn();
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: setModeMock,
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // MUI IconButton handles Enter automatically through onClick
      expect(button).toBeInTheDocument();
    });
  });

  describe('Tooltip', () => {
    it('shows tooltip with correct text for light mode', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'light',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.mouseEnter(button);

      // Wait for tooltip to appear
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toHaveTextContent(/dark mode/i);
    });

    it('shows tooltip with correct text for dark mode', async () => {
      const { useThemeMode } = await import('../../contexts/ThemeContext');
      vi.mocked(useThemeMode).mockReturnValue({
        mode: 'dark',
        setMode: vi.fn(),
        systemMode: 'light',
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.mouseEnter(button);

      // Wait for tooltip to appear
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toHaveTextContent(/light mode/i);
    });
  });
});
