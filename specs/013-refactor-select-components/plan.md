# Implementation Plan: Refactor Select Components and Improve Form UX

**Branch**: `013-refactor-select-components` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-refactor-select-components/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor StatusSelect and AssigneeSelect components to follow the SeveritySelect pattern (value/onChange props without direct API calls), enabling component reusability across DetailPanel and CreateIncidentDialog. Implement explicit Save button pattern in DetailPanel with improved error visibility and user feedback (top-center success notifications with 5-second auto-dismiss, inline error alerts).

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1
**Primary Dependencies**: Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1)
**Storage**: Browser localStorage via existing storage.ts module pattern (for incident data persistence)
**Testing**: Vitest + React Testing Library (component tests, integration tests)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - ES2020+ support)
**Project Type**: Single web application (React SPA with Vite)
**Performance Goals**: UI feedback within 100ms, notification appearance within 200ms, 5-second auto-dismiss for success notifications
**Constraints**: Must maintain WCAG 2.1 AA accessibility, all components keyboard navigable, focus indicators visible, error messages programmatically associated
**Scale/Scope**: 3 select components to refactor (StatusSelect, AssigneeSelect, SeveritySelect), 2 container components to update (IncidentDetailForm, CreateIncidentDialog), explicit Save pattern in DetailPanel

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Test-First Development (TDD) ✅
- **Status**: PASS (with plan)
- **Plan**: All component refactors will follow TDD:
  1. Write failing tests for StatusSelect/AssigneeSelect with value/onChange props
  2. Refactor components to pass tests
  3. Write tests for DetailPanel explicit save pattern
  4. Update DetailPanel to pass tests
  5. Write tests for error alerts in both DetailPanel and CreateIncidentDialog
  6. Implement error alert components

### Principle II: TypeScript Strict Mode ✅
- **Status**: PASS
- **Verification**: Project already uses TypeScript 5.6.2 with strict mode enabled. All new code will maintain strict typing with explicit parameter/return types, no `any` types.

### Principle III: Code Quality Standards ✅
- **Status**: PASS
- **Plan**: Refactoring will improve code quality by:
  - Eliminating code duplication (StatusSelect/AssigneeSelect currently duplicate update logic)
  - Following single responsibility principle (select components only handle UI, parent handles API)
  - Reducing component coupling (select components won't depend on useUpdateIncident hook)
  - No magic values (status/severity options already defined as constants)

### Principle IV: User Experience Excellence ✅
- **Status**: PASS
- **Alignment**: Feature directly improves UX:
  - Loading states: Save button shows loading indicator during API call (FR-015)
  - Error states: Clear, inline error alerts for operation failures (FR-008, FR-009, FR-010)
  - Form validation: Components disabled during save to prevent invalid submissions (FR-012)
  - State visibility: Success notifications auto-dismiss after 5 seconds (FR-007)
  - Data persistence: Changes only persist on explicit Save (FR-005)

### Principle V: Accessibility (WCAG 2.1 AA) ✅
- **Status**: PASS
- **Compliance**: All existing accessibility features will be preserved:
  - Keyboard navigation: All select components and buttons remain keyboard accessible
  - Focus indicators: Material UI components maintain visible focus states
  - Error messages: Inline error alerts will be programmatically associated with form
  - Loading feedback: aria-busy attribute used during save operations (already in IncidentDetailForm.tsx:235)
  - Semantic HTML: Material UI components use appropriate ARIA roles and labels

### Technology Standards ✅
- **Status**: PASS
- **Verification**: No new dependencies required. Uses existing Material UI, React, and TanStack Query patterns.

### Complexity Tracking
Not applicable - this refactoring reduces complexity by eliminating code duplication and improving component separation of concerns.

---

## Phase 1 Design Complete - Constitution Re-evaluation

### Post-Design Constitution Check ✅

**Re-evaluated**: 2026-01-15 after Phase 1 design completion

#### Principle I: Test-First Development (TDD) ✅
- **Status**: PASS - Design supports TDD
- **Verification**:
  - Component contracts defined in `contracts/component-interfaces.ts` provide clear test targets
  - Test patterns documented in `quickstart.md` sections (lines covering testing)
  - Existing SeveritySelect.test.tsx provides reference pattern for StatusSelect/AssigneeSelect tests
  - Integration test scenarios defined in `research.md` Q4

#### Principle II: TypeScript Strict Mode ✅
- **Status**: PASS - All contracts use strict typing
- **Verification**:
  - No `any` types in component-interfaces.ts
  - All props explicitly typed with TypeScript interfaces
  - Null handling explicit (assigneeId: string | null)
  - Union types used for enums (IncidentStatus, IncidentSeverity)

#### Principle III: Code Quality Standards ✅
- **Status**: PASS - Design improves code quality
- **Benefits Confirmed**:
  - Eliminates 50+ lines of duplicate code (useUpdateIncident logic in StatusSelect + AssigneeSelect)
  - Single responsibility: select components handle UI only, parents handle business logic
  - No magic numbers: notification duration (5000ms) documented in contracts
  - Reduced coupling: select components no longer depend on useUpdateIncident hook

#### Principle IV: User Experience Excellence ✅
- **Status**: PASS - Design enhances UX
- **UX Improvements Validated**:
  - Loading states: SaveButton component provides immediate feedback (< 100ms)
  - Error states: Inline Alert with descriptive messages (FR-010) positioned prominently
  - Success feedback: Top-center Snackbar with 5s auto-dismiss (< 200ms appearance per Performance Goals)
  - Explicit save pattern: Users control when changes persist, can edit multiple fields before save
  - Error recovery: Form values preserved on failure, enabling retry without data loss

#### Principle V: Accessibility (WCAG 2.1 AA) ✅
- **Status**: PASS - Design maintains accessibility
- **Verification**:
  - All select components use Material UI with built-in ARIA support
  - Error alerts use role="alert" for screen reader announcement
  - Loading states use aria-busy attribute (documented in quickstart.md)
  - Keyboard navigation preserved (Material UI Select components)
  - Focus management handled by Material UI components

### Design Quality Assessment

**Strengths**:
1. Clear separation of concerns between UI and business logic
2. Consistent API across all three select components
3. Reusable patterns for both update and create flows
4. Comprehensive documentation (research, data-model, contracts, quickstart)
5. No new dependencies required (uses existing Material UI + TanStack Query)

**Risks Mitigated**:
1. Breaking changes contained to internal components (no public API changes)
2. Reference implementation exists (SeveritySelect) reducing implementation risk
3. useIncidentForm hook already implements explicit save pattern (no hook changes needed)
4. Material UI components already support required notification positioning

**Complexity Reduction Confirmed**:
- Current: StatusSelect (64 lines) + AssigneeSelect (70 lines) = 134 lines with duplicate logic
- Target: StatusSelect (~40 lines) + AssigneeSelect (~45 lines) = 85 lines, ~36% reduction
- Code duplication eliminated: useUpdateIncident calls, internal state management, error handling

### Final Gate Status: ✅ APPROVED FOR IMPLEMENTATION

All constitution principles satisfied. Design ready for Phase 2 (task generation via `/speckit.tasks`).

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
│   ├── common/
│   │   ├── StatusChip.tsx           # Existing - displays status badges
│   │   ├── SeverityChip.tsx         # Existing - displays severity badges
│   │   └── SaveButton.tsx           # Existing - reusable save button with loading state
│   └── incidents/
│       ├── StatusSelect.tsx         # TO REFACTOR - remove useUpdateIncident, add value/onChange props
│       ├── AssigneeSelect.tsx       # TO REFACTOR - remove useUpdateIncident, add value/onChange props
│       ├── SeveritySelect.tsx       # REFERENCE PATTERN - already uses value/onChange pattern
│       ├── IncidentDetailForm.tsx   # TO UPDATE - add error alert, update success notification positioning
│       ├── IncidentDrawer.tsx       # MINOR UPDATE - pass error state to form
│       └── CreateIncidentDialog.tsx # TO UPDATE - integrate refactored selects, add error alert
├── hooks/
│   ├── useIncidents.ts              # Existing - provides useUpdateIncident and useCreateIncident hooks
│   └── useIncidentForm.ts           # Existing - already implements explicit save pattern
└── api/
    └── types.ts                     # Existing - IncidentStatus, IncidentSeverity, User types

tests/
├── integration/
│   └── [new test files for explicit save flow]
└── unit/
    └── components/
        └── incidents/
            ├── StatusSelect.test.tsx     # TO CREATE - test refactored component
            ├── AssigneeSelect.test.tsx   # TO CREATE - test refactored component
            └── IncidentDetailForm.test.tsx # TO UPDATE - test error alerts and success notification
```

**Structure Decision**: Single web application structure (Option 1). All source code in `src/` with component-based organization. Tests mirror source structure in `tests/` directory. This feature involves refactoring existing components rather than creating new architectural layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations. This feature reduces complexity through refactoring.
