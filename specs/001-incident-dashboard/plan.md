# Implementation Plan: Team Incident Dashboard

**Branch**: `001-incident-dashboard` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-incident-dashboard/spec.md`

## Summary

Build a production-quality incident management dashboard for DanskeBank operations team. The dashboard enables viewing, filtering, sorting, creating, and updating incidents with a focus on accessibility (WCAG 2.1 AA) and responsive design. Uses Material React Table for data display with detail panel editing, TanStack Query for server state, and React Router for URL-shareable views.

## Technical Context

**Language/Version**: TypeScript 5.6+ (strict mode enabled in tsconfig.json)
**Framework**: React 18.3.1 + React DOM 18.3.1
**Primary Dependencies**:
- Material UI (MUI) v5/v6 - Component library
- Material React Table (MRT) - Data table with detail panels
- TanStack Query v5 - Server state management
- TanStack Form - Form handling and validation
- React Router v6 - URL routing for deep linking
- dayjs - Date calculations and formatting (relative time, localization)

**Storage**: LocalStorage (via existing Mock API layer)
**Testing**: Vitest + React Testing Library (already configured)
**Target Platform**: Modern evergreen browsers (desktop + mobile ≥320px)
**Project Type**: Single-page web application
**Performance Goals**:
- Initial load: <3 seconds
- Filter/sort response: <1 second
- Detail view open: <1 second
- Save operations: <2 seconds

**Constraints**:
- WCAG 2.1 AA accessibility compliance
- Responsive design (320px to 1920px+)
- Touch target minimum 44x44px on mobile
- TDD workflow (tests before implementation)

**Scale/Scope**: 500+ incidents with client-side pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Plan includes TDD workflow with Vitest + RTL |
| II. TypeScript Strict Mode | ✅ PASS | tsconfig.json already has strict: true |
| III. Code Quality Standards | ✅ PASS | ESLint 9+ and Prettier 3+ already configured |
| IV. User Experience Excellence | ✅ PASS | Loading states, error handling, responsive design planned |
| V. Accessibility (WCAG 2.1 AA) | ✅ PASS | MUI + MRT provide accessibility, keyboard nav required |

**Technology Standards Check:**
- ✅ Node.js 18+
- ✅ React 18 with functional components and hooks
- ✅ TypeScript 5.6+ with strict mode
- ✅ Vite 6+ (already configured)
- ✅ Vitest + React Testing Library (already configured)
- ✅ ESLint 9+ with TypeScript plugin (already configured)
- ✅ Prettier 3+ (already configured)

## Project Structure

### Documentation (this feature)

```text
specs/001-incident-dashboard/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - UX/tech research
├── data-model.md        # Phase 1 output - Entity definitions
├── quickstart.md        # Phase 1 output - Setup guide
├── contracts/           # Phase 1 output - API contracts
│   └── openapi.yaml     # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/                    # Existing Mock API (provided)
│   ├── index.ts
│   ├── mockApi.ts
│   ├── seedData.ts
│   ├── storage.ts
│   └── types.ts
├── components/             # React components
│   ├── common/             # Shared/reusable components
│   │   ├── StatusChip.tsx
│   │   ├── SeverityChip.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── incidents/          # Incident-specific components
│   │   ├── IncidentTable.tsx
│   │   ├── IncidentDetailPanel.tsx
│   │   ├── IncidentFilters.tsx
│   │   ├── CreateIncidentDrawer.tsx
│   │   └── StatusHistory.tsx
│   └── layout/             # Layout components
│       └── DashboardLayout.tsx
├── hooks/                  # Custom React hooks
│   ├── useIncidents.ts     # TanStack Query hooks
│   ├── useUsers.ts
│   └── useUrlState.ts      # URL state sync
├── types/                  # TypeScript type definitions
│   └── index.ts            # Re-export from api/types.ts + UI types
├── theme/                  # MUI theme configuration
│   └── index.ts            # DanskeBank-aligned theme
├── App.tsx                 # Main app with Router
├── main.tsx                # Entry point
└── routes.tsx              # React Router configuration

tests/
├── unit/                   # Unit tests
│   └── components/
├── integration/            # Integration tests
│   └── incidents/
└── setup.ts                # Test setup (existing)
```

**Structure Decision**: Single-page application structure following React best practices. Components organized by feature (incidents) and type (common, layout). Existing API layer preserved as-is.

## UI/UX Decisions (User-Confirmed)

### Component Library & Styling
- **UI Library**: Material UI (MUI)
- **Table**: Material React Table (MRT)
- **Styling**: MUI's `sx` prop + `styled()` API
- **Forms**: TanStack Form for validation and handling

### Interaction Patterns
- **Table View**: Read-only display with colored MUI Chips for status/severity
- **Detail View**: MRT's built-in detail panel (one open at a time)
- **Editing**: All edits happen in detail panel via MUI Select dropdowns
- **No inline editing**: Prevents accidental changes, cleaner UX
- **Create Form**: Side drawer panel slides in from right

### Visual Design
| Element | Display | Edit Mode |
|---------|---------|-----------|
| Status | Colored MUI Chip | MUI Select dropdown |
| Severity | Colored MUI Chip | MUI Select dropdown |
| Assignee | Text (user name) | MUI Select dropdown |
| Title/Description | Text | Text fields |

### Color Scheme
**Severity Colors:**
- Critical: `error` (red)
- High: `warning` (orange)
- Medium: `info` (blue)
- Low: `success` (green)

**Status Colors:**
- Open: `info` (blue)
- In Progress: `warning` (amber)
- Resolved: `success` (green)

### Routing & URL Sharing
- **Router**: React Router v6
- **URL Pattern**: `/incidents/:id` for detail view
- **Deep Linking**: Users can share URLs that open specific incidents
- **Filter State**: Persisted in URL query params (e.g., `?status=Open&severity=High`)

### Pagination Strategy
- **Approach**: Client-side pagination via MRT
- **Rationale**: Mock API loads all data; MRT handles pagination UI
- **Page Sizes**: 10, 20, 50, 100 options

## Dependencies to Add

```json
{
  "dependencies": {
    "@mui/material": "^5.15.x or ^6.x",
    "@mui/icons-material": "^5.15.x or ^6.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x",
    "material-react-table": "^3.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-form": "^0.x",
    "react-router-dom": "^6.x",
    "dayjs": "^1.x"
  }
}
```

## Complexity Tracking

> No constitution violations requiring justification.

| Decision | Rationale | Simpler Alternative Considered |
|----------|-----------|--------------------------------|
| TanStack Query over Context | Better caching, loading states, error handling for API calls | React Context - would require manual cache management |
| MRT over simple table | Built-in pagination, sorting, filtering, detail panels | HTML table - would require building all features manually |
| React Router for deep linking | User requirement for shareable URLs | No router - would not meet URL sharing requirement |
