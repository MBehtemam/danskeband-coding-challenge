# Tasks: Refactor Select Components and Improve Form UX

**Input**: Design documents from `/specs/013-refactor-select-components/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per Constitution Principle I (TDD) - all tests must be written FIRST and FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths are relative to repository root: `/Users/mohammedehtemam/projects/github/danskeband-coding-challenge/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure supports refactoring

- [ ] T001 Verify TypeScript 5.6.2 with strict mode enabled in tsconfig.json
- [ ] T002 Verify Material UI v7.3.7 and TanStack Query v5.90.17 are installed
- [ ] T003 Verify testing framework (Vitest + React Testing Library) is configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Verify useIncidentForm hook exists and implements explicit save pattern in src/hooks/useIncidentForm.ts
- [ ] T005 Verify SaveButton component exists in src/components/common/SaveButton.tsx
- [ ] T006 Verify SeveritySelect component follows controlled pattern (value/onChange props) in src/components/incidents/SeveritySelect.tsx
- [ ] T007 Verify useUsers hook exists for fetching user list in src/hooks/useUsers.ts
- [ ] T008 Verify IncidentStatus, IncidentSeverity, User types are defined in src/api/types.ts

**Checkpoint**: Foundation verified - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reusable Status and Assignee Selection (Priority: P1) 🎯 MVP

**Goal**: Refactor StatusSelect and AssigneeSelect to follow controlled component pattern (value/onChange props) without direct API calls, enabling reusability across DetailPanel and CreateIncidentDialog.

**Independent Test**: Can be fully tested by verifying StatusSelect and AssigneeSelect components accept value/onChange props and don't directly call update APIs. Delivers reusable components that work in isolation.

### Tests for User Story 1 (TDD - Write FIRST, ensure FAIL)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Write unit test for StatusSelect with value/onChange props in tests/unit/components/incidents/StatusSelect.test.tsx
- [ ] T010 [P] [US1] Write unit test for AssigneeSelect with value/onChange props in tests/unit/components/incidents/AssigneeSelect.test.tsx

### Implementation for User Story 1

- [ ] T011 [P] [US1] Refactor StatusSelect to controlled component pattern in src/components/incidents/StatusSelect.tsx
- [ ] T012 [P] [US1] Refactor AssigneeSelect to controlled component pattern in src/components/incidents/AssigneeSelect.tsx

**Detailed Instructions for T011**:
1. Remove `useUpdateIncident` hook import and usage
2. Remove internal state management (`useState` for status)
3. Replace props interface with contract from `contracts/component-interfaces.ts`:
   - Remove: `incidentId`, `currentStatus`, `onSuccess`
   - Add: `value`, `onChange`, `disabled`, `fullWidth`
4. Update onChange handler to call parent's `onChange` callback (no API call)
5. Use `value` prop instead of internal state
6. Respect `disabled` and `fullWidth` props
7. Keep StatusChip usage for displaying status with color

**Detailed Instructions for T012**:
1. Remove `useUpdateIncident` hook import and usage
2. Remove `useUsers` hook import and usage (users now come from props)
3. Remove internal state management (`useState` for assigneeId)
4. Replace props interface with contract from `contracts/component-interfaces.ts`:
   - Remove: `incidentId`, `currentAssigneeId`, `onSuccess`
   - Add: `value`, `onChange`, `users`, `disabled`, `fullWidth`
5. Update onChange handler to call parent's `onChange` callback (no API call)
6. Use `value` prop instead of internal state
7. Respect `disabled` and `fullWidth` props
8. Support null value for "Unassigned" state

**Checkpoint**: At this point, StatusSelect and AssigneeSelect should be fully functional controlled components, testable independently, and ready to use in both DetailPanel and CreateIncidentDialog.

---

## Phase 4: User Story 2 - Explicit Save Pattern in DetailPanel (Priority: P2)

**Goal**: Update IncidentDetailForm to use refactored select components with explicit save pattern. DetailPanel handles updateIncident API calls and provides consistent feedback (success notification at top-center with 5s auto-dismiss, inline error alerts).

**Independent Test**: Can be tested by changing multiple fields in DetailPanel and verifying changes only persist when Save button is clicked.

### Tests for User Story 2 (TDD - Write FIRST, ensure FAIL)

- [ ] T013 [P] [US2] Write integration test for explicit save flow with multiple field changes in tests/integration/detail-panel-explicit-save.test.tsx
- [ ] T014 [P] [US2] Write integration test for error recovery flow (change → save → error → retry) in tests/integration/detail-panel-error-recovery.test.tsx

### Implementation for User Story 2

- [ ] T015 [US2] Update IncidentDetailForm to use refactored StatusSelect and AssigneeSelect in src/components/incidents/IncidentDetailForm.tsx
- [ ] T016 [US2] Move error alert to top of form content area in src/components/incidents/IncidentDetailForm.tsx
- [ ] T017 [US2] Update success notification position to top-center with 5-second auto-dismiss in src/components/incidents/IncidentDetailForm.tsx
- [ ] T018 [US2] Update IncidentDrawer to pass users prop to form in src/components/incidents/IncidentDrawer.tsx

**Detailed Instructions for T015**:
1. Update StatusSelect usage:
   - Remove: `incidentId={incident.id}`, `currentStatus={...}`, `onSuccess={...}`
   - Add: `value={formValues.status}`, `onChange={form.setStatus}`, `disabled={form.isSaving}`, `fullWidth`
2. Update AssigneeSelect usage:
   - Remove: `incidentId={incident.id}`, `currentAssigneeId={...}`, `onSuccess={...}`
   - Add: `value={formValues.assigneeId}`, `onChange={form.setAssigneeId}`, `users={users}`, `disabled={form.isSaving}`, `fullWidth`
3. Ensure SeveritySelect also uses `disabled={form.isSaving}`
4. Verify SaveButton props: `disabled={!form.hasChanges}`, `loading={form.isSaving}`, `onClick={form.handleSave}`

**Detailed Instructions for T016**:
1. Move error Alert from footer (next to buttons) to top of form content area
2. Position before form fields using `sx={{ mb: 2 }}`
3. Use `role="alert"` for accessibility
4. Display error message: `{form.saveError?.message || 'Failed to save changes'}`
5. Only show when `form.saveError` is not null

**Detailed Instructions for T017**:
1. Update Snackbar component props:
   - Change `autoHideDuration` from 3000 to 5000
   - Change `anchorOrigin={{ vertical: 'top', horizontal: 'center' }}`
2. Keep Alert with `severity="success"` and `variant="filled"`
3. Keep `open={form.saveSuccess}` prop
4. Message: "Changes saved successfully"

**Detailed Instructions for T018**:
1. Fetch users with `useUsers` hook in IncidentDrawer
2. Pass `users={users || []}` prop to IncidentDetailForm
3. Update IncidentDetailForm props interface to accept `users: User[]`

**Checkpoint**: At this point, DetailPanel should implement explicit save pattern with all select components using controlled pattern, proper error alerts at top, and success notifications at top-center with 5s auto-dismiss.

---

## Phase 5: User Story 3 - Improved Error Visibility (Priority: P3)

**Goal**: Add error alerts to CreateIncidentDialog to provide clear, visible feedback when server errors occur during incident creation.

**Independent Test**: Can be tested by simulating server errors and verifying error alerts appear in CreateIncidentDialog with descriptive messages.

### Tests for User Story 3 (TDD - Write FIRST, ensure FAIL)

- [ ] T019 [P] [US3] Write integration test for CreateIncidentDialog error display in tests/integration/create-incident-error.test.tsx
- [ ] T020 [P] [US3] Write integration test for error clearing on successful retry in tests/integration/create-incident-error-recovery.test.tsx

### Implementation for User Story 3

- [ ] T021 [US3] Update CreateIncidentDialog to use refactored StatusSelect and AssigneeSelect in src/components/incidents/CreateIncidentDialog.tsx
- [ ] T022 [US3] Enhance error alert display in CreateIncidentDialog in src/components/incidents/CreateIncidentDialog.tsx

**Detailed Instructions for T021**:
1. Verify StatusSelect usage (if exists):
   - Should use: `value={status}`, `onChange={setStatus}`, `disabled={createIncident.isPending}`, `fullWidth`
2. Verify AssigneeSelect usage (if exists):
   - Should use: `value={assigneeId}`, `onChange={setAssigneeId}`, `users={users || []}`, `disabled={createIncident.isPending}`, `fullWidth`
3. Fetch users with `useUsers` hook if not already done
4. Ensure all form fields disabled during `createIncident.isPending`

**Detailed Instructions for T022**:
1. Verify error Alert exists at top of dialog content (before form fields)
2. Ensure error Alert displays when `createIncident.isError` is true
3. Display descriptive error message: `{createIncident.error?.message || 'Failed to create incident. Please try again.'}`
4. Use `severity="error"`, `role="alert"`, `sx={{ mb: 2 }}`
5. Error should clear on successful submission or dialog close

**Checkpoint**: All user stories should now be independently functional - StatusSelect/AssigneeSelect are reusable, DetailPanel uses explicit save pattern with proper notifications, and CreateIncidentDialog shows clear error feedback.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements that affect multiple user stories

- [ ] T023 [P] Run all unit tests and verify they pass: `npm test`
- [ ] T024 [P] Run all integration tests and verify they pass: `npm test tests/integration/`
- [ ] T025 [P] Run TypeScript compiler and verify no type errors: `npm run type-check`
- [ ] T026 [P] Run linter and verify no errors: `npm run lint`
- [ ] T027 Verify quickstart.md patterns work correctly with refactored components
- [ ] T028 Manual testing: Change multiple fields in DetailPanel and verify explicit save behavior
- [ ] T029 Manual testing: Verify success notification appears at top-center and auto-dismisses after 5 seconds
- [ ] T030 Manual testing: Simulate server error and verify error alerts appear in both DetailPanel and CreateIncidentDialog
- [ ] T031 Manual testing: Verify keyboard navigation works in all select components
- [ ] T032 Manual testing: Verify screen reader announces error alerts correctly (WCAG 2.1 AA)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): DEPENDS on User Story 1 completion (needs refactored select components)
  - User Story 3 (P3): DEPENDS on User Story 1 completion (needs refactored select components)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - BLOCKS User Stories 2 and 3 (provides refactored components)
- **User Story 2 (P2)**: MUST wait for User Story 1 completion - Needs refactored StatusSelect and AssigneeSelect
- **User Story 3 (P3)**: MUST wait for User Story 1 completion - Needs refactored StatusSelect and AssigneeSelect

### Within Each User Story

- Tests MUST be written FIRST and FAIL before implementation (TDD)
- Tasks marked [P] within a story can run in parallel
- All implementation tasks depend on tests being written first
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: All Setup tasks can run in parallel (T001, T002, T003)
- **Phase 2**: All Foundational verification tasks can run in parallel (T004-T008)
- **Phase 3 (US1)**:
  - Tests can be written in parallel (T009 ✅, T010 ✅)
  - After tests written, implementations can run in parallel (T011 ✅, T012 ✅)
- **Phase 4 (US2)**:
  - Tests can be written in parallel (T013 ✅, T014 ✅)
  - Implementation tasks are sequential (T015 → T016 → T017 → T018) as they modify same file
- **Phase 5 (US3)**:
  - Tests can be written in parallel (T019 ✅, T020 ✅)
  - Implementation tasks can run in parallel (T021 ✅, T022 ✅) if modifying different parts
- **Phase 6**: All polish tasks marked [P] can run in parallel (T023, T024, T025, T026)

---

## Parallel Example: User Story 1

```bash
# STEP 1: Launch all tests for User Story 1 together (write FIRST):
Task T009: "Write unit test for StatusSelect with value/onChange props in tests/unit/components/incidents/StatusSelect.test.tsx"
Task T010: "Write unit test for AssigneeSelect with value/onChange props in tests/unit/components/incidents/AssigneeSelect.test.tsx"

# STEP 2: Verify tests FAIL (they should - components don't exist yet in refactored form)

# STEP 3: Launch all implementations for User Story 1 together:
Task T011: "Refactor StatusSelect to controlled component pattern in src/components/incidents/StatusSelect.tsx"
Task T012: "Refactor AssigneeSelect to controlled component pattern in src/components/incidents/AssigneeSelect.tsx"

# STEP 4: Verify tests PASS (implementation complete)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify existing infrastructure)
2. Complete Phase 2: Foundational (verify required components exist)
3. Complete Phase 3: User Story 1 (refactor select components)
   - Write tests FIRST (T009, T010)
   - Verify tests FAIL
   - Implement refactoring (T011, T012)
   - Verify tests PASS
4. **STOP and VALIDATE**: Test refactored components independently
5. StatusSelect and AssigneeSelect are now reusable ✅

### Incremental Delivery

1. Complete Setup + Foundational → Foundation verified ✅
2. Add User Story 1 → Test independently → Refactored select components ready ✅
3. Add User Story 2 → Test independently → DetailPanel uses explicit save with refactored components ✅
4. Add User Story 3 → Test independently → CreateIncidentDialog shows error alerts ✅
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (writes tests, then implements refactoring)
3. After User Story 1 completes:
   - Developer B: User Story 2 (DetailPanel explicit save)
   - Developer C: User Story 3 (CreateIncidentDialog errors)
4. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files, no dependencies - can run in parallel
- **[Story] label** maps task to specific user story for traceability
- **TDD Required**: All tests MUST be written FIRST and FAIL before implementation (Constitution Principle I)
- **Controlled Component Pattern**: StatusSelect and AssigneeSelect no longer call APIs directly - parent components control state and API calls
- **Explicit Save Pattern**: DetailPanel uses Save button - changes are local until user clicks Save
- **Error Visibility**: Error alerts positioned at top of forms for immediate visibility
- **Success Notifications**: Top-center position with 5-second auto-dismiss per FR-007
- **Accessibility**: All components maintain WCAG 2.1 AA compliance (keyboard navigation, focus indicators, error announcements)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Reference SeveritySelect.tsx as pattern for controlled component implementation
