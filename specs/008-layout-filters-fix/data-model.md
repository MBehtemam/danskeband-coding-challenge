# Data Model: Layout Improvements, Status Colors, and Filter Bug Fixes

**Feature**: 008-layout-filters-fix
**Date**: 2026-01-15

## Overview

This feature does not introduce new data entities. It modifies how existing entities are filtered, displayed, and styled. The existing data model remains unchanged.

## Existing Entities (Reference)

### Incident

The core entity managed by the incident dashboard.

```typescript
interface Incident {
  id: string;                    // UUID, primary key
  title: string;                 // Required, searchable
  description: string;           // Optional, rich text
  status: IncidentStatus;        // 'Open' | 'In Progress' | 'Resolved'
  severity: IncidentSeverity;    // 'Low' | 'Medium' | 'High' | 'Critical'
  assigneeId: string | null;     // Foreign key to User.id, nullable for unassigned
  createdAt: string;             // ISO 8601 datetime string
  updatedAt: string;             // ISO 8601 datetime string
  statusHistory: StatusChange[]; // Audit trail of status changes
  isDummy?: boolean;             // Flag for seed/test data
}
```

**Affected Fields**:
- `assigneeId`: Filter must handle null values for "Unassigned" option
- `createdAt`: Filter must parse ISO string for date comparisons
- `status`: Display colors changing (no data impact)

### User

Referenced by incidents for assignee information.

```typescript
interface User {
  id: string;      // UUID, primary key
  name: string;    // Display name, used in filter dropdown
  email: string;   // User email
  role: string;    // User role
}
```

**Usage in Filters**:
- Assignee dropdown populated from `users.map(u => u.name)`
- Filter matches `incident.assigneeId` → `user.id` → `user.name`

### IncidentStatus (Enum)

Status values with updated visual styling.

```typescript
type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';
```

**Color Mapping** (updated):

| Status | Background | Text | Icon |
|--------|------------|------|------|
| Open | #4672c2 | #FFFFFF | RadioButtonUncheckedIcon |
| In Progress | #bad7e5 | #002346 | PlayArrowIcon |
| Resolved | #ebece7 | #002346 | CheckCircleIcon |

## Filter State Model

### URL Parameter Schema

Filter state is persisted in URL parameters for shareability.

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `assignee` | string | `Jane%20Smith` | User name (URL encoded) |
| `assigneeMode` | string | `eq` \| `neq` | Filter mode |
| `dateOp` | string | `between` \| `gt` \| `lt` | Date comparison operator |
| `dateStart` | string | `2024-01-15` | Start date (ISO date only) |
| `dateEnd` | string | `2024-01-31` | End date (ISO date only) |
| `status` | string | `Open` | Status filter value |
| `severity` | string | `High` | Severity filter value |
| `search` | string | `server` | Global search term |

### Filter Value Transformations

```typescript
// Assignee filter: name → ID lookup
const assigneeId = users.find(u => u.name === filterValue)?.id;

// Date filter: string → Date conversion
const rowDate = new Date(incident.createdAt);
const filterDate = new Date(dateStart);

// Unassigned filter: special case
const isUnassigned = filterValue === 'Unassigned' && !incident.assigneeId;
```

## Validation Rules

### Date Range Validation

```typescript
interface DateRangeValidation {
  // End date cannot be before start date
  startDate: Date | null;
  endDate: Date | null;

  isValid(): boolean {
    if (!this.startDate || !this.endDate) return true;
    return this.endDate >= this.startDate;
  }
}
```

### Assignee Filter Validation

```typescript
interface AssigneeFilterValidation {
  // Filter value must be either:
  // 1. 'Unassigned' (special case)
  // 2. A valid user name from the users list
  filterValue: string;
  validUsers: User[];

  isValid(): boolean {
    if (this.filterValue === 'Unassigned') return true;
    return this.validUsers.some(u => u.name === this.filterValue);
  }
}
```

## State Transitions

No state transitions are modified by this feature. The incident lifecycle remains:

```
Open → In Progress → Resolved
  ↑        ↓            ↓
  └────────┴────────────┘
       (can revert)
```

## Data Migration

**Not Required**: This feature only changes:
1. UI styling (colors)
2. Filter logic (bug fixes)
3. Component layout (button position)

No data schema changes. No migration scripts needed.
