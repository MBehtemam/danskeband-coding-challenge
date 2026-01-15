# Tasks: Layout Improvements, Status Colors, and Filter Bug Fixes

**Input**: Design documents from `/specs/008-layout-filters-fix/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/filter-contracts.md

**Tests**: Tests are NOT explicitly requested in the feature specification. Test tasks are omitted per speckit template guidance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification - no changes needed as project already exists

- [X] T001 Verify TypeScript 5.6.2 strict mode enabled in tsconfig.json
- [X] T002 Verify Material UI v7.3.7 and Material React Table v3.2.1 are installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure changes that affect multiple user stories

**⚠️ CRITICAL**: These changes establish the foundation for filter fixes and color updates

- [X] T003 Update STATUS_CONFIG colors in src/theme/constants.ts (Resolved: #ebece7, In Progress: #bad7f5, Open: #4672c2)
- [X] T004 Update STATUS_CONFIG text colors in src/theme/constants.ts (Resolved: #002346, In Progress: #002346, Open: #FFFFFF)
- [X] T005 Update STATUS_CONFIG icon colors to match text colors in src/theme/constants.ts

**Checkpoint**: Foundation ready - theme colors updated, filter and layout fixes can now begin

---

## Phase 3: User Story 1 - Filtering Incidents by Assignee (Priority: P1) 🎯 MVP

**Goal**: Fix assignee filter to correctly match user names and support "Unassigned" option

**Independent Test**: Select an assignee from the filter dropdown and verify only incidents assigned to that user appear. Select "Unassigned" to verify incidents with null assigneeId appear.

### Implementation for User Story 1

- [X] T006 [US1] Add "Unassigned" option to filterSelectOptions in assignee column definition in src/components/incidents/IncidentTable.tsx
- [X] T007 [US1] Implement custom assignee filterFn that handles "Unassigned" case (null/empty assigneeId) in src/components/incidents/IncidentTable.tsx
- [X] T008 [US1] Implement custom assignee filterFn that matches user names for named assignees in src/components/incidents/IncidentTable.tsx
- [X] T009 [US1] Update assignee column accessorFn to return user name instead of using accessorKey with UUID in src/components/incidents/IncidentTable.tsx
- [X] T010 [US1] Verify assignee filter persists in URL parameters on page refresh in src/components/incidents/IncidentTable.tsx

**Checkpoint**: Assignee filter should now work correctly - users can filter by any assignee name or "Unassigned"

---

## Phase 4: User Story 2 - Filtering Incidents by Created Date (Priority: P1)

**Goal**: Fix date filter to correctly filter incidents by creation date using date range comparisons

**Independent Test**: Select a date range in the Created filter and verify only incidents created within that range appear. Test "greater than" and "less than" modes.

### Implementation for User Story 2

- [X] T011 [US2] Implement custom date filterFn that converts ISO string createdAt to Date object in src/components/incidents/IncidentTable.tsx
- [X] T012 [US2] Implement betweenInclusive logic (startDate <= rowDate <= endDate) in date filterFn in src/components/incidents/IncidentTable.tsx
- [X] T013 [US2] Implement greaterThan logic (rowDate > startDate) in date filterFn in src/components/incidents/IncidentTable.tsx
- [X] T014 [US2] Implement lessThan logic (rowDate < endDate) in date filterFn in src/components/incidents/IncidentTable.tsx
- [X] T015 [US2] Add date picker validation using muiFilterDatePickerProps to prevent invalid ranges (endDate before startDate) in src/components/incidents/IncidentTable.tsx
- [X] T016 [US2] Verify date filter persists in URL parameters on page refresh in src/components/incidents/IncidentTable.tsx

**Checkpoint**: Date filter should now work correctly - users can filter by date range, greater than, or less than

---

## Phase 5: User Story 3 - Create Incident Button Positioning (Priority: P2)

**Goal**: Integrate "Create Incident" button into MRT toolbar to ensure consistent positioning regardless of column visibility

**Independent Test**: Toggle column visibility (hide/show columns) and verify the "Create Incident" button remains properly positioned on the right side of the table toolbar.

### Implementation for User Story 3

- [X] T017 [US3] Add onCreateClick prop to IncidentTableProps interface in src/components/incidents/IncidentTable.tsx
- [X] T018 [US3] Implement renderTopToolbarCustomActions in IncidentTable to render Create Incident button in src/components/incidents/IncidentTable.tsx
- [X] T019 [US3] Position Create Incident button using flexbox with flexGrow spacer for right alignment in src/components/incidents/IncidentTable.tsx
- [X] T020 [US3] Remove old Create Incident button from DashboardPage layout above table in src/components/incidents/DashboardPage.tsx
- [X] T021 [US3] Pass handleOpenCreateDialog as onCreateClick prop to IncidentTable in src/components/incidents/DashboardPage.tsx

**Checkpoint**: Create Incident button should now stay aligned with table toolbar regardless of column visibility state

---

## Phase 6: User Story 4 - Updated Status Chip Colors (Priority: P3)

**Goal**: Display status chips with updated colors for better visual distinction and WCAG AA compliance

**Independent Test**: View incidents with each status (Open, In Progress, Resolved) and verify correct background colors, text colors, and icon colors are applied.

### Implementation for User Story 4

- [X] T022 [US4] Verify StatusChip component reads backgroundColor from STATUS_CONFIG in src/components/common/StatusChip.tsx
- [X] T023 [US4] Verify StatusChip component reads textColor from STATUS_CONFIG in src/components/common/StatusChip.tsx
- [X] T024 [US4] Verify StatusChip component applies icon color matching text color in src/components/common/StatusChip.tsx
- [X] T025 [US4] Verify all status chips render with WCAG AA compliant contrast ratios (≥4.5:1) by visual inspection

**Checkpoint**: All status chips should display with new colors and maintain accessibility contrast requirements

---

## Phase 7: User Story 5 - Full-Width Navigation with Centered Table (Priority: P3)

**Goal**: Verify layout is correct - full-width navigation bar with centered incident table

**Independent Test**: View dashboard on different screen sizes and verify navigation spans full width while table remains centered.

### Implementation for User Story 5

- [X] T026 [US5] Verify AppBar component spans full width of viewport in src/components/layout/AppLayout.tsx
- [X] T027 [US5] Verify Container component centers incident table content in src/components/layout/AppLayout.tsx
- [X] T028 [US5] Test responsive layout on mobile (320px), tablet (768px), and desktop (1920px+) viewports

**Checkpoint**: Layout should be correct - navigation full-width, table centered, responsive on all screen sizes

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T029 [P] Run quickstart.md acceptance criteria validation for all user stories
- [ ] T030 [P] Test filter state persistence in URL parameters across all filters
- [ ] T031 [P] Verify keyboard navigation works for all filter inputs and Create Incident button
- [ ] T032 [P] Verify screen reader support with aria-labels on status chips and filter inputs
- [ ] T033 Run full linting check: npm run lint
- [ ] T034 Run all existing tests to ensure no regressions: npm test

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Assignee Filter): Can start after Foundational - No dependencies on other stories
  - User Story 2 (Date Filter): Can start after Foundational - No dependencies on other stories
  - User Story 3 (Button Position): Can start after Foundational - No dependencies on other stories
  - User Story 4 (Status Colors): Depends on Foundational (T003-T005) - Verification only
  - User Story 5 (Layout): Can start after Foundational - Verification only
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Independent
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent
- **User Story 4 (P3)**: Depends on Foundational color updates (T003-T005) - Verification phase
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Verification phase

### Within Each User Story

- User Story 1: T006 → T007-T009 can run in sequence, T010 at end
- User Story 2: T011 → T012-T014 can run in sequence, T015-T016 at end
- User Story 3: T017 → T018-T019 → T020-T021 (sequential due to DashboardPage dependency)
- User Story 4: T022-T025 can run in sequence (verification tasks)
- User Story 5: T026-T028 can run in sequence (verification tasks)

### Parallel Opportunities

- Setup tasks (T001-T002) can run in parallel
- Foundational tasks (T003-T005) can run in parallel (all modify src/theme/constants.ts but different properties)
- After Foundational completes, User Stories 1, 2, and 3 can start in parallel (different files/features)
- Polish tasks marked [P] (T029-T032) can run in parallel

---

## Parallel Example: After Foundational Phase

```bash
# Launch User Story 1, 2, and 3 implementation in parallel:
Task: "Fix assignee filter in src/components/incidents/IncidentTable.tsx (US1)"
Task: "Fix date filter in src/components/incidents/IncidentTable.tsx (US2)"
Task: "Move Create button to toolbar in src/components/incidents/IncidentTable.tsx (US3)"

# Note: All three stories modify IncidentTable.tsx, so coordinate changes or work sequentially
# Recommended sequential order: US1 → US2 → US3 (both P1 filters first, then P2 button)
```

---

## Parallel Example: Polish Phase

```bash
# Launch all verification tasks together:
Task: "Run quickstart.md acceptance criteria validation for all user stories"
Task: "Test filter state persistence in URL parameters across all filters"
Task: "Verify keyboard navigation works for all filter inputs and Create Incident button"
Task: "Verify screen reader support with aria-labels on status chips and filter inputs"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2 - Critical Bugs)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T005) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 - Assignee Filter (T006-T010)
4. **VALIDATE**: Test assignee filter independently
5. Complete Phase 4: User Story 2 - Date Filter (T011-T016)
6. **VALIDATE**: Test date filter independently
7. Deploy/demo critical bug fixes

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (colors updated)
2. Add User Story 1 → Test independently → Bug fix 1 complete
3. Add User Story 2 → Test independently → Bug fix 2 complete
4. Add User Story 3 → Test independently → UX improvement complete
5. Add User Stories 4 & 5 → Verify → Visual enhancements complete
6. Each story adds value without breaking previous stories

### Sequential Strategy (Recommended)

Since User Stories 1, 2, and 3 all modify IncidentTable.tsx, recommended order:

1. Team completes Setup + Foundational together (T001-T005)
2. Implement US1: Assignee Filter (T006-T010)
3. Implement US2: Date Filter (T011-T016)
4. Implement US3: Button Position (T017-T021)
5. Verify US4: Status Colors (T022-T025)
6. Verify US5: Layout (T026-T028)
7. Polish phase (T029-T034)

---

## Notes

- [P] tasks = different files or properties, no dependencies
- [Story] label maps task to specific user story for traceability
- User Stories 1 & 2 are P1 critical bug fixes - prioritize these
- User Story 3 is P2 UX improvement - can be deferred if needed
- User Stories 4 & 5 are P3 verification tasks - low risk
- All three main implementation stories (US1, US2, US3) modify IncidentTable.tsx - coordinate changes
- Verify tests pass after each story completion
- Commit after each user story or logical group
- Stop at any checkpoint to validate story independently
- WCAG AA contrast ratios verified in research.md - all colors compliant
