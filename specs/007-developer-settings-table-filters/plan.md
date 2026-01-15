# Implementation Plan: Developer Settings & Table Enhancements

**Branch**: `007-developer-settings-table-filters` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-developer-settings-table-filters/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement URL-synchronized pagination, enhanced column filtering with chip-style visuals for Status/Severity, advanced date range filtering for Created At, fix column visibility toggle, and create a Developer Settings page for managing dummy test incidents.

## Technical Context

**Language/Version**: TypeScript 5.6.2 (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, dayjs 1.11.19, @emotion/react 11.14.0
**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browser (Chrome, Firefox, Safari, Edge - responsive from 320px mobile to 1920px+ desktop)
**Project Type**: Web (single-page application)
**Performance Goals**: Loading states within 100ms, filter operations < 200ms
**Constraints**: Offline-capable (localStorage), mobile-responsive, WCAG 2.1 AA compliant
**Scale/Scope**: Single dashboard page + new Developer Settings page, ~60 TypeScript files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development (NON-NEGOTIABLE)
- [ ] Tests MUST be written BEFORE implementation code
- [ ] Red-Green-Refactor cycle MUST be followed
- [ ] Integration tests MUST cover all critical user flows (URL pagination, filtering, developer settings)
- [ ] Component tests MUST verify UI behavior (chip filters, date picker, column toggle)

### II. TypeScript Strict Mode
- [ ] `strict: true` enabled in tsconfig.json (already configured)
- [ ] No `any` type usage - all new types must be explicit
- [ ] All function parameters and return types explicitly typed
- [ ] New types for DateFilterState, DummyIncident flag in dedicated type files

### III. Code Quality Standards
- [ ] ESLint errors resolved before commit
- [ ] Prettier formatting applied
- [ ] Functions under 50 lines where practical
- [ ] Components follow single responsibility principle
- [ ] Magic numbers/strings extracted to named constants (filter operators, URL param names)

### IV. User Experience Excellence
- [ ] Loading states provide feedback within 100ms
- [ ] Error states are clear and actionable (date validation errors)
- [ ] Forms validate inline (date range validation)
- [ ] UI responsive from 320px (mobile) to 1920px+ (desktop)
- [ ] Critical actions require confirmation (delete dummy incidents)
- [ ] Data persists correctly via localStorage/URL and survives page refresh
- [ ] State changes immediately visible without manual refresh

### V. Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements keyboard navigable
- [ ] Focus indicators visible with contrast requirements
- [ ] Color not only means of conveying information (status/severity chips have labels)
- [ ] Text contrast meets minimum ratios (4.5:1 normal, 3:1 large)
- [ ] Form inputs have associated labels (date picker, filter controls)
- [ ] Error messages programmatically associated with fields
- [ ] Screen reader announcements for dynamic content changes
- [ ] Semantic HTML elements used appropriately

**Initial Gate Status**: ✅ PASS - No violations identified. Feature requirements align with constitution principles.

### Post-Design Re-evaluation

After Phase 1 design completion, re-evaluating constitution compliance:

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ Ready | Test files planned in project structure |
| II. TypeScript Strict Mode | ✅ Ready | New types defined in data-model.md, strict mode already enabled |
| III. Code Quality Standards | ✅ Ready | Components follow SRP, constants defined for filter operators |
| IV. User Experience Excellence | ✅ Ready | Loading states, inline validation, responsive design addressed |
| V. Accessibility | ✅ Ready | Using MUI components with built-in a11y, chips have labels |

**Post-Design Gate Status**: ✅ PASS - Design artifacts align with all constitution principles.

**New Dependency Justification**: `@mui/x-date-pickers` (~50KB gzipped) required for date range filtering. Native HTML date inputs have inconsistent browser support and styling. This aligns with Constitution IV (User Experience Excellence) requiring consistent, accessible date selection.

## Project Structure

### Documentation (this feature)

```text
specs/007-developer-settings-table-filters/
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
├── api/
│   ├── mockApi.ts           # Mock API routes (ADD DELETE endpoint enhancement)
│   ├── storage.ts           # LocalStorage layer (existing)
│   ├── seedData.ts          # Default data (existing)
│   └── types.ts             # API types (ADD isDummy flag to Incident)
├── components/
│   ├── common/
│   │   ├── StatusChip.tsx       # Reusable (existing)
│   │   ├── SeverityChip.tsx     # Reusable (existing)
│   │   └── DateRangeFilter.tsx  # NEW: Custom date filter component
│   ├── incidents/
│   │   ├── IncidentTable.tsx    # MODIFY: URL pagination, chip filters, date filter
│   │   ├── IncidentDrawer.tsx   # Existing (minor: close on delete)
│   │   └── filters/             # NEW: Custom filter components
│   │       ├── StatusFilterChip.tsx
│   │       ├── SeverityFilterChip.tsx
│   │       └── DateRangeFilterInput.tsx
│   ├── layout/
│   │   └── AppLayout.tsx        # MODIFY: Add Developer Settings nav link
│   └── settings/                # NEW: Developer settings components
│       ├── DeveloperSettingsPage.tsx
│       ├── DummyIncidentCreator.tsx
│       └── DummyIncidentList.tsx
├── hooks/
│   ├── useIncidents.ts      # MODIFY: Add useDeleteIncident mutation
│   ├── useUrlPagination.ts  # NEW: Custom hook for URL pagination sync
│   └── useUrlState.ts       # NEW: Generic URL state sync hook
├── pages/
│   └── DeveloperSettingsPage.tsx  # NEW: Developer settings page
├── services/
│   └── incidentService.ts   # MODIFY: Add deleteIncident function
├── types/
│   ├── form.ts              # Existing
│   └── filters.ts           # NEW: Filter state types (DateFilterState)
└── utils/
    └── dateUtils.ts         # Existing (may extend for filter comparison)

tests/
├── components/
│   ├── IncidentTable.test.tsx       # EXTEND: URL pagination, filter tests
│   ├── DateRangeFilter.test.tsx     # NEW
│   └── DeveloperSettings.test.tsx   # NEW
├── hooks/
│   └── useUrlPagination.test.ts     # NEW
└── integration/
    ├── pagination.test.tsx          # NEW: URL pagination flow
    ├── filtering.test.tsx           # NEW: Advanced filter flow
    └── developerSettings.test.tsx   # NEW: Dummy incident CRUD flow
```

**Structure Decision**: Single web application following existing codebase patterns. New components follow established directory structure with `/components/settings/` for developer settings and `/components/incidents/filters/` for custom filter components. All tests co-located in `tests/` directory per existing convention.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified. All implementation decisions align with established principles.

| Decision | Justification |
|----------|---------------|
| New dependency (@mui/x-date-pickers) | Required for accessible, consistent date picker UX |
| Custom filter components | MRT default filters don't support chip rendering |
| Separate Developer Settings page | Clear separation from main dashboard functionality |

---

## Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| Research | [research.md](./research.md) | Technology decisions and alternatives |
| Data Model | [data-model.md](./data-model.md) | Entity definitions and state types |
| API Contract | [contracts/api.yaml](./contracts/api.yaml) | OpenAPI 3.0 spec for DELETE enhancement |
| URL Contract | [contracts/url-state.md](./contracts/url-state.md) | URL query parameter specification |
| Quickstart | [quickstart.md](./quickstart.md) | Development setup and testing guide |

---

## Next Steps

Run `/speckit.tasks` to generate the implementation task breakdown based on this plan.
