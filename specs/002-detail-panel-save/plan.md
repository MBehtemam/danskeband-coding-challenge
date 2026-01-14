# Implementation Plan: Detail Panel with Explicit Save

**Branch**: `002-detail-panel-save` | **Date**: 2026-01-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-detail-panel-save/spec.md`

## Summary

Replace the current row expansion pattern with a MUI Drawer-based side panel for incident details, and convert the auto-save pattern for status/assignee edits to an explicit save model. Users will make changes locally, see visual feedback of unsaved changes, and explicitly click Save to persist changes (or Cancel to discard).

## Technical Context

**Language/Version**: TypeScript 5.6+ (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3
**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest + React Testing Library (TDD required per constitution)
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single frontend application
**Performance Goals**: Panel opens <1s, save operation completes <2s with feedback
**Constraints**: WCAG 2.1 AA accessibility, responsive (33% width desktop, full-width mobile)
**Scale/Scope**: Enhancement to existing 001-incident-dashboard feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ Required | Tests BEFORE implementation for all new components and hooks |
| II. TypeScript Strict Mode | ✅ Enabled | Existing tsconfig.json has strict: true; all new code typed |
| III. Code Quality | ✅ Configured | ESLint + Prettier configured; will follow existing patterns |
| IV. UX Excellence | ✅ Addressed | Loading states, error feedback, unsaved change indicators planned |
| V. Accessibility (WCAG 2.1 AA) | ✅ Planned | Keyboard nav for drawer, focus management, ARIA for Save/Cancel states |

**Pre-Design Gate**: ✅ PASSED - No violations

### Post-Design Gate (Phase 1)

| Principle | Status | Design Evidence |
|-----------|--------|-----------------|
| I. Test-First Development | ✅ PASS | quickstart.md includes TDD patterns; test examples for all new components/hooks |
| II. TypeScript Strict Mode | ✅ PASS | data-model.md defines all interfaces with explicit types; no `any` types |
| III. Code Quality | ✅ PASS | Plan uses existing ESLint/Prettier; component structure follows existing patterns |
| IV. UX Excellence | ✅ PASS | Loading indicators (isSaving), error feedback (saveError), unsaved change indicators (hasChanges) all designed |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | MUI Drawer handles focus trap/escape; ARIA attributes for button states defined in data-model |

**Post-Design Gate**: ✅ PASSED - Design adheres to all constitution principles

## Project Structure

### Documentation (this feature)

```text
specs/002-detail-panel-save/
├── plan.md              # This file
├── research.md          # Phase 0 output - MUI Drawer patterns, form state management
├── data-model.md        # Phase 1 output - PendingChanges interface, form state
├── quickstart.md        # Phase 1 output - Developer guide for this feature
├── contracts/           # Phase 1 output - No new API endpoints (uses existing PATCH)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── incidents/
│   │   ├── IncidentDrawer.tsx           # NEW: MUI Drawer for detail panel
│   │   ├── IncidentDrawer.test.tsx      # NEW: Tests for drawer
│   │   ├── IncidentDetailForm.tsx       # NEW: Form with editable fields
│   │   ├── IncidentDetailForm.test.tsx  # NEW: Form tests
│   │   ├── IncidentTable.tsx            # MODIFY: Remove row expansion, add drawer trigger
│   │   ├── IncidentDetailPanel.tsx      # REMOVE: Replaced by IncidentDrawer
│   │   ├── StatusSelect.tsx             # MODIFY: Add controlled mode prop
│   │   └── AssigneeSelect.tsx           # MODIFY: Add controlled mode prop
│   └── common/
│       ├── SaveButton.tsx               # NEW: Reusable save button with loading state
│       └── SaveButton.test.tsx          # NEW: Tests
├── hooks/
│   ├── useIncidentForm.ts               # NEW: Form state management hook
│   └── useIncidentForm.test.ts          # NEW: Hook tests
└── [existing structure unchanged]
```

**Structure Decision**: Extend existing single frontend project structure. New components follow established patterns. Drawer replaces row expansion; form components manage local edit state separate from server state.

## Architecture Decisions

### State Management for Detail Panel

```
                    ┌─────────────────────────────────────────┐
                    │           IncidentDrawer                │
                    │  ┌─────────────────────────────────────┐│
                    │  │  useIncidentForm(incident)          ││
                    │  │  - originalValues (from incident)   ││
                    │  │  - formValues (local edits)         ││
                    │  │  - hasChanges (diff detection)      ││
                    │  │  - handleChange()                   ││
                    │  │  - handleSave()                     ││
                    │  │  - handleCancel()                   ││
                    │  └─────────────────────────────────────┘│
                    │                    ↓                    │
                    │  ┌────────────────────────────────────┐ │
                    │  │   IncidentDetailForm               │ │
                    │  │   - StatusSelect (controlled)      │ │
                    │  │   - AssigneeSelect (controlled)    │ │
                    │  │   - Save/Cancel buttons            │ │
                    │  └────────────────────────────────────┘ │
                    └─────────────────────────────────────────┘
```

### Data Flow for Explicit Save

```
User edits field → useIncidentForm updates formValues
                 → hasChanges becomes true
                 → Save button enables

User clicks Save → useUpdateIncident.mutate()
                 → Loading state shown
                 → On success: drawer can close, originalValues update
                 → On error: error message, retry available

User clicks Cancel → formValues reset to originalValues
                   → hasChanges becomes false
```

### Key Changes from Current Implementation

| Current (Auto-Save) | New (Explicit Save) |
|---------------------|---------------------|
| StatusSelect calls mutate on change | StatusSelect calls onChange callback only |
| AssigneeSelect calls mutate on change | AssigneeSelect calls onChange callback only |
| Changes persist immediately | Changes held in local form state |
| No Save/Cancel buttons | Explicit Save/Cancel buttons |
| Row expansion panel | MUI Drawer side panel |
| 100% table width always visible | ~67% table visible when drawer open (desktop) |

### Responsive Behavior

| Viewport | Drawer Width | Table Visibility | Panel Position |
|----------|--------------|------------------|----------------|
| Desktop (≥900px) | ~33% (400px min) | 67% visible | Right overlay |
| Tablet (600-899px) | ~50% | 50% visible | Right overlay |
| Mobile (<600px) | 100% | Hidden (full overlay) | Full screen |

## Complexity Tracking

No constitution violations requiring justification. Design follows simplest approach:
- Reuses existing MUI Drawer component
- Extends existing hooks pattern with new useIncidentForm
- No new external dependencies
- Existing mock API PATCH endpoint handles all save operations
