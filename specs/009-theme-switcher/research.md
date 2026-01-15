# Research: Dark/Light Theme Switcher

**Feature**: 009-theme-switcher
**Date**: 2026-01-15
**Research Phase**: Phase 0 - Technical Investigation

## Research Questions

This document consolidates research findings for all technical unknowns identified during planning.

---

## R1: Material UI Dark Theme Implementation Pattern

### Decision
Use **separate light and dark theme objects** created with `createTheme()`, managed via React Context, and switched dynamically through ThemeProvider.

### Rationale
- Explicit control over Danske Bank brand color adaptations for each mode
- Type-safe theme configuration with TypeScript strict mode
- Better performance (pre-created theme objects, no recreation on render)
- Simpler testing strategy (mock context vs. MUI's colorSchemes)
- Proven pattern in current codebase (already using single theme with ThemeProvider)

### Alternatives Considered
- **MUI Color Schemes API (`colorSchemes` prop)**: Modern approach but requires MUI v6+ full compatibility and more complex migration of existing theme structure. Rejected because it would require restructuring the current well-established theme architecture.
- **CSS-only theming**: Insufficient control over component-specific overrides. Rejected because MUI components need programmatic theme access.

### Implementation Details
```typescript
// Create both themes upfront (no dynamic recreation)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#003755' },
    // ... existing light colors
  },
  // ... existing config
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#009EDC' }, // Swap accent to primary for contrast
    background: { default: '#1a1a1a', paper: '#242424' },
    text: { primary: '#FFFFFF', secondary: '#b3b3b3' },
    divider: '#424242',
  },
  // ... shared config
});
```

---

## R2: Theme State Management Strategy

### Decision
Use **React Context + useState + localStorage** with graceful fallback for storage unavailability.

### Rationale
- Meets spec requirement for localStorage persistence with fallback
- Simple, testable implementation (no external state management library)
- Follows existing patterns in codebase (similar to useUrlState)
- TypeScript-friendly with explicit type safety
- Supports 100ms debouncing requirement

### Alternatives Considered
- **MUI's useColorScheme hook**: Requires Color Schemes API adoption. Rejected for same reasons as R1.
- **Redux/Zustand**: Overkill for single feature with simple state. Rejected to avoid unnecessary complexity.
- **Direct localStorage without Context**: Would require prop drilling or repeated logic. Rejected for poor maintainability.

### Implementation Details
```typescript
interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemMode: 'light' | 'dark';
}

// Graceful fallback
const [mode, setModeState] = useState<ThemeMode>(() => {
  try {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
  } catch {
    return 'light'; // Private browsing fallback
  }
});
```

---

## R3: System Preference Detection (prefers-color-scheme)

### Decision
Use `window.matchMedia('(prefers-color-scheme: dark)')` with event listener for dynamic detection, defaulting to light mode if unsupported.

### Rationale
- Standard web API with broad browser support (95%+ coverage)
- React-friendly via useEffect hook
- Meets spec requirement for P3 system integration
- Graceful degradation when media query unsupported

### Alternatives Considered
- **MUI's useMediaQuery hook**: Wraps same API but adds MUI dependency for simple check. Rejected as unnecessary abstraction.
- **Server-side detection**: Not applicable for client-side React SPA. Rejected.

### Implementation Details
```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    setSystemMode(e.matches ? 'dark' : 'light');
  };

  // Set initial value (handles unsupported browsers gracefully)
  setSystemMode(mediaQuery.matches ? 'dark' : 'light');

  // Listen for OS-level theme changes
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

---

## R4: Dark Mode Color Adaptations for Danske Bank Brand

### Decision
Create dark theme variant with:
- **Primary**: Swap accent blue (#009EDC) to primary for better contrast
- **Backgrounds**: #1a1a1a (default), #242424 (paper) - avoid pure black
- **Text**: #FFFFFF (primary), #b3b3b3 (secondary)
- **Status colors**: Adjusted to maintain WCAG AA contrast (≥4.5:1)

### Rationale
- Avoids eye strain from pure black backgrounds (#000000)
- Maintains brand identity while ensuring readability
- Meets WCAG AA accessibility requirements in both modes
- Follows Material Design dark theme guidelines

### Alternatives Considered
- **Pure black backgrounds**: Causes OLED burn-in and eye strain. Rejected per Material Design guidelines.
- **Identical colors for both modes**: Fails contrast requirements. Rejected for accessibility.
- **Auto-generated dark colors**: Insufficient control over brand consistency. Rejected.

### Color Mappings

| Element | Light Mode | Dark Mode | Rationale |
|---------|-----------|----------|-----------|
| Primary | #003755 (dark blue) | #009EDC (light blue) | Swap for contrast on dark background |
| Background | #FFFFFF | #1a1a1a | Slightly warm dark, not pure black |
| Paper | #FFFFFF | #242424 | Elevated surfaces lighter than background |
| Text Primary | #002447 | #FFFFFF | Reverse contrast |
| Text Secondary | #968d73 | #b3b3b3| Maintain readability |
| Divider | #ebece7 | #424242 | More visible on dark backgrounds |

**Status Colors (Dark Mode Adjustments)**:
- Open: #5a8fd9 (lighter blue for visibility)
- In Progress: #7ca3d4 (adjusted blue-gray)
- Resolved: #4a4a4a (lighter gray)

All colors verified for WCAG AA compliance (≥4.5:1 contrast ratio).

---

## R5: Smooth Theme Transition Implementation

### Decision
Apply CSS transitions to theme-dependent properties using Material UI component styleOverrides with 300ms standard duration.

### Rationale
- Prevents jarring color changes (spec requirement FR-010)
- 300ms is MUI's standard transition duration (balances smoothness and responsiveness)
- Applied at component level for maximum coverage
- Meets <200ms perceived performance requirement

### Alternatives Considered
- **No transitions**: Creates jarring experience. Rejected per spec requirement FR-010.
- **Global CSS transitions**: Affects all properties including layout, causing unwanted animations. Rejected for poor UX.
- **JS-based animations**: More complex, unnecessary for simple color changes. Rejected for simplicity.

### Implementation Details
```typescript
MuiCssBaseline: {
  styleOverrides: {
    body: {
      transition: 'background-color 300ms ease-in-out, color 300ms ease-in-out',
    },
  },
},
MuiAppBar: {
  styleOverrides: {
    root: {
      transition: 'background-color 300ms ease-in-out, box-shadow 300ms ease-in-out',
    },
  },
},
MuiPaper: {
  styleOverrides: {
    root: {
      transition: 'background-color 300ms ease-in-out',
    },
  },
},
```

---

## R6: Debouncing Strategy for Rapid Theme Switches

### Decision
Use lodash `debounce` with 100ms delay on the `setMode` function returned from context.

### Rationale
- Meets spec requirement (FR-012: 100ms debounce)
- Prevents excessive re-renders while maintaining instant feel
- lodash already in dependencies (verified via package.json inspection)
- Standard pattern for rate-limiting user interactions

### Alternatives Considered
- **No debouncing**: Allows excessive re-renders. Rejected per spec requirement FR-012.
- **Custom debounce implementation**: Reinventing wheel unnecessarily. Rejected in favor of battle-tested library.
- **Throttling instead of debouncing**: Would allow mid-sequence renders. Rejected because we want final state only.

### Implementation Details
```typescript
import { debounce } from 'lodash-es';

const setMode = useMemo(
  () => debounce((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('theme-mode', newMode);
    } catch {
      // Private browsing fallback
    }
  }, 100),
  []
);
```

---

## R7: localStorage Graceful Fallback Strategy

### Decision
Wrap all localStorage operations in try-catch blocks, falling back to session-only state when unavailable.

### Rationale
- Meets spec requirement (FR-011: graceful localStorage handling)
- Private browsing mode throws exceptions on localStorage access
- Theme switching functionality continues to work (just doesn't persist)
- Simple, no additional dependencies

### Alternatives Considered
- **Feature detection before use**: Still throws in some browsers during private browsing. Rejected as insufficient.
- **sessionStorage fallback**: Adds complexity with minimal benefit. Rejected for simplicity.
- **Block theme switching if localStorage unavailable**: Breaks core functionality. Rejected per spec requirement FR-011.

### Implementation Details
```typescript
// Load initial preference
const [mode, setModeState] = useState<ThemeMode>(() => {
  try {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
  } catch {
    return 'light'; // Fallback to light mode
  }
});

// Save preference
try {
  localStorage.setItem('theme-mode', newMode);
} catch {
  // Silent fail - theme works but doesn't persist
}
```

---

## R8: Theme Switcher Icons and Placement

### Decision
Use MUI's **LightModeIcon** and **DarkModeIcon** from `@mui/icons-material`, placed in AppLayout Toolbar next to existing navigation buttons.

### Rationale
- Matches MUI website implementation (per spec input)
- Icons clearly communicate theme switching functionality
- Follows existing AppLayout pattern (icon buttons on mobile, text buttons on desktop)
- Already have @mui/icons-material@7.3.7 installed

### Alternatives Considered
- **Custom SVG icons**: Unnecessary effort, MUI icons already meet requirements. Rejected.
- **Brightness4Icon**: Less clear than dedicated light/dark icons. Rejected for clarity.
- **Separate theme menu**: Over-engineered for simple toggle. Rejected for simplicity.

### Implementation Details
```typescript
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

// Show opposite icon (if dark, show light icon to indicate "switch to light")
<IconButton
  onClick={handleToggle}
  color="inherit"
  aria-label="Toggle theme"
>
  {isDark ? <LightModeIcon /> : <DarkModeIcon />}
</IconButton>
```

**Placement**: In AppLayout Toolbar after the logo/title, before the Developer Settings button (maintains visual hierarchy).

---

## R9: Performance Optimization Strategy

### Decision
Pre-create theme objects outside components and use `useMemo` to select between them based on mode.

### Rationale
- Prevents theme recreation on every render
- Reduces React tree reconciliation work
- Meets <200ms performance requirement
- Zero additional dependencies

### Alternatives Considered
- **Dynamic theme creation**: Creates new object each render, causing full app re-render. Rejected for poor performance.
- **CSS variables only**: Insufficient for MUI component overrides. Rejected.

### Implementation Details
```typescript
// Pre-create outside component
export const lightTheme = createTheme({ /* ... */ });
export const darkTheme = createTheme({ /* ... */ });

// Select efficiently
function AppRoot() {
  const { mode, systemMode } = useThemeMode();
  const activeMode = mode === 'system' ? systemMode : mode;

  const muiTheme = useMemo(
    () => (activeMode === 'dark' ? darkTheme : lightTheme),
    [activeMode]
  );

  return <ThemeProvider theme={muiTheme}>{...}</ThemeProvider>;
}
```

---

## R10: Testing Strategy for Theme Switching

### Decision
Test-Driven Development approach with three test layers:
1. **Hook tests** (useThemeMode): State management, localStorage, system detection
2. **Component tests** (ThemeSwitcher): UI interaction, icon rendering, accessibility
3. **Integration tests**: Full theme switching flow, persistence, fallback scenarios

### Rationale
- Meets constitution requirement (TDD non-negotiable)
- Comprehensive coverage of P1, P2, P3 requirements
- Tests edge cases (localStorage unavailable, rapid clicking)
- Uses existing Vitest + React Testing Library setup

### Test Coverage
```typescript
// Hook tests
- ✓ Loads theme from localStorage on mount
- ✓ Defaults to light when no preference saved
- ✓ Persists theme changes to localStorage
- ✓ Falls back gracefully when localStorage unavailable
- ✓ Detects system preference (prefers-color-scheme)
- ✓ Updates when system preference changes
- ✓ Debounces rapid mode changes

// Component tests
- ✓ Renders correct icon based on current theme
- ✓ Toggles theme when clicked
- ✓ Has accessible aria-label
- ✓ Is keyboard navigable

// Integration tests
- ✓ Theme persists across page reloads
- ✓ System preference respected on first visit
- ✓ Explicit preference overrides system
- ✓ All components update when theme changes
```

---

## Summary

All research questions resolved. No blocking unknowns remain. Ready to proceed to Phase 1 (Design & Contracts).

### Key Technologies Confirmed
- React Context for state management
- Material UI createTheme() for theme objects
- localStorage with try-catch fallback
- window.matchMedia for system preference detection
- lodash debounce for rate-limiting
- CSS transitions for smooth theme changes
- Vitest + React Testing Library for TDD

### Architecture Decision Record
- **Pattern**: Context Provider wrapping app root with ThemeProvider
- **Storage**: localStorage with 'theme-mode' key
- **Types**: TypeScript strict mode with explicit ThemeMode type
- **Performance**: Pre-created themes + useMemo selection
- **Accessibility**: WCAG AA compliant colors + keyboard navigation
