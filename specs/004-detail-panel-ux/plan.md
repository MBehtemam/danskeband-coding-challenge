# Implementation Plan: Detail Panel UX Improvements

**Branch**: `004-detail-panel-ux` | **Date**: 2026-01-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-detail-panel-ux/spec.md`

## Summary

This feature improves the incident detail panel UX by: (1) adding a copy-to-clipboard button for incident IDs, (2) changing the editable fields layout from horizontal to vertical, (3) displaying colored chips inside select dropdowns, and (4) introducing a distinct color scheme with icons to differentiate status chips from severity chips.

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1)
**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest 2.1.8 + React Testing Library (@testing-library/react@16.1.0, @testing-library/user-event@14.6.1)
**Target Platform**: Web (modern browsers supporting Clipboard API)
**Project Type**: Single web application (frontend only)
**Performance Goals**: Visual feedback within 500ms for copy action, immediate UI updates on layout
**Constraints**: Must maintain accessibility (WCAG 2.1 AA), responsive design from 320px to 1920px+
**Scale/Scope**: Single detail panel component with shared chip components used across table and history views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence/Notes |
|-----------|--------|----------------|
| **I. Test-First Development** | ✅ PASS | Tests will be written before implementation following TDD red-green-refactor cycle. Component tests for StatusChip, SeverityChip, CopyButton, and layout changes. |
| **II. TypeScript Strict Mode** | ✅ PASS | tsconfig.json has `strict: true`. All new code will use explicit types, no `any`. |
| **III. Code Quality Standards** | ✅ PASS | ESLint 9.17.0 + Prettier 3.7.4 configured. Code will follow single responsibility principle. |
| **IV. User Experience Excellence** | ✅ PASS | Copy feedback within 500ms (SC-006), responsive layout (FR-009), immediate state changes visible. |
| **V. Accessibility (WCAG 2.1 AA)** | ✅ PASS | Icons supplement color for color-blind users (FR-017, SC-007), keyboard navigation maintained, min touch targets 44px. |

**Gate Status**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/004-detail-panel-ux/
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
│   ├── common/
│   │   ├── StatusChip.tsx          # UPDATE: New colors (#42A5F5, #1E88E5, #1565C0) + icons
│   │   ├── StatusChip.test.tsx     # UPDATE: Test new colors and icons
│   │   ├── SeverityChip.tsx        # UPDATE: Add optional icons for severity indicators
│   │   ├── SeverityChip.test.tsx   # UPDATE: Test icon rendering
│   │   ├── CopyButton.tsx          # NEW: Clipboard copy with feedback
│   │   └── CopyButton.test.tsx     # NEW: Tests for copy functionality
│   └── incidents/
│       ├── IncidentDetailForm.tsx  # UPDATE: Vertical layout for dropdowns
│       ├── IncidentDetailForm.test.tsx  # UPDATE: Test vertical layout
│       ├── StatusSelect.tsx        # UPDATE: Render chips in dropdown options
│       ├── StatusSelect.test.tsx   # UPDATE: Test chip rendering in menu
│       ├── SeveritySelect.tsx      # UPDATE: Render chips in dropdown options
│       └── SeveritySelect.test.tsx # UPDATE: Test chip rendering in menu
├── theme/
│   └── index.ts                    # UPDATE: Add custom chip colors to palette
├── hooks/
│   ├── useCopyToClipboard.ts       # NEW: Custom hook for clipboard operations
│   └── useCopyToClipboard.test.ts  # NEW: Tests for clipboard hook
└── test/
    └── setup.ts                    # May need clipboard mock setup

tests/
├── integration/
│   └── detail-panel-ux.test.tsx    # NEW: Integration tests for full workflow
└── unit/
    └── [component tests above]
```

**Structure Decision**: Single web application structure. UI-only changes, no backend modifications needed. All changes are in the `src/components/` directory with supporting hooks and theme updates.

## Complexity Tracking

> No constitution violations identified. Feature is straightforward UI enhancement within existing architecture.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Post-Design Evidence |
|-----------|--------|---------------------|
| **I. Test-First Development** | ✅ PASS | Test files specified for all new/updated components: CopyButton.test.tsx, useCopyToClipboard.test.ts, updated StatusChip.test.tsx, SeverityChip.test.tsx, StatusSelect.test.tsx, SeveritySelect.test.tsx. TDD workflow documented in quickstart.md. |
| **II. TypeScript Strict Mode** | ✅ PASS | Component contracts defined in contracts/components.ts with explicit interfaces (StatusChipProps, CopyButtonProps, UseCopyToClipboardReturn). No `any` types. |
| **III. Code Quality Standards** | ✅ PASS | Single responsibility maintained: CopyButton handles clipboard, StatusChip handles display, useCopyToClipboard hook isolates clipboard logic. Constants extracted (STATUS_CONFIG, SEVERITY_CONFIG). |
| **IV. User Experience Excellence** | ✅ PASS | Copy feedback timing documented (2000ms reset). Responsive layout specification complete. Immediate visual feedback via tooltip and icon change. |
| **V. Accessibility (WCAG 2.1 AA)** | ✅ PASS | Icons provide non-color differentiation (RadioButtonUnchecked, PlayArrow, CheckCircle). aria-labels specified. Touch targets maintain 44px minimum. Color contrast ensured with white text on colored backgrounds. |

**Final Gate Status**: ✅ ALL GATES PASS - Design phase complete. Ready for task generation (/speckit.tasks).

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | specs/004-detail-panel-ux/plan.md | ✅ Complete |
| Research Document | specs/004-detail-panel-ux/research.md | ✅ Complete |
| Data Model | specs/004-detail-panel-ux/data-model.md | ✅ Complete |
| Component Contracts | specs/004-detail-panel-ux/contracts/components.ts | ✅ Complete |
| Quickstart Guide | specs/004-detail-panel-ux/quickstart.md | ✅ Complete |
