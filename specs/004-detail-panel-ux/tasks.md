# Tasks: Detail Panel UX Improvements

**Input**: Design documents from `/specs/004-detail-panel-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/components.ts, quickstart.md

**Tests**: Included per constitution's Test-First Development principle (TDD red-green-refactor).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test setup and clipboard API mocking

- [x] T001 Setup clipboard mock in test environment in src/test/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and hook that MUST be complete before user story UI components

**⚠️ CRITICAL**: User story component work depends on this phase

- [x] T002 Write test for useCopyToClipboard hook in src/hooks/useCopyToClipboard.test.ts
- [x] T003 Implement useCopyToClipboard hook with clipboard API and fallback in src/hooks/useCopyToClipboard.ts

**Checkpoint**: Foundation ready - clipboard hook available for CopyButton component ✅

---

## Phase 3: User Story 4 - Improved Chip Color Scheme with Icons (Priority: P1) 🎯 MVP

**Goal**: Update StatusChip to use blue spectrum colors with workflow icons, ensuring status and severity chips are visually distinct

**Independent Test**: View an incident with "In Progress" status and "High" severity side-by-side; they should be visually distinguishable (blue vs orange)

**Why first**: StatusChip and SeverityChip are dependencies for User Stories 1 and 3 (chips appear in dropdowns and throughout the app)

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US4] Write tests for StatusChip new colors and icons in src/components/common/StatusChip.test.tsx
- [x] T005 [P] [US4] Write tests for SeverityChip consistent colors in src/components/common/SeverityChip.test.tsx

### Implementation for User Story 4

- [x] T006 [P] [US4] Update StatusChip with STATUS_CONFIG (blue colors + icons) in src/components/common/StatusChip.tsx
- [x] T007 [P] [US4] Update SeverityChip with SEVERITY_CONFIG (existing colors, consistent styling) in src/components/common/SeverityChip.tsx

**Checkpoint**: Status and severity chips now visually distinct; status chips show blue colors with workflow icons ✅

---

## Phase 4: User Story 1 - Copy Incident ID (Priority: P1)

**Goal**: Add a copy button next to the incident ID that copies the ID to clipboard with visual feedback

**Independent Test**: Open an incident, click the copy button next to the ID, paste to verify the correct ID was copied to clipboard

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Write tests for CopyButton component in src/components/common/CopyButton.test.tsx

### Implementation for User Story 1

- [x] T009 [US1] Implement CopyButton component with tooltip and feedback states in src/components/common/CopyButton.tsx
- [x] T010 [US1] Integrate CopyButton next to incident ID in src/components/incidents/IncidentDetailForm.tsx

**Checkpoint**: Users can copy incident ID with a single click; visual feedback confirms the action ✅

---

## Phase 5: User Story 2 - Vertical Layout for Editable Fields (Priority: P1)

**Goal**: Change status, severity, and assignee dropdowns from horizontal to vertical stack layout

**Independent Test**: Open the detail panel and verify that status, severity, and assignee fields are stacked vertically with consistent alignment and uniform width

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US2] Write tests for vertical layout in src/components/incidents/IncidentDetailForm.test.tsx

### Implementation for User Story 2

- [x] T012 [US2] Update IncidentDetailForm to use vertical flex layout in src/components/incidents/IncidentDetailForm.tsx
- [x] T013 [P] [US2] Add fullWidth prop support to StatusSelect in src/components/incidents/StatusSelect.tsx
- [x] T014 [P] [US2] Add fullWidth prop support to SeveritySelect in src/components/incidents/SeveritySelect.tsx

**Checkpoint**: Editable fields are vertically stacked with uniform width; layout adapts on mobile viewports ✅

---

## Phase 6: User Story 3 - Chips Displayed in Select Dropdowns (Priority: P2)

**Goal**: Display colored chips inside status and severity dropdown menus and for selected values

**Independent Test**: Click on status/severity dropdown and verify each option displays as a colored chip rather than plain text; selected value also shows as chip

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T015 [P] [US3] Write tests for chips in StatusSelect dropdown in src/components/incidents/StatusSelect.test.tsx
- [x] T016 [P] [US3] Write tests for chips in SeveritySelect dropdown in src/components/incidents/SeveritySelect.test.tsx

### Implementation for User Story 3

- [x] T017 [US3] Add renderValue and chip MenuItems to StatusSelect in src/components/incidents/StatusSelect.tsx
- [x] T018 [US3] Add renderValue and chip MenuItems to SeveritySelect in src/components/incidents/SeveritySelect.tsx

**Checkpoint**: Dropdown menus show chips for options and selected values; colors match chips elsewhere in the app ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Integration testing, validation, and verification

- [x] T019 Write integration test for full detail panel workflow in tests/integration/detail-panel-ux.test.tsx
- [x] T020 Run quickstart.md verification checklist
- [x] T021 Run full test suite and lint check (npm test && npm run lint)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - creates useCopyToClipboard hook
- **User Story 4 (Phase 3)**: Depends on Foundational - chip components are dependencies for other stories
- **User Story 1 (Phase 4)**: Depends on Foundational (T003) and User Story 4 (T006)
- **User Story 2 (Phase 5)**: Depends on User Story 4 (chips needed for vertical layout testing)
- **User Story 3 (Phase 6)**: Depends on User Story 4 (chips needed in dropdowns)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 4 (P1)**: Foundational - StatusChip/SeverityChip updates are prerequisites for other stories
- **User Story 1 (P1)**: Depends on Foundational (clipboard hook) only
- **User Story 2 (P1)**: No strict dependencies on other stories (uses existing chips)
- **User Story 3 (P2)**: Depends on User Story 4 (needs updated chips for dropdown rendering)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 2 (Foundational)**:
- Test and implementation are sequential (TDD)

**Phase 3 (User Story 4)**:
- T004 and T005 can run in parallel (different test files)
- T006 and T007 can run in parallel (different component files)

**Phase 4 (User Story 1)**:
- T008 must complete before T009 (TDD)

**Phase 5 (User Story 2)**:
- T013 and T014 can run in parallel (different select files)

**Phase 6 (User Story 3)**:
- T015 and T016 can run in parallel (different test files)
- T017 and T018 are sequential (may share patterns but different files)

---

## Parallel Example: User Story 4 (Phase 3)

```bash
# Launch tests for US4 together (different files):
Task: "Write tests for StatusChip new colors and icons in src/components/common/StatusChip.test.tsx"
Task: "Write tests for SeverityChip consistent colors in src/components/common/SeverityChip.test.tsx"

# After tests written, launch implementations together (different files):
Task: "Update StatusChip with STATUS_CONFIG in src/components/common/StatusChip.tsx"
Task: "Update SeverityChip with SEVERITY_CONFIG in src/components/common/SeverityChip.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 4, 1, 2 - All P1)

1. Complete Phase 1: Setup (clipboard mock)
2. Complete Phase 2: Foundational (useCopyToClipboard hook)
3. Complete Phase 3: User Story 4 (chip color scheme) - **Visual distinction achieved**
4. Complete Phase 4: User Story 1 (copy button) - **ID copy functionality**
5. Complete Phase 5: User Story 2 (vertical layout) - **Layout improvement**
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo MVP if ready

### Full Feature Delivery

1. Complete MVP (Steps 1-6 above)
2. Complete Phase 6: User Story 3 (chips in dropdowns) - **Enhanced dropdown UX**
3. Complete Phase 7: Polish (integration tests, verification)

### Incremental Delivery

Each story adds value without breaking previous stories:
- **After US4**: Status/severity visually distinct across the entire app
- **After US1**: Users can copy incident IDs efficiently
- **After US2**: Cleaner, more readable detail panel layout
- **After US3**: Consistent chip display in all contexts including dropdowns

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing (TDD red-green-refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 4 is placed first because StatusChip/SeverityChip are dependencies for stories 1 and 3
