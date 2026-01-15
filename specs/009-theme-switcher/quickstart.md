# Quickstart Guide: Dark/Light Theme Switcher

**Feature**: 009-theme-switcher
**Date**: 2026-01-15
**Audience**: Developers implementing this feature

## Overview

This guide provides step-by-step instructions for implementing the dark/light theme switcher feature. Follow the order below to ensure proper Test-Driven Development workflow.

---

## Prerequisites

Before starting implementation:

- [ ] Read [spec.md](./spec.md) for requirements
- [ ] Read [research.md](./research.md) for technical decisions
- [ ] Read [data-model.md](./data-model.md) for state structure
- [ ] Review [contracts/](./contracts/) for API specifications
- [ ] Ensure development environment running (`npm run dev`)
- [ ] Ensure tests running (`npm test`)

---

## Implementation Order (TDD)

### Phase 1: Type Definitions (5 min)

**Goal**: Define shared TypeScript types

**Steps**:
1. Create `src/types/theme.ts`
2. Copy types from `contracts/types-contract.ts`
3. Export `ThemeMode`, `ResolvedThemeMode`, constants
4. Run type checker: `npm run type-check`

**Files**:
- `src/types/theme.ts` (NEW)

**Validation**:
```bash
npm run type-check # Should pass
```

---

### Phase 2: Dark Theme Definition (15 min)

**Goal**: Create dark theme variant for Danske Bank brand

**Steps**:
1. Open `src/theme/constants.ts`
2. Add dark mode color constants (see research.md R4 for values)
3. Open `src/theme/index.ts`
4. Create `darkTheme` using `createTheme()`
5. Add transitions to component overrides (300ms)
6. Export both `lightTheme` and `darkTheme`

**Files**:
- `src/theme/constants.ts` (MODIFY - add dark colors)
- `src/theme/index.ts` (MODIFY - export both themes)
- `src/theme/types.ts` (MODIFY if needed - add dark types)

**Validation**:
```bash
npm run type-check # Should pass
npm run build # Should compile
```

---

### Phase 3: Theme Context (TDD - 45 min)

**Goal**: Implement theme state management with tests

#### 3.1: Write Tests First

Create `src/contexts/ThemeContext.test.tsx`:

```typescript
describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to light mode when no preference stored', () => {
    const { result } = renderHook(() => useThemeMode(), {
      wrapper: ThemeContextProvider,
    });
    expect(result.current.mode).toBe('light');
  });

  it('loads saved preference from localStorage', () => {
    localStorage.setItem('theme-mode', 'dark');
    const { result } = renderHook(() => useThemeMode(), {
      wrapper: ThemeContextProvider,
    });
    expect(result.current.mode).toBe('dark');
  });

  it('persists theme changes to localStorage', () => {
    const { result } = renderHook(() => useThemeMode(), {
      wrapper: ThemeContextProvider,
    });

    act(() => {
      result.current.setMode('dark');
    });

    // Wait for debounce
    await waitFor(() => {
      expect(localStorage.getItem('theme-mode')).toBe('dark');
    });
  });

  it('detects system preference', () => {
    // Mock matchMedia to return dark mode
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useThemeMode(), {
      wrapper: ThemeContextProvider,
    });

    expect(result.current.systemMode).toBe('dark');
  });

  it('falls back gracefully when localStorage unavailable', () => {
    // Mock localStorage to throw
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => useThemeMode(), {
      wrapper: ThemeContextProvider,
    });

    expect(result.current.mode).toBe('light'); // Defaults
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useThemeMode());
    }).toThrow('useThemeMode must be used within ThemeContextProvider');
  });
});
```

**Run tests (should FAIL - RED phase)**:
```bash
npm test ThemeContext # All tests should fail
```

#### 3.2: Implement Context (GREEN phase)

Create `src/contexts/ThemeContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash-es';
import type { ThemeMode, ResolvedThemeMode } from '../types/theme';
import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY, THEME_DEBOUNCE_DELAY } from '../types/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemMode: ResolvedThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Load initial preference
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // localStorage unavailable
    }
    return DEFAULT_THEME_MODE;
  });

  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>('light');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    setSystemMode(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Debounced setMode
  const setMode = useMemo(
    () =>
      debounce((newMode: ThemeMode) => {
        setModeState(newMode);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch {
          console.warn('localStorage unavailable, theme will not persist');
        }
      }, THEME_DEBOUNCE_DELAY),
    []
  );

  const value: ThemeContextValue = { mode, setMode, systemMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
}
```

**Run tests (should PASS - GREEN phase)**:
```bash
npm test ThemeContext # All tests should pass
```

#### 3.3: Refactor (REFACTOR phase)

- Extract localStorage logic to helper functions
- Add TypeScript strict mode compliance
- Run `npm run lint` and fix any issues

**Files**:
- `src/contexts/ThemeContext.tsx` (NEW)
- `src/contexts/ThemeContext.test.tsx` (NEW)

---

### Phase 4: ThemeSwitcher Component (TDD - 30 min)

#### 4.1: Write Tests First

Create `src/components/layout/ThemeSwitcher.test.tsx`:

```typescript
describe('ThemeSwitcher', () => {
  it('renders dark mode icon when theme is light', () => {
    const { getByLabelText } = render(<ThemeSwitcher />, {
      wrapper: createWrapper({ mode: 'light' }),
    });

    const button = getByLabelText('Toggle theme');
    expect(within(button).getByTestId('DarkModeIcon')).toBeInTheDocument();
  });

  it('renders light mode icon when theme is dark', () => {
    const { getByLabelText } = render(<ThemeSwitcher />, {
      wrapper: createWrapper({ mode: 'dark' }),
    });

    const button = getByLabelText('Toggle theme');
    expect(within(button).getByTestId('LightModeIcon')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    const setMode = vi.fn();
    const { getByLabelText } = render(<ThemeSwitcher />, {
      wrapper: createWrapper({ mode: 'light', setMode }),
    });

    const button = getByLabelText('Toggle theme');
    fireEvent.click(button);

    expect(setMode).toHaveBeenCalledWith('dark');
  });

  it('is keyboard accessible', () => {
    const { getByLabelText } = render(<ThemeSwitcher />);
    const button = getByLabelText('Toggle theme');

    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('shows tooltip on hover', async () => {
    const { getByLabelText, findByRole } = render(<ThemeSwitcher />, {
      wrapper: createWrapper({ mode: 'light' }),
    });

    const button = getByLabelText('Toggle theme');
    fireEvent.mouseEnter(button);

    const tooltip = await findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/dark mode/i);
  });
});
```

**Run tests (should FAIL - RED phase)**:
```bash
npm test ThemeSwitcher # All tests should fail
```

#### 4.2: Implement Component (GREEN phase)

Create `src/components/layout/ThemeSwitcher.tsx`:

```typescript
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../../contexts/ThemeContext';

export function ThemeSwitcher() {
  const { mode, setMode, systemMode } = useThemeMode();

  // Resolve active mode
  const activeMode = mode === 'system' ? systemMode : mode;
  const isDark = activeMode === 'dark';

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
```

**Run tests (should PASS - GREEN phase)**:
```bash
npm test ThemeSwitcher # All tests should pass
```

**Files**:
- `src/components/layout/ThemeSwitcher.tsx` (NEW)
- `src/components/layout/ThemeSwitcher.test.tsx` (NEW)

---

### Phase 5: Integrate with App Root (20 min)

#### 5.1: Update main.tsx

Wrap app with ThemeContextProvider and dynamic ThemeProvider:

```typescript
import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './theme';

function AppWithTheme() {
  const { mode, systemMode } = useThemeMode();
  const activeMode = mode === 'system' ? systemMode : mode;
  const theme = activeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AppWithTheme />
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
```

**Files**:
- `src/main.tsx` (MODIFY)

---

### Phase 6: Add to AppLayout (15 min)

#### 6.1: Update AppLayout.tsx

Add ThemeSwitcher button to Toolbar:

```typescript
import { ThemeSwitcher } from './ThemeSwitcher';

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Logo />
        <Typography variant="body1">Incident Dashboard</Typography>
        <Box sx={{ flexGrow: 1 }} />

        {/* NEW: Theme switcher */}
        <ThemeSwitcher />

        {/* Existing navigation */}
        {isMobile ? (
          <IconButton component={Link} to="/developer">
            <SettingsIcon />
          </IconButton>
        ) : (
          <Button component={Link} to="/developer">
            Developer Settings
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
```

#### 6.2: Update AppLayout Tests

Add tests for ThemeSwitcher presence:

```typescript
it('renders theme switcher button', () => {
  const { getByLabelText } = render(<AppLayout><div /></AppLayout>);
  expect(getByLabelText('Toggle theme')).toBeInTheDocument();
});
```

**Files**:
- `src/components/layout/AppLayout.tsx` (MODIFY)
- `src/components/layout/AppLayout.test.tsx` (MODIFY)

---

### Phase 7: Integration Testing (20 min)

Create `src/App.test.tsx` integration tests:

```typescript
describe('Theme Switcher Integration', () => {
  it('switches entire app theme when toggled', async () => {
    const { getByLabelText } = render(<App />);

    // Initial theme is light
    expect(document.body).toHaveStyle({ backgroundColor: '#FFFFFF' });

    // Click theme switcher
    const button = getByLabelText('Toggle theme');
    fireEvent.click(button);

    // Wait for debounce + transition
    await waitFor(() => {
      expect(document.body).toHaveStyle({ backgroundColor: '#1a1a1a' });
    });
  });

  it('persists theme across remounts', async () => {
    const { getByLabelText, unmount, rerender } = render(<App />);

    // Switch to dark
    fireEvent.click(getByLabelText('Toggle theme'));
    await waitFor(() => {
      expect(localStorage.getItem('theme-mode')).toBe('dark');
    });

    // Unmount and remount
    unmount();
    rerender(<App />);

    // Should still be dark
    expect(document.body).toHaveStyle({ backgroundColor: '#1a1a1a' });
  });
});
```

**Files**:
- `src/App.test.tsx` (MODIFY)

---

## Validation Checklist

Run all checks before marking feature complete:

### Unit Tests
```bash
npm test # All tests pass
```

### Type Checking
```bash
npm run type-check # No errors
```

### Linting
```bash
npm run lint # No errors
```

### Build
```bash
npm run build # Compiles successfully
```

### Manual Testing

- [ ] Theme switcher visible in navigation bar
- [ ] Icon changes when clicked (dark → light, light → dark)
- [ ] Entire app theme changes on click
- [ ] Theme persists after page reload
- [ ] localStorage error doesn't break functionality (test in private browsing)
- [ ] Rapid clicking doesn't cause issues (debounced)
- [ ] Keyboard navigation works (Tab to button, Enter to toggle)
- [ ] Tooltip appears on hover
- [ ] System preference detected on first load (test by changing OS theme)
- [ ] Smooth transitions between themes (no jarring color changes)

---

## Troubleshooting

### Issue: Tests fail with "localStorage is not defined"

**Solution**: Mock localStorage in test setup:
```typescript
const mockStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] ?? null; },
  setItem(key: string, value: string) { this.store[key] = value; },
  removeItem(key: string) { delete this.store[key]; },
  clear() { this.store = {}; },
};

Object.defineProperty(window, 'localStorage', { value: mockStorage });
```

### Issue: Theme doesn't persist

**Check**:
1. localStorage not blocked by browser
2. Debounce completed before page unload
3. No console errors about localStorage

### Issue: System preference not detected

**Check**:
1. Browser supports `prefers-color-scheme` (95%+ do)
2. OS theme is set to dark mode
3. No console errors in ThemeContext

### Issue: Rapid clicking causes multiple re-renders

**Check**:
1. Debounce implemented correctly (100ms)
2. setMode wrapped in useMemo
3. No unnecessary re-renders in DevTools Profiler

---

## Performance Validation

### Metrics to Check

1. **Theme switch time**: <200ms from click to complete visual change
2. **Initial load time**: No noticeable delay from theme detection
3. **Bundle size impact**: <10KB added (theme + context + component)
4. **Re-render count**: Only ThemeProvider and descendants re-render

### Tools

```bash
# Bundle size
npm run build
npx vite-bundle-visualizer

# Performance
# Use React DevTools Profiler to measure re-renders
```

---

## Deployment Checklist

Before pushing to production:

- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing complete (all scenarios above)
- [ ] Accessibility tested (keyboard + screen reader)
- [ ] Performance validated (<200ms switch time)
- [ ] Browser compatibility tested (Chrome, Firefox, Safari)
- [ ] Mobile testing complete (iOS + Android)
- [ ] Private browsing mode tested (graceful fallback)
- [ ] Documentation updated (README, CLAUDE.md)
- [ ] PR created with screenshots

---

## Next Steps

After implementation complete:

1. Create pull request using `gh pr create`
2. Add screenshots showing light and dark themes
3. Reference spec.md in PR description
4. Assign for code review
5. Address review feedback
6. Merge to main branch
7. Deploy to production

---

## Estimated Timeline

| Phase | Time | Cumulative |
|-------|------|------------|
| 1. Types | 5 min | 5 min |
| 2. Dark Theme | 15 min | 20 min |
| 3. Context (TDD) | 45 min | 65 min |
| 4. Component (TDD) | 30 min | 95 min |
| 5. App Root | 20 min | 115 min |
| 6. AppLayout | 15 min | 130 min |
| 7. Integration Tests | 20 min | 150 min |
| **Total** | **2.5 hours** | |

**Note**: Times are estimates for experienced developer. Add buffer for learning/debugging.

---

## Support

If you encounter issues during implementation:

1. Review [research.md](./research.md) for technical decisions
2. Check [contracts/](./contracts/) for API specifications
3. Search codebase for similar patterns (e.g., existing context usage)
4. Consult MUI documentation for theme API
5. Ask team for code review assistance
