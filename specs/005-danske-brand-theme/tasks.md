# Tasks: Danske Bank Visual Design System

**Input**: Design documents from `/specs/005-danske-brand-theme/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅, contracts/ ✅

**Tests**: No test tasks included (tests not explicitly requested in feature specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and external asset preparation

- [X] T001 Add Google Fonts preconnect and Play font link tags to index.html
- [X] T002 [P] Download Danske Bank logo SVG from Wikimedia Commons to src/assets/danske-bank-logo.svg

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme configuration that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create theme types file based on contracts/theme-types.ts in src/theme/types.ts
- [X] T004 [P] Create theme constants file based on contracts/theme-constants.ts in src/theme/constants.ts
- [X] T005 Update src/theme/index.ts with complete MUI createTheme configuration using constants from T004

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Brand Recognition Through Color and Typography (Priority: P1) 🎯 MVP

**Goal**: Users immediately recognize Danske Bank brand through consistent colors (Prussian Blue #003755, Cerulean #009EDC) and Play font across all text and UI elements.

**Independent Test**: Open any page and visually confirm Danske Bank brand colors and Play font are consistently applied across all text and UI elements.

### Implementation for User Story 1

- [X] T006 [US1] Configure MUI palette with primary (#003755), secondary (#009EDC), background (#F6F4F2), and text (#222222) colors in src/theme/index.ts
- [X] T007 [US1] Configure MUI typography with Play font family and fallback stack in src/theme/index.ts
- [X] T008 [US1] Add MuiCssBaseline component override for global background color (#F6F4F2) in src/theme/index.ts
- [X] T009 [US1] Export statusColors and severityColors constants for chip components in src/theme/index.ts
- [X] T010 [US1] Update src/components/common/StatusChip.tsx to use exported statusColors from theme
- [X] T011 [P] [US1] Update src/components/common/SeverityChip.tsx to use exported severityColors from theme
- [X] T012 [US1] Verify Play font renders correctly and all text uses theme typography (manual visual check)

**Checkpoint**: Brand colors and typography are consistently applied - User Story 1 complete

---

## Phase 4: User Story 2 - Full-Width Navigation Bar with Danske Bank Branding (Priority: P1)

**Goal**: Professional full-width navigation bar with Danske Bank logo on the left, white background, and task-relevant navigation elements.

**Independent Test**: View the application header and verify navigation spans full width, displays Danske Bank logo on left, has white background with subtle bottom border.

### Implementation for User Story 2

- [X] T013 [US2] Add MuiAppBar component override with white background, Prussian Blue text, and subtle bottom border in src/theme/index.ts
- [X] T014 [US2] Update src/components/layout/AppLayout.tsx to import and display danske-bank-logo.svg on the left
- [X] T015 [US2] Configure AppLayout Toolbar to span full width with proper responsive styling
- [X] T016 [US2] Verify navigation bar displays correctly with logo and proper styling (manual visual check)

**Checkpoint**: Full-width navigation bar with Danske Bank logo complete - User Story 2 complete

---

## Phase 5: User Story 3 - Card-Based Content Layout (Priority: P2)

**Goal**: Clean card-based layouts with white backgrounds, subtle borders, appropriate border radius (8px), and proper spacing (16-24px).

**Independent Test**: View any content section and confirm cards have white backgrounds, #ebece7 borders, 8px border radius, and consistent padding.

### Implementation for User Story 3

- [X] T017 [US3] Add MuiCard component override with white background, #ebece7 border, 8px border radius, no box-shadow in src/theme/index.ts
- [X] T018 [P] [US3] Add MuiCardContent component override with 16px padding in src/theme/index.ts
- [X] T019 [P] [US3] Add MuiPaper component override with no backgroundImage and #ebece7 outlined border in src/theme/index.ts
- [X] T020 [US3] Verify card components display with correct styling (manual visual check)

**Checkpoint**: Card-based content layout complete - User Story 3 complete

---

## Phase 6: User Story 4 - Button and Interactive Element Styling (Priority: P2)

**Goal**: Buttons and interactive elements styled with Danske Bank design language - primary buttons with Prussian Blue (#003755), secondary with Cerulean (#009EDC), visible hover states.

**Independent Test**: View primary and secondary buttons, confirm colors match spec and hover states are visible.

### Implementation for User Story 4

- [X] T021 [US4] Add MuiButton component override with textTransform: none, fontWeight: 600, 4px border radius in src/theme/index.ts
- [X] T022 [US4] Configure containedPrimary button style with #003755 background and #002640 hover in src/theme/index.ts
- [X] T023 [P] [US4] Configure containedSecondary button style with #009EDC background and #0088C7 hover in src/theme/index.ts
- [X] T024 [P] [US4] Configure outlinedPrimary button style with transparent background and #003755 border/text in src/theme/index.ts
- [X] T025 [US4] Add MuiLink component override with #003755 color and underline on hover in src/theme/index.ts
- [X] T026 [US4] Verify button and link components display with correct styling and hover states (manual visual check)

**Checkpoint**: Button and interactive element styling complete - User Story 4 complete

---

## Phase 7: User Story 5 - Typography Hierarchy and Readability (Priority: P2)

**Goal**: Clear typography hierarchy with Play font - H1 (36px bold), H2 (28px bold), H3 (22px semi-bold), body (16px regular), proper line heights.

**Independent Test**: View headings and body text, confirm Play font with appropriate size hierarchy (H1 largest, readable body text).

### Implementation for User Story 5

- [X] T027 [US5] Configure h1 typography variant with 2.25rem, fontWeight 700, lineHeight 1.2 in src/theme/index.ts
- [X] T028 [P] [US5] Configure h2 typography variant with 1.75rem, fontWeight 700, lineHeight 1.3 in src/theme/index.ts
- [X] T029 [P] [US5] Configure h3 typography variant with 1.375rem, fontWeight 600, lineHeight 1.4 in src/theme/index.ts
- [X] T030 [P] [US5] Configure h4 typography variant with 1.125rem, fontWeight 600, lineHeight 1.4 in src/theme/index.ts
- [X] T031 [US5] Configure body1 (1rem) and body2 (0.875rem) typography variants with fontWeight 400, lineHeight 1.5 in src/theme/index.ts
- [X] T032 [US5] Verify typography hierarchy displays correctly across all heading levels (manual visual check)

**Checkpoint**: Typography hierarchy and readability complete - User Story 5 complete

---

## Phase 8: User Story 6 - Responsive Design with Danske Bank Styling (Priority: P3)

**Goal**: Consistent Danske Bank styling across all screen sizes with navigation collapse at 960px breakpoint.

**Independent Test**: Resize browser window and confirm navigation collapses at 960px, typography scales correctly, brand colors remain consistent.

### Implementation for User Story 6

- [X] T033 [US6] Add responsive breakpoint at 960px (md) for navigation collapse in src/components/layout/AppLayout.tsx
- [X] T034 [US6] Implement useMediaQuery hook to detect mobile viewport in AppLayout.tsx
- [X] T035 [US6] Add responsive Toolbar height (56px mobile, 64px desktop) in AppLayout.tsx
- [X] T036 [US6] Add responsive logo sizing (24px height mobile, 32px height desktop) in AppLayout.tsx
- [X] T037 [US6] Add responsive Container padding (xs: 8px, sm: 16px, md: 24px) in AppLayout.tsx
- [X] T038 [US6] Verify responsive behavior at various breakpoints (manual resize test)

**Checkpoint**: Responsive design with Danske Bank styling complete - User Story 6 complete

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements that affect multiple user stories

- [X] T039 [P] Add MuiTableRow component override with warm hover states (#ebece7) in src/theme/index.ts
- [X] T040 [P] Add MuiTableCell component override with #ebece7 border color in src/theme/index.ts
- [X] T041 [P] Add MuiOutlinedInput component override with warm border colors and focus/error states in src/theme/index.ts
- [X] T042 [P] Add MuiChip component override with fontWeight 500 in src/theme/index.ts
- [X] T043 Run npm run lint to verify no linting errors
- [X] T044 Run npm test to verify existing tests still pass
- [X] T045 Run quickstart.md verification checklist (Brand Identity, Color System, Status & Severity, UX & Accessibility, Responsive)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User Stories 1-2 (P1) should complete before User Stories 3-5 (P2)
  - User Story 6 (P3) can proceed after P1 stories complete
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Builds on theme established in US1
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Builds on theme established in US1
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Builds on theme established in US1
- **User Story 6 (P3)**: Requires AppLayout changes from US2 to be complete

### Within Each User Story

- Core theme configuration before component updates
- Theme file changes before component file changes
- Implementation before visual verification

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T003 and T004 (Foundational) can run in parallel
- T010 and T011 (StatusChip and SeverityChip) can run in parallel
- T017, T018, T019 (Card styling) can run in parallel
- T023 and T024 (Button variants) can run in parallel
- T028, T029, T030 (H2, H3, H4) can run in parallel
- T039, T040, T041, T042 (Polish component overrides) can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch Setup tasks together:
Task: "Add Google Fonts preconnect and Play font link tags to index.html"
Task: "Download Danske Bank logo SVG to src/assets/danske-bank-logo.svg"
```

## Parallel Example: User Story 5 Typography

```bash
# Launch typography heading tasks together:
Task: "Configure h2 typography variant in src/theme/index.ts"
Task: "Configure h3 typography variant in src/theme/index.ts"
Task: "Configure h4 typography variant in src/theme/index.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (font + logo)
2. Complete Phase 2: Foundational (theme constants + types)
3. Complete Phase 3: User Story 1 (brand colors + typography)
4. Complete Phase 4: User Story 2 (navigation bar + logo)
5. **STOP and VALIDATE**: Application has Danske Bank brand identity
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 → Test brand identity → Deploy/Demo (MVP!)
3. Add User Story 3 + 4 + 5 → Test card/button/typography styling → Deploy/Demo
4. Add User Story 6 → Test responsive behavior → Deploy/Demo
5. Complete Polish → Final verification → Deploy/Demo

---

## Notes

- [P] tasks = different files or non-conflicting changes, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Theme file (src/theme/index.ts) has many changes - execute sequentially within same story
- Manual visual checks (T012, T016, T020, T026, T032, T038) can be batched at end of each story
