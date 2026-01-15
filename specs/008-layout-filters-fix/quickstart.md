# Quickstart: Layout Improvements, Status Colors, and Filter Bug Fixes

**Feature**: 008-layout-filters-fix
**Date**: 2026-01-15

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Setup

```bash
# Clone and checkout feature branch
git checkout 008-layout-filters-fix

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### 1. Run Tests (TDD)

```bash
# Run all tests in watch mode
npm test

# Run specific test file
npm test -- src/components/incidents/IncidentTable.test.tsx

# Run tests with coverage
npm run test:coverage
```

### 2. Verify Linting

```bash
# Run ESLint
npm run lint

# Run all checks (tests + lint)
npm test && npm run lint
```

### 3. Local Development Server

```bash
# Start dev server with hot reload
npm run dev
# → http://localhost:5173
```

## Key Files

| File | Purpose |
|------|---------|
| `src/theme/constants.ts` | Status color definitions |
| `src/components/common/StatusChip.tsx` | Status chip component |
| `src/components/incidents/IncidentTable.tsx` | Table with filters |
| `src/components/incidents/DashboardPage.tsx` | Dashboard layout |

## Testing the Fixes

### Assignee Filter

1. Open http://localhost:5173
2. Click on "Assignee" column filter dropdown
3. Select a user name (e.g., "Jane Smith")
4. Verify only incidents assigned to that user appear
5. Select "Unassigned" to see incidents with no assignee

### Date Filter

1. Open http://localhost:5173
2. Click on "Created" column filter dropdown
3. Select a date range
4. Verify only incidents within that range appear
5. Try "After" and "Before" date modes

### Create Button Position

1. Open http://localhost:5173
2. Note the "Create Incident" button position
3. Toggle column visibility (hide some columns)
4. Verify button remains on right side of table toolbar

### Status Colors

1. Open http://localhost:5173
2. View incidents with different statuses
3. Verify colors match:
   - Open: Blue background (#4672c2), white text
   - In Progress: Light blue background (#bad7e5), dark text
   - Resolved: Light gray background (#ebece7), dark text

## Acceptance Criteria Checklist

- [ ] Assignee filter shows correct results when selecting a user
- [ ] "Unassigned" filter option shows incidents with no assignee
- [ ] Date range filter shows correct results
- [ ] Date filter prevents invalid ranges (end before start)
- [ ] Create Incident button stays aligned with table toolbar
- [ ] Status colors match specification
- [ ] All status chips have readable contrast (WCAG AA)
- [ ] URL parameters persist filter state on refresh

## Troubleshooting

### Filters Not Working

1. Check browser console for errors
2. Verify URL parameters are being set correctly
3. Check that user data is loaded before filtering

### Colors Not Updating

1. Hard refresh browser (Ctrl+Shift+R)
2. Check that theme constants are imported correctly
3. Verify StatusChip component is using theme colors

### Create Button Missing

1. Check that DashboardPage passes handler to IncidentTable
2. Verify renderTopToolbarCustomActions is implemented
3. Check for CSS conflicts hiding the button
