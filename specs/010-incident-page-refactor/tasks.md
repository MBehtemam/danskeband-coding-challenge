---
description: "Task list for refactoring incident page structure"
---

# Tasks: Incident Page Structure Refactor

**Input**: Design documents from `/specs/010-incident-page-refactor/`
**Prerequisites**: spec.md (user stories defined)

**Tests**: Tests are NOT explicitly requested in the specification. Only existing test imports will be updated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths use absolute references from repository root

---

## Phase 1: Analysis & Planning

**Purpose**: Understand the current codebase structure and identify all files that need to be moved or updated

- [ ] T001 Identify all page-level components in src/components/incidents/ that should move to src/pages/
- [ ] T002 Identify all files that import DashboardPage to create comprehensive update list
- [ ] T003 Verify src/pages/ directory exists and matches DeveloperSettingsPage pattern

---

## Phase 2: User Story 1 - Consistent Project Structure (Priority: P1) 🎯

**Goal**: Move DashboardPage from src/components/incidents/ to src/pages/ to match the pattern established by DeveloperSettingsPage

**Independent Test**: Navigate the file system and verify DashboardPage is in src/pages/ directory alongside DeveloperSettingsPage, following the same organizational pattern

### Implementation for User Story 1

- [ ] T004 [US1] Create src/pages/IncidentDashboardPage.tsx by moving src/components/incidents/DashboardPage.tsx
- [ ] T005 [US1] Update import from '../layout/AppLayout' to match DeveloperSettingsPage pattern in src/pages/IncidentDashboardPage.tsx
- [ ] T006 [US1] Update import from './IncidentTable' to '../components/incidents/IncidentTable' in src/pages/IncidentDashboardPage.tsx
- [ ] T007 [US1] Update import from './CreateIncidentDialog' to '../components/incidents/CreateIncidentDialog' in src/pages/IncidentDashboardPage.tsx
- [ ] T008 [US1] Update named export from 'DashboardPage' to 'IncidentDashboardPage' in src/pages/IncidentDashboardPage.tsx
- [ ] T009 [US1] Create src/pages/index.ts to export IncidentDashboardPage (matching pattern if DeveloperSettingsPage has index)
- [ ] T010 [US1] Delete original src/components/incidents/DashboardPage.tsx file

**Checkpoint**: At this point, the file has been moved but imports throughout the codebase need updating

---

## Phase 3: User Story 2 - Preserved Application Functionality (Priority: P1)

**Goal**: Update all import statements throughout the codebase to reflect the new file location, ensuring no runtime errors

**Independent Test**: Run `npm run build` and `npm test` - all should pass with no errors. Navigate to incident dashboard in running app - should display correctly with identical behavior

### Implementation for User Story 2

- [ ] T011 [US2] Update import statement in src/App.tsx from './components/incidents/DashboardPage' to './pages/IncidentDashboardPage'
- [ ] T012 [US2] Update component name from DashboardPage to IncidentDashboardPage in src/App.tsx Route elements
- [ ] T013 [US2] Move src/components/incidents/DashboardPage.test.tsx to src/pages/IncidentDashboardPage.test.tsx
- [ ] T014 [US2] Update import statement in src/pages/IncidentDashboardPage.test.tsx to import from './IncidentDashboardPage'
- [ ] T015 [US2] Update component name references from 'DashboardPage' to 'IncidentDashboardPage' in src/pages/IncidentDashboardPage.test.tsx
- [ ] T016 [US2] Update test imports for child components to use '../components/incidents/' paths in src/pages/IncidentDashboardPage.test.tsx
- [ ] T017 [US2] Run TypeScript compilation: `npm run build` to verify no import errors
- [ ] T018 [US2] Run test suite: `npm test` to verify all tests pass
- [ ] T019 [US2] Verify routing still works by starting dev server and navigating to incident routes

**Checkpoint**: Application builds, tests pass, and routing works correctly with the new structure

---

## Phase 4: User Story 3 - Clear Component Separation (Priority: P2)

**Goal**: Verify and document the clear separation between page-level components (in src/pages/) and reusable UI components (in src/components/)

**Independent Test**: Review directory structure and confirm only page-level/route components are in src/pages/ while reusable UI components remain in src/components/incidents/

### Implementation for User Story 3

- [ ] T020 [US3] Verify src/pages/ contains only page-level components: DeveloperSettingsPage and IncidentDashboardPage
- [ ] T021 [US3] Verify src/components/incidents/ contains only reusable UI components (IncidentTable, IncidentDrawer, CreateIncidentDialog, etc.)
- [ ] T022 [US3] Add code comment at top of src/pages/IncidentDashboardPage.tsx explaining it's a page-level component for the incident dashboard route
- [ ] T023 [US3] Review and update src/pages/index.ts (if exists) to export both page components with clear documentation

**Checkpoint**: Clear architectural separation is established and documented

---

## Phase 5: Final Validation & Documentation

**Purpose**: Ensure the refactor is complete and properly documented

- [ ] T024 Run final build verification: `npm run build`
- [ ] T025 Run final test verification: `npm test`
- [ ] T026 Manual testing: Navigate to "/" route and verify incident dashboard works
- [ ] T027 Manual testing: Navigate to "/incidents/:incidentId" route and verify detail view works
- [ ] T028 Manual testing: Navigate to "/developer" route and verify developer settings works
- [ ] T029 Update CLAUDE.md with project structure documentation reflecting the new organization
- [ ] T030 Review git diff to confirm only file moves and import updates (no logic changes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Analysis (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Analysis - file must be moved before imports can be updated
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion - can't update imports until file is moved
- **User Story 3 (Phase 4)**: Depends on User Story 2 completion - verification requires all moves and updates complete
- **Final Validation (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: File move operation - MUST complete before US2
- **User Story 2 (P1)**: Import updates - MUST complete after US1, MUST complete before US3
- **User Story 3 (P2)**: Verification and documentation - MUST complete after US1 and US2

### Within Each User Story

**User Story 1** (Sequential - file operations):
1. Create new file with updated imports (T004-T007)
2. Update exports (T008-T009)
3. Delete old file (T010)

**User Story 2** (Must be sequential to verify at each step):
1. Update App.tsx imports and references (T011-T012)
2. Move and update test file (T013-T016)
3. Verify compilation (T017)
4. Verify tests pass (T018)
5. Verify routing works (T019)

**User Story 3** (All verification tasks can run in parallel):
- T020, T021, T022, T023 can all be done in parallel

### Parallel Opportunities

- **Limited parallel opportunities** due to the nature of this refactor (file moves create sequential dependencies)
- **Within User Story 3**: All verification tasks (T020-T023) can run in parallel
- **Within Final Validation**: T026, T027, T028 (manual testing) can run in parallel after T024 and T025 pass

---

## Implementation Strategy

### Sequential Execution (Required for this refactor)

Due to the nature of file moves and import updates, this refactor must be executed mostly sequentially:

1. **Phase 1**: Analyze current structure
2. **Phase 2 (US1)**: Move the file and update internal imports
3. **Phase 3 (US2)**: Update all external imports and test files
4. **Phase 4 (US3)**: Verify separation and document
5. **Phase 5**: Final validation

### Why Sequential?

- Can't update imports (US2) until file is moved (US1)
- Can't verify separation (US3) until all updates are complete (US2)
- Each phase validates the previous phase's work

### Single PR Strategy

This refactor MUST be completed in a single PR to avoid broken intermediate states where:
- Files are moved but imports aren't updated (broken build)
- Some imports are updated but others aren't (broken runtime)

---

## Notes

- **No [P] markers on most tasks** because file moves create dependencies between tasks
- **This is a pure refactor** - no functionality changes, only file locations and imports
- **Naming change**: DashboardPage → IncidentDashboardPage for clarity (distinguishes from potential future dashboard pages)
- **Test logic unchanged** - only import paths and component name references updated
- **All tests must pass** - this is a zero-regression refactor
- **Component APIs preserved** - all props, interfaces, and exports remain identical except for the name change
- Commit the entire refactor as a single atomic change
- Use TypeScript compiler and test suite as safety net to catch any missed imports
