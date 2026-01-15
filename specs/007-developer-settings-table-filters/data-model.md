# Data Model: Developer Settings & Table Enhancements

**Feature Branch**: `007-developer-settings-table-filters`
**Date**: 2026-01-14

## Entity Modifications

### Incident (Extended)

**File**: `src/api/types.ts`

The existing `Incident` interface is extended with a flag to distinguish developer-created test incidents.

```typescript
interface Incident {
  id: string;                        // Unique identifier (existing)
  title: string;                     // Incident title (existing)
  description: string;               // Detailed description (existing)
  status: IncidentStatus;            // "Open" | "In Progress" | "Resolved" (existing)
  severity: IncidentSeverity;        // "Low" | "Medium" | "High" | "Critical" (existing)
  assigneeId: string | null;         // User ID or null (existing)
  createdAt: string;                 // ISO date string (existing)
  updatedAt: string;                 // ISO date string (existing)
  statusHistory: StatusHistoryEntry[]; // Status change log (existing)
  isDummy: boolean;                  // NEW: True if created via Developer Settings
}
```

**Migration Note**: Existing incidents in localStorage will default `isDummy: false` when the field is missing.

---

## New Types

### DateFilterState

**File**: `src/types/filters.ts` (NEW)

Represents the state of a date range filter with comparison operators.

```typescript
type DateFilterOperator = 'gt' | 'lt' | 'between';

interface DateFilterState {
  operator: DateFilterOperator | null;  // Selected comparison operator
  startDate: string | null;             // ISO date string for primary date
  endDate: string | null;               // ISO date string for 'between' end date
}
```

**Validation Rules**:
- When `operator` is `'between'`, both `startDate` and `endDate` must be non-null
- When `operator` is `'between'`, `endDate` must be >= `startDate`
- When `operator` is `'gt'` or `'lt'`, only `startDate` is used

---

### PaginationState

**File**: `src/types/filters.ts` (NEW)

Represents pagination state synchronized with URL parameters.

```typescript
interface PaginationState {
  pageIndex: number;   // 0-based page index (URL shows 1-based)
  pageSize: number;    // Rows per page (10, 20, 50, or 100)
}
```

**URL Mapping**:
- `pageIndex: 0` → `?page=1`
- `pageSize: 20` → `?pageSize=20`

**Validation Rules**:
- `pageIndex` must be >= 0
- `pageSize` must be one of [10, 20, 50, 100]
- Invalid values fallback to defaults (pageIndex: 0, pageSize: 10)

---

### ColumnVisibilityState

**File**: `src/types/filters.ts` (NEW)

Represents which columns are visible in the table.

```typescript
type ColumnVisibilityState = Record<string, boolean>;

// Column IDs
type IncidentColumnId =
  | 'title'
  | 'status'
  | 'severity'
  | 'assigneeId'
  | 'createdAt';
```

**URL Mapping**:
- Hidden columns: `?hiddenColumns=severity,assigneeId`
- All visible: no `hiddenColumns` param or empty string

**Validation Rules**:
- At least one column must remain visible
- Unknown column IDs are ignored

---

### CreateDummyIncidentInput

**File**: `src/types/filters.ts` (NEW)

Input type for creating dummy incidents (extends existing CreateIncidentInput).

```typescript
interface CreateDummyIncidentInput {
  title: string;                    // Auto-generated random title
  description: string;              // Auto-generated random description
  severity: IncidentSeverity;       // Randomly selected
  assigneeId: string | null;        // Randomly selected or null
  isDummy: true;                    // Always true for dummy incidents
}
```

---

## State Relationships

### URL State Model

```
URL Parameters
├── Pagination
│   ├── page (1-based integer)
│   └── pageSize (10|20|50|100)
├── Filters
│   ├── status (IncidentStatus)
│   ├── severity (IncidentSeverity)
│   ├── assignee (string)
│   ├── search (string) [global filter]
│   └── createdAt (encoded DateFilterState)
├── Sorting
│   ├── sortBy (IncidentColumnId)
│   └── sortDesc (boolean)
└── Column Visibility
    └── hiddenColumns (comma-separated IncidentColumnId[])
```

### Date Filter URL Encoding

The `createdAt` filter state is encoded in the URL as:

```
?dateOp={operator}&dateStart={ISO}&dateEnd={ISO}
```

Examples:
- Greater than: `?dateOp=gt&dateStart=2026-01-01`
- Less than: `?dateOp=lt&dateStart=2026-01-14`
- Between: `?dateOp=between&dateStart=2026-01-01&dateEnd=2026-01-14`

---

## Entity Relationships

```
┌──────────────────┐     ┌──────────────────┐
│     Incident     │────→│       User       │
│                  │     │                  │
│ - id             │     │ - id             │
│ - title          │     │ - name           │
│ - status         │     │ - email          │
│ - severity       │     └──────────────────┘
│ - assigneeId ────┼──────────┘
│ - createdAt      │
│ - updatedAt      │
│ - statusHistory  │
│ - isDummy (NEW)  │
└──────────────────┘
         │
         │ filtered by
         ▼
┌──────────────────┐
│ Table View State │
│                  │
│ - pagination     │──→ PaginationState
│ - filters        │──→ MRT_ColumnFiltersState + DateFilterState
│ - sorting        │──→ MRT_SortingState
│ - visibility     │──→ ColumnVisibilityState
└──────────────────┘
```

---

## State Transitions

### Incident Lifecycle (with isDummy)

```
┌─────────────────────────────────────────────────────────┐
│                    CREATE                                │
│                                                          │
│  From Dashboard:          From Developer Settings:       │
│  createIncident()         createIncident()               │
│  isDummy: false          isDummy: true                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    ACTIVE                                │
│                                                          │
│  Incident exists in localStorage                         │
│  - Can be viewed in table                                │
│  - Can be updated (status, severity, etc.)               │
│  - isDummy determines delete eligibility                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    DELETE                                │
│                                                          │
│  isDummy: true  → DELETE allowed (from Dev Settings)     │
│  isDummy: false → DELETE blocked (403 Forbidden)         │
└─────────────────────────────────────────────────────────┘
```

### Date Filter State Transitions

```
┌──────────┐    select operator    ┌────────────────┐
│   IDLE   │ ──────────────────→  │ OPERATOR_SET   │
│ op: null │                      │ op: gt|lt|btw  │
└──────────┘                      └────────────────┘
                                          │
                                          │ select startDate
                                          ▼
                              ┌────────────────────┐
                              │   START_DATE_SET   │
                              │ startDate: "..."   │
                              └────────────────────┘
                                          │
                         ┌────────────────┼────────────────┐
                         │                │                │
                    op: gt|lt        op: between      op: between
                         │                │                │
                         ▼                ▼                ▼
                  ┌──────────┐    ┌────────────┐   ┌────────────┐
                  │  ACTIVE  │    │ INCOMPLETE │   │   ACTIVE   │
                  │ (filter  │    │ (needs     │   │ (filter    │
                  │ applied) │    │  endDate)  │   │  applied)  │
                  └──────────┘    └────────────┘   └────────────┘
```

---

## Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| `DateFilterState.endDate` | Must be >= `startDate` when `operator === 'between'` | "End date must be after or equal to start date" |
| `PaginationState.pageIndex` | Must be >= 0 | Falls back to 0 |
| `PaginationState.pageSize` | Must be in [10, 20, 50, 100] | Falls back to 10 |
| `ColumnVisibilityState` | At least one column visible | Title column always visible |
| `Incident.isDummy` | Only dummy incidents can be deleted | "Cannot delete non-dummy incidents" |

---

## Backward Compatibility

### localStorage Migration

Existing incidents without `isDummy` field:

```typescript
// In storage.ts or mockApi.ts
const migrateIncident = (incident: Partial<Incident>): Incident => ({
  ...incident,
  isDummy: incident.isDummy ?? false, // Default to non-dummy
} as Incident);
```

### URL Parameter Defaults

Missing URL parameters use sensible defaults:

| Parameter | Default | Notes |
|-----------|---------|-------|
| `page` | `1` | First page |
| `pageSize` | `10` | Standard default |
| `dateOp` | `null` | No date filter |
| `hiddenColumns` | `""` | All columns visible |
