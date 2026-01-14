# Implementation Plan: Team Incident Dashboard

**Branch**: `001-incident-dashboard` | **Date**: 2026-01-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-incident-dashboard/spec.md`

## Summary

Build a production-quality frontend application for an internal operations team to manage incidents. The dashboard enables viewing, filtering, creating, and updating incidents with full CRUD operations via a mock API. Technical approach uses Material UI + Material React Table for UI, TanStack Query for server state, TanStack Form for forms, and React Router for navigation.

## Technical Context

**Language/Version**: TypeScript 5.6+ (strict mode enabled in tsconfig.json)
**Primary Dependencies**: React 18.3.1, Material UI, Material React Table v3, TanStack Query v5, TanStack Form, React Router v6, dayjs
**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest + React Testing Library (TDD required per constitution)
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single frontend application
**Performance Goals**: Initial load <3s, filter/sort response <1s, save operations <2s
**Constraints**: Client-side pagination for 500+ incidents, WCAG 2.1 AA accessibility
**Scale/Scope**: 500+ incidents, 4 seed users, 7 user stories, ~40 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✓ Required | All tasks must include tests BEFORE implementation |
| II. TypeScript Strict Mode | ✓ Enabled | tsconfig.json has strict: true |
| III. Code Quality | ✓ Configured | ESLint + Prettier already set up |
| IV. UX Excellence | ✓ Addressed | Loading states, error handling, optimistic updates planned |
| V. Accessibility (WCAG 2.1 AA) | ✓ Planned | Keyboard nav, ARIA, semantic HTML in all components |

## Project Structure

### Documentation (this feature)

```text
specs/001-incident-dashboard/
├── plan.md              # This file
├── research.md          # Technology decisions (MUI, MRT, TanStack)
├── data-model.md        # Entity definitions (Incident, User, StatusHistory)
├── quickstart.md        # Developer setup guide
├── contracts/           # API specification
│   └── openapi.yaml     # OpenAPI 3.1 spec for mock API
└── tasks.md             # Implementation tasks with TDD
```

### Source Code (repository root)

```text
src/
├── api/                 # Mock API (existing)
│   ├── index.ts
│   ├── mockApi.ts
│   ├── seedData.ts
│   ├── storage.ts
│   └── types.ts
├── components/
│   ├── common/          # Shared UI (StatusChip, SeverityChip, EmptyState, etc.)
│   ├── incidents/       # Feature components (IncidentTable, DetailPanel, etc.)
│   └── layout/          # AppLayout, Header
├── hooks/               # TanStack Query hooks (useIncidents, useUsers, mutations)
├── services/            # API client layer (incidentService, userService)
├── theme/               # MUI theme with DanskeBank brand colors
├── utils/               # Utilities (dateUtils with dayjs)
├── App.tsx
├── App.css
└── main.tsx             # Providers: QueryClient, Router, Theme
```

**Structure Decision**: Single frontend project. Components organized by feature (incidents) with shared common components. Hooks and services separated for clean architecture. Tests collocated with source files (*.test.tsx).

## Architecture Decisions

### State Management
- **Server State**: TanStack Query for caching, background refetch, optimistic updates
- **UI State**: React useState for local component state (drawer open, edit mode)
- **URL State**: React Router for filters, sort, and deep linking to incidents

### Data Flow
```
User Action → Component → Hook (useMutation) → Service → Mock API → LocalStorage
                                ↓
                    TanStack Query Cache Invalidation
                                ↓
                    UI Re-render with fresh data
```

### Component Architecture
- **IncidentTable**: MRT-based table with pagination, sorting, filtering, detail panels
- **IncidentDetailPanel**: MRT renderDetailPanel for view/edit in-place
- **CreateIncidentDrawer**: Side drawer with TanStack Form for new incidents
- **Common Chips**: StatusChip, SeverityChip for consistent status/severity display

## Complexity Tracking

No constitution violations requiring justification. Architecture follows simplest approach:
- Single project (no monorepo)
- Client-side state only (no external state management library beyond TanStack Query)
- Existing mock API (no backend changes needed)
