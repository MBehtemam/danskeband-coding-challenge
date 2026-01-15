# Data Model: Dark/Light Theme Switcher

**Feature**: 009-theme-switcher
**Date**: 2026-01-15
**Phase**: Phase 1 - Design

## Overview

This document defines the data entities, types, and state models for the theme switching feature. The data model is minimal by design - theme preferences are UI state rather than business domain entities.

---

## Entity: Theme Preference

### Description
Represents the user's selected color scheme preference. This is ephemeral UI state persisted to browser storage for convenience, not a business entity requiring server-side persistence.

### TypeScript Type Definition

```typescript
/**
 * Theme mode options
 * - 'light': Explicitly set to light theme
 * - 'dark': Explicitly set to dark theme
 * - 'system': Defer to operating system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme mode (no 'system' option)
 * Used when theme has been resolved against system preference
 */
export type ResolvedThemeMode = 'light' | 'dark';
```

### Attributes

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|------------------|
| mode | ThemeMode | Yes | User's theme preference | Must be 'light', 'dark', or 'system' |
| timestamp | number | No | Unix timestamp of last change | Positive integer (milliseconds) |

### Storage Location
- **Primary**: Browser localStorage with key `'theme-mode'`
- **Fallback**: React state only (when localStorage unavailable)

### Storage Format
```typescript
// localStorage stores raw string value
localStorage.setItem('theme-mode', 'dark'); // "dark"
localStorage.getItem('theme-mode');         // "dark" | null
```

### Default Value
```typescript
const DEFAULT_THEME_MODE: ThemeMode = 'light';
```

### Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ App Initialization                                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Try reading localStorage['theme-mode']                   │
│ 2. If found and valid → use stored value                    │
│ 3. If not found → default to 'light'                        │
│ 4. If localStorage throws → default to 'light'              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ User Toggles Theme                                           │
├─────────────────────────────────────────────────────────────┤
│ 1. User clicks ThemeSwitcher button                         │
│ 2. Debounced setMode() called (100ms delay)                 │
│ 3. React state updated immediately                          │
│ 4. Try persisting to localStorage['theme-mode']             │
│ 5. If localStorage throws → silent fail, continue           │
│ 6. ThemeProvider re-renders with new theme                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ System Preference Changes (if mode='system')                │
├─────────────────────────────────────────────────────────────┤
│ 1. OS theme changes (light ↔ dark)                          │
│ 2. window.matchMedia fires 'change' event                   │
│ 3. React state 'systemMode' updates                         │
│ 4. If mode='system', active theme updates automatically     │
│ 5. ThemeProvider re-renders with new theme                  │
└─────────────────────────────────────────────────────────────┘
```

### State Transitions

```
                     ┌─────────────┐
          ┌──────────┤ 'light'     ├──────────┐
          │          └─────────────┘          │
          │ User clicks                       │ User clicks
          │ (setMode('dark'))                 │ (setMode('system'))
          │                                   │
          ↓                                   ↓
     ┌─────────────┐                    ┌─────────────┐
     │ 'dark'      │←───────────────────┤ 'system'    │
     └─────────────┘ User clicks        └─────────────┘
                     (setMode('dark'))        ↑
                                              │
                                              │ OS pref changes
                                              │ (internal only)
                                              ↓
                                        [systemMode state]
```

**Notes**:
- All transitions are user-initiated except system preference detection
- Transitions are debounced (100ms) to prevent rapid re-renders
- Invalid values default to 'light'

---

## Entity: System Theme Preference (Runtime Only)

### Description
Represents the operating system's color scheme preference. This is detected at runtime via browser API and is not persisted.

### TypeScript Type Definition

```typescript
/**
 * Detected system theme mode (never 'system')
 */
export type SystemThemeMode = 'light' | 'dark';
```

### Attributes

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|------------------|
| systemMode | SystemThemeMode | Yes | OS-level theme preference | Must be 'light' or 'dark' |

### Storage Location
- **Storage**: React state only (not persisted)
- **Source**: `window.matchMedia('(prefers-color-scheme: dark)')`

### Lifecycle
```
App Mount
  ↓
window.matchMedia('(prefers-color-scheme: dark)').matches
  ↓
Initial systemMode set ('light' or 'dark')
  ↓
Event listener registered on MediaQueryList
  ↓
OS theme changes → listener fires → systemMode updates
```

### Default Value
```typescript
const DEFAULT_SYSTEM_MODE: SystemThemeMode = 'light';
```

---

## Context State Shape

### ThemeContext Value

```typescript
interface ThemeContextType {
  /**
   * Current user-selected theme mode
   * Can be 'light', 'dark', or 'system'
   */
  mode: ThemeMode;

  /**
   * Function to update theme mode
   * Debounced internally with 100ms delay
   */
  setMode: (mode: ThemeMode) => void;

  /**
   * Detected system theme preference
   * Automatically updated when OS theme changes
   */
  systemMode: SystemThemeMode;
}
```

### Active Theme Resolution Logic

```typescript
/**
 * Determine which MUI theme to apply
 */
function getActiveTheme(mode: ThemeMode, systemMode: SystemThemeMode): ResolvedThemeMode {
  if (mode === 'system') {
    return systemMode; // Defer to OS preference
  }
  return mode; // Use explicit user preference
}

// Example usage
const activeMode = getActiveTheme(mode, systemMode);
const muiTheme = activeMode === 'dark' ? darkTheme : lightTheme;
```

---

## Validation Rules

### ThemeMode Validation

```typescript
/**
 * Type guard for ThemeMode
 */
function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Safely parse stored theme mode
 */
function parseStoredThemeMode(value: string | null): ThemeMode {
  if (isValidThemeMode(value)) {
    return value;
  }
  return DEFAULT_THEME_MODE; // Fallback to 'light'
}
```

### localStorage Value Sanitization

```typescript
/**
 * Safely read theme preference from localStorage
 */
function loadThemePreference(): ThemeMode {
  try {
    const stored = localStorage.getItem('theme-mode');
    return parseStoredThemeMode(stored);
  } catch (error) {
    // localStorage unavailable (private browsing, security error, etc.)
    console.warn('localStorage unavailable, using default theme');
    return DEFAULT_THEME_MODE;
  }
}

/**
 * Safely persist theme preference to localStorage
 */
function saveThemePreference(mode: ThemeMode): void {
  try {
    localStorage.setItem('theme-mode', mode);
  } catch (error) {
    // Silent fail - theme works but doesn't persist
    console.warn('localStorage unavailable, theme will not persist');
  }
}
```

---

## Relationships

```
┌──────────────────────────────────────────────────────────────┐
│ ThemeContext                                                  │
├──────────────────────────────────────────────────────────────┤
│ - mode: ThemeMode                                            │
│ - setMode: (mode: ThemeMode) => void                         │
│ - systemMode: SystemThemeMode                                │
└────────────┬────────────────────────────┬────────────────────┘
             │                            │
             │ drives                     │ drives
             ↓                            ↓
┌──────────────────────────┐  ┌─────────────────────────────┐
│ localStorage             │  │ window.matchMedia           │
├──────────────────────────┤  ├─────────────────────────────┤
│ Key: 'theme-mode'        │  │ Query: (prefers-color-      │
│ Value: ThemeMode         │  │        scheme: dark)        │
│ Persistence: Optional    │  │ Updates: Live               │
└────────────┬─────────────┘  └──────────┬──────────────────┘
             │                           │
             └───────────┬───────────────┘
                         │ resolve to
                         ↓
           ┌──────────────────────────────┐
           │ Active Theme (MUI Theme)     │
           ├──────────────────────────────┤
           │ lightTheme OR darkTheme      │
           └──────────────────────────────┘
```

**Dependency Flow**:
1. ThemeContext manages user preference (mode)
2. ThemeContext monitors system preference (systemMode)
3. Active theme resolved based on mode + systemMode
4. MUI ThemeProvider applies resolved theme to component tree

---

## Edge Cases & Error Handling

### E1: localStorage Unavailable

**Scenario**: Private browsing mode, disabled cookies, security restrictions

**Handling**:
```typescript
try {
  localStorage.getItem('theme-mode');
} catch {
  // Fallback to default without throwing
  return 'light';
}
```

**Result**: Theme switching works but doesn't persist across sessions

---

### E2: Invalid Stored Value

**Scenario**: localStorage corrupted, manually edited, version mismatch

**Handling**:
```typescript
const stored = localStorage.getItem('theme-mode');
if (!isValidThemeMode(stored)) {
  return DEFAULT_THEME_MODE; // Reset to light
}
```

**Result**: Gracefully defaults to light mode

---

### E3: prefers-color-scheme Unsupported

**Scenario**: Old browsers without media query support

**Handling**:
```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
// .matches will be false if query unsupported
setSystemMode(mediaQuery.matches ? 'dark' : 'light');
```

**Result**: Defaults to light mode for system preference

---

### E4: Rapid Theme Toggle

**Scenario**: User clicks theme button multiple times quickly

**Handling**:
```typescript
const debouncedSetMode = debounce((newMode: ThemeMode) => {
  setModeState(newMode);
  saveThemePreference(newMode);
}, 100);
```

**Result**: Only final click within 100ms window applies

---

## Data Migration

### Version Compatibility

**Current**: No existing theme preference storage

**This Feature**: Introduces `localStorage['theme-mode']`

**Future Compatibility**:
- If key doesn't exist → new user, use default
- If key exists with valid value → existing user, respect preference
- If key exists with invalid value → corrupt data, reset to default

No migration logic required (fresh feature).

---

## Performance Considerations

### State Update Frequency

```typescript
// Infrequent updates (user-initiated only)
- User toggle: ~1-5 times per session
- System change: ~0-2 times per session

// No polling, no periodic checks
- localStorage read: Once on mount
- matchMedia listener: Passive event-driven
```

### Memory Footprint

```typescript
// Minimal state
- mode: string (3-6 bytes)
- systemMode: string (4-5 bytes)
- Total: <100 bytes including React overhead
```

### Re-render Impact

```typescript
// Theme change triggers:
1. ThemeContext state update → Context consumers re-render
2. ThemeProvider receives new theme → All children re-render

// Mitigation:
- Pre-created theme objects (no object recreation)
- useMemo on active theme selection
- Debounced updates (100ms)
```

---

## Summary

### Entities
1. **Theme Preference** (ThemeMode): User's explicit preference
2. **System Preference** (SystemThemeMode): OS-level detected preference

### Storage
- **Persistent**: localStorage['theme-mode']
- **Ephemeral**: React Context state

### Validation
- Type guards for runtime safety
- Graceful fallbacks for all error cases
- Default to 'light' when uncertain

### Performance
- Minimal state (<100 bytes)
- Infrequent updates (user-initiated)
- Pre-created themes (no dynamic allocation)

**Next Phase**: Generate API contracts (though minimal for this feature - no server API involved)
