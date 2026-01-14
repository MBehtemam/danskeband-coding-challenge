# Tasks: Detail Panel with Explicit Save

**Input**: Design documents from `/specs/002-detail-panel-save/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD required per constitution - tests are written FIRST and must FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, type definitions, and directory structure

- [x] T001 Create form types file with IncidentFormValues, IncidentFormState, UseIncidentFormReturn interfaces in src/types/form.ts
- [x] T002 [P] Create components/common directory if not exists
- [x] T003 [P] Create hooks directory if not exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable components and hooks that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational Components

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] Create test file for SaveButton component in src/components/common/SaveButton.test.tsx with tests for: disabled state, loading state, click handler, accessible button label
- [x] T005 [P] Create test file for useIncidentForm hook in src/hooks/useIncidentForm.test.ts with tests for: initial state from incident, hasChanges detection, setStatus, setAssigneeId, handleCancel resets values, handleSave calls mutation

### Implementation for Foundational Components

- [x] T006 [P] Implement SaveButton component with loading spinner and disabled states in src/components/common/SaveButton.tsx
- [x] T007 Implement useIncidentForm hook with form state management in src/hooks/useIncidentForm.ts (depends on T001 types)

**Checkpoint**: Foundation ready - SaveButton and useIncidentForm available for all user stories

---

## Phase 3: User Story 1 - View Incident Details in Side Panel (Priority: P1) 🎯 MVP

**Goal**: Replace row expansion with MUI Drawer side panel showing full incident details

**Independent Test**: Click an incident row and verify a side panel opens showing all incident details (title, description, status, severity, assignee, timestamps, status history) without expanding the table row.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Create test file for IncidentDrawer in src/components/incidents/IncidentDrawer.test.tsx with tests for: renders when incident provided, shows incident title, shows all detail fields, calls onClose when close button clicked, updates when incident prop changes
- [x] T009 [P] [US1] Create test file for IncidentDetailForm (read-only fields) in src/components/incidents/IncidentDetailForm.test.tsx with tests for: displays title, description, severity, timestamps, status history as read-only

### Implementation for User Story 1

- [x] T010 [P] [US1] Create IncidentDrawer component shell with MUI Drawer (anchor=right, responsive width) in src/components/incidents/IncidentDrawer.tsx
- [x] T011 [US1] Create IncidentDetailForm component with read-only incident fields display in src/components/incidents/IncidentDetailForm.tsx
- [x] T012 [US1] Wire IncidentDrawer to show IncidentDetailForm with incident data passed through props
- [x] T013 [US1] Add close button with accessibility (aria-label) to IncidentDrawer header
- [x] T014 [US1] Implement responsive drawer width (100% mobile, 400px tablet, 33% desktop) using MUI sx breakpoints
- [x] T015 [US1] Modify IncidentTable to remove row expansion logic in src/components/incidents/IncidentTable.tsx
- [x] T016 [US1] Add row click handler in IncidentTable to navigate to /incidents/:id route (existing pattern)
- [x] T017 [US1] Integrate IncidentDrawer into main App/page component, driven by URL incidentId param
- [x] T018 [US1] Remove or deprecate IncidentDetailPanel component (replaced by IncidentDrawer)

**Checkpoint**: User Story 1 complete - clicking a row opens a side drawer with read-only incident details

---

## Phase 4: User Story 2 - Edit Incident with Explicit Save (Priority: P1)

**Goal**: Users can edit status/assignee and explicitly save changes with Save button

**Independent Test**: Open an incident, change status and/or assignee, observe changes are not saved automatically, then click Save and verify changes persist.

**Dependencies**: Requires US1 (drawer must exist to add editing)

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T019 [P] [US2] Add tests to IncidentDetailForm.test.tsx for: StatusSelect renders with current value, AssigneeSelect renders with current value, onStatusChange callback called on change, onAssigneeChange callback called on change, Save button exists, onSave callback called when Save clicked
- [x] T020 [P] [US2] Add tests to IncidentDrawer.test.tsx for: integrates useIncidentForm hook, passes form values to IncidentDetailForm, save triggers mutation, shows loading during save, shows error on save failure, success feedback on save complete

### Implementation for User Story 2

- [x] T021 [US2] Modify StatusSelect to support controlled mode (value/onChange props) in src/components/incidents/StatusSelect.tsx
- [x] T022 [US2] Modify AssigneeSelect to support controlled mode (value/onChange props) in src/components/incidents/AssigneeSelect.tsx
- [x] T023 [US2] Add editable StatusSelect to IncidentDetailForm connected to onStatusChange callback
- [x] T024 [US2] Add editable AssigneeSelect to IncidentDetailForm connected to onAssigneeChange callback
- [x] T025 [US2] Add Save button using SaveButton component to IncidentDetailForm footer
- [x] T026 [US2] Wire IncidentDrawer to use useIncidentForm hook for state management
- [x] T027 [US2] Connect Save button onClick to handleSave from useIncidentForm
- [x] T028 [US2] Display loading indicator (isSaving) during save operation
- [x] T029 [US2] Display error message when saveError is present with retry option
- [x] T030 [US2] Display success feedback (snackbar or inline) when save completes

**Checkpoint**: User Story 2 complete - users can edit status/assignee and explicitly save changes

---

## Phase 5: User Story 3 - Visual Indication of Unsaved Changes (Priority: P2)

**Goal**: Users see clear visual feedback when they have unsaved changes

**Independent Test**: Make a change and observe visual feedback (Save button enabled/highlighted) that indicates unsaved changes exist.

**Dependencies**: Requires US2 (editing must exist to have unsaved changes)

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T031 [P] [US3] Add tests to IncidentDetailForm.test.tsx for: Save button disabled when hasChanges=false, Save button enabled when hasChanges=true, Save button has visual emphasis when hasChanges=true
- [x] T032 [P] [US3] Add tests to IncidentDrawer.test.tsx for: hasChanges correctly computed when form values differ from original

### Implementation for User Story 3

- [x] T033 [US3] Style Save button to show disabled/muted state when hasChanges=false in SaveButton.tsx
- [x] T034 [US3] Style Save button with visual emphasis (contained variant, primary color) when hasChanges=true
- [x] T035 [US3] Ensure Save button transitions back to disabled state after successful save
- [x] T036 [US3] Ensure Save button transitions back to disabled state when changes reverted to original values

**Checkpoint**: User Story 3 complete - users can clearly see when they have unsaved changes

---

## Phase 6: User Story 4 - Cancel Edits (Priority: P2)

**Goal**: Users can cancel edits and revert to original values

**Independent Test**: Make changes, click Cancel/Discard, and verify the panel reverts to showing original values.

**Dependencies**: Requires US2 (editing must exist to cancel edits)

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T037 [P] [US4] Add tests to IncidentDetailForm.test.tsx for: Cancel button exists, Cancel button disabled when hasChanges=false, Cancel button enabled when hasChanges=true, onCancel callback called when Cancel clicked
- [x] T038 [P] [US4] Add tests to useIncidentForm.test.ts for: handleCancel resets formValues to originalValues, handleCancel clears saveError, hasChanges=false after handleCancel

### Implementation for User Story 4

- [x] T039 [US4] Add Cancel button to IncidentDetailForm footer next to Save button
- [x] T040 [US4] Wire Cancel button onClick to handleCancel from useIncidentForm
- [x] T041 [US4] Style Cancel button to show disabled state when hasChanges=false
- [x] T042 [US4] Implement handleCancel in useIncidentForm to reset formValues to originalValues
- [x] T043 [US4] Clear saveError state when cancel is clicked

**Checkpoint**: User Story 4 complete - users can cancel edits and revert to original values

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, edge cases, and cleanup

- [x] T044 [P] Add keyboard accessibility: Escape key closes drawer in IncidentDrawer.tsx
- [x] T045 [P] Add focus management: auto-focus first interactive element when drawer opens
- [x] T046 [P] Add aria-labelledby to drawer pointing to incident title for screen readers
- [x] T047 [P] Add aria-busy to form during save operation
- [x] T048 Handle edge case: reset form when selectedIncidentId changes (discard unsaved changes silently per spec)
- [x] T049 [P] Ensure URL deep linking works: opening /incidents/:id directly shows drawer
- [x] T050 [P] Ensure filter state preserved in URL when opening/closing drawer
- [x] T051 Run full test suite and fix any failures: npm test
- [x] T052 Run linter and fix any issues: npm run lint
- [x] T053 Manual testing against quickstart.md accessibility checklist
- [x] T054 Manual testing at responsive breakpoints (320px, 600px, 900px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on US1 (need drawer to add editing)
- **User Story 3 (Phase 5)**: Depends on US2 (need editing to show unsaved indicator)
- **User Story 4 (Phase 6)**: Depends on US2 (need editing to cancel)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (SaveButton, useIncidentForm)
    ↓
Phase 3: US1 - View Details in Side Panel (P1) 🎯 MVP
    ↓
Phase 4: US2 - Edit with Explicit Save (P1)
   ↓ ↘
Phase 5: US3 - Unsaved Changes Indicator (P2)
   ↓ ↙
Phase 6: US4 - Cancel Edits (P2)
    ↓
Phase 7: Polish
```

Note: US3 and US4 can run in parallel after US2 completes (different concerns, minimal file overlap)

### Within Each User Story

1. Tests MUST be written and FAIL before implementation
2. Component shell/structure before detailed implementation
3. Wire up integration after component is functional
4. Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002 and T003 can run in parallel (different directories)

**Phase 2 (Foundational)**:
- T004 and T005 can run in parallel (different test files)
- T006 can run parallel after T004 passes (different implementation file)

**Phase 3 (US1)**:
- T008 and T009 can run in parallel (different test files)
- T010 can run after T008 written (implementation for its tests)

**Phase 5 & 6 (US3 & US4)**:
- Can run in parallel after US2 completes (different features, minimal overlap)

**Phase 7 (Polish)**:
- T044, T045, T046, T047 can run in parallel (different accessibility concerns)
- T049, T050 can run in parallel (different URL behaviors)

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tests together:
Task: "Create test file for SaveButton in src/components/common/SaveButton.test.tsx"
Task: "Create test file for useIncidentForm in src/hooks/useIncidentForm.test.ts"

# After tests written, launch implementations in parallel:
Task: "Implement SaveButton component in src/components/common/SaveButton.tsx"
Task: "Implement useIncidentForm hook in src/hooks/useIncidentForm.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (SaveButton + useIncidentForm)
3. Complete Phase 3: User Story 1 (View Details in Side Panel)
4. **STOP and VALIDATE**: Test US1 independently - clicking rows opens drawer with details
5. Deploy/demo if ready (basic drawer without editing)

### Full Feature (All Stories)

1. Complete Setup + Foundational + US1 (MVP)
2. Add US2 (Explicit Save) → Test independently
3. Add US3 + US4 in parallel (Unsaved Indicator + Cancel) → Test independently
4. Polish phase for accessibility and edge cases
5. Full regression test

### Task Count Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Phase 1: Setup | 3 | 2 |
| Phase 2: Foundational | 4 | 3 |
| Phase 3: US1 | 11 | 2 |
| Phase 4: US2 | 12 | 2 |
| Phase 5: US3 | 6 | 2 |
| Phase 6: US4 | 7 | 2 |
| Phase 7: Polish | 11 | 7 |
| **Total** | **54** | **20** |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD required: Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution mandates: Tests first, TypeScript strict, WCAG 2.1 AA accessibility
