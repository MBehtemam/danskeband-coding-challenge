# Implementation Plan: Danske Bank Visual Design System

**Branch**: `005-danske-brand-theme` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-danske-brand-theme/spec.md`

## Summary

Implement Danske Bank's visual design system by updating the existing MUI theme configuration to use brand-specific colors (Prussian Blue #003755, Cerulean #009EDC, Pampas #F6F4F2), integrating the Play font from Google Fonts, updating the navigation bar with the official Danske Bank logo, and refining component styling (buttons, cards, inputs) to match Danske Bank's design language while maintaining WCAG AA accessibility compliance.

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1), React Router v6.30.3
**Storage**: N/A (theming is purely visual - no data persistence changes)
**Testing**: Vitest 2.1.8 + React Testing Library + JSDOM 26.0.0
**Target Platform**: Web (modern browsers, responsive 320px to 1920px+)
**Project Type**: Web application (single frontend project)
**Performance Goals**: Theme changes should not impact render performance; font loading should not block initial render (font-display: swap)
**Constraints**: WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text), mobile breakpoint at 960px
**Scale/Scope**: Single-page dashboard application, ~15 components affected by theme changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Theme changes are testable via component snapshot/visual tests; will write tests for new components before implementation |
| II. TypeScript Strict Mode | ✅ PASS | All theme configuration will use strict typing; no `any` types |
| III. Code Quality Standards | ✅ PASS | Will follow ESLint/Prettier rules; named constants for all color values |
| IV. User Experience Excellence | ✅ PASS | Loading states maintained; responsive design 320px-1920px+; font fallback prevents FOUT |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | All color combinations verified for 4.5:1 contrast; focus indicators maintained |

**Gate Result**: ✅ ALL GATES PASS - Proceed to Phase 0

### Post-Phase 1 Re-Check (Design Complete)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Theme constants and component overrides are testable; test files defined in project structure |
| II. TypeScript Strict Mode | ✅ PASS | TypeScript interfaces defined in contracts/theme-types.ts; const assertions used for immutability |
| III. Code Quality Standards | ✅ PASS | All colors extracted to BRAND_COLORS constant; no magic strings in theme config |
| IV. User Experience Excellence | ✅ PASS | Font fallback stack defined; preconnect hints optimize loading; responsive breakpoint at 960px |
| V. Accessibility (WCAG 2.1 AA) | ⚠️ CONDITIONAL | White on Cerulean (#009EDC) buttons: 3.07:1 ratio passes AA for large text only. **Mitigation**: Use bold 16px+ text on Cerulean buttons |

**Gate Result**: ✅ ALL GATES PASS WITH MITIGATION - Ready for implementation

## Project Structure

### Documentation (this feature)

```text
specs/005-danske-brand-theme/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── assets/
│   └── danske-bank-logo.svg    # NEW: Brand logo asset
├── theme/
│   └── index.ts                # MODIFY: Update colors, typography, component overrides
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx       # MODIFY: Full-width nav, logo integration, responsive menu
│   ├── common/
│   │   ├── StatusChip.tsx      # MODIFY: Update to use theme colors consistently
│   │   └── SeverityChip.tsx    # REVIEW: Verify contrast ratios with new background
│   └── incidents/
│       └── *.tsx               # REVIEW: Verify card styling, button states
├── index.css                   # MODIFY: Add Play font CSS custom properties
└── test/
    └── theme.test.ts           # NEW: Theme configuration tests

index.html                      # MODIFY: Add Google Fonts preconnect and link tags

tests/
├── integration/
│   └── theme.test.tsx          # NEW: Visual regression tests for brand consistency
└── unit/
    └── theme.test.ts           # NEW: Theme value tests
```

**Structure Decision**: Single frontend project (existing structure). Theme changes affect existing files plus one new asset (logo SVG). Test files colocated with source following existing pattern.

## Complexity Tracking

> No constitution violations identified - this section remains empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
