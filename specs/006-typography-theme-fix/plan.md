# Implementation Plan: Typography and Theme Fix

**Branch**: `006-typography-theme-fix` | **Date**: 2026-01-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-typography-theme-fix/spec.md`

## Summary

Update the application's MUI theme to match Danske Bank website design system. This involves updating typography (Play font verification, heading sizes, weights, line heights), button styling (48px pill-shaped border radius), and color corrections (primary button color #0A5EF0, primary text color #002447). Changes are localized to the theme configuration files with minimal component modifications.

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7 (@mui/material), Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1)
**Storage**: N/A (theming is purely visual - no data persistence changes)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (modern browsers, responsive from 320px to 1920px+)
**Project Type**: Single React web application
**Performance Goals**: No visual layout shifts from font changes (FR-007/SC-007)
**Constraints**: Typography sizes within 2px tolerance (SC-002), WCAG 2.1 AA contrast ratios maintained
**Scale/Scope**: ~10 files affected (theme constants, theme index, component tests, potential index.html)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Existing theme-based tests (StatusChip.test.tsx, SeverityChip.test.tsx) must be updated with new color values. New tests for typography/button styling required. |
| II. TypeScript Strict Mode | ✅ PASS | Theme types already defined in src/theme/types.ts. Updates will maintain strict typing. |
| III. Code Quality Standards | ✅ PASS | Changes are to centralized constants - no magic numbers. Named constants already in use. |
| IV. User Experience Excellence | ✅ PASS | Typography changes improve readability. Button styling matches brand expectations. |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | Must verify new text color #002447 maintains 4.5:1 contrast against white background. Primary button #0A5EF0 against white text must meet 4.5:1. |

**Pre-Design Gate**: PASSED - All principles satisfied.

### Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Tests exist for StatusChip and SeverityChip. Button/typography tests should be added during implementation per TDD. |
| II. TypeScript Strict Mode | ✅ PASS | New interfaces (ButtonConfig, TableTypography) maintain strict typing. All types extend existing type system. |
| III. Code Quality Standards | ✅ PASS | All values defined as named constants. No magic numbers. Changes localized to theme files. |
| IV. User Experience Excellence | ✅ PASS | Typography changes improve readability. Button styling matches user expectations from Danske Bank brand. |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | Verified: #002447 text = 15.85:1 contrast. #0A5EF0 button = 4.62:1 contrast. Both exceed AA requirements. |

**Post-Design Gate**: PASSED - Design complies with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/006-typography-theme-fix/
├── plan.md              # This file
├── research.md          # Phase 0 output - gap analysis
├── data-model.md        # Phase 1 output - theme entity definitions
├── quickstart.md        # Phase 1 output - implementation overview
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── theme/
│   ├── index.ts         # MUI theme definition - MODIFY
│   ├── constants.ts     # Design tokens - MODIFY
│   └── types.ts         # TypeScript interfaces - MODIFY (add h5, h6, caption)
├── components/
│   ├── common/
│   │   ├── StatusChip.test.tsx  # Color tests - VERIFY
│   │   ├── SeverityChip.test.tsx # Color tests - VERIFY
│   │   └── SaveButton.tsx       # Button styling - VERIFY
│   └── layout/
│       └── AppLayout.tsx        # Typography usage - VERIFY

index.html               # Play font loading - VERIFY (already present)

tests/
└── (no dedicated theme test file exists - CONSIDER ADDING)
```

**Structure Decision**: Single React web application. Theme configuration is centralized in `src/theme/` with design tokens in `constants.ts` and MUI theme in `index.ts`. No new directories needed.

## Complexity Tracking

No constitution violations - no complexity justification needed.

## Gap Analysis Summary

Based on comparison between spec requirements and current implementation:

| Token | Spec Requirement | Current Value | Action |
|-------|-----------------|---------------|--------|
| **Typography** | | | |
| Font family | Play + fallbacks | ✅ Play + fallbacks | None |
| H1 | 36px, 400, 1.22 | 36px, 700, 1.2 | Update weight, lineHeight |
| H2 | 32px, 500, 1.3 | 28px, 700, 1.3 | Update fontSize, weight |
| H3 | 24px, 400, 1.17 | 22px, 600, 1.4 | Update fontSize, weight, lineHeight |
| H4 | 20px, 500, 1.3 | 18px, 600, 1.4 | Update fontSize, weight, lineHeight |
| H5 | 16px, 500, 1.3 | ❌ Missing | Add definition |
| H6 | 14px, 500, 1.3 | ❌ Missing | Add definition |
| Body | 16px, 400, 1.5 | ✅ 16px, 400, 1.5 | None |
| Caption | 14px, 400, 1.5 | ✅ 14px, 400, 1.5 | None |
| **Buttons** | | | |
| Border radius | 48px (pill) | 4px | Update to 48px |
| Min height | 48px | 44px (SaveButton) | Update to 48px |
| Padding | 0 24px | default | Add 0 24px |
| Font weight | 400 | 600 | Update to 400 |
| Primary bg | #0A5EF0 | #003755 | Update to #0A5EF0 |
| **Colors** | | | |
| Primary text | #002447 | #222222 | Update to #002447 |
| Heading text | #002447 | inherits | Add explicit color |
| **Table** | | | |
| Header text | 14px, 500 | default | Verify/update |
| Body text | 14px, 400 | default | Verify/update |
| **Font Loading** | | | |
| Play font | Google Fonts | ✅ Already loaded | None |
| Font weights | 400, 500, 700 | 400, 700 loaded | ⚠️ Add 500 weight |

## Key Changes Required

1. **index.html**: Add font-weight 500 to Google Fonts import
2. **constants.ts**:
   - Update TYPOGRAPHY_CONFIG (H1-H4, add H5, H6, caption)
   - Add BUTTON_SHAPE config (borderRadius: 48)
   - Update TEXT_COLORS.primary to #002447
   - Add primaryButton color #0A5EF0 to BRAND_COLORS
3. **types.ts**: Add interfaces for h5, h6, caption typography variants
4. **index.ts**:
   - Update MuiButton overrides (borderRadius, height, padding, fontWeight)
   - Add h5, h6, caption to typography
   - Update MuiTableCell font sizes/weights
5. **Component tests**: Update expected RGB values if any tests assert on theme colors
