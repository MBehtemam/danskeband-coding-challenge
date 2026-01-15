# Data Model: Saved Table Views

**Feature**: 011-saved-views | **Date**: 2026-01-15

## Overview

This document defines all data entities, types, and validation rules for the Saved Table Views feature. The data model is designed to integrate seamlessly with Material React Table's type system while maintaining type safety through TypeScript strict mode.

---

## Core Entities

### 1. SavedView

Represents a user-created table configuration that can be saved, named, and reapplied.

```typescript
interface SavedView {
  /**
   * Unique identifier for the view (UUID v4)
   * Used for stable references when renaming views
   */
  id: string;

  /**
   * User-provided name for the view
   * Constraints: 1-100 characters, unique per user, non-empty after trim
   */
  name: string;

  /**
   * Table configuration captured when view was saved
   */
  config: ViewConfig;

  /**
   * ISO 8601 timestamp when view was created
   * Example: "2026-01-15T10:30:00.000Z"
   */
  createdAt: string;

  /**
   * ISO 8601 timestamp when view was last updated
   * Updated when view is renamed or configuration is updated
   */
  updatedAt: string;
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format (`[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`)
- `name`:
  - Min length: 1 character after trim
  - Max length: 100 characters
  - Must be unique (case-sensitive) across all user's saved views
  - Can contain any Unicode characters (including emoji)
- `config`: Must conform to ViewConfig structure (see below)
- `createdAt`: Must be valid ISO 8601 timestamp string
- `updatedAt`: Must be valid ISO 8601 timestamp string, >= createdAt

**Lifecycle**:
1. **Created**: When user clicks "Save" in SaveViewPanel with valid name
2. **Updated**: When user clicks "Update [View Name]" while view is active
3. **Renamed**: When user clicks "Rename" and provides new unique name
4. **Deleted**: When user confirms deletion in DeleteViewDialog
5. **Applied**: When user selects view from SavedViewsDropdown

**Storage Location**: localStorage key `"saved-views"` as JSON array

---

### 2. ViewConfig

Represents the table state configuration captured in a saved view.

```typescript
interface ViewConfig {
  /**
   * Column visibility state
   * Key: column ID, Value: whether column is visible
   * Empty object means all columns visible (default)
   */
  columnVisibility: MRT_VisibilityState;  // Record<string, boolean>

  /**
   * Active column filters
   * Array of filter definitions: column ID and filter value
   */
  columnFilters: MRT_ColumnFiltersState;  // Array<{ id: string, value: unknown }>

  /**
   * Filter function modes for each filtered column
   * Key: column ID, Value: filter function name
   * Example: { status: 'equals', severity: 'notEquals', createdAt: 'betweenInclusive' }
   */
  columnFilterFns: MRT_ColumnFilterFnsState;  // Record<string, MRT_FilterFn>

  /**
   * Sorting state
   * Array of sort definitions: column ID and direction
   * Empty array means no sorting (will use default: createdAt desc)
   */
  sorting: MRT_SortingState;  // Array<{ id: string, desc: boolean }>

  /**
   * Global filter value (searches across title column)
   */
  globalFilter: string;
}
```

**Valid Column IDs** (from IncidentTable):
- `title` - Incident title (cannot be hidden)
- `status` - Incident status (Open, In Progress, Resolved, Closed)
- `severity` - Incident severity (Low, Medium, High, Critical)
- `assigneeId` - Assigned user ID
- `createdAt` - Creation timestamp

**Valid Filter Functions** (per column):
- `title`: `contains` (default), `startsWith`, `endsWith`, `equals`, `notEquals`
- `status`: `equals` (default), `notEquals`
- `severity`: `equals` (default), `notEquals`
- `assigneeId`: `equals` (default), `notEquals`
- `createdAt`: `betweenInclusive` (default), `greaterThan`, `lessThan`

**Validation Rules**:
- `columnVisibility`: Keys must be valid column IDs, values must be boolean
- `columnFilters`: Each filter `id` must be valid column ID, `value` type depends on column
- `columnFilterFns`: Keys must be valid column IDs, values must be valid filter function names for that column
- `sorting`: Each sort `id` must be valid column ID, max 1 sort (multi-sort not enabled)
- `globalFilter`: String, can be empty

**Default ViewConfig** (code constant, not stored):
```typescript
const DEFAULT_VIEW_CONFIG: ViewConfig = {
  columnVisibility: {},
  columnFilters: [],
  columnFilterFns: {},
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: '',
};
```

---

### 3. SavedViewsState

Context state structure for managing saved views in the application.

```typescript
interface SavedViewsState {
  /**
   * Array of all user's saved views
   * Max length: 50 views
   */
  savedViews: SavedView[];

  /**
   * ID of currently active view, or null for default view
   */
  activeViewId: string | null;

  /**
   * Storage availability status
   * - 'full': localStorage read/write works
   * - 'session': localStorage read failed, using memory only
   * - 'none': localStorage write failed, feature disabled
   */
  storageAvailable: 'full' | 'session' | 'none';

  /**
   * Whether the current table state differs from active view config
   * True if user modified table while a view is active
   */
  isDirty: boolean;
}
```

**Validation Rules**:
- `savedViews`: Max length 50, all elements must be valid SavedView objects
- `activeViewId`: Must be null or valid UUID matching one of savedViews[].id
- `storageAvailable`: Must be one of three enum values
- `isDirty`: Boolean, only relevant when activeViewId is not null

---

## Type Definitions (New Files)

### src/types/savedViews.ts

```typescript
import type {
  MRT_ColumnFiltersState,
  MRT_ColumnFilterFnsState,
  MRT_SortingState,
  MRT_VisibilityState
} from 'material-react-table';

/**
 * Table configuration that can be saved as a view
 */
export interface ViewConfig {
  columnVisibility: MRT_VisibilityState;
  columnFilters: MRT_ColumnFiltersState;
  columnFilterFns: MRT_ColumnFilterFnsState;
  sorting: MRT_SortingState;
  globalFilter: string;
}

/**
 * A user-created saved view with metadata
 */
export interface SavedView {
  id: string;
  name: string;
  config: ViewConfig;
  createdAt: string;
  updatedAt: string;
}

/**
 * Storage availability status
 */
export type StorageStatus = 'full' | 'session' | 'none';

/**
 * Context state for saved views management
 */
export interface SavedViewsState {
  savedViews: SavedView[];
  activeViewId: string | null;
  storageAvailable: StorageStatus;
  isDirty: boolean;
}

/**
 * Context value provided to consumers
 */
export interface SavedViewsContextValue extends SavedViewsState {
  createView: (name: string, config: ViewConfig) => SavedView | null;
  updateView: (viewId: string, config: ViewConfig) => boolean;
  renameView: (viewId: string, newName: string) => boolean;
  deleteView: (viewId: string) => boolean;
  applyView: (viewId: string | null) => ViewConfig | null;
  validateViewName: (name: string, excludeViewId?: string) => ValidationResult;
}

/**
 * Validation result for view name
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Constants
 */
export const STORAGE_KEY_SAVED_VIEWS = 'saved-views';
export const STORAGE_KEY_ACTIVE_VIEW_ID = 'active-view-id';
export const MAX_SAVED_VIEWS = 50;
export const MIN_VIEW_NAME_LENGTH = 1;
export const MAX_VIEW_NAME_LENGTH = 100;

/**
 * Default view configuration (system-provided)
 */
export const DEFAULT_VIEW_CONFIG: ViewConfig = {
  columnVisibility: {},
  columnFilters: [],
  columnFilterFns: {},
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: '',
};
```

---

### src/api/types.ts (additions)

```typescript
// Add to existing types.ts file

/**
 * Re-export saved views types for convenience
 */
export type {
  SavedView,
  ViewConfig,
  StorageStatus,
  SavedViewsState,
  SavedViewsContextValue,
  ValidationResult
} from '../types/savedViews';
```

---

## Storage Schema

### localStorage Structure

```typescript
// Key: "saved-views"
// Value: JSON string of SavedView[]
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Incidents",
    "config": {
      "columnVisibility": { "severity": false, "createdAt": false },
      "columnFilters": [{ "id": "assigneeId", "value": "current-user-id" }],
      "columnFilterFns": { "assigneeId": "equals" },
      "sorting": [{ "id": "status", "desc": false }],
      "globalFilter": ""
    },
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "Critical Issues",
    "config": {
      "columnVisibility": {},
      "columnFilters": [{ "id": "severity", "value": "Critical" }],
      "columnFilterFns": { "severity": "equals" },
      "sorting": [{ "id": "createdAt", "desc": true }],
      "globalFilter": ""
    },
    "createdAt": "2026-01-15T11:00:00.000Z",
    "updatedAt": "2026-01-15T11:00:00.000Z"
  }
]

// Key: "active-view-id"
// Value: JSON string of string | null
"550e8400-e29b-41d4-a716-446655440000"
```

**Storage Size Estimate**:
- Average SavedView: ~500 bytes (with typical config)
- 50 views: ~25KB
- Well within localStorage limits (5-10MB typical)

---

## State Transitions

### SavedView Lifecycle State Machine

```
[Not Exist]
    ↓ createView(name, config)
[Saved, Inactive]
    ↓ applyView(id)
[Saved, Active]
    ↓ user modifies table
[Saved, Active, Dirty]
    ↓ updateView(id, newConfig)
[Saved, Active, Clean]
    ↓ applyView(null) or applyView(otherId)
[Saved, Inactive]
    ↓ renameView(id, newName)
[Saved, Inactive, Renamed]
    ↓ deleteView(id)
[Not Exist]
```

**State Properties**:
- **Saved**: View exists in savedViews array and localStorage
- **Active**: View's ID matches activeViewId
- **Dirty**: Table state differs from active view's config
- **Inactive**: View exists but is not currently applied

---

## Validation Functions

### View Name Validation

```typescript
function validateViewName(
  name: string,
  existingViews: SavedView[],
  excludeViewId?: string
): ValidationResult {
  const trimmed = name.trim();

  // Check empty
  if (trimmed.length === 0) {
    return { valid: false, error: 'View name is required' };
  }

  // Check length
  if (trimmed.length > 100) {
    return { valid: false, error: 'View name must be 100 characters or less' };
  }

  // Check uniqueness (case-sensitive)
  const duplicate = existingViews.find(
    v => v.name === trimmed && v.id !== excludeViewId
  );
  if (duplicate) {
    return { valid: false, error: 'A view with this name already exists' };
  }

  return { valid: true };
}
```

### ViewConfig Validation

```typescript
const VALID_COLUMN_IDS = ['title', 'status', 'severity', 'assigneeId', 'createdAt'];

const VALID_FILTER_FNS: Record<string, string[]> = {
  title: ['contains', 'startsWith', 'endsWith', 'equals', 'notEquals'],
  status: ['equals', 'notEquals'],
  severity: ['equals', 'notEquals'],
  assigneeId: ['equals', 'notEquals'],
  createdAt: ['betweenInclusive', 'greaterThan', 'lessThan'],
};

function isValidViewConfig(config: unknown): config is ViewConfig {
  if (typeof config !== 'object' || config === null) return false;

  const c = config as Partial<ViewConfig>;

  // Check required properties
  if (!c.columnVisibility || !c.columnFilters || !c.columnFilterFns ||
      !c.sorting || typeof c.globalFilter !== 'string') {
    return false;
  }

  // Validate columnVisibility
  for (const [key, value] of Object.entries(c.columnVisibility)) {
    if (!VALID_COLUMN_IDS.includes(key) || typeof value !== 'boolean') {
      return false;
    }
  }

  // Validate columnFilters
  if (!Array.isArray(c.columnFilters)) return false;
  for (const filter of c.columnFilters) {
    if (!VALID_COLUMN_IDS.includes(filter.id)) return false;
  }

  // Validate columnFilterFns
  for (const [columnId, fn] of Object.entries(c.columnFilterFns)) {
    if (!VALID_COLUMN_IDS.includes(columnId)) return false;
    if (!VALID_FILTER_FNS[columnId]?.includes(fn as string)) return false;
  }

  // Validate sorting
  if (!Array.isArray(c.sorting)) return false;
  for (const sort of c.sorting) {
    if (!VALID_COLUMN_IDS.includes(sort.id) || typeof sort.desc !== 'boolean') {
      return false;
    }
  }

  return true;
}
```

---

## Data Integrity Constraints

### Referential Integrity
- `activeViewId` must be null or reference an existing view ID in `savedViews`
- If active view is deleted, `activeViewId` must be set to null

### Invariants
- View names must be unique within `savedViews` array (case-sensitive)
- `savedViews.length <= MAX_SAVED_VIEWS` (50)
- `updatedAt >= createdAt` for all views
- All view IDs must be unique within `savedViews` array

### Corruption Handling
If localStorage data is corrupted (invalid JSON, wrong structure):
1. Log error to console
2. Clear corrupted data from localStorage
3. Initialize with empty state (no saved views)
4. Show user notification: "Saved views were reset due to data corruption"

---

## Migration & Versioning

### Initial Version (1.0)
- No migration needed (new feature)
- Schema version not stored (can be added later if needed)

### Future Considerations
If schema changes in future versions:
- Add `schemaVersion` field to localStorage
- Implement migration functions to transform old data to new schema
- Graceful fallback if migration fails (clear data, notify user)

---

## Examples

### Example 1: Minimal View
```json
{
  "id": "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789",
  "name": "Simple View",
  "config": {
    "columnVisibility": {},
    "columnFilters": [],
    "columnFilterFns": {},
    "sorting": [{ "id": "createdAt", "desc": true }],
    "globalFilter": ""
  },
  "createdAt": "2026-01-15T12:00:00.000Z",
  "updatedAt": "2026-01-15T12:00:00.000Z"
}
```

### Example 2: Complex View
```json
{
  "id": "f1e2d3c4-b5a6-4789-9012-a1b2c3d4e5f6",
  "name": "🔥 Critical + Assigned to Me",
  "config": {
    "columnVisibility": {
      "createdAt": false
    },
    "columnFilters": [
      { "id": "severity", "value": "Critical" },
      { "id": "assigneeId", "value": "user-123" },
      { "id": "status", "value": "Open" }
    ],
    "columnFilterFns": {
      "severity": "equals",
      "assigneeId": "equals",
      "status": "equals"
    },
    "sorting": [{ "id": "title", "desc": false }],
    "globalFilter": "authentication"
  },
  "createdAt": "2026-01-15T14:30:00.000Z",
  "updatedAt": "2026-01-15T16:45:00.000Z"
}
```

---

## References

- Feature Spec: [spec.md](./spec.md)
- Research Decisions: [research.md](./research.md)
- Material React Table Types: https://www.material-react-table.com/docs/api/table-options
- TypeScript Strict Mode: https://www.typescriptlang.org/tsconfig#strict
