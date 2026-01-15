# Implementation Plan: Layout Improvements, Status Colors, and Filter Bug Fixes

**Branch**: `008-layout-filters-fix` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-layout-filters-fix/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature addresses three categories of improvements: (1) fixing critical filter bugs where assignee and date filters return no results, (2) repositioning the "Create Incident" button to be integrated within the MRT table toolbar for consistent positioning, and (3) updating status chip colors to match new design requirements (#ebece7 for Resolved, #bad7e5 for In Progress, #4672c2 for Open).

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, dayjs 1.11.19
**Storage**: LocalStorage via existing Mock API layer
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (Modern browsers, responsive 320px-1920px+)
**Project Type**: Web application (single frontend project)
**Performance Goals**: Filter operations complete in <3 seconds, immediate UI feedback
**Constraints**: WCAG AA compliance for all status colors (4.5:1 contrast ratio)
**Scale/Scope**: Single-page incident dashboard with ~100-1000 incidents

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Will write tests for filter fixes and color changes before implementation |
| II. TypeScript Strict Mode | ✅ PASS | All code will use strict typing, no `any` types |
| III. Code Quality Standards | ✅ PASS | ESLint/Prettier compliance, focused functions |
| IV. User Experience Excellence | ✅ PASS | Filter fixes improve core UX, colors provide immediate feedback |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | All new colors meet 4.5:1 contrast ratio |

## Project Structure

### Documentation (this feature)

```text
specs/008-layout-filters-fix/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/                 # Mock API layer (unchanged)
├── components/
│   ├── common/
│   │   └── StatusChip.tsx       # Update status colors
│   ├── incidents/
│   │   ├── DashboardPage.tsx    # Move Create button integration
│   │   └── IncidentTable.tsx    # Fix filters, integrate Create button
│   └── layout/
│       └── AppLayout.tsx        # Verify full-width nav (already correct)
├── hooks/
│   └── useIncidents.ts          # (unchanged)
├── theme/
│   └── constants.ts             # Update STATUS_COLORS values
├── types/
│   └── filters.ts               # (unchanged)
└── utils/
    └── dateUtils.ts             # (unchanged)

tests/
├── components/
│   ├── StatusChip.test.tsx      # Test new color values
│   ├── IncidentTable.test.tsx   # Test filter fixes
│   └── DashboardPage.test.tsx   # Test button positioning
└── integration/
    └── filters.test.tsx         # E2E filter tests
```

**Structure Decision**: Single frontend project with co-located tests. Changes primarily affect components and theme constants.

## Complexity Tracking

> No constitution violations identified. All changes are focused bug fixes and visual updates.

## Bug Analysis

### Assignee Filter Bug

**Root Cause**: The assignee filter stores the **user name** (string) in the URL parameter and compares it against the **user name** from `getUserName()`. However, the `filterSelectOptions` provides user names but MRT's internal filtering happens BEFORE the custom `filterFn` is applied for select variants.

**Current Code** (IncidentTable.tsx lines 359-371):
```typescript
{
  accessorKey: 'assigneeId',
  header: 'Assignee',
  filterVariant: 'select',
  filterSelectOptions: users?.map((u) => u.name) ?? [],
  filterFn: (row, _columnId, filterValue) => {
    const assigneeName = getUserName(row.original.assigneeId);
    return assigneeName === filterValue;
  },
}
```

**Issue**: MRT's select filter with `accessorKey: 'assigneeId'` tries to match the filter value (user name) against the raw `assigneeId` (UUID) first, which never matches. The custom `filterFn` should work but may not be invoked correctly due to MRT's internal handling of select filters.

**Fix**: Either:
1. Use `accessorFn` instead of `accessorKey` to return the user name for filtering
2. Provide both value/label pairs in `filterSelectOptions` that map name→id
3. Add "Unassigned" option for null assigneeId incidents

### Date Filter Bug

**Root Cause**: The date filter initializes from URL params correctly, but the MRT date-range filter expects dates in a specific format. The comparison may fail if:
1. The `createdAt` field is an ISO string while filter values are Date objects
2. Date timezone handling differs between stored and filtered values

**Current Code** (IncidentTable.tsx lines 373-382):
```typescript
{
  accessorKey: 'createdAt',
  filterVariant: 'date-range',
  filterFn: default MRT date handling
}
```

**Issue**: MRT's built-in date-range filter expects Date objects but `createdAt` is stored as ISO string. The default filter comparison may not handle string→Date conversion.

**Fix**: Implement custom `filterFn` that properly compares ISO date strings with selected Date objects, handling all three modes (betweenInclusive, greaterThan, lessThan).

## Design Decisions

### Create Incident Button Positioning

**Decision**: Integrate button into MRT's `renderToolbarInternalActions` or `renderTopToolbarCustomActions` to ensure it stays aligned with the table toolbar regardless of column visibility.

**Rationale**: Moving the button into the MRT toolbar system guarantees consistent positioning as MRT handles toolbar layout internally.

### Status Color Updates

| Status | Current | New | Text Color | Contrast |
|--------|---------|-----|------------|----------|
| Resolved | #144a37 | #ebece7 | Dark (#002346) | 12.5:1 ✓ |
| In Progress | #d8b463 | #bad7e5 | Dark (#002346) | 9.3:1 ✓ |
| Open | #4672c2 | #4672c2 | White (#FFFFFF) | 4.6:1 ✓ |

All colors meet WCAG AA contrast requirements (4.5:1 minimum).

## Phase Status

### Phase 0: Research ✅ Complete
- [research.md](./research.md) - Filter system analysis, color contrast verification

### Phase 1: Design & Contracts ✅ Complete
- [data-model.md](./data-model.md) - Existing entities reference, filter state model
- [quickstart.md](./quickstart.md) - Development setup and testing guide
- [contracts/filter-contracts.md](./contracts/filter-contracts.md) - Filter function and component contracts

### Constitution Re-Check (Post Phase 1)

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Test-First Development | ✅ PASS | Test files identified in project structure, TDD workflow in quickstart |
| II. TypeScript Strict Mode | ✅ PASS | All contracts use explicit types, no `any` |
| III. Code Quality Standards | ✅ PASS | Filter functions are focused (<50 lines), single responsibility |
| IV. User Experience Excellence | ✅ PASS | Filter fixes restore core functionality, <3s response target |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | All colors verified ≥4.5:1 contrast in contracts |

### Phase 2: Task Generation
- Pending: Run `/speckit.tasks` to generate tasks.md
