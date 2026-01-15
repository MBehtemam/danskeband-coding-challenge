# Tasks: Developer Settings & Table Enhancements

**Input**: Design documents from `/specs/007-developer-settings-table-filters/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT included as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create type definitions needed across all user stories

- [ ] T001 Install @mui/x-date-pickers dependency via npm install @mui/x-date-pickers
- [ ] T002 [P] Create filter types (DateFilterState, PaginationState, ColumnVisibilityState) in src/types/filters.ts
- [ ] T003 [P] Extend Incident interface with isDummy flag in src/api/types.ts
- [ ] T004 Add LocalizationProvider configuration for date picker in src/App.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create useUrlState generic hook for URL state synchronization in src/hooks/useUrlState.ts
- [ ] T006 Add migration logic for existing incidents without isDummy field in src/api/mockApi.ts
- [ ] T007 Add DELETE endpoint handler with isDummy validation in src/api/mockApi.ts
- [ ] T008 Add deleteIncident function to src/services/incidentService.ts
- [ ] T009 Add useDeleteIncident mutation hook to src/hooks/useIncidents.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - URL-Based Pagination Management (Priority: P1) 🎯 MVP

**Goal**: Synchronize pagination state (page, pageSize) with URL query parameters so users can share links and maintain position on refresh

**Independent Test**: Navigate table, change page/rows-per-page, refresh browser - same page and settings should be preserved

### Implementation for User Story 1

- [ ] T010 [US1] Create useUrlPagination hook for pagination URL sync in src/hooks/useUrlPagination.ts
- [ ] T011 [US1] Integrate useUrlPagination with IncidentTable pagination state in src/components/incidents/IncidentTable.tsx
- [ ] T012 [US1] Add URL parameter validation (clamp invalid page, fallback pageSize) in src/hooks/useUrlPagination.ts
- [ ] T013 [US1] Ensure page and pageSize params are always present in URL (even for defaults) in src/components/incidents/IncidentTable.tsx

**Checkpoint**: URL pagination fully functional - page/pageSize synced with URL, survives refresh, shareable links work

---

## Phase 4: User Story 2 - Enhanced Column Filtering with Visual Chips (Priority: P1)

**Goal**: Enable column filters by default and display Status/Severity options as styled chips matching the existing display format

**Independent Test**: Open table, verify filters visible by default, select status/severity filters and confirm chip-style display

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create StatusFilterChip component for status filter dropdown in src/components/incidents/filters/StatusFilterChip.tsx
- [ ] T015 [P] [US2] Create SeverityFilterChip component for severity filter dropdown in src/components/incidents/filters/SeverityFilterChip.tsx
- [ ] T016 [US2] Enable column filters by default (showColumnFilters: true) in src/components/incidents/IncidentTable.tsx
- [ ] T017 [US2] Configure Status column with filterVariant and custom chip rendering in src/components/incidents/IncidentTable.tsx
- [ ] T018 [US2] Configure Severity column with filterVariant and custom chip rendering in src/components/incidents/IncidentTable.tsx
- [ ] T019 [US2] Sync status and severity filter values with URL parameters in src/components/incidents/IncidentTable.tsx

**Checkpoint**: Chip filters fully functional - filters enabled by default, status/severity show as chips, filter state in URL

---

## Phase 5: User Story 3 - Advanced Date Filtering for Created At (Priority: P2)

**Goal**: Filter incidents by creation date using date picker with comparison operators (greater than, less than, between)

**Independent Test**: Select Created At filter, choose operator, select dates, verify only matching incidents appear

### Implementation for User Story 3

- [ ] T020 [US3] Create DateRangeFilterInput component with operator dropdown and date picker in src/components/incidents/filters/DateRangeFilterInput.tsx
- [ ] T021 [US3] Implement dateFilterFn custom filter function for date comparison logic in src/components/incidents/IncidentTable.tsx
- [ ] T022 [US3] Configure Created At column with custom Filter component and filterFn in src/components/incidents/IncidentTable.tsx
- [ ] T023 [US3] Add inline validation for between operator (end date >= start date) in src/components/incidents/filters/DateRangeFilterInput.tsx
- [ ] T024 [US3] Sync date filter state (dateOp, dateStart, dateEnd) with URL parameters in src/components/incidents/IncidentTable.tsx

**Checkpoint**: Date filtering fully functional - operators work, validation shows errors, filter state in URL

---

## Phase 6: User Story 4 - Fix Column Toggle/Hide Functionality (Priority: P2)

**Goal**: Fix column visibility toggle to correctly show/hide columns with persistence via URL

**Independent Test**: Access column visibility menu, toggle columns on/off, verify table updates and state persists on refresh

### Implementation for User Story 4

- [ ] T025 [US4] Separate responsive column defaults from user preferences in src/components/incidents/IncidentTable.tsx
- [ ] T026 [US4] Implement column visibility state management with proper merge logic in src/components/incidents/IncidentTable.tsx
- [ ] T027 [US4] Add hiddenColumns URL parameter sync for column visibility in src/components/incidents/IncidentTable.tsx
- [ ] T028 [US4] Ensure title column cannot be hidden (minimum one column visible) in src/components/incidents/IncidentTable.tsx
- [ ] T029 [US4] Configure onColumnVisibilityChange handler in MRT table in src/components/incidents/IncidentTable.tsx

**Checkpoint**: Column visibility fully functional - toggle works, state persists in URL, title always visible

---

## Phase 7: User Story 5 - Developer Settings Page (Priority: P3)

**Goal**: Create dedicated settings page for adding dummy incidents and managing (deleting) dummy incidents

**Independent Test**: Navigate to developer settings, create dummy incident, verify in main table, delete from settings page

### Implementation for User Story 5

- [ ] T030 [P] [US5] Create DeveloperSettingsPage container component in src/pages/DeveloperSettingsPage.tsx
- [ ] T031 [P] [US5] Create DummyIncidentCreator component with random data generation in src/components/settings/DummyIncidentCreator.tsx
- [ ] T032 [P] [US5] Create DummyIncidentList component with delete buttons in src/components/settings/DummyIncidentList.tsx
- [ ] T033 [US5] Add /developer route to React Router in src/App.tsx
- [ ] T034 [US5] Add navigation link to Developer Settings in src/components/layout/AppLayout.tsx
- [ ] T035 [US5] Wire up createIncident mutation with isDummy: true in DummyIncidentCreator in src/components/settings/DummyIncidentCreator.tsx
- [ ] T036 [US5] Wire up deleteIncident mutation with confirmation dialog in DummyIncidentList in src/components/settings/DummyIncidentList.tsx
- [ ] T037 [US5] Filter DummyIncidentList to only show incidents where isDummy is true in src/components/settings/DummyIncidentList.tsx
- [ ] T038 [US5] Close IncidentDrawer automatically if viewed dummy incident is deleted in src/components/incidents/IncidentDrawer.tsx

**Checkpoint**: Developer settings fully functional - can create/delete dummy incidents, navigation works, drawer closes on delete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, edge case handling, and validation

- [ ] T039 Handle edge case: page param exceeds available pages after data changes in src/hooks/useUrlPagination.ts
- [ ] T040 Handle edge case: URL manipulation with invalid filter values in src/components/incidents/IncidentTable.tsx
- [ ] T041 Run npm run lint and fix any linting errors
- [ ] T042 Run npm test and verify all existing tests pass
- [ ] T043 Validate quickstart.md scenarios work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (URL Pagination) and US2 (Chip Filters) can proceed in parallel
  - US3 (Date Filter) can proceed in parallel with US1/US2
  - US4 (Column Visibility) can proceed in parallel with US1/US2/US3
  - US5 (Developer Settings) depends on T007-T009 (delete endpoint) from Foundational
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - independent of other stories
- **User Story 2 (P1)**: Can start after Foundational - independent of other stories
- **User Story 3 (P2)**: Can start after Foundational - independent of other stories
- **User Story 4 (P2)**: Can start after Foundational - independent of other stories
- **User Story 5 (P3)**: Can start after Foundational - depends on delete mutation from T007-T009

### Within Each User Story

- Components marked [P] can run in parallel (different files)
- URL sync tasks should come after component implementation
- Validation/edge cases come last within each story

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002 (filter types) || T003 (isDummy flag)
```

**Phase 2 (Foundational)**:
```
After T005 (useUrlState) completes:
T006 (migration) || T007 (DELETE endpoint)
Then: T008 (service) → T009 (hook)
```

**User Stories can run in parallel after Foundational**:
```
US1 (Pagination) || US2 (Chip Filters) || US3 (Date Filter) || US4 (Column Visibility)
US5 (Developer Settings) can run in parallel but needs delete infrastructure
```

**Within Phase 7 (US5)**:
```
T030 (page) || T031 (creator) || T032 (list)
Then: T033-T038 sequentially
```

---

## Parallel Example: User Story 5

```bash
# Launch all independent components together:
Task: "Create DeveloperSettingsPage in src/pages/DeveloperSettingsPage.tsx"
Task: "Create DummyIncidentCreator in src/components/settings/DummyIncidentCreator.tsx"
Task: "Create DummyIncidentList in src/components/settings/DummyIncidentList.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (URL Pagination)
4. **STOP and VALIDATE**: Test URL pagination independently
5. Deploy/demo if ready

### Recommended Order (Incremental Delivery)

1. **Setup + Foundational** → Foundation ready
2. **User Story 1 (URL Pagination)** → Test independently → Demo (MVP!)
3. **User Story 2 (Chip Filters)** → Test independently → Demo
4. **User Story 4 (Column Visibility)** → Test independently → Demo (bug fix - high value)
5. **User Story 3 (Date Filter)** → Test independently → Demo
6. **User Story 5 (Developer Settings)** → Test independently → Demo
7. **Polish phase** → Final validation

### Why This Order

- US1 + US2 are both P1 priority - core table functionality
- US4 is a bug fix (P2) but high user impact
- US3 requires date picker dependency to be working
- US5 is lower priority (P3) and mostly isolated

---

## Summary

| Phase | Tasks | Parallel Opportunities |
|-------|-------|----------------------|
| Setup | 4 | T002 \|\| T003 |
| Foundational | 5 | T006 \|\| T007 |
| US1 (Pagination) | 4 | Sequential (same file) |
| US2 (Chip Filters) | 6 | T014 \|\| T015 |
| US3 (Date Filter) | 5 | Sequential (dependencies) |
| US4 (Column Visibility) | 5 | Sequential (same file) |
| US5 (Developer Settings) | 9 | T030 \|\| T031 \|\| T032 |
| Polish | 5 | T041 \|\| T042 |

**Total Tasks**: 43
**Tasks by User Story**: US1: 4, US2: 6, US3: 5, US4: 5, US5: 9
**Suggested MVP**: Phase 1 + Phase 2 + User Story 1 (13 tasks)
