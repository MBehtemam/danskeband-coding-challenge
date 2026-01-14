# Implementation Plan: Detail Panel Enhancements

**Branch**: `003-detail-panel-enhancements` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-detail-panel-enhancements/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enhance the incident detail panel with: (1) editable severity dropdown replacing the read-only chip, (2) improved visual layout with logical content grouping and collapsible status history, (3) dual-purpose Cancel button that closes the panel when no changes exist or reverts when changes exist, and (4) display of incident ID in the header. All changes extend the existing explicit save pattern from feature 002.

## Technical Context

**Language/Version**: TypeScript 5.6+ (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7, TanStack Query v5.90.17, @emotion/react for styling
**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browser (desktop and mobile responsive)
**Project Type**: Web (single SPA frontend)
**Performance Goals**: UI interactions <100ms, layout changes immediate (no network latency for layout)
**Constraints**: Must work on mobile viewports (320px+), accessibility WCAG 2.1 AA compliance required
**Scale/Scope**: Single feature enhancement to existing incident dashboard

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development (NON-NEGOTIABLE)
- ✅ **COMPLIANT**: Tests will be written before implementation for all new functionality
- Requirements mapping:
  - Severity dropdown: Unit tests for SeveritySelect component, integration tests for form submission
  - Cancel button behavior: Tests for close-when-no-changes and revert-when-changes scenarios
  - Layout improvements: Component tests for visual grouping, collapsible history section
  - Incident ID display: Simple rendering test

### II. TypeScript Strict Mode
- ✅ **COMPLIANT**: Project has `strict: true` in tsconfig.json
- Will extend existing types:
  - `IncidentFormValues` to include `severity: IncidentSeverity`
  - No new types needed; leveraging existing `IncidentSeverity` type

### III. Code Quality Standards
- ✅ **COMPLIANT**: ESLint/Prettier configured, will run before commits
- Changes follow single responsibility:
  - `SeveritySelect` component (new, mirrors `StatusSelect`)
  - Updates to `IncidentDetailForm` for layout restructuring
  - Updates to `useIncidentForm` hook for severity state

### IV. User Experience Excellence
- ✅ **COMPLIANT**:
  - Loading states already exist in form
  - Inline validation via Save button state
  - Responsive layout required (FR-009)
  - Immediate state visibility through existing save pattern

### V. Accessibility (WCAG 2.1 AA)
- ✅ **COMPLIANT**:
  - Severity dropdown will use proper `aria-label`
  - Cancel button has existing `aria-label`, will update for dual behavior
  - Collapsible history will use proper expand/collapse ARIA attributes
  - Incident ID will use semantic HTML

**GATE STATUS**: ✅ PASSED - No violations, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/003-detail-panel-enhancements/
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
├── api/                    # Existing - no changes needed
│   └── types.ts            # Existing types (IncidentSeverity, UpdateIncidentInput)
├── types/
│   └── form.ts             # UPDATE: Add severity to IncidentFormValues
├── hooks/
│   └── useIncidentForm.ts  # UPDATE: Add severity state management
├── components/
│   ├── common/
│   │   └── SeverityChip.tsx    # Existing - no changes needed
│   └── incidents/
│       ├── IncidentDetailForm.tsx  # UPDATE: Layout restructure, severity dropdown, cancel behavior
│       ├── IncidentDrawer.tsx      # UPDATE: Pass onClose to form for cancel-close behavior
│       ├── SeveritySelect.tsx      # NEW: Severity dropdown component
│       └── StatusHistoryTimeline.tsx # UPDATE: Make collapsible
```

**Structure Decision**: Existing single SPA structure. No new directories needed. Changes confined to existing component and hook files with one new component (SeveritySelect).

## Complexity Tracking

> No constitution violations to justify. All changes align with existing patterns and principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Post-Design Constitution Re-Check

*Completed after Phase 1 design artifacts generated.*

### I. Test-First Development (NON-NEGOTIABLE)
- ✅ **COMPLIANT**: Test requirements documented in quickstart.md
- Test files identified:
  - `src/components/incidents/SeveritySelect.test.tsx` (NEW)
  - `src/components/incidents/IncidentDetailForm.test.tsx` (UPDATE)
  - `src/hooks/useIncidentForm.test.ts` (UPDATE)

### II. TypeScript Strict Mode
- ✅ **COMPLIANT**: All type changes documented in data-model.md
- Type contracts defined in contracts/component-interfaces.ts
- No `any` types introduced

### III. Code Quality Standards
- ✅ **COMPLIANT**: Single responsibility maintained
- SeveritySelect: Isolated dropdown component
- Form changes: Layout restructure only
- Hook changes: State management extension only

### IV. User Experience Excellence
- ✅ **COMPLIANT**: Design decisions in research.md ensure:
  - Immediate feedback through existing patterns
  - Clear section organization
  - Responsive design requirements addressed
  - Cancel button always actionable

### V. Accessibility (WCAG 2.1 AA)
- ✅ **COMPLIANT**: Research.md specifies:
  - Accordion for collapsible section (built-in ARIA)
  - Proper form control labels
  - Keyboard navigation support
  - Semantic heading hierarchy

**FINAL GATE STATUS**: ✅ ALL CHECKS PASSED

---

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/003-detail-panel-enhancements/plan.md` | ✅ Complete |
| Research | `specs/003-detail-panel-enhancements/research.md` | ✅ Complete |
| Data Model | `specs/003-detail-panel-enhancements/data-model.md` | ✅ Complete |
| Component Contracts | `specs/003-detail-panel-enhancements/contracts/component-interfaces.ts` | ✅ Complete |
| Quickstart Guide | `specs/003-detail-panel-enhancements/quickstart.md` | ✅ Complete |
| Tasks | `specs/003-detail-panel-enhancements/tasks.md` | Pending (`/speckit.tasks`) |
