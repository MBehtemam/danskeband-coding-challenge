# Tasks: Team Incident Dashboard

**Input**: Design documents from `/specs/001-incident-dashboard/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/openapi.yaml ✓

**TDD Required**: Per constitution, all tests MUST be written BEFORE implementation (Red-Green-Refactor).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] [TEST?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[TEST]**: This is a test task (must complete BEFORE corresponding implementation)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and base configuration

- [x] T001 Install MUI dependencies: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- [x] T002 Install data management dependencies: material-react-table@^3, @tanstack/react-query@^5, @tanstack/react-form
- [x] T003 Install routing and utility dependencies: react-router-dom@^6, dayjs
- [x] T004 Create MUI theme with DanskeBank brand colors in src/theme/index.ts
- [x] T005 [P] Create src/components/common/ directory structure
- [x] T006 [P] Create src/components/incidents/ directory structure
- [x] T007 [P] Create src/components/layout/ directory structure
- [x] T008 [P] Create src/hooks/ directory structure
- [x] T009 [P] Create src/services/ directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**TDD Note**: Service and hook tests written first, then implementation.

### 2.1 Provider Setup (No Tests - Configuration Only)

- [x] T010 Configure QueryClient provider in src/main.tsx with TanStack Query
- [x] T011 Configure BrowserRouter provider in src/main.tsx with React Router
- [x] T012 Configure ThemeProvider and CssBaseline in src/main.tsx with MUI theme

### 2.2 Services (TDD)

- [x] T013 [TEST] Write tests for incidentService API calls in src/services/incidentService.test.ts
- [x] T014 Create API service layer for incidents in src/services/incidentService.ts
- [x] T015 [TEST] Write tests for userService API calls in src/services/userService.test.ts
- [x] T016 Create API service layer for users in src/services/userService.ts

### 2.3 Hooks (TDD)

- [x] T017 [TEST] Write tests for useIncidents hook in src/hooks/useIncidents.test.ts
- [x] T018 Create useIncidents hook with TanStack Query in src/hooks/useIncidents.ts
- [x] T019 [TEST] Write tests for useUsers hook in src/hooks/useUsers.test.ts
- [x] T020 Create useUsers hook with TanStack Query in src/hooks/useUsers.ts
- [x] T021 [TEST] Write tests for useCreateIncident mutation in src/hooks/useIncidents.test.ts
- [x] T022 Create useCreateIncident mutation hook in src/hooks/useIncidents.ts
- [x] T023 [TEST] Write tests for useUpdateIncident mutation in src/hooks/useIncidents.test.ts
- [x] T024 Create useUpdateIncident mutation hook in src/hooks/useIncidents.ts

### 2.4 Common Components (TDD)

- [x] T025 [P][TEST] Write tests for StatusChip in src/components/common/StatusChip.test.tsx
- [x] T026 [P] Create StatusChip component in src/components/common/StatusChip.tsx
- [x] T027 [P][TEST] Write tests for SeverityChip in src/components/common/SeverityChip.test.tsx
- [x] T028 [P] Create SeverityChip component in src/components/common/SeverityChip.tsx

### 2.5 Layout & Utilities

- [x] T029 [TEST] Write tests for AppLayout in src/components/layout/AppLayout.test.tsx
- [x] T030 Create AppLayout component with header in src/components/layout/AppLayout.tsx
- [x] T031 Setup dayjs with relativeTime plugin in src/utils/dateUtils.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Incident List (Priority: P1)

**Goal**: Display paginated list of incidents showing title, status, severity, assignee, created date

**Independent Test**: Load application and verify list displays with all incident information

**TDD**: Write component tests first, then implement.

### 3.1 IncidentTable Component (TDD)

- [x] T032 [US1][TEST] Write tests for IncidentTable rendering incidents in src/components/incidents/IncidentTable.test.tsx
- [x] T033 [US1] Create IncidentTable component shell with MRT in src/components/incidents/IncidentTable.tsx
- [x] T034 [US1][TEST] Write tests for table columns (title, status, severity, assignee, date) in src/components/incidents/IncidentTable.test.tsx
- [x] T035 [US1] Configure MRT columns: title, status, severity, assignee, created date in src/components/incidents/IncidentTable.tsx
- [x] T036 [US1] Implement StatusChip rendering in table status column in src/components/incidents/IncidentTable.tsx
- [x] T037 [US1] Implement SeverityChip rendering in table severity column in src/components/incidents/IncidentTable.tsx
- [x] T038 [US1] Implement assignee name lookup from users in src/components/incidents/IncidentTable.tsx
- [x] T039 [US1] Implement relative date formatting for created date column in src/components/incidents/IncidentTable.tsx

### 3.2 Pagination (TDD)

- [x] T040 [US1][TEST] Write tests for pagination controls in src/components/incidents/IncidentTable.test.tsx
- [x] T041 [US1] Configure MRT pagination with page size options (10, 20, 50, 100) in src/components/incidents/IncidentTable.tsx

### 3.3 Loading & Empty States (TDD)

- [x] T042 [US1][TEST] Write tests for EmptyState component in src/components/common/EmptyState.test.tsx
- [x] T043 [US1] Create EmptyState component for no incidents in src/components/common/EmptyState.tsx
- [x] T044 [US1][TEST] Write tests for LoadingState component in src/components/common/LoadingState.test.tsx
- [x] T045 [US1] Create LoadingState component with MUI CircularProgress in src/components/common/LoadingState.tsx
- [x] T046 [US1] Integrate loading and empty states into IncidentTable in src/components/incidents/IncidentTable.tsx

### 3.4 Page Integration

- [x] T047 [US1][TEST] Write tests for DashboardPage in src/components/incidents/DashboardPage.test.tsx
- [x] T048 [US1] Create DashboardPage component integrating IncidentTable in src/components/incidents/DashboardPage.tsx
- [x] T049 [US1] Wire DashboardPage route in App.tsx

**Checkpoint**: User Story 1 complete - users can view paginated incident list

---

## Phase 4: User Story 2 - Filter and Sort Incidents (Priority: P1)

**Goal**: Enable filtering by status/severity/assignee, search by title, and sorting

**Independent Test**: Apply filters/sort and verify list updates correctly

### 4.1 Search & Filters (TDD)

- [x] T050 [US2][TEST] Write tests for global title search in src/components/incidents/IncidentTable.test.tsx
- [x] T051 [US2] Enable MRT enableGlobalFilter for title search in src/components/incidents/IncidentTable.tsx
- [x] T052 [US2][TEST] Write tests for column filters in src/components/incidents/IncidentTable.test.tsx
- [x] T053 [US2] Enable MRT enableColumnFilters in src/components/incidents/IncidentTable.tsx
- [x] T054 [US2] Configure status column filter with select variant (Open/In Progress/Resolved) in src/components/incidents/IncidentTable.tsx
- [x] T055 [US2] Configure severity column filter with select variant (Low/Medium/High/Critical) in src/components/incidents/IncidentTable.tsx
- [x] T056 [US2] Configure assignee column filter with select variant (user list) in src/components/incidents/IncidentTable.tsx

### 4.2 Sorting (TDD)

- [x] T057 [US2][TEST] Write tests for sorting functionality in src/components/incidents/IncidentTable.test.tsx
- [x] T058 [US2] Enable MRT enableSorting for all columns in src/components/incidents/IncidentTable.tsx
- [x] T059 [US2] Configure custom severity sorting by priority order (Critical > High > Medium > Low) in src/components/incidents/IncidentTable.tsx

### 4.3 URL State & Clear Filters

- [x] T060 [US2][TEST] Write tests for URL filter synchronization in src/components/incidents/IncidentTable.test.tsx
- [x] T061 [US2] Sync filter state to URL query params using React Router in src/components/incidents/IncidentTable.tsx
- [x] T062 [US2] Restore filters from URL params on page load in src/components/incidents/IncidentTable.tsx
- [x] T063 [US2][TEST] Write tests for NoFilterResults component in src/components/common/NoFilterResults.test.tsx
- [x] T064 [US2] Create NoFilterResults component for empty filter results in src/components/common/NoFilterResults.tsx
- [x] T065 [US2] Add clear filters button when filters active in src/components/incidents/IncidentTable.tsx

**Checkpoint**: User Story 2 complete - users can filter, search, and sort incidents

---

## Phase 5: User Story 3 - View Incident Details (Priority: P1)

**Goal**: Show full incident details in expandable detail panel

**Independent Test**: Click incident and verify all details display correctly

### 5.1 Detail Panel (TDD)

- [x] T066 [US3][TEST] Write tests for IncidentDetailPanel in src/components/incidents/IncidentDetailPanel.test.tsx
- [x] T067 [US3] Create IncidentDetailPanel component shell in src/components/incidents/IncidentDetailPanel.tsx
- [x] T068 [US3] Enable MRT renderDetailPanel for row expansion in src/components/incidents/IncidentTable.tsx
- [x] T069 [US3] Display full title and description in detail panel in src/components/incidents/IncidentDetailPanel.tsx
- [x] T070 [US3] Display status and severity with chips in detail panel in src/components/incidents/IncidentDetailPanel.tsx
- [x] T071 [US3] Display assignee name (or "Unassigned") in detail panel in src/components/incidents/IncidentDetailPanel.tsx
- [x] T072 [US3] Display formatted createdAt and updatedAt timestamps in detail panel in src/components/incidents/IncidentDetailPanel.tsx

### 5.2 Status History (TDD)

- [x] T073 [US3][TEST] Write tests for StatusHistoryTimeline in src/components/incidents/StatusHistoryTimeline.test.tsx
- [x] T074 [US3] Create StatusHistoryTimeline component in src/components/incidents/StatusHistoryTimeline.tsx
- [x] T075 [US3] Display status history entries with user name lookup in src/components/incidents/StatusHistoryTimeline.tsx

### 5.3 Panel Behavior & Deep Linking

- [x] T076 [US3][TEST] Write tests for single panel open behavior in src/components/incidents/IncidentTable.test.tsx
- [x] T077 [US3] Configure only one detail panel open at a time in src/components/incidents/IncidentTable.tsx
- [x] T078 [US3][TEST] Write tests for deep linking to incident in src/components/incidents/DashboardPage.test.tsx
- [x] T079 [US3] Add deep link support: /incidents/:id opens that row's panel in src/components/incidents/DashboardPage.tsx
- [x] T080 [US3] Update URL when detail panel opens/closes in src/components/incidents/IncidentTable.tsx
- [x] T081 [US3] Preserve filter state when returning from detail view in src/components/incidents/IncidentTable.tsx

**Checkpoint**: User Story 3 complete - users can view full incident details with history

---

## Phase 6: User Story 4 - Update Incident Status (Priority: P2)

**Goal**: Allow status changes with persistence and optimistic updates

**Independent Test**: Change status and verify change persists after refresh

### 6.1 Status Edit (TDD)

- [ ] T082 [US4][TEST] Write tests for StatusSelect in src/components/incidents/StatusSelect.test.tsx
- [ ] T083 [US4] Create StatusSelect component with MUI Select in src/components/incidents/StatusSelect.tsx
- [ ] T084 [US4][TEST] Write tests for status edit mode in detail panel in src/components/incidents/IncidentDetailPanel.test.tsx
- [ ] T085 [US4] Add status edit mode to IncidentDetailPanel in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T086 [US4] Integrate StatusSelect in detail panel edit mode in src/components/incidents/IncidentDetailPanel.tsx

### 6.2 Save & Feedback (TDD)

- [ ] T087 [US4][TEST] Write tests for status update mutation in src/components/incidents/IncidentDetailPanel.test.tsx
- [ ] T088 [US4] Wire useUpdateIncident mutation to status change in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T089 [US4] Implement optimistic update for status change in src/hooks/useIncidents.ts
- [ ] T090 [US4] Add loading spinner during status save in src/components/incidents/IncidentDetailPanel.tsx

### 6.3 Error Handling (TDD)

- [ ] T091 [US4][TEST] Write tests for ErrorAlert component in src/components/common/ErrorAlert.test.tsx
- [ ] T092 [US4] Create ErrorAlert component for save failures in src/components/common/ErrorAlert.tsx
- [ ] T093 [US4] Display error message on status update failure in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T094 [US4] Add retry mechanism for failed status updates in src/components/incidents/IncidentDetailPanel.tsx

### 6.4 Success Feedback (TDD)

- [ ] T095 [US4][TEST] Write tests for SuccessSnackbar component in src/components/common/SuccessSnackbar.test.tsx
- [ ] T096 [US4] Create SuccessSnackbar component for save confirmation in src/components/common/SuccessSnackbar.tsx
- [ ] T097 [US4] Show success feedback when status update completes in src/components/incidents/IncidentDetailPanel.tsx

**Checkpoint**: User Story 4 complete - users can update incident status with feedback

---

## Phase 7: User Story 5 - Update Incident Assignee (Priority: P2)

**Goal**: Allow assignee changes with user selection dropdown

**Independent Test**: Change assignee and verify change persists after refresh

### 7.1 Assignee Select (TDD)

- [ ] T098 [US5][TEST] Write tests for AssigneeSelect in src/components/incidents/AssigneeSelect.test.tsx
- [ ] T099 [US5] Create AssigneeSelect component with MUI Select in src/components/incidents/AssigneeSelect.tsx
- [ ] T100 [US5] Populate AssigneeSelect options from useUsers hook in src/components/incidents/AssigneeSelect.tsx
- [ ] T101 [US5] Add "Unassigned" option to AssigneeSelect in src/components/incidents/AssigneeSelect.tsx

### 7.2 Integration & Error Handling

- [ ] T102 [US5][TEST] Write tests for assignee edit in detail panel in src/components/incidents/IncidentDetailPanel.test.tsx
- [ ] T103 [US5] Integrate AssigneeSelect in detail panel edit mode in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T104 [US5] Wire useUpdateIncident mutation to assignee change in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T105 [US5] Handle assignee dropdown error state (users fail to load) in src/components/incidents/AssigneeSelect.tsx
- [ ] T106 [US5] Add loading spinner during assignee save in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T107 [US5] Display error message on assignee update failure in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T108 [US5] Show success feedback when assignee update completes in src/components/incidents/IncidentDetailPanel.tsx

**Checkpoint**: User Story 5 complete - users can reassign incidents

---

## Phase 8: User Story 6 - Create New Incident (Priority: P2)

**Goal**: Provide form in side drawer to create new incidents

**Independent Test**: Fill form and verify new incident appears in list

### 8.1 Create Drawer (TDD)

- [ ] T109 [US6][TEST] Write tests for CreateIncidentDrawer in src/components/incidents/CreateIncidentDrawer.test.tsx
- [ ] T110 [US6] Create CreateIncidentDrawer component shell in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T111 [US6] Setup TanStack Form with CreateIncidentInput fields in src/components/incidents/CreateIncidentDrawer.tsx

### 8.2 Form Fields (TDD)

- [ ] T112 [US6][TEST] Write tests for form field validation in src/components/incidents/CreateIncidentDrawer.test.tsx
- [ ] T113 [US6] Create TitleField component with MUI TextField in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T114 [US6] Create DescriptionField component with MUI TextField multiline in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T115 [US6][TEST] Write tests for SeveritySelect in src/components/incidents/SeveritySelect.test.tsx
- [ ] T116 [US6] Create SeveritySelect component with MUI Select in src/components/incidents/SeveritySelect.tsx
- [ ] T117 [US6] Integrate SeveritySelect in create form in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T118 [US6] Integrate AssigneeSelect in create form in src/components/incidents/CreateIncidentDrawer.tsx

### 8.3 Validation (TDD)

- [ ] T119 [US6][TEST] Write tests for title validation in src/components/incidents/CreateIncidentDrawer.test.tsx
- [ ] T120 [US6] Implement title validation (required, max 200 chars) in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T121 [US6] Implement severity validation (required) in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T122 [US6] Display inline validation errors with clear guidance in src/components/incidents/CreateIncidentDrawer.tsx

### 8.4 Submit & Feedback

- [ ] T123 [US6][TEST] Write tests for form submission in src/components/incidents/CreateIncidentDrawer.test.tsx
- [ ] T124 [US6] Wire useCreateIncident mutation to form submit in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T125 [US6] Add loading state during incident creation in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T126 [US6] Display error message on creation failure, preserve form data in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T127 [US6] Close drawer and show success on successful creation in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T128 [US6] Add cancel button to close drawer without saving in src/components/incidents/CreateIncidentDrawer.tsx

### 8.5 FAB Integration

- [ ] T129 [US6][TEST] Write tests for FAB button in src/components/incidents/DashboardPage.test.tsx
- [ ] T130 [US6] Add FAB button to open create drawer in src/components/incidents/DashboardPage.tsx
- [ ] T131 [US6] Position FAB appropriately for desktop and mobile in src/components/incidents/DashboardPage.tsx

**Checkpoint**: User Story 6 complete - users can create new incidents

---

## Phase 9: User Story 7 - Responsive Experience (Priority: P3)

**Goal**: Ensure dashboard works well on desktop and mobile devices (320px to 1920px+)

**Independent Test**: Access on desktop and mobile viewports, verify all features usable

**Note**: Use MRT's built-in responsive features (column visibility, density). Do NOT switch to card layout - MRT handles table responsiveness natively.

### 9.1 Table Responsiveness (TDD)

- [ ] T132 [US7][TEST] Write tests for responsive table behavior in src/components/incidents/IncidentTable.test.tsx
- [ ] T133 [US7] Configure MRT columnVisibility for mobile breakpoints (hide less critical columns) in src/components/incidents/IncidentTable.tsx
- [ ] T134 [US7] Configure MRT density='compact' on mobile for better space usage in src/components/incidents/IncidentTable.tsx
- [ ] T135 [US7] Collapse toolbar filters into MRT's built-in filter menu on mobile in src/components/incidents/IncidentTable.tsx
- [ ] T136 [US7] Test and fix any horizontal overflow issues on 320px viewport in src/components/incidents/IncidentTable.tsx

### 9.2 Component Responsiveness

- [ ] T137 [US7][TEST] Write tests for responsive detail panel in src/components/incidents/IncidentDetailPanel.test.tsx
- [ ] T138 [US7] Ensure touch targets are minimum 44x44px in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T139 [US7] Optimize detail panel layout for mobile screens in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T140 [US7] Optimize create drawer width for mobile screens in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T141 [US7] Ensure AppLayout header adapts to mobile in src/components/layout/AppLayout.tsx
- [ ] T142 [US7] Add viewport meta tag if missing in index.html

**Checkpoint**: User Story 7 complete - dashboard works on all device sizes

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, keyboard navigation, error handling refinements

### 10.1 Keyboard Navigation (TDD)

- [ ] T143 [TEST] Write tests for keyboard navigation in src/components/incidents/IncidentTable.test.tsx
- [ ] T144 [P] Add keyboard navigation for table rows and controls in src/components/incidents/IncidentTable.tsx
- [ ] T145 [P] Add keyboard navigation for detail panel interactions in src/components/incidents/IncidentDetailPanel.tsx
- [ ] T146 [P] Add focus management when drawer opens/closes in src/components/incidents/CreateIncidentDrawer.tsx

### 10.2 ARIA & Screen Reader (TDD)

- [ ] T147 [TEST] Write tests for ARIA attributes in src/components/incidents/IncidentTable.test.tsx
- [ ] T148 [P] Add aria-labels to all interactive elements in src/components/incidents/
- [ ] T149 [P] Add aria-live regions for status update announcements in src/components/common/SuccessSnackbar.tsx
- [ ] T150 Ensure all form fields have associated labels in src/components/incidents/CreateIncidentDrawer.tsx
- [ ] T151 Add aria-describedby for form validation errors in src/components/incidents/CreateIncidentDrawer.tsx

### 10.3 Visual Accessibility

- [ ] T152 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1) in src/theme/index.ts

### 10.4 Final Quality Checks

- [ ] T153 Review and refine error messages for clarity across all components
- [ ] T154 Run npm run lint and fix any issues
- [ ] T155 Run npm run build and fix any TypeScript errors
- [ ] T156 Verify all quickstart.md scenarios work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - **BLOCKS all user stories**
- **User Stories (Phase 3-9)**: All depend on Phase 2 completion
  - US1 (P1): Can start immediately after Phase 2
  - US2 (P1): Can start after Phase 2, benefits from US1 but independently testable
  - US3 (P1): Can start after Phase 2, builds on US1 table
  - US4 (P2): Requires US3 detail panel to be functional
  - US5 (P2): Requires US3 detail panel to be functional
  - US6 (P2): Can start after Phase 2, independent of other stories
  - US7 (P3): Should be done after US1-US6 to optimize all components
- **Polish (Phase 10)**: Depends on all user stories being complete

### TDD Flow per Component

```
1. [TEST] Write failing test → npm test (RED)
2. Implement minimal code → npm test (GREEN)
3. Refactor → npm test (still GREEN)
4. Commit
```

### User Story Dependencies (Summary)

```
Phase 2 (Foundation) ─┬─► US1 (View List) ─────► US2 (Filter/Sort) ───┐
                      │                                                │
                      ├─► US3 (View Details) ─┬─► US4 (Update Status) ├─► US7 (Responsive)
                      │                       │                        │
                      │                       └─► US5 (Update Assignee)│
                      │                                                │
                      └─► US6 (Create Incident) ───────────────────────┘
```

### Parallel Opportunities (Tasks marked [P])

**Within Setup (Phase 1)**:
- T005-T009: Directory creation (all parallel)

**Within Foundational (Phase 2)**:
- T025-T028: StatusChip and SeverityChip tests and implementation (parallel pairs)

**Within Polish (Phase 10)**:
- T143-T145, T147-T148, T151: Independent accessibility tasks

---

## Implementation Strategy

### TDD Workflow

For each component/feature:
1. Write test first (`*.test.tsx` or `*.test.ts`)
2. Run `npm test` - verify test FAILS (Red)
3. Write minimal implementation to pass
4. Run `npm test` - verify test PASSES (Green)
5. Refactor if needed
6. Run `npm test` - verify still passes
7. Commit with message: `test: add tests for X` then `feat: implement X`

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational with tests (T010-T031)
3. Complete Phase 3: User Story 1 with tests (T032-T049)
4. **STOP and VALIDATE**: Run `npm test`, verify all tests pass
5. Deploy/demo if ready - users can view all incidents

### Recommended Priority Order

1. **Phase 1**: Setup
2. **Phase 2**: Foundational (with TDD)
3. **Phase 3**: US1 - View List (MVP baseline)
4. **Phase 4**: US2 - Filter/Sort (high value for 500+ incidents)
5. **Phase 5**: US3 - View Details (enables editing stories)
6. **Phase 6**: US4 - Update Status (primary action)
7. **Phase 7**: US5 - Update Assignee (team coordination)
8. **Phase 8**: US6 - Create Incident (complete CRUD)
9. **Phase 9**: US7 - Responsive (polish)
10. **Phase 10**: Polish (accessibility, final checks)

### Incremental Delivery

Each user story adds independently testable value:

1. **After US1**: Read-only incident viewer with pagination
2. **After US2**: Efficient incident discovery with filters
3. **After US3**: Complete incident viewer with full details
4. **After US4**: Basic incident lifecycle management
5. **After US5**: Team work distribution capability
6. **After US6**: Full incident capture to resolution workflow
7. **After US7**: Multi-device access

---

## Notes

- **[P]** = different files, no dependencies (can run in parallel)
- **[Story]** = maps task to specific user story for traceability
- **[TEST]** = test task that MUST be completed BEFORE corresponding implementation
- Each user story should be independently completable and testable
- Commit after each test+implementation pair
- Stop at any checkpoint to validate story independently
- Run `npm test` frequently to maintain TDD discipline
