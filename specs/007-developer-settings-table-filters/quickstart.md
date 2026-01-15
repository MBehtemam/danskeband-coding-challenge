# Quickstart: Developer Settings & Table Enhancements

**Feature Branch**: `007-developer-settings-table-filters`
**Date**: 2026-01-14

## Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

## Setup

```bash
# Clone and checkout feature branch
git checkout 007-developer-settings-table-filters

# Install dependencies
npm install

# Install new dependency for date picker
npm install @mui/x-date-pickers

# Start development server
npm run dev
```

## Testing the Feature

### 1. URL-Based Pagination

1. Open http://localhost:5173/
2. Observe URL shows `?page=1&pageSize=10` by default
3. Navigate to page 2 - URL updates to `?page=2&pageSize=10`
4. Change rows per page to 20 - URL updates to `?page=1&pageSize=20`
5. Copy URL and paste in new tab - same page/pageSize displayed
6. Refresh page - state preserved

### 2. Status/Severity Chip Filters

1. Open the Status filter dropdown
2. See chip-styled options (Open, In Progress, Resolved) with colors
3. Select "Open" - filter applied, URL updates
4. Open the Severity filter dropdown
5. See chip-styled options (Critical, High, Medium, Low) with colors
6. Select "Critical" - filter applied, URL updates

### 3. Date Range Filter

1. Open the Created At filter
2. Select operator "Greater than"
3. Pick a date from the date picker
4. See only incidents after that date
5. Change operator to "Between"
6. Pick start and end dates
7. Try invalid range (end before start) - see validation error
8. Fix the range - filter applied

### 4. Column Visibility

1. Click the column visibility icon in table toolbar
2. Toggle off "Severity" column - column hidden
3. Toggle off "Assignee" column - column hidden
4. URL updates with `?hiddenColumns=severity,assigneeId`
5. Refresh page - columns still hidden
6. Toggle columns back on - columns visible

### 5. Developer Settings

1. Navigate to http://localhost:5173/developer (or click nav link)
2. Click "Add Dummy Incident" button
3. New dummy incident created with random data
4. See the dummy incident in the list
5. Click "Delete" on a dummy incident
6. Confirm deletion - incident removed
7. Navigate back to dashboard - dummy incident gone

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "pagination"

# Run with coverage
npm run test:coverage
```

## Key Files to Review

| File | Description |
|------|-------------|
| [src/components/incidents/IncidentTable.tsx](src/components/incidents/IncidentTable.tsx) | Main table with all enhancements |
| [src/types/filters.ts](src/types/filters.ts) | New filter type definitions |
| [src/hooks/useUrlPagination.ts](src/hooks/useUrlPagination.ts) | URL pagination sync hook |
| [src/pages/DeveloperSettingsPage.tsx](src/pages/DeveloperSettingsPage.tsx) | Developer settings page |
| [src/api/mockApi.ts](src/api/mockApi.ts) | Enhanced DELETE endpoint |

## Common Issues

### Date picker not rendering
Ensure `@mui/x-date-pickers` is installed and LocalizationProvider is configured.

### URL parameters not persisting
Check browser console for React Router warnings. Ensure `setSearchParams` is called with `{ replace: true }`.

### Column visibility not working
Verify the table's `onColumnVisibilityChange` handler is connected properly.

## Architecture Decisions

1. **URL-first state**: All table state is URL-driven for shareability
2. **Chip reuse**: StatusChip and SeverityChip components reused in filters
3. **isDummy flag**: Simple boolean to distinguish deletable incidents
4. **Client-side filtering**: Leverages MRT's built-in filtering for performance
