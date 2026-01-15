# Tasks: Saved Table Views

**Input**: Design documents from `/specs/011-saved-views/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Following TDD approach - tests MUST be written BEFORE implementation per constitution requirement (Principle I: Test-First Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create type definitions and foundational structure for saved views feature

- [X] T001 Create `src/types/savedViews.ts` with ViewConfig, SavedView, StorageStatus, SavedViewsState, SavedViewsContextValue, ValidationResult interfaces and constants
- [X] T002 Update `src/api/types.ts` to re-export saved views types for convenience

**Checkpoint**: Types defined - can proceed with TDD implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core storage and context infrastructure that MUST be complete before ANY user story UI can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Storage Layer (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [P] Unit test for `getSavedViews()` with empty localStorage, valid data, corrupted data, and unavailable storage in `tests/unit/savedViewsStorage.test.ts`
- [X] T004 [P] Unit test for `setSavedViews()` with success, QuotaExceededError, and SecurityError cases in `tests/unit/savedViewsStorage.test.ts`
- [X] T005 [P] Unit test for `getActiveViewId()` and `setActiveViewId()` in `tests/unit/savedViewsStorage.test.ts`
- [X] T006 [P] Unit test for `validateSavedViewsData()` with valid/invalid structures in `tests/unit/savedViewsStorage.test.ts`
- [X] T007 [P] Unit test for `isStorageAvailable()` with available/unavailable localStorage in `tests/unit/savedViewsStorage.test.ts`

### Storage Layer Implementation

- [X] T008 [P] Implement `getSavedViews()` in `src/api/storage.ts` with error handling and corruption recovery
- [X] T009 [P] Implement `setSavedViews()` in `src/api/storage.ts` with quota exceeded handling
- [X] T010 [P] Implement `getActiveViewId()` and `setActiveViewId()` in `src/api/storage.ts`
- [X] T011 [P] Implement `validateSavedViewsData()` in `src/api/storage.ts` with comprehensive validation
- [X] T012 [P] Implement `isStorageAvailable()` in `src/api/storage.ts` with caching

### Tests for SavedViewsContext (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] Unit test for SavedViewsContext initialization (load from storage, detect availability, handle corruption) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T014 [P] Unit test for `createView()` method (success, validation failures, max limit, storage failure) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T015 [P] Unit test for `applyView()` method (apply by ID, apply null for default, invalid ID) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T016 [P] Unit test for `updateView()` method (success, view not found, storage failure) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T017 [P] Unit test for `renameView()` method (success, duplicate name, invalid name) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T018 [P] Unit test for `deleteView()` method (success, delete active view, view not found) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T019 [P] Unit test for `validateViewName()` method (valid, empty, too long, duplicate) in `src/contexts/SavedViewsContext.test.tsx`
- [X] T020 [P] Unit test for `isDirty` state calculation in `src/contexts/SavedViewsContext.test.tsx`

### Context Layer Implementation

- [X] T021 Create `src/contexts/SavedViewsContext.tsx` with context provider, state initialization from localStorage, and storage availability detection
- [X] T022 Implement `createView()` method in SavedViewsContext with UUID generation, validation, max limit enforcement, and persistence
- [X] T023 Implement `applyView()` method in SavedViewsContext with view lookup and activeViewId persistence
- [X] T024 Implement `updateView()` method in SavedViewsContext with timestamp update and persistence
- [X] T025 Implement `renameView()` method in SavedViewsContext with validation and persistence
- [X] T026 Implement `deleteView()` method in SavedViewsContext with active view handling and persistence
- [X] T027 Implement `validateViewName()` method in SavedViewsContext with length, emptiness, and uniqueness checks
- [X] T028 Implement `isDirty` state tracking in SavedViewsContext by comparing current table state to active view config
- [X] T029 Create `src/hooks/useSavedViews.ts` custom hook with provider requirement enforcement

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Apply Saved Views (Priority: P1) 🎯 MVP

**Goal**: Users can save current table configurations as named views and quickly switch between them

**Independent Test**: Create a view with specific column visibility and filters, save with unique name, switch to another configuration, then reapply the saved view to verify table returns to saved state

### Tests for User Story 1 (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T030 [P] [US1] Component test for SaveViewPanel in create mode (render, validation, submit, cancel) in `src/components/incidents/saved-views/SaveViewPanel.test.tsx`
- [X] T031 [P] [US1] Component test for SavedViewsDropdown (render views list, select view, show active view, keyboard navigation) in `src/components/incidents/saved-views/SavedViewsDropdown.test.tsx`
- [X] T032 [P] [US1] Integration test for create-and-apply workflow (create view → switch config → reapply view) in `tests/integration/saved-views.test.tsx`

### Implementation for User Story 1

- [X] T033 [P] [US1] Create SaveViewPanel component in `src/components/incidents/saved-views/SaveViewPanel.tsx` with create mode, name input, validation, and config preview
- [X] T034 [P] [US1] Create SavedViewsDropdown component in `src/components/incidents/saved-views/SavedViewsDropdown.tsx` with button, menu, view list, and "Create New View" option
- [X] T035 [US1] Wrap DashboardPage with SavedViewsProvider in `src/components/incidents/DashboardPage.tsx`
- [X] T036 [US1] Integrate SavedViewsDropdown into IncidentTable toolbar in `src/components/incidents/IncidentTable.tsx` with view application logic
- [X] T037 [US1] Add captureCurrentConfig() and applyConfigToTable() helper functions in `src/components/incidents/IncidentTable.tsx`
- [X] T038 [US1] Wire SaveViewPanel open/close state and handlers in `src/components/incidents/IncidentTable.tsx`
- [X] T039 [US1] Add integration tests for view application in `src/components/incidents/IncidentTable.test.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create and apply saved views independently

---

## Phase 4: User Story 2 - Manage Saved Views (Priority: P2)

**Goal**: Users can update view configurations, rename views, and delete views they no longer need

**Independent Test**: Edit an existing view's name or configuration, apply it to verify changes persisted, and delete unused views to verify they're removed from dropdown

### Tests for User Story 2 (TDD)

- [X] T040 [P] [US2] Component test for SaveViewPanel in rename mode in `src/components/incidents/saved-views/SaveViewPanel.test.tsx`
- [X] T041 [P] [US2] Component test for DeleteViewDialog (render, confirm, cancel, keyboard) in `src/components/incidents/saved-views/DeleteViewDialog.test.tsx`
- [X] T042 [P] [US2] Component test for SavedViewsDropdown action buttons (rename, update, delete) in `src/components/incidents/saved-views/SavedViewsDropdown.test.tsx`
- [X] T043 [P] [US2] Integration test for update workflow (modify table → update view → reapply → verify changes saved) in `tests/integration/saved-views.test.tsx`
- [X] T044 [P] [US2] Integration test for rename workflow (rename view → verify name change persists) in `tests/integration/saved-views.test.tsx`
- [X] T045 [P] [US2] Integration test for delete workflow (delete view → verify removed from list → verify default applied if was active) in `tests/integration/saved-views.test.tsx`

### Implementation for User Story 2

- [X] T046 [P] [US2] Add rename mode to SaveViewPanel component in `src/components/incidents/saved-views/SaveViewPanel.tsx`
- [X] T047 [P] [US2] Create DeleteViewDialog component in `src/components/incidents/saved-views/DeleteViewDialog.tsx` with confirmation message and destructive action styling
- [X] T048 [US2] Add action buttons (rename, update, delete) to view items in SavedViewsDropdown in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T049 [US2] Add dirty indicator ("*") to SavedViewsDropdown button when isDirty is true in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T050 [US2] Wire rename panel open/close state and handlers in `src/components/incidents/IncidentTable.tsx`
- [X] T051 [US2] Wire DeleteViewDialog open/close state and handlers in `src/components/incidents/IncidentTable.tsx`
- [X] T052 [US2] Implement update view logic when user clicks update action in `src/components/incidents/IncidentTable.tsx`
- [X] T053 [US2] Implement delete view logic with active view handling in `src/components/incidents/IncidentTable.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can create, apply, rename, update, and delete views

---

## Phase 5: User Story 3 - View Persistence and Default State (Priority: P3)

**Goal**: Application remembers which view was active when user returns to incident table

**Independent Test**: Apply a saved view, refresh browser, and verify same view is still active

### Tests for User Story 3 (TDD)

- [X] T054 [P] [US3] Integration test for view persistence across page refresh in `tests/integration/saved-views.test.tsx`
- [X] T055 [P] [US3] Integration test for navigation away and back with view persistence in `tests/integration/saved-views.test.tsx`
- [X] T056 [P] [US3] Integration test for default view when no saved views exist in `tests/integration/saved-views.test.tsx`
- [X] T057 [P] [US3] Integration test for invalid activeViewId reference handling in `tests/integration/saved-views.test.tsx`
- [X] T058 [P] [US3] Integration test for manual changes discarded on refresh in `tests/integration/saved-views.test.tsx`

### Implementation for User Story 3

- [X] T059 [US3] Add useEffect in SavedViewsContext to apply active view on mount in `src/contexts/SavedViewsContext.tsx`
- [X] T060 [US3] Add useEffect in IncidentTable to apply view config from context on mount in `src/components/incidents/IncidentTable.tsx`
- [X] T061 [US3] Add validation in SavedViewsContext to clear invalid activeViewId references on init in `src/contexts/SavedViewsContext.tsx`
- [X] T062 [US3] Add DEFAULT_VIEW_CONFIG application when activeViewId is null in `src/components/incidents/IncidentTable.tsx`

**Checkpoint**: All core user stories (P1-P3) now work - views persist across sessions and handle edge cases

---

## Phase 6: User Story 4 - Toolbar Layout Update (Priority: P4)

**Goal**: Move "Create Incident" button to left side of toolbar for better visual hierarchy

**Independent Test**: Visually inspect toolbar and verify "Create Incident" button is positioned on left side

### Tests for User Story 4 (TDD)

- [X] T063 [US4] Component test for toolbar layout with Create button on left in `src/components/incidents/IncidentTable.test.tsx`

### Implementation for User Story 4

- [X] T064 [US4] Move "Create Incident" button to left side of toolbar in renderTopToolbarCustomActions in `src/components/incidents/IncidentTable.tsx`
- [X] T065 [US4] Add flexbox spacer between Create button and Saved Views dropdown in `src/components/incidents/IncidentTable.tsx`

**Checkpoint**: All user stories complete - toolbar layout improved

---

## Phase 7: Edge Cases & Error Handling

**Purpose**: Handle edge cases and error conditions gracefully per constitution requirement (Principle IV: UX Excellence)

### Tests for Edge Cases (TDD)

- [X] T066 [P] Integration test for localStorage unavailable (private mode) with graceful degradation in `tests/integration/saved-views.test.tsx`
- [X] T067 [P] Integration test for maximum views limit (50 views) enforcement in `tests/integration/saved-views.test.tsx`
- [X] T068 [P] Integration test for corrupted localStorage data recovery in `tests/integration/saved-views.test.tsx`
- [X] T069 [P] Integration test for view name validation edge cases (empty, too long, duplicates) in `tests/integration/saved-views.test.tsx`
- [X] T070 [P] Integration test for deleting currently active view in `tests/integration/saved-views.test.tsx`

### Edge Case Implementation

- [X] T071 [P] Add storage availability warning banner in SavedViewsDropdown when storageAvailable is 'session' in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T072 [P] Add error dialog display when storageAvailable is 'none' in SavedViewsDropdown in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T073 [P] Add max views limit error message when attempting to create 51st view in SaveViewPanel in `src/components/incidents/saved-views/SaveViewPanel.tsx`
- [X] T074 [P] Add view count indicator (X/50) in SavedViewsDropdown menu footer in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`

**Checkpoint**: All edge cases handled gracefully - feature is robust

---

## Phase 8: Accessibility & Polish

**Purpose**: Ensure WCAG 2.1 AA compliance and polish UX per constitution requirement (Principle V: Accessibility)

### Tests for Accessibility (TDD)

- [X] T075 [P] Accessibility test for SavedViewsDropdown (ARIA labels, keyboard navigation, focus management) in `src/components/incidents/saved-views/SavedViewsDropdown.test.tsx`
- [X] T076 [P] Accessibility test for SaveViewPanel (focus trap, auto-focus, ARIA attributes) in `src/components/incidents/saved-views/SaveViewPanel.test.tsx`
- [X] T077 [P] Accessibility test for DeleteViewDialog (alert dialog role, focus management) in `src/components/incidents/saved-views/DeleteViewDialog.test.tsx`

### Accessibility Implementation

- [X] T078 [P] Add ARIA labels and roles to SavedViewsDropdown menu in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T079 [P] Add keyboard navigation support (arrow keys, enter, escape) to SavedViewsDropdown in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T080 [P] Add focus trap to SaveViewPanel with auto-focus on name field in `src/components/incidents/saved-views/SaveViewPanel.tsx`
- [X] T081 [P] Add focus management to DeleteViewDialog with auto-focus on Cancel button in `src/components/incidents/saved-views/DeleteViewDialog.tsx`
- [X] T082 [P] Add loading states for async operations (save, delete) with visual feedback in `src/components/incidents/saved-views/SaveViewPanel.tsx`

### Polish Tasks

- [X] T083 [P] Add success/error toast notifications for create, update, rename, delete operations in `src/components/incidents/IncidentTable.tsx`
- [X] T084 [P] Add view config preview formatting (readable summary) in SaveViewPanel in `src/components/incidents/saved-views/SaveViewPanel.tsx`
- [X] T085 [P] Add alphabetical sorting of views in dropdown menu in SavedViewsDropdown in `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [X] T086 Run full test suite and ensure 100% pass rate with `npm test`
- [X] T087 Run linter and fix any warnings with `npm run lint`
- [X] T088 Run build and ensure no TypeScript errors with `npm run build`
- [X] T089 Manual QA: Test all user stories end-to-end per spec.md acceptance scenarios
- [X] T090 Manual QA: Test with screen reader (VoiceOver or NVDA) for accessibility validation

**Checkpoint**: Feature complete, tested, accessible, and ready for production

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Phase 2 - MVP target
  - User Story 2 (P2) depends on US1 components existing
  - User Story 3 (P3) depends on US1 components existing
  - User Story 4 (P4) independent, can be done anytime after Phase 2
- **Edge Cases (Phase 7)**: Depends on all user stories being implemented
- **Accessibility & Polish (Phase 8)**: Depends on all user stories being implemented

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP target**
- **User Story 2 (P2)**: Depends on US1 (extends SaveViewPanel and SavedViewsDropdown components)
- **User Story 3 (P3)**: Depends on US1 (adds persistence to existing components)
- **User Story 4 (P4)**: Independent - only affects toolbar layout

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD requirement)
- Storage functions before context (Phase 2)
- Context before UI components
- UI components can be built in parallel within a story (marked [P])
- Integration after components are built
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: All tasks can run in parallel (T001, T002)
- **Phase 2 Tests**: All storage tests (T003-T007) can run in parallel, all context tests (T013-T020) can run in parallel
- **Phase 2 Implementation**: All storage functions (T008-T012) can run in parallel after storage tests pass
- **Phase 3 Tests**: All US1 tests (T030-T032) can run in parallel
- **Phase 3 Implementation**: SaveViewPanel (T033) and SavedViewsDropdown (T034) can run in parallel
- **Phase 4 Tests**: All US2 tests (T040-T045) can run in parallel
- **Phase 4 Implementation**: Panel rename mode (T046), DeleteViewDialog (T047), and dropdown actions (T048-T049) can run in parallel
- **Phase 5 Tests**: All US3 tests (T054-T058) can run in parallel
- **Phase 7 Tests**: All edge case tests (T066-T070) can run in parallel
- **Phase 7 Implementation**: All edge case UI updates (T071-T074) can run in parallel
- **Phase 8 Tests**: All accessibility tests (T075-T077) can run in parallel
- **Phase 8 Implementation**: All accessibility improvements (T078-T082) and polish tasks (T083-T085) can run in parallel

---

## Parallel Example: User Story 1 Implementation

```bash
# After US1 tests are written and failing, launch parallel implementation:
Task T033: "Create SaveViewPanel component in src/components/incidents/saved-views/SaveViewPanel.tsx"
Task T034: "Create SavedViewsDropdown component in src/components/incidents/saved-views/SavedViewsDropdown.tsx"

# Then sequentially integrate:
Task T035: "Wrap DashboardPage with SavedViewsProvider"
Task T036: "Integrate SavedViewsDropdown into IncidentTable toolbar"
Task T037: "Add helper functions in IncidentTable"
Task T038: "Wire SaveViewPanel state and handlers"
Task T039: "Add integration tests for view application"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended

1. Complete Phase 1: Setup (types) → ~30 mins
2. Complete Phase 2: Foundational (storage + context with TDD) → ~3 hours
3. Complete Phase 3: User Story 1 (create and apply views with TDD) → ~2 hours
4. **STOP and VALIDATE**: Test User Story 1 independently per acceptance scenarios
5. Demo/deploy if ready - users can now create and switch between saved views

**Estimated MVP Time**: ~5.5 hours

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready (~3.5 hours)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!) → Users gain value immediately
3. Add User Story 2 → Test independently → Deploy/Demo → Users can now manage views
4. Add User Story 3 → Test independently → Deploy/Demo → Views persist across sessions
5. Add User Story 4 → Test independently → Deploy/Demo → Improved toolbar UX
6. Add Edge Cases + Accessibility → Test → Deploy/Demo → Production-ready
7. Each story adds value without breaking previous stories

**Total Estimated Time**: ~12-15 hours for complete feature with all stories

### Parallel Team Strategy

With 2 developers:

1. Both complete Setup + Foundational together (~3.5 hours)
2. Once Foundational is done:
   - Developer A: User Story 1 (create/apply) → User Story 3 (persistence)
   - Developer B: User Story 2 (manage views) → User Story 4 (toolbar layout)
3. Both work on Edge Cases + Accessibility together
4. Stories integrate seamlessly due to shared context API

**Total Time with 2 developers**: ~8-10 hours wall-clock time

---

## Notes

- All tasks follow strict TDD: write failing tests → implement to pass tests → refactor
- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD requirement from constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All new code must pass TypeScript strict mode compilation
- All new code must pass ESLint/Prettier checks
- Total task count: 90 tasks (including tests, implementation, and polish)
- Parallel opportunities: ~40 tasks can run in parallel at various stages
- MVP scope: Phases 1-3 (Tasks T001-T039) = 39 tasks
- Full feature scope: All phases (Tasks T001-T090) = 90 tasks
