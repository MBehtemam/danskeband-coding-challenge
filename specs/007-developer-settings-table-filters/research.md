# Research: Developer Settings & Table Enhancements

**Feature Branch**: `007-developer-settings-table-filters`
**Date**: 2026-01-14

## Research Topics

### 1. Material React Table URL Pagination Integration

**Decision**: Use Material React Table's built-in `onPaginationChange` callback with React Router's `useSearchParams` hook.

**Rationale**: The codebase already establishes a pattern for URL state synchronization in `IncidentTable.tsx` for filters and sorting. Pagination follows the same pattern using MRT's `state.pagination` and `onPaginationChange` props.

**Implementation Approach**:
```typescript
// Initialize from URL
const [pagination, setPagination] = useState<MRT_PaginationState>(() => {
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);
  return { pageIndex: Math.max(0, page - 1), pageSize };
});

// Sync to URL in useEffect
useEffect(() => {
  params.set('page', String(pagination.pageIndex + 1));
  params.set('pageSize', String(pagination.pageSize));
  setSearchParams(params, { replace: true });
}, [pagination]);

// Material React Table config
const table = useMaterialReactTable({
  state: { pagination },
  onPaginationChange: setPagination,
  manualPagination: false, // Keep client-side pagination
});
```

**Edge Case Handling**:
- Invalid page number (negative, NaN, exceeds data): Clamp to valid range [1, totalPages]
- Invalid pageSize: Fallback to default (10) if not in allowed options [10, 20, 50, 100]

**Alternatives Considered**:
1. **Manual pagination with custom logic**: Rejected because MRT has excellent built-in pagination; no need to reinvent.
2. **Server-side pagination**: Rejected for this mock API implementation; client-side is sufficient for demo scale.

---

### 2. Custom Filter Components with Chips (Status/Severity)

**Decision**: Create custom filter components using Material React Table's `Filter` column prop with `renderColumnFilterModeMenuItems` and `filterVariant: 'custom'`.

**Rationale**: MRT's default select filter works but doesn't display chips. Custom filter components can reuse existing `StatusChip` and `SeverityChip` components for visual consistency.

**Implementation Approach**:
```typescript
// Column definition with custom filter
{
  accessorKey: 'status',
  header: 'Status',
  Cell: ({ cell }) => <StatusChip status={cell.getValue<IncidentStatus>()} />,
  filterVariant: 'multi-select', // Allow multiple selection
  filterSelectOptions: [
    { value: 'Open', label: 'Open', render: () => <StatusChip status="Open" size="small" /> },
    { value: 'In Progress', label: 'In Progress', render: () => <StatusChip status="In Progress" size="small" /> },
    { value: 'Resolved', label: 'Resolved', render: () => <StatusChip status="Resolved" size="small" /> },
  ],
  // Or use muiFilterTextFieldProps for styling
}
```

**Alternative**: Use MRT's `muiFilterAutocompleteProps` with custom `renderOption` and `renderTags` to show chips in the filter dropdown.

**Best Practice**: Material React Table v3.x supports `filterVariant: 'autocomplete'` which can be customized with `muiFilterAutocompleteProps` for chip rendering.

**Alternatives Considered**:
1. **Pure CSS styling of select options**: Limited browser support for styling `<option>` elements.
2. **Entirely custom filter outside MRT**: Breaks integration with MRT's filter state management.

---

### 3. Date Range Filter with Operators

**Decision**: Implement custom filter component with date picker (MUI Date Picker) and operator dropdown.

**Rationale**: MRT doesn't have built-in date range filtering with operators. A custom component provides the flexibility needed for greater-than, less-than, and between operations.

**Implementation Approach**:
```typescript
// Filter state type
interface DateFilterState {
  operator: 'gt' | 'lt' | 'between' | null;
  startDate: string | null;
  endDate: string | null; // Only used for 'between'
}

// Custom filterFn
const dateFilterFn: MRT_FilterFn<Incident> = (row, columnId, filterValue: DateFilterState) => {
  if (!filterValue.operator || !filterValue.startDate) return true;

  const cellValue = dayjs(row.getValue<string>(columnId));
  const startDate = dayjs(filterValue.startDate);

  switch (filterValue.operator) {
    case 'gt':
      return cellValue.isAfter(startDate);
    case 'lt':
      return cellValue.isBefore(startDate);
    case 'between':
      const endDate = dayjs(filterValue.endDate);
      return cellValue.isAfter(startDate.subtract(1, 'day')) &&
             cellValue.isBefore(endDate.add(1, 'day')); // Inclusive
    default:
      return true;
  }
};
```

**Date Picker Options**:
1. **MUI X Date Pickers** (`@mui/x-date-pickers`): Full-featured, production-ready, requires separate install
2. **Native HTML date input**: Limited styling, inconsistent cross-browser
3. **Custom date input with dayjs**: More control but more work

**Recommendation**: Use `@mui/x-date-pickers` DatePicker component for consistent MUI styling and accessibility. Already compatible with MUI v7.

**Validation**:
- Inline validation for "between" operator: endDate must be >= startDate
- Display error message inline, disable filter application until valid

**Alternatives Considered**:
1. **Single date with automatic operator inference**: Confusing UX, not explicit enough.
2. **Text input with date parsing**: Error-prone, poor UX.

---

### 4. Column Visibility Toggle Fix

**Decision**: Debug existing column visibility implementation and ensure proper state synchronization.

**Research Findings**: The current implementation in `IncidentTable.tsx` sets `columnVisibility` based on responsive breakpoints but doesn't expose user toggle functionality properly.

**Root Cause Analysis**:
- MRT has `enableHiding: true` (default) which shows the column visibility menu
- The responsive `columnVisibility` state might be overriding user-selected visibility
- Need to separate responsive defaults from user preferences

**Implementation Approach**:
```typescript
// Separate responsive defaults from user preferences
const [userColumnVisibility, setUserColumnVisibility] = useState<VisibilityState>(() => {
  // Load from URL params
  const hidden = searchParams.get('hiddenColumns')?.split(',') ?? [];
  return Object.fromEntries(hidden.map(col => [col, false]));
});

// Merge responsive defaults with user preferences (user takes precedence)
const mergedVisibility = useMemo(() => ({
  ...responsiveDefaults,
  ...userColumnVisibility,
}), [responsiveDefaults, userColumnVisibility]);

// Table config
const table = useMaterialReactTable({
  enableHiding: true,
  state: { columnVisibility: mergedVisibility },
  onColumnVisibilityChange: setUserColumnVisibility,
});
```

**URL Persistence**: Store hidden column IDs as comma-separated list: `?hiddenColumns=severity,assigneeId`

**Edge Case**: All columns hidden - ensure at least one column (title) remains visible.

**Alternatives Considered**:
1. **localStorage for visibility**: Violates requirement for URL-shareable state.
2. **Session-only visibility**: Doesn't persist across refresh.

---

### 5. Developer Settings Page Architecture

**Decision**: Create a new route `/developer` with dedicated page component following existing routing patterns.

**Rationale**: The developer settings functionality is distinct from the main dashboard and warrants its own page for clarity.

**Implementation Approach**:

**Routing** (App.tsx):
```typescript
<Route path="/developer" element={<DeveloperSettingsPage />} />
```

**Navigation** (Add to AppLayout or create header nav):
- Link to "/developer" from main dashboard
- Back link from developer settings to dashboard

**Page Components**:
1. `DeveloperSettingsPage.tsx` - Container page
2. `DummyIncidentCreator.tsx` - Form/button to create dummy incidents
3. `DummyIncidentList.tsx` - List of all incidents with delete option (only dummy deletable)

**Dummy Incident Flag**:
- Add `isDummy: boolean` to Incident type
- Set `isDummy: true` when creating via developer settings
- Filter in mock API: only allow DELETE for incidents where `isDummy: true`

**Random Data Generation**:
```typescript
const generateDummyIncident = (): CreateIncidentInput => ({
  title: faker.lorem.sentence() || `Test Incident ${Date.now()}`,
  description: faker.lorem.paragraph(),
  severity: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Critical']),
  assigneeId: faker.helpers.arrayElement([null, ...userIds]),
  isDummy: true,
});
```

**Note**: Consider lightweight random generation without faker to avoid bundle size increase:
```typescript
const TITLES = ['Database timeout', 'API error', 'UI bug', 'Performance issue', ...];
const randomFrom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
```

**Alternatives Considered**:
1. **Modal-based settings on main page**: Clutters the dashboard, harder to navigate.
2. **Separate `/settings` route for all settings**: Over-engineering for current scope; can extend later.

---

### 6. Delete Incident API Enhancement

**Decision**: Enhance existing mock API DELETE endpoint to only allow deletion of dummy incidents.

**Rationale**: Spec requirement FR-012 states users can only delete dummy incidents from developer settings.

**Implementation Approach**:
```typescript
// mockApi.ts - Enhanced DELETE handler
if (url.match(/^\/api\/incidents\/[\w-]+$/) && method === 'DELETE') {
  const id = url.split('/').pop();
  const incidents = getIncidents();
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return createResponse(404, { error: 'Incident not found' });
  }

  if (!incident.isDummy) {
    return createResponse(403, { error: 'Cannot delete non-dummy incidents' });
  }

  const updated = incidents.filter(i => i.id !== id);
  setIncidents(updated);
  return createResponse(204, null);
}
```

**Service Layer**:
```typescript
// incidentService.ts
export async function deleteIncident(id: string): Promise<void> {
  const response = await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete incident');
  }
}
```

**TanStack Query Mutation**:
```typescript
// useIncidents.ts
export function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}
```

---

### 7. Dependencies Assessment

**Required New Dependencies**:
1. `@mui/x-date-pickers` - Date picker component for date range filter
   - Bundle size impact: ~50KB gzipped (acceptable)
   - Peer dependency: dayjs (already installed)

**No New Dependencies Needed For**:
- URL state management (React Router already installed)
- Random data generation (can use Math.random with predefined arrays)
- Chip components (reuse existing StatusChip/SeverityChip)

---

## Summary of Key Decisions

| Topic | Decision | Key Reason |
|-------|----------|------------|
| URL Pagination | MRT built-in + useSearchParams | Follows existing codebase pattern |
| Chip Filters | MRT autocomplete with custom render | Reuses existing chip components |
| Date Filter | Custom component + @mui/x-date-pickers | MRT lacks built-in date range support |
| Column Visibility | Separate user prefs from responsive defaults | Fix current override issue |
| Developer Settings | New /developer route | Clear separation of concerns |
| Dummy Incidents | isDummy flag on Incident type | Simple, explicit filtering |
| Delete API | 403 for non-dummy deletion | Spec requirement FR-012 |
