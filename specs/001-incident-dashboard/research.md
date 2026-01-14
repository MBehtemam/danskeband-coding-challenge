# Research: Team Incident Dashboard

**Feature Branch**: `001-incident-dashboard`
**Date**: 2026-01-14 (Updated after user consultation)
**Status**: Complete

## Executive Summary

This document consolidates all research findings for the Team Incident Dashboard implementation, including UX best practices, technology decisions, and architectural patterns. **Key updates**: After consulting with the user, technology choices have been updated to use Material UI, Material React Table, and TanStack libraries.

---

## 1. UI Component Library

### Decision: Material UI (MUI)

**Rationale:**
- User-selected choice for component library
- Comprehensive component set with built-in accessibility
- Well-documented with active community
- Works seamlessly with Material React Table

**Alternatives Considered:**
| Library | Pros | Cons | Rejected Because |
|---------|------|------|------------------|
| Custom CSS | Maximum control, no dependencies | More development time | User preference for MUI |
| Shadcn/UI | Modern, customizable | Needs manual integration | Not familiar to team |
| Chakra UI | Good DX | Different design language | User preference for MUI |

**Sources:**
- [MUI Documentation](https://mui.com/)
- [Dashboard Design Principles - UXPin](https://www.uxpin.com/studio/blog/dashboard-design-principles/)

---

## 2. Data Table Implementation

### Decision: Material React Table (MRT) v3

**Rationale:**
- User-selected choice for table implementation
- Built on TanStack Table (headless) + MUI (styling)
- Built-in features: pagination, sorting, filtering, detail panels
- Excellent TypeScript support
- Row virtualization available for large datasets

**Key Features to Use:**
- `renderDetailPanel` - For incident detail/edit view
- `enablePagination` - Client-side pagination for 500+ incidents
- `enableSorting` - Sort by date, severity, status
- `enableColumnFilters` - Filter by status, severity, assignee
- `enableGlobalFilter` - Title search

**Configuration Notes:**
- Only one detail panel open at a time: use `muiExpandButtonProps.onClick` to close others
- Lazy loading in detail panel works well with TanStack Query

**Sources:**
- [MRT Detail Panel Guide](https://www.material-react-table.com/docs/guides/detail-panel)
- [MRT Editing Guide](https://www.material-react-table.com/docs/guides/editing)
- [MRT Best Practices](https://www.material-react-table.com/docs/guides/best-practices)

---

## 3. State Management

### Decision: TanStack Query (Server State Only)

**Rationale:**
- User-selected choice for state management
- Handles caching, background refetching, stale data automatically
- Built-in loading and error states
- Optimistic updates for better UX
- DevTools for debugging

**Implementation Pattern:**
```typescript
// Fetch all incidents
const { data, isLoading, error } = useQuery({
  queryKey: ['incidents'],
  queryFn: () => fetch('/api/incidents').then(res => res.json())
});

// Update incident mutation
const updateMutation = useMutation({
  mutationFn: (data) => fetch(`/api/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['incidents'] })
});
```

**Local UI State:**
- Filter/sort state: React Router URL params
- Form state: TanStack Form
- Drawer open/close: Local useState

**Alternatives Considered:**
| Solution | Pros | Cons | Rejected Because |
|----------|------|------|------------------|
| React Context + useReducer | Simple, no dependencies | Manual caching, refetching | User preference for TanStack Query |
| Zustand | Lightweight | Still need manual API handling | Overkill for this use case |
| Redux Toolkit | Powerful | Boilerplate heavy | User preference for TanStack Query |

---

## 4. Form Handling

### Decision: TanStack Form

**Rationale:**
- User-selected choice for forms
- Lightweight and performant
- Great TypeScript support with inferred types
- Works well with TanStack ecosystem (Query)

**Usage Pattern:**
```typescript
const form = useForm({
  defaultValues: { title: '', description: '', severity: 'Medium', assigneeId: null },
  onSubmit: async (values) => await createIncident(values),
});
```

**Validation Approach:**
- TanStack Form's built-in validators
- Custom validation functions for business rules
- Real-time inline validation

---

## 5. Table Display: Status & Severity

### Decision: MUI Chips in Table, MUI Select in Edit Mode

**Research Findings:**
Industry best practices from [PatternFly Status & Severity Guidelines](https://www.patternfly.org/patterns/status-and-severity/):
- **Status** = current state (Open, In Progress, Resolved)
- **Severity** = how critical the issue is (Low, Medium, High, Critical)
- Combine **text + color + icon** for best scannability
- Don't make the table a "rainbow" - limit color palette

**Display (Read-Only in Table):**

| Field | Component | Colors |
|-------|-----------|--------|
| Status | MUI Chip | Open=blue, In Progress=amber, Resolved=green |
| Severity | MUI Chip | Critical=red, High=orange, Medium=blue, Low=green |
| Assignee | Plain text | N/A |

**Edit (In Detail Panel):**

| Field | Component | Notes |
|-------|-----------|-------|
| Status | MUI Select dropdown | Standard accessible select |
| Severity | MUI Select dropdown | Standard accessible select |
| Assignee | MUI Select dropdown | List of users from API |
| Title | MUI TextField | Text input |
| Description | MUI TextField multiline | Textarea |

**Sources:**
- [PatternFly Status & Severity](https://www.patternfly.org/patterns/status-and-severity/)
- [The Right Way to Design Table Status Badges](https://uxmovement.substack.com/p/why-youre-designing-table-status)
- [Design Better Badges - Medium](https://coyleandrew.medium.com/design-better-badges-cdb83f4dd43e)

---

## 6. Detail Panel & Editing Pattern

### Decision: MRT Detail Panel for View/Edit, Side Drawer for Create

**Research Findings:**
From [Data Table UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables):
- Detail panels allow viewing/editing without losing table context
- Progressive disclosure: show summary in row, full details in panel
- Only one panel open at a time reduces cognitive load

**UX Pattern:**
1. **View Incident**: Click row to expand detail panel below the row
2. **Edit Incident**: Edit fields directly in detail panel, Save button
3. **Create Incident**: Floating Action Button (FAB) opens side drawer

**No Inline Table Editing:**
- User confirmed: all edits in detail panel only
- Prevents accidental changes
- Cleaner, more focused UX

**Sources:**
- [MRT Detail Panel Example](https://www.material-react-table.com/docs/examples/detail-panel)
- [Dashboard UX Patterns - Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)

---

## 7. Routing & URL Sharing

### Decision: React Router v6 with URL State

**User Requirement:**
> "I like if user copy a URL in the url they see the real view"

**Implementation:**
- `/` - Main dashboard with incident table
- `/incidents/:id` - Opens specific incident in detail panel (deep link)
- Query params for filters: `?status=Open&severity=High&assignee=user-1`

**Deep Linking Pattern:**
```typescript
// On mount, check URL for incident ID
const { incidentId } = useParams();
if (incidentId) {
  // Expand that row's detail panel
  table.setExpanded({ [incidentId]: true });
}
```

**Sources:**
- [Implementing Deep Links in React with Atoms](https://www.sematic.dev/blog/implementing-deep-links-in-react-with-atoms)
- [React Router v6 Documentation](https://reactrouter.com/)

---

## 8. Pagination Strategy

### Decision: Client-Side Pagination via MRT

**Context:**
- Mock API returns all incidents at once (no server pagination)
- Expected volume: 500+ incidents
- LocalStorage can easily handle this amount of data

**Implementation:**
- MRT's built-in `enablePagination` option
- Page size options: 10, 20, 50, 100
- TanStack Query caches full dataset
- Filtering/sorting happens client-side

**Why Not Server-Side:**
- Mock API would need significant refactoring
- For a frontend challenge, client-side demonstrates MRT capabilities
- Still shows understanding of pagination UX patterns

---

## 9. Styling Approach

### Decision: MUI's sx prop + styled() API

**Rationale:**
- User-selected choice for styling
- Consistent with MUI patterns
- Type-safe with TypeScript
- Supports responsive breakpoints
- Easy theming

**DanskeBank Brand Alignment:**
```typescript
// theme/index.ts
const theme = createTheme({
  palette: {
    primary: {
      main: '#003755',  // DanskeBank blue
    },
    secondary: {
      main: '#00a3e0',
    },
  },
});
```

---

## 10. Responsive Design

### Decision: Mobile-First with MUI Responsive Features

**Requirements:**
- Support 320px (mobile) to 1920px+ (desktop)
- Touch targets minimum 44x44px
- All features usable on all devices

**MRT Responsive Approach:**
- Column hiding on smaller screens
- Detail panel works on all sizes
- Filters collapse into menu on mobile

**MUI Responsive Utilities:**
- `useMediaQuery` for breakpoint detection
- `sx` prop with breakpoint values
- `Drawer` for mobile-friendly panels

---

## 11. Accessibility (WCAG 2.1 AA)

### Requirements Mapping

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigable | MRT handles table keyboard nav; custom focus management for drawer |
| Focus indicators | MUI default + custom `:focus-visible` styles |
| Color not sole indicator | Icons + text labels with colors |
| Text contrast 4.5:1 | MUI theme colors meet requirements |
| Form labels | MUI TextField `label` prop |
| Error messages | `aria-describedby` + `aria-invalid` |
| Dynamic announcements | `aria-live` regions for status updates |
| Semantic HTML | MUI uses proper elements (button, table, etc.) |

---

## 12. Existing Mock API Analysis

### Endpoints Available

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/incidents` | List all incidents |
| GET | `/api/incidents/:id` | Get single incident |
| POST | `/api/incidents` | Create incident |
| PATCH | `/api/incidents/:id` | Update incident |
| DELETE | `/api/incidents/:id` | Delete incident |
| GET | `/api/users` | List all users |
| POST | `/api/reset` | Reset data to defaults |

### Data Types (Already Defined)

```typescript
type IncidentStatus = "Open" | "In Progress" | "Resolved";
type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

### No Changes Needed to Mock API
- API is complete for all required features
- Types are well-defined
- Status history tracking already implemented

---

## 13. Testing Strategy

### Decision: Vitest + React Testing Library (Already Configured)

**TDD Workflow:**
1. Write failing test (Red)
2. Implement minimal code (Green)
3. Refactor (Refactor)

**Test Organization:**
```
src/components/incidents/
├── IncidentTable.tsx
└── IncidentTable.test.tsx
```

**Testing Priorities:**
| Level | Focus | Coverage |
|-------|-------|----------|
| Unit | Component rendering, interactions | 80%+ |
| Integration | Filter + List + Pagination | Critical paths |
| Accessibility | Keyboard navigation, ARIA | All interactive elements |

---

## Technology Stack Summary

| Layer | Technology | Notes |
|-------|------------|-------|
| UI Framework | React 18.3.1 | Existing |
| Language | TypeScript 5.6+ | Existing, strict mode |
| Build Tool | Vite 6.0.5 | Existing |
| UI Components | Material UI | To add |
| Table | Material React Table | To add |
| State | TanStack Query | To add |
| Forms | TanStack Form | To add |
| Routing | React Router v6 | To add |
| Date Utils | dayjs | To add |
| Styling | MUI sx + styled | Via MUI |
| Testing | Vitest + RTL | Existing |
| API | Fetch + mockApi | Existing |

---

## Summary of Key Decisions (User-Confirmed)

| Area | Decision | User Input |
|------|----------|------------|
| UI Library | Material UI | User-selected |
| Table | Material React Table | User-selected |
| State Management | TanStack Query | User-selected |
| Forms | TanStack Form | User-selected |
| Styling | MUI sx prop + styled | User-selected |
| Display (Table) | MUI Chips for status/severity | User-confirmed |
| Editing | Detail panel only, no inline | User-confirmed |
| Create Form | Side drawer | User-confirmed |
| Routing | React Router v6 | User-confirmed |
| Pagination | Client-side via MRT | User-confirmed |

---

## Next Steps

All technical decisions finalized. Proceed to Phase 1:
1. Generate data-model.md
2. Generate API contracts
3. Generate quickstart.md
4. Update agent context
