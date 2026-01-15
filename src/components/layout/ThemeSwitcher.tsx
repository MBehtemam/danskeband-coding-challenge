/**
 * ThemeSwitcher Component
 *
 * Feature: 009-theme-switcher
 * Toggle button for switching between light and dark themes
 */

import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../../contexts/ThemeContext';

/**
 * ThemeSwitcher Button Component
 *
 * Displays a toggle button that switches between light and dark themes.
 * Shows the opposite icon (dark icon in light mode, light icon in dark mode).
 */
export function ThemeSwitcher() {
  const { mode, setMode, systemMode } = useThemeMode();

  // Resolve active mode (system preference or explicit mode)
  const activeMode = mode === 'system' ? systemMode : mode;
  const isDark = activeMode === 'dark';

  // Toggle between light and dark
  const handleToggle = () => {
    const nextMode = activeMode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
  };

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton onClick={handleToggle} color="inherit" aria-label="Toggle theme">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
