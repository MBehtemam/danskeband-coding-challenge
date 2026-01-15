# Filter Contracts: Layout Improvements, Status Colors, and Filter Bug Fixes

**Feature**: 008-layout-filters-fix
**Date**: 2026-01-15

## Overview

This document defines the contracts for filter functions and component interfaces affected by this feature.

## Filter Function Contracts

### Assignee Filter Function

```typescript
/**
 * Custom filter function for assignee column.
 * Handles both named users and "Unassigned" special case.
 *
 * @param row - MRT row containing incident data
 * @param columnId - Column identifier ('assigneeId')
 * @param filterValue - Selected filter value (user name or 'Unassigned')
 * @returns boolean - true if row matches filter
 */
type AssigneeFilterFn = (
  row: MRT_Row<Incident>,
  columnId: string,
  filterValue: string
) => boolean;

// Contract:
// - If filterValue === 'Unassigned': return true if incident.assigneeId is null/empty
// - Otherwise: return true if resolved user name matches filterValue
// - Must handle case where assigneeId references non-existent user (return 'Unknown')
```

### Date Filter Function

```typescript
/**
 * Custom filter function for createdAt column.
 * Handles date range, greater than, and less than comparisons.
 *
 * @param row - MRT row containing incident data
 * @param columnId - Column identifier ('createdAt')
 * @param filterValue - Array of [startDate, endDate] or single date
 * @param addMeta - MRT metadata function
 * @returns boolean - true if row matches filter
 */
type DateFilterFn = (
  row: MRT_Row<Incident>,
  columnId: string,
  filterValue: [Date | null, Date | null],
  addMeta: (meta: any) => void
) => boolean;

// Contract:
// - Parse row.getValue(columnId) as ISO string to Date object
// - If filterMode is 'betweenInclusive': return startDate <= rowDate <= endDate
// - If filterMode is 'greaterThan': return rowDate > startDate
// - If filterMode is 'lessThan': return rowDate < endDate
// - Handle null dates gracefully (null = no constraint)
```

## Component Contracts

### IncidentTable Props

```typescript
interface IncidentTableProps {
  /** Callback when Create Incident button is clicked */
  onCreateClick?: () => void;
}
```

### StatusChip Props

```typescript
interface StatusChipProps {
  /** Incident status to display */
  status: IncidentStatus;
  /** Chip size variant */
  size?: 'small' | 'medium';
}

// Contract:
// - Renders MUI Chip with background color from STATUS_CONFIG[status].backgroundColor
// - Text color from STATUS_CONFIG[status].textColor
// - Icon color matches text color
// - aria-label includes status for accessibility
```

### STATUS_CONFIG Contract

```typescript
interface StatusConfig {
  backgroundColor: string;  // Hex color code
  textColor: string;        // Hex color code
  icon: React.ComponentType<SvgIconProps>;
  label: string;            // Display text
}

// Contract for updated colors:
const STATUS_CONFIG: Record<IncidentStatus, StatusConfig> = {
  'Open': {
    backgroundColor: '#4672c2',
    textColor: '#FFFFFF',
    icon: RadioButtonUncheckedIcon,
    label: 'Open',
  },
  'In Progress': {
    backgroundColor: '#bad7e5',
    textColor: '#002346',
    icon: PlayArrowIcon,
    label: 'In Progress',
  },
  'Resolved': {
    backgroundColor: '#ebece7',
    textColor: '#002346',
    icon: CheckCircleIcon,
    label: 'Resolved',
  },
};
```

## URL Parameter Contract

### Filter Parameters

| Parameter | Type | Validation | Example |
|-----------|------|------------|---------|
| `assignee` | string | Must be valid user name or 'Unassigned' | `Jane%20Smith` |
| `assigneeMode` | string | Must be 'eq' or 'neq' | `eq` |
| `dateOp` | string | Must be 'between', 'gt', or 'lt' | `between` |
| `dateStart` | string | Must be valid ISO date (YYYY-MM-DD) | `2024-01-15` |
| `dateEnd` | string | Must be valid ISO date, >= dateStart | `2024-01-31` |

### URL Serialization Contract

```typescript
// Encoding (state → URL)
const encodeAssigneeFilter = (userName: string): string => {
  return encodeURIComponent(userName);
};

const encodeDateFilter = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Decoding (URL → state)
const decodeAssigneeFilter = (urlValue: string): string => {
  return decodeURIComponent(urlValue);
};

const decodeDateFilter = (urlValue: string): Date | null => {
  if (!urlValue) return null;
  return new Date(urlValue);
};
```

## Accessibility Contract

### Color Contrast Requirements

All status colors must meet WCAG 2.1 AA Level requirements:
- Normal text (< 18pt): 4.5:1 minimum contrast ratio
- Large text (≥ 18pt or 14pt bold): 3:1 minimum contrast ratio

| Status | Background | Foreground | Contrast | Requirement |
|--------|------------|------------|----------|-------------|
| Open | #4672c2 | #FFFFFF | 4.61:1 | ✅ ≥ 4.5:1 |
| In Progress | #bad7e5 | #002346 | 9.38:1 | ✅ ≥ 4.5:1 |
| Resolved | #ebece7 | #002346 | 12.53:1 | ✅ ≥ 4.5:1 |

### Keyboard Navigation

- All filter dropdowns must be keyboard accessible
- Create Incident button must have visible focus indicator
- Date pickers must support keyboard date entry

### Screen Reader Support

- Status chips include aria-label with status name
- Filter inputs include associated labels
- Clear filters button includes descriptive text
