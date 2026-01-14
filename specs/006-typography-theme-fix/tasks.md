# Tasks: Typography and Theme Fix

**Input**: Design documents from `/specs/006-typography-theme-fix/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and extend type system for new theme tokens

- [X] T001 Verify Play font is loaded in index.html and add font-weight 500 if needed
- [X] T002 [P] Extend TypographyConfig interface to include h5, h6, caption in src/theme/types.ts
- [X] T003 [P] Add ButtonConfig interface in src/theme/types.ts
- [X] T004 [P] Add TableTypography interface in src/theme/types.ts
- [X] T005 [P] Extend BrandColors interface with primaryButton, primaryButtonHover in src/theme/types.ts
- [X] T006 [P] Add ShapeConfig.borderRadiusButton property to interface in src/theme/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update theme constants that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Update TYPOGRAPHY_CONFIG with spec-compliant H1-H4 values in src/theme/constants.ts
- [X] T008 Add H5, H6, caption variants to TYPOGRAPHY_CONFIG in src/theme/constants.ts
- [X] T009 [P] Update TEXT_COLORS.primary from #222222 to #002447 in src/theme/constants.ts
- [X] T010 [P] Add BRAND_COLORS.primaryButton (#0A5EF0) and primaryButtonHover (#0852D1) in src/theme/constants.ts
- [X] T011 [P] Add BUTTON_CONFIG constant (borderRadius: 48, minHeight: 48, paddingHorizontal: 24, fontWeight: 400) in src/theme/constants.ts
- [X] T012 [P] Add TABLE_TYPOGRAPHY constant (header: 14px/500, body: 14px/400) in src/theme/constants.ts
- [X] T013 [P] Add SHAPE_CONFIG.borderRadiusButton: 48 in src/theme/constants.ts

**Checkpoint**: Constants ready - theme integration can now begin

---

## Phase 3: User Story 1 - Visual Consistency with Brand (Priority: P1) 🎯 MVP

**Goal**: Users see typography and buttons that match the Danske Bank brand (Play font, pill-shaped buttons with correct colors)

**Independent Test**: Visual comparison - open the application alongside danskebank.dk and verify fonts, button shapes, and text colors match

### Implementation for User Story 1

- [X] T014 [US1] Apply TYPOGRAPHY_CONFIG.fontFamily and fontWeights to MUI theme typography section in src/theme/index.ts
- [X] T015 [US1] Update MuiButton.root with borderRadius (48px), minHeight (48px), padding (0 24px), fontWeight (400) in src/theme/index.ts
- [X] T016 [US1] Update MuiButton.containedPrimary with BRAND_COLORS.primaryButton and hover state in src/theme/index.ts
- [X] T017 [US1] Update MuiButton.containedSecondary with 48px borderRadius for consistency in src/theme/index.ts
- [X] T018 [US1] Apply TEXT_COLORS.primary (#002447) to palette.text.primary in src/theme/index.ts

**Checkpoint**: At this point, buttons and text colors should match Danske Bank brand visually

---

## Phase 4: User Story 2 - Readable Table Typography (Priority: P1)

**Goal**: Table headers are visually distinct from body text with correct font weights (500 vs 400)

**Independent Test**: View incident table - headers should be slightly bolder than body text, both at 14px

### Implementation for User Story 2

- [X] T019 [US2] Update MuiTableCell.root with TABLE_TYPOGRAPHY.body (fontSize: 0.875rem, fontWeight: 400) in src/theme/index.ts
- [X] T020 [US2] Update MuiTableCell.head with TABLE_TYPOGRAPHY.header (fontSize: 0.875rem, fontWeight: 500) in src/theme/index.ts
- [X] T021 [US2] Verify table line-height provides adequate readability (1.5) in src/theme/index.ts

**Checkpoint**: Table typography should now show clear header/body distinction

---

## Phase 5: User Story 3 - Consistent Heading Hierarchy (Priority: P2)

**Goal**: Clear visual hierarchy through properly sized headings (H1-H6)

**Independent Test**: Navigate through the application and verify heading sizes decrease progressively from H1 to H6

### Implementation for User Story 3

- [X] T022 [US3] Apply updated TYPOGRAPHY_CONFIG.h1 (36px, 400, 1.22) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T023 [US3] Apply updated TYPOGRAPHY_CONFIG.h2 (32px, 500, 1.3) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T024 [US3] Apply updated TYPOGRAPHY_CONFIG.h3 (24px, 400, 1.17) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T025 [US3] Apply updated TYPOGRAPHY_CONFIG.h4 (20px, 500, 1.3) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T026 [P] [US3] Add typography.h5 (16px, 500, 1.3) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T027 [P] [US3] Add typography.h6 (14px, 500, 1.3) with TEXT_COLORS.primary to theme in src/theme/index.ts
- [X] T028 [P] [US3] Add typography.caption (14px, 400, 1.5) to theme in src/theme/index.ts

**Checkpoint**: Full heading hierarchy (H1-H6 + caption) should now be styled per spec

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify existing tests pass and perform final validation

- [X] T029 Run existing tests and verify StatusChip.test.tsx passes with new theme colors in src/components/common/StatusChip.test.tsx
- [X] T030 Run existing tests and verify SeverityChip.test.tsx passes with new theme colors in src/components/common/SeverityChip.test.tsx
- [X] T031 [P] Run type-check (npm run type-check) to verify no TypeScript errors
- [X] T032 [P] Run linting (npm run lint) to verify code quality
- [X] T033 Run full test suite (npm test) to verify all tests pass
- [X] T034 Run build (npm run build) to verify production build succeeds
- [ ] T035 Visual verification against danskebank.dk per quickstart.md validation criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (type definitions) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - can run parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion - can run parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Brand consistency (buttons, fonts, text colors) - No dependencies on other stories
- **User Story 2 (P1)**: Table typography - No dependencies on US1, can run in parallel
- **User Story 3 (P2)**: Heading hierarchy - No dependencies on US1/US2, can run in parallel

### Within Each Phase

- Types must be defined before constants
- Constants must be defined before theme index updates
- Theme updates within a story can be grouped logically

### Parallel Opportunities

- Setup tasks T002-T006 can run in parallel (different interface definitions)
- Foundational tasks T009-T013 can run in parallel (different constants)
- User Stories 1, 2, and 3 can be worked on in parallel after Foundational phase
- Polish tasks T031-T032 can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all type definition tasks together:
Task: "Extend TypographyConfig interface to include h5, h6, caption in src/theme/types.ts"
Task: "Add ButtonConfig interface in src/theme/types.ts"
Task: "Add TableTypography interface in src/theme/types.ts"
Task: "Extend BrandColors interface with primaryButton, primaryButtonHover in src/theme/types.ts"
Task: "Add ShapeConfig.borderRadiusButton property to interface in src/theme/types.ts"
```

## Parallel Example: Foundational Phase

```bash
# Launch all independent constant updates together:
Task: "Update TEXT_COLORS.primary from #222222 to #002447 in src/theme/constants.ts"
Task: "Add BRAND_COLORS.primaryButton (#0A5EF0) and primaryButtonHover (#0852D1) in src/theme/constants.ts"
Task: "Add BUTTON_CONFIG constant in src/theme/constants.ts"
Task: "Add TABLE_TYPOGRAPHY constant in src/theme/constants.ts"
Task: "Add SHAPE_CONFIG.borderRadiusButton: 48 in src/theme/constants.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (type definitions)
2. Complete Phase 2: Foundational (constants)
3. Complete Phase 3: User Story 1 (buttons and brand colors)
4. **STOP and VALIDATE**: Visual comparison with danskebank.dk buttons
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Types and constants ready
2. Add User Story 1 → Test button styling → Deploy/Demo (MVP!)
3. Add User Story 2 → Test table typography → Deploy/Demo
4. Add User Story 3 → Test heading hierarchy → Deploy/Demo
5. Polish phase → Final validation and cleanup

### All Changes Localized

All changes are confined to:
- `index.html` (optional font weight update)
- `src/theme/types.ts` (interface additions)
- `src/theme/constants.ts` (value updates)
- `src/theme/index.ts` (MUI theme application)

No component code changes required - theme system handles all visual updates.

---

## Notes

- [P] tasks = different files/sections, no dependencies
- [Story] label maps task to specific user story for traceability
- This is a theme-only feature - no API or data model changes
- Visual verification is the primary validation method
- Existing tests should continue to pass (color changes may require RGB value updates in assertions)
- All typography values use rem units for accessibility
- WCAG 2.1 AA compliance verified: #002447 (15.85:1), #0A5EF0 with white text (4.62:1)
