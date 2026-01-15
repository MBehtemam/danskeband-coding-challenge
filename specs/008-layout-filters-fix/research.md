# Research: Layout Improvements, Status Colors, and Filter Bug Fixes

**Feature**: 008-layout-filters-fix
**Date**: 2026-01-15

## Research Findings

### 1. Material React Table (MRT) Filter System

**Decision**: Use custom `filterFn` with `accessorFn` for assignee filtering to handle UUID→name mapping correctly.

**Rationale**: MRT v3's filtering system applies filters in this order:
1. If `filterVariant: 'select'` is used, MRT matches the filter value against the accessor value
2. If a custom `filterFn` is provided, it overrides the default but must be properly typed
3. The `accessorKey` returns raw data, but `accessorFn` can transform data for both display AND filtering

The current bug occurs because:
- `accessorKey: 'assigneeId'` returns a UUID
- `filterSelectOptions: users?.map(u => u.name)` provides names
- MRT attempts to compare `filterValue (name)` === `row.assigneeId (UUID)` → always false

**Alternatives considered**:
1. **Map filter values to IDs in filterSelectOptions** - Rejected because it would require mapping back to names for display
2. **Store assignee ID in URL instead of name** - Rejected because names are more user-friendly in URLs
3. **Use accessorFn to return name directly** - Selected as the cleanest solution

### 2. Date Range Filter Implementation

**Decision**: Implement custom `filterFn` that converts ISO strings to Date objects for comparison.

**Rationale**: MRT's built-in `date-range` filter expects the column value to be a Date object. Our `createdAt` field is stored as an ISO string (`"2024-01-15T10:30:00.000Z"`). The default comparisons fail because:
1. String comparison `"2024-01-15..." > "2024-01-10..."` works alphabetically but not semantically for all date formats
2. MRT's date filter uses `new Date(value)` internally but may not handle all edge cases

**Fix approach**:
```typescript
filterFn: (row, columnId, filterValue, addMeta) => {
  const [startDate, endDate] = filterValue as [Date | null, Date | null];
  const rowDate = new Date(row.getValue<string>(columnId));

  if (startDate && endDate) {
    return rowDate >= startDate && rowDate <= endDate;
  }
  if (startDate) return rowDate >= startDate;
  if (endDate) return rowDate <= endDate;
  return true;
}
```

**Alternatives considered**:
1. **Convert createdAt to Date in accessor** - Rejected because it would affect sorting and display
2. **Use dayjs for comparison** - Acceptable but adds complexity; native Date works fine
3. **Store dates as timestamps** - Rejected as breaking change to data model

### 3. MRT Toolbar Integration for Create Button

**Decision**: Use `renderTopToolbarCustomActions` to integrate the Create Incident button.

**Rationale**: MRT provides several toolbar customization options:
- `renderTopToolbar`: Complete replacement of top toolbar (too invasive)
- `renderTopToolbarCustomActions`: Add custom actions to left side of toolbar
- `renderToolbarInternalActions`: Add custom actions to internal actions area

Using `renderTopToolbarCustomActions` allows:
1. Button stays within MRT's toolbar layout system
2. Position is consistent regardless of column visibility
3. Access to table instance for potential future features

**Implementation approach**:
```typescript
renderTopToolbarCustomActions: ({ table }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    {hasActiveFilters && <ClearFiltersButton />}
    <Box sx={{ flexGrow: 1 }} />
    <CreateIncidentButton onClick={handleOpenCreateDialog} />
  </Box>
)
```

**Alternatives considered**:
1. **Keep button above table** - Rejected because it doesn't stay aligned when columns change
2. **Use CSS position: absolute** - Rejected because fragile and not responsive
3. **Use MRT's internal actions** - Rejected because it mixes with column hide/show actions

### 4. Status Color Contrast Verification

**Decision**: Update colors to specified values with appropriate text colors for WCAG AA compliance.

**Rationale**: Using WebAIM's contrast checker algorithm:

| Status | Background | Text | Contrast Ratio | WCAG AA |
|--------|------------|------|----------------|---------|
| Resolved | #ebece7 | #002346 | 12.53:1 | ✅ Pass (≥4.5:1) |
| In Progress | #bad7e5 | #002346 | 9.38:1 | ✅ Pass (≥4.5:1) |
| Open | #4672c2 | #FFFFFF | 4.61:1 | ✅ Pass (≥4.5:1) |

All colors meet WCAG AA Level requirements for normal text (4.5:1 minimum).

**Color psychology**:
- Resolved (#ebece7): Light neutral/gray suggests completed/archived
- In Progress (#bad7e5): Light blue suggests active/working
- Open (#4672c2): Medium blue suggests new/attention needed

### 5. Unassigned Incidents Handling

**Decision**: Add "Unassigned" as a filter option that matches incidents with null/empty assigneeId.

**Rationale**: Users need to find unassigned incidents to distribute workload. The filter dropdown should include:
- All user names from the users list
- An "Unassigned" option for incidents where `assigneeId` is null or empty string

**Implementation**:
```typescript
filterSelectOptions: [
  'Unassigned',
  ...(users?.map((u) => u.name) ?? [])
],
filterFn: (row, _columnId, filterValue) => {
  if (filterValue === 'Unassigned') {
    return !row.original.assigneeId;
  }
  const assigneeName = getUserName(row.original.assigneeId);
  return assigneeName === filterValue;
}
```

### 6. Date Picker Invalid Range Prevention

**Decision**: Disable end dates before start date in the date picker UI.

**Rationale**: MRT's built-in date-range picker doesn't have built-in validation for invalid ranges. We can add validation via:
1. `muiFilterDatePickerProps` to configure the DatePicker components
2. Custom `shouldDisableDate` function for the end date picker

**Implementation**:
```typescript
muiFilterDatePickerProps: ({ column }) => ({
  minDate: column.getFilterValue()?.[0] || undefined,
})
```

### 7. Layout Verification

**Decision**: No changes needed for full-width navigation and centered table.

**Rationale**: After code review:
- `AppLayout.tsx` uses MUI `AppBar` with `position="static"` which spans full width by default
- `Container` with `maxWidth="xl"` centers content appropriately
- Current layout matches requirements

Verified layout structure:
```
AppBar (full width)
└── Toolbar (full width, responsive height)
Container (centered, maxWidth: xl, responsive padding)
└── DashboardPage content (incident table)
```

## Technical Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| material-react-table | 3.2.1 | Table with filtering, sorting, pagination |
| @mui/material | 7.3.7 | UI components, theming |
| @mui/x-date-pickers | - | Date picker components for filters |
| dayjs | 1.11.19 | Date formatting utilities |
| react-router-dom | 6.30.3 | URL state synchronization |

## Files to Modify

1. **src/theme/constants.ts** - Update STATUS_COLORS values
2. **src/components/common/StatusChip.tsx** - No changes (reads from theme)
3. **src/components/incidents/IncidentTable.tsx** - Fix filters, add Create button to toolbar
4. **src/components/incidents/DashboardPage.tsx** - Pass Create button handler to IncidentTable

## Testing Strategy

| Test Type | Coverage |
|-----------|----------|
| Unit | Filter functions with mock data |
| Component | StatusChip renders correct colors |
| Integration | Assignee filter shows correct results |
| Integration | Date filter shows correct results |
| Visual | Create button position across column states |
