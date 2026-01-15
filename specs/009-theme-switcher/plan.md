# Implementation Plan: Dark/Light Theme Switcher

**Branch**: `009-theme-switcher` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-theme-switcher/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a dark/light theme switcher in the navigation bar that allows users to toggle between light and dark themes. The implementation will use Material UI's theme system with localStorage persistence, system preference detection via prefers-color-scheme media query, and MUI-style icons for theme switching. Theme changes will apply instantly across all components without page reload.

## Technical Context

**Language/Version**: TypeScript 5.6.3 (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1)
**Storage**: Browser localStorage (with graceful fallback for unavailability)
**Testing**: Vitest + React Testing Library (following TDD per constitution)
**Target Platform**: Modern web browsers supporting CSS custom properties and prefers-color-scheme media query
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: Theme changes must apply within 200ms; debounce rapid switches at 100ms
**Constraints**: Must work across all viewports (320px to 1920px+); graceful degradation when localStorage unavailable
**Scale/Scope**: Application-wide theme system affecting all existing components (navigation, tables, panels, buttons)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development (NON-NEGOTIABLE)
✅ **COMPLIANT** - Will follow TDD for all implementation:
- Custom hook tests for theme state management (useThemeMode)
- Component tests for ThemeSwitcher button behavior
- Integration tests for theme persistence and system preference detection
- Tests for localStorage fallback scenarios

### II. TypeScript Strict Mode
✅ **COMPLIANT** - All code will use strict TypeScript:
- Explicit types for theme mode ('light' | 'dark' | 'system')
- Type-safe hook return values
- No `any` types; proper typing for localStorage interactions
- Shared types in dedicated files

### III. Code Quality Standards
✅ **COMPLIANT** - Will meet all quality gates:
- ESLint zero-tolerance enforcement
- Prettier formatting applied
- Functions under 50 lines
- Constants for localStorage keys and debounce delays
- No dead code

### IV. User Experience Excellence
✅ **COMPLIANT** - All UX requirements addressed:
- Immediate visual feedback (<200ms) on theme change
- Theme persists via localStorage across sessions
- Clear, recognizable icons for theme switching
- Smooth transitions between themes
- Graceful fallback when localStorage unavailable

### V. Accessibility (WCAG 2.1 AA)
✅ **COMPLIANT** - Meets accessibility standards:
- Theme switcher is keyboard navigable (IconButton component)
- Focus indicators visible via MUI defaults
- aria-label for screen reader support
- Color contrast maintained in both themes
- Semantic HTML (button element)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx              # Will add ThemeSwitcher button here
│   │   ├── AppLayout.test.tsx         # Will add theme switcher tests
│   │   └── ThemeSwitcher.tsx          # NEW: Theme toggle button component
│   │   └── ThemeSwitcher.test.tsx     # NEW: ThemeSwitcher component tests
│   ├── incidents/
│   └── settings/
├── hooks/
│   ├── useIncidents.ts
│   ├── useUrlState.ts
│   ├── useUrlPagination.ts
│   └── useThemeMode.ts                # NEW: Theme state management hook
│   └── useThemeMode.test.ts           # NEW: Hook tests
├── theme/
│   ├── constants.ts                   # Will add dark theme constants
│   ├── index.ts                       # Will export light/dark themes
│   └── types.ts                       # Will add dark theme types
├── types/
│   └── theme.ts                       # NEW: Shared theme mode types
└── main.tsx                           # Will wrap with theme provider logic
```

**Structure Decision**: Single-page React application. New ThemeSwitcher component will be added to the AppLayout navigation bar. A custom hook (useThemeMode) will manage theme state, localStorage persistence, and system preference detection. The existing theme/ directory will be extended to support both light and dark theme configurations.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. All gates pass.
