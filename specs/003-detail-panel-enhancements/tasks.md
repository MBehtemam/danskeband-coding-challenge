# Tasks: Detail Panel Enhancements

**Input**: Design documents from `/specs/003-detail-panel-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-interfaces.ts

**Tests**: Required (constitution mandates TDD - tests MUST be written first and fail before implementation)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Type Foundation)

**Purpose**: Extend existing types to support severity editing - required before any component work

- [X] T001 Update IncidentFormValues interface to add severity field in src/types/form.ts
- [X] T002 Update UseIncidentFormReturn interface to add setSeverity in src/types/form.ts

**Checkpoint**: Type foundation ready - hook and component work can proceed

---

## Phase 2: Foundational (Hook Enhancement)

**Purpose**: Extend useIncidentForm hook to manage severity state - BLOCKS all UI work

**⚠️ CRITICAL**: No component work can begin until this phase is complete

### Tests for Hook Enhancement ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 Add test for severity initialization from incident in src/hooks/useIncidentForm.test.ts
- [X] T004 Add test for setSeverity updates formValues.severity in src/hooks/useIncidentForm.test.ts
- [X] T005 Add test for severity change triggers hasChanges=true in src/hooks/useIncidentForm.test.ts
- [X] T006 Add test for handleCancel reverts severity to original in src/hooks/useIncidentForm.test.ts
- [X] T007 Add test for handleSave includes severity in API payload in src/hooks/useIncidentForm.test.ts

### Implementation

- [X] T008 Add severity to formValues state initialization in src/hooks/useIncidentForm.ts
- [X] T009 Add setSeverity callback function in src/hooks/useIncidentForm.ts
- [X] T010 Update hasChanges calculation to include severity comparison in src/hooks/useIncidentForm.ts
- [X] T011 Update handleCancel to revert severity to original value in src/hooks/useIncidentForm.ts
- [X] T012 Update handleSave to include severity in UpdateIncidentInput payload in src/hooks/useIncidentForm.ts

**Checkpoint**: Foundation ready - severity state management complete, user story implementation can now begin

---

## Phase 3: User Story 1 - Edit Incident Severity (Priority: P1) 🎯 MVP

**Goal**: Replace read-only severity chip with editable dropdown that persists changes via Save button

**Independent Test**: Open incident, change severity from one level to another, click Save, verify new severity displays correctly in panel and list

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US1] Create test file and add test for rendering severity dropdown in src/components/incidents/SeveritySelect.test.tsx
- [X] T014 [P] [US1] Add test for displaying all four severity options in src/components/incidents/SeveritySelect.test.tsx
- [X] T015 [P] [US1] Add test for calling onChange when option selected in src/components/incidents/SeveritySelect.test.tsx
- [X] T016 [P] [US1] Add test for disabled state during save in src/components/incidents/SeveritySelect.test.tsx
- [X] T017 [US1] Add test for severity dropdown integration in form in src/components/incidents/IncidentDetailForm.test.tsx

### Implementation for User Story 1

- [X] T018 [US1] Create SeveritySelect component with FormControl/Select in src/components/incidents/SeveritySelect.tsx
- [X] T019 [US1] Export SEVERITY_OPTIONS constant in src/components/incidents/SeveritySelect.tsx
- [X] T020 [US1] Add proper aria-label and labelId for accessibility in src/components/incidents/SeveritySelect.tsx
- [X] T021 [US1] Update IncidentDetailFormProps to include onSeverityChange and onClose in src/components/incidents/IncidentDetailForm.tsx
- [X] T022 [US1] Add SeveritySelect to IncidentDetailForm component in src/components/incidents/IncidentDetailForm.tsx
- [X] T023 [US1] Update IncidentDrawer to pass setSeverity and onClose to form in src/components/incidents/IncidentDrawer.tsx

**Checkpoint**: User Story 1 complete - severity editing works end-to-end

---

## Phase 4: User Story 2 - Improved Panel Layout (Priority: P1)

**Goal**: Organize panel into logical sections (Header, Editable Fields, Metadata, History) with collapsible status history

**Independent Test**: Open any incident and verify information is organized into 4 distinct visual sections with consistent alignment, and status history can be collapsed/expanded

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US2] Add test for incident ID display in header section in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T025 [P] [US2] Add test for editable fields section grouping in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T026 [P] [US2] Add test for metadata section display in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T027 [P] [US2] Add test for collapsible status history with Accordion in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T028 [P] [US2] Add test for accordion default expanded state in src/components/incidents/IncidentDetailForm.test.tsx

### Implementation for User Story 2

- [X] T029 [US2] Create Header section with incident ID and title display in src/components/incidents/IncidentDetailForm.tsx
- [X] T030 [US2] Create Editable Fields section with Box container and subtitle in src/components/incidents/IncidentDetailForm.tsx
- [X] T031 [US2] Group Status, Severity, and Assignee fields with flex layout in src/components/incidents/IncidentDetailForm.tsx
- [X] T032 [US2] Create Metadata section for Created/Updated timestamps in src/components/incidents/IncidentDetailForm.tsx
- [X] T033 [US2] Import Accordion, AccordionSummary, AccordionDetails, ExpandMoreIcon from MUI in src/components/incidents/IncidentDetailForm.tsx
- [X] T034 [US2] Wrap StatusHistoryTimeline in Accordion with defaultExpanded in src/components/incidents/IncidentDetailForm.tsx
- [X] T035 [US2] Add proper ARIA attributes for accordion accessibility in src/components/incidents/IncidentDetailForm.tsx
- [X] T036 [US2] Apply consistent spacing and typography per research.md decisions in src/components/incidents/IncidentDetailForm.tsx

**Checkpoint**: User Story 2 complete - layout sections clearly organized with collapsible history

---

## Phase 5: User Story 3 - Close Panel via Cancel Button (Priority: P2)

**Goal**: Cancel button closes panel when no unsaved changes, reverts changes when unsaved changes exist

**Independent Test**: Open panel without changes, click Cancel, verify panel closes. Then open, make change, click Cancel, verify change reverts but panel stays open

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T037 [P] [US3] Add test for Cancel calls onClose when hasChanges is false in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T038 [P] [US3] Add test for Cancel calls onCancel when hasChanges is true in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T039 [P] [US3] Add test for Cancel button never disabled except during save in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T040 [P] [US3] Add test for Cancel aria-label changes based on hasChanges state in src/components/incidents/IncidentDetailForm.test.tsx

### Implementation for User Story 3

- [X] T041 [US3] Create handleCancelClick function with dual behavior logic in src/components/incidents/IncidentDetailForm.tsx
- [X] T042 [US3] Update Cancel button to use handleCancelClick instead of onCancel directly in src/components/incidents/IncidentDetailForm.tsx
- [X] T043 [US3] Remove disabled={!hasChanges} condition from Cancel button in src/components/incidents/IncidentDetailForm.tsx
- [X] T044 [US3] Add dynamic aria-label based on hasChanges state in src/components/incidents/IncidentDetailForm.tsx

**Checkpoint**: User Story 3 complete - Cancel button has context-aware dual behavior

---

## Phase 6: User Story 4 - Display Incident ID (Priority: P3)

**Goal**: Show incident ID in header area for reference in communications and documentation

**Independent Test**: Open incident and verify ID is visible in header area and can be selected for copying

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T045 [P] [US4] Add test for incident ID rendered with caption typography in src/components/incidents/IncidentDetailForm.test.tsx
- [X] T046 [P] [US4] Add test for ID text is selectable (no user-select: none) in src/components/incidents/IncidentDetailForm.test.tsx

### Implementation for User Story 4

- [X] T047 [US4] Add Typography caption with incident.id above title in src/components/incidents/IncidentDetailForm.tsx
- [X] T048 [US4] Apply subtle styling (text.secondary color) per research.md in src/components/incidents/IncidentDetailForm.tsx

**Checkpoint**: User Story 4 complete - incident ID visible and copyable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and final verification

- [X] T049 [P] Run npm run lint and fix any linting errors
- [X] T050 [P] Run npx tsc --noEmit and fix any type errors
- [X] T051 Run npm test and verify all tests pass
- [ ] T052 [P] Test responsive layout at mobile breakpoints (320px, 375px, 768px)
- [ ] T053 [P] Verify accessibility with keyboard navigation test
- [ ] T054 Run quickstart.md acceptance checklist validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all component work
- **User Stories (Phase 3-6)**: All depend on Phase 2 completion
  - US1 and US2 are both P1 priority - can be done in parallel
  - US3 depends on Cancel button existing (minor overlap with US2 layout)
  - US4 is self-contained, lowest priority
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - Independent
- **User Story 2 (P1)**: Can start after Phase 2 - Independent (includes layout where US1 severity goes)
- **User Story 3 (P2)**: Can start after Phase 2 - Uses Cancel button from existing layout
- **User Story 4 (P3)**: Can start after Phase 2 - Independent, integrates into header from US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Write component tests before component implementation
- Verify each story works independently at checkpoint

### Parallel Opportunities

Within Phase 2 (Foundational):
- All hook tests (T003-T007) can run in parallel
- Hook implementation (T008-T012) is sequential (state dependencies)

Within User Story 1:
- All SeveritySelect tests (T013-T016) can run in parallel
- SeveritySelect implementation (T018-T020) is sequential

Within User Story 2:
- All layout tests (T024-T028) can run in parallel
- Layout implementation has some dependencies but many can parallel

Within User Story 3:
- All Cancel button tests (T037-T040) can run in parallel

Within User Story 4:
- All ID display tests (T045-T046) can run in parallel

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all SeveritySelect tests together:
Task: "Create test for rendering severity dropdown in src/components/incidents/SeveritySelect.test.tsx"
Task: "Add test for displaying all four severity options in src/components/incidents/SeveritySelect.test.tsx"
Task: "Add test for calling onChange when option selected in src/components/incidents/SeveritySelect.test.tsx"
Task: "Add test for disabled state during save in src/components/incidents/SeveritySelect.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types)
2. Complete Phase 2: Foundational (hook)
3. Complete Phase 3: User Story 1 (severity editing)
4. **STOP and VALIDATE**: Test severity editing works end-to-end
5. Deploy/demo severity editing capability

### Recommended Full Implementation Order

1. **Phase 1-2**: Setup + Foundation (types and hook) - Must complete first
2. **Phase 3**: User Story 1 (severity editing) - Core functionality
3. **Phase 4**: User Story 2 (layout improvements) - Visual organization
4. **Phase 5**: User Story 3 (Cancel dual behavior) - UX polish
5. **Phase 6**: User Story 4 (incident ID) - Minor enhancement
6. **Phase 7**: Polish - Final validation

### Incremental Delivery

1. After US1: Users can edit severity ✓
2. After US2: Panel is visually organized, history collapsible ✓
3. After US3: Cancel button works intuitively ✓
4. After US4: Incident ID visible for reference ✓
5. Each story adds value without breaking previous stories

---

## Summary

| Phase | Tasks | Parallel Tasks | Story |
|-------|-------|----------------|-------|
| 1: Setup | 2 | 0 | - |
| 2: Foundational | 10 | 0 | - |
| 3: US1 | 11 | 4 | Edit Severity |
| 4: US2 | 13 | 5 | Panel Layout |
| 5: US3 | 8 | 4 | Cancel Behavior |
| 6: US4 | 4 | 2 | Incident ID |
| 7: Polish | 6 | 4 | - |
| **Total** | **54** | **19** | |

---

## Notes

- [P] tasks = different files or no dependencies, can run simultaneously
- [Story] label maps task to specific user story for traceability
- TDD required: Write failing tests before implementation
- Each user story has independent checkpoint for validation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
