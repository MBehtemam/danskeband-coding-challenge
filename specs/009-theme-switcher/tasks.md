# Tasks: Dark/Light Theme Switcher

**Input**: Design documents from `/specs/009-theme-switcher/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Following TDD approach per project constitution (NON-NEGOTIABLE)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/`, `tests/` at repository root
- Paths shown below follow existing project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions shared across all user stories

- [X] T001 [P] Create TypeScript type definitions in src/types/theme.ts (ThemeMode, ResolvedThemeMode, SystemThemeMode, constants)
- [X] T002 [P] Add dark mode color constants to src/theme/constants.ts (background, text, divider colors from research.md R4)
- [X] T003 Create dark theme object in src/theme/index.ts using createTheme() with Danske Bank brand colors
- [X] T004 Add CSS transitions to theme component overrides in src/theme/index.ts (300ms for MuiCssBaseline, MuiAppBar, MuiPaper)
- [X] T005 Export both lightTheme and darkTheme from src/theme/index.ts

**Checkpoint**: ✅ Type definitions and theme objects ready - can proceed to foundational phase

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Theme state management infrastructure that MUST be complete before ANY user story UI can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Write failing tests for ThemeContext in src/contexts/ThemeContext.test.tsx (defaults to light, loads from storage, persists changes, detects system, handles localStorage errors, throws outside provider)
- [X] T007 Create ThemeContext with React.createContext in src/contexts/ThemeContext.tsx (context interface: mode, setMode, systemMode)
- [X] T008 Implement ThemeContextProvider component in src/contexts/ThemeContext.tsx (useState for mode with localStorage initialization, useState for systemMode)
- [X] T009 Add localStorage read logic with try-catch fallback in src/contexts/ThemeContext.tsx (loadThemePreference helper)
- [X] T010 Implement system preference detection with useEffect and window.matchMedia in src/contexts/ThemeContext.tsx (prefers-color-scheme listener)
- [X] T011 Add debounced setMode function using lodash debounce (100ms) in src/contexts/ThemeContext.tsx (persists to localStorage with try-catch)
- [X] T012 Create useThemeMode hook in src/contexts/ThemeContext.tsx (throws error if used outside provider)
- [X] T013 Verify all ThemeContext tests pass in src/contexts/ThemeContext.test.tsx (GREEN phase - all tests passing)
- [X] T014 Refactor ThemeContext for code quality in src/contexts/ThemeContext.tsx (extract helpers, ensure strict TypeScript compliance, run linter)

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Theme Preference (Priority: P1) 🎯 MVP

**Goal**: Users can switch between light and dark themes with a single click from the navigation bar

**Independent Test**: Click the theme switcher button and verify the entire application theme changes instantly (all components update within 200ms)

### Tests for User Story 1 (TDD - WRITE FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Write failing test for ThemeSwitcher rendering correct icon (light mode shows dark icon) in src/components/layout/ThemeSwitcher.test.tsx
- [ ] T016 [P] [US1] Write failing test for ThemeSwitcher rendering correct icon (dark mode shows light icon) in src/components/layout/ThemeSwitcher.test.tsx
- [ ] T017 [P] [US1] Write failing test for ThemeSwitcher toggle on click in src/components/layout/ThemeSwitcher.test.tsx (calls setMode with opposite theme)
- [ ] T018 [P] [US1] Write failing test for ThemeSwitcher keyboard accessibility in src/components/layout/ThemeSwitcher.test.tsx (focusable, Enter/Space triggers toggle)
- [ ] T019 [P] [US1] Write failing test for ThemeSwitcher tooltip display in src/components/layout/ThemeSwitcher.test.tsx (shows "Switch to dark mode" or "Switch to light mode")

### Implementation for User Story 1

- [ ] T020 [US1] Create ThemeSwitcher component in src/components/layout/ThemeSwitcher.tsx (IconButton with LightModeIcon/DarkModeIcon toggle)
- [ ] T021 [US1] Add useThemeMode hook to ThemeSwitcher in src/components/layout/ThemeSwitcher.tsx (resolve active mode from mode + systemMode)
- [ ] T022 [US1] Implement handleToggle function in src/components/layout/ThemeSwitcher.tsx (switches between light and dark)
- [ ] T023 [US1] Add Tooltip wrapper to ThemeSwitcher in src/components/layout/ThemeSwitcher.tsx (aria-label for accessibility)
- [ ] T024 [US1] Verify all ThemeSwitcher tests pass in src/components/layout/ThemeSwitcher.test.tsx (GREEN phase)
- [ ] T025 [US1] Integrate ThemeSwitcher into AppLayout Toolbar in src/components/layout/AppLayout.tsx (place after logo, before Developer Settings button)
- [ ] T026 [US1] Add test for ThemeSwitcher presence in src/components/layout/AppLayout.test.tsx (verifies button renders with aria-label)
- [ ] T027 [US1] Wrap app with ThemeContextProvider in src/main.tsx (wrap BrowserRouter with ThemeContextProvider)
- [ ] T028 [US1] Create AppWithTheme wrapper component in src/main.tsx (uses useThemeMode, resolves active theme, applies ThemeProvider)
- [ ] T029 [US1] Write integration test for theme switching in src/App.test.tsx (click button, verify background color changes)
- [ ] T030 [US1] Verify all integration tests pass and app theme switches instantly

**Checkpoint**: At this point, User Story 1 should be fully functional - users can toggle themes and see immediate visual changes

---

## Phase 4: User Story 2 - Theme Persistence (Priority: P2)

**Goal**: User theme preferences persist across browser sessions via localStorage

**Independent Test**: Switch theme, close browser completely, reopen application, and verify the previously selected theme is still active

### Tests for User Story 2 (TDD - WRITE FIRST) ⚠️

- [ ] T031 [P] [US2] Write failing test for theme persistence in src/App.test.tsx (switch to dark, unmount, remount, verify still dark)
- [ ] T032 [P] [US2] Write failing test for localStorage persistence in src/contexts/ThemeContext.test.tsx (setMode writes to localStorage after debounce)
- [ ] T033 [P] [US2] Write failing test for default behavior in src/contexts/ThemeContext.test.tsx (no saved preference defaults to light)

### Implementation for User Story 2

- [ ] T034 [US2] Verify localStorage.setItem called in debounced setMode in src/contexts/ThemeContext.tsx (already implemented in Phase 2 T011, validate behavior)
- [ ] T035 [US2] Verify localStorage.getItem called on mount in src/contexts/ThemeContext.tsx (already implemented in Phase 2 T009, validate behavior)
- [ ] T036 [US2] Verify all persistence tests pass in src/App.test.tsx and src/contexts/ThemeContext.test.tsx (GREEN phase)
- [ ] T037 [US2] Add manual test for cross-session persistence (switch theme, hard refresh, verify persistence)
- [ ] T038 [US2] Verify graceful fallback when localStorage unavailable in src/contexts/ThemeContext.test.tsx (private browsing mode test)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - themes switch instantly and persist across sessions

---

## Phase 5: User Story 3 - System Theme Detection (Priority: P3)

**Goal**: Application respects operating system color scheme preference on first visit (when no explicit user preference exists)

**Independent Test**: Clear localStorage, set OS to dark mode, open application, and verify it starts in dark mode automatically

### Tests for User Story 3 (TDD - WRITE FIRST) ⚠️

- [ ] T039 [P] [US3] Write failing test for system preference detection in src/contexts/ThemeContext.test.tsx (mock matchMedia dark mode, verify systemMode='dark')
- [ ] T040 [P] [US3] Write failing test for system preference detection in src/contexts/ThemeContext.test.tsx (mock matchMedia light mode, verify systemMode='light')
- [ ] T041 [P] [US3] Write failing test for system preference changes in src/contexts/ThemeContext.test.tsx (fire MediaQueryList change event, verify systemMode updates)
- [ ] T042 [P] [US3] Write failing test for explicit preference override in src/App.test.tsx (set explicit dark, verify ignores system light)

### Implementation for User Story 3

- [ ] T043 [US3] Verify window.matchMedia listener in useEffect in src/contexts/ThemeContext.tsx (already implemented in Phase 2 T010, validate behavior)
- [ ] T044 [US3] Verify system preference respected when mode='system' in src/main.tsx AppWithTheme (activeMode calculation: mode === 'system' ? systemMode : mode)
- [ ] T045 [US3] Verify all system detection tests pass in src/contexts/ThemeContext.test.tsx (GREEN phase)
- [ ] T046 [US3] Add integration test for system preference priority in src/App.test.tsx (no saved preference + OS dark mode = app starts dark)
- [ ] T047 [US3] Verify graceful degradation when prefers-color-scheme unsupported in src/contexts/ThemeContext.tsx (defaults to light mode)

**Checkpoint**: All user stories should now be independently functional - theme switching, persistence, and system detection all work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements, code cleanup, and validation across all user stories

- [ ] T048 [P] Run full test suite and verify 100% pass rate (npm test)
- [ ] T049 [P] Run TypeScript type checking and verify zero errors (npm run type-check)
- [ ] T050 [P] Run linter and fix all violations (npm run lint)
- [ ] T051 [P] Run build and verify successful compilation (npm run build)
- [ ] T052 Perform manual accessibility testing (keyboard navigation, screen reader, focus indicators)
- [ ] T053 Verify WCAG AA color contrast in both themes (all text meets 4.5:1 ratio)
- [ ] T054 [P] Performance validation: measure theme switch time (must be <200ms from click to complete visual change)
- [ ] T055 [P] Test in private browsing mode (verify localStorage fallback works, theme switching still functional)
- [ ] T056 [P] Test rapid clicking behavior (verify debounce prevents excessive re-renders)
- [ ] T057 [P] Browser compatibility testing (Chrome, Firefox, Safari)
- [ ] T058 [P] Mobile testing (iOS Safari, Android Chrome, touch interaction, responsive layout)
- [ ] T059 Update CLAUDE.md with active technologies (TypeScript 5.6.3, React 18.3.1, MUI 7.3.7, localStorage)
- [ ] T060 Code cleanup and refactoring (remove dead code, ensure functions <50 lines, extract constants)
- [ ] T061 Validate all quickstart.md scenarios (run through implementation guide end-to-end)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T005) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T006-T014)
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US2 and US3 verify behavior already implemented in Foundational phase
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - DELIVERS MVP
- **User Story 2 (P2)**: Can start after US1 complete - Validates persistence behavior from Phase 2
- **User Story 3 (P3)**: Can start after US1 complete - Validates system detection behavior from Phase 2

### Within Each User Story

- Tests MUST be written FIRST and FAIL before implementation (RED phase)
- Implementation tasks make tests pass (GREEN phase)
- Integration tests validate story completion
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T001 (types), T002 (constants) can run in parallel (different files)

**Phase 2 (Foundational)**:
- T006 (write tests) can start immediately after T001-T005
- All tests in T006 can be written in parallel (different test cases)

**Phase 3 (User Story 1)**:
- T015-T019 (all ThemeSwitcher tests) can run in parallel (different test cases in same file)

**Phase 4 (User Story 2)**:
- T031-T033 (all persistence tests) can run in parallel (different test cases)

**Phase 5 (User Story 3)**:
- T039-T042 (all system detection tests) can run in parallel (different test cases)

**Phase 6 (Polish)**:
- T048 (tests), T049 (types), T050 (lint), T051 (build) can run in parallel
- T052-T058 (manual testing) can run in parallel if multiple testers available
- T059-T061 (documentation) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (write phase):
Task: "Write failing test for ThemeSwitcher rendering correct icon (light mode shows dark icon)"
Task: "Write failing test for ThemeSwitcher rendering correct icon (dark mode shows light icon)"
Task: "Write failing test for ThemeSwitcher toggle on click"
Task: "Write failing test for ThemeSwitcher keyboard accessibility"
Task: "Write failing test for ThemeSwitcher tooltip display"

# All 5 tests can be written in parallel (different test cases in same test file)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005) - ~20 minutes
2. Complete Phase 2: Foundational (T006-T014) - ~45 minutes - CRITICAL GATE
3. Complete Phase 3: User Story 1 (T015-T030) - ~60 minutes
4. **STOP and VALIDATE**: Test theme switching works independently
5. Deploy/demo MVP (theme toggle with instant visual feedback)

**Total MVP Time**: ~2 hours

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~65 minutes)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - theme switching works!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP + persistence across sessions!)
4. Add User Story 3 → Test independently → Deploy/Demo (MVP + persistence + system detection!)
5. Each story adds value without breaking previous stories

### Sequential Implementation (Single Developer)

1. Team completes Setup (Phase 1) - ~20 minutes
2. Team completes Foundational (Phase 2) - ~45 minutes
3. Implement in priority order:
   - Developer: User Story 1 (T015-T030) - ~60 minutes - STOP and validate MVP
   - Developer: User Story 2 (T031-T038) - ~25 minutes - Validate persistence
   - Developer: User Story 3 (T039-T047) - ~25 minutes - Validate system detection
4. Polish (Phase 6) - ~30 minutes
5. **Total Time**: ~3.5 hours for complete feature

---

## Notes

- [P] tasks = different files or independent test cases, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is mandatory**: Write tests first (RED), implement (GREEN), refactor
- Verify tests fail before implementing
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- US2 and US3 primarily validate behavior already implemented in Foundational phase
- Avoid: skipping tests, implementing before tests fail, breaking TDD workflow
- Performance requirement: Theme changes must apply within 200ms
- Accessibility requirement: WCAG AA compliance in both themes

---

## Task Count Summary

- **Total Tasks**: 61
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKS all user stories)
- **Phase 3 (US1 - Toggle Theme)**: 16 tasks (MVP delivery)
- **Phase 4 (US2 - Persistence)**: 8 tasks
- **Phase 5 (US3 - System Detection)**: 9 tasks
- **Phase 6 (Polish)**: 14 tasks
- **Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase
- **MVP Scope**: Phases 1-3 (T001-T030) = 30 tasks = ~2 hours
