# Contract: SavedViewsContext API

**Feature**: 011-saved-views | **Date**: 2026-01-15
**Type**: React Context Provider API Contract

## Overview

This document defines the public API contract for the SavedViewsContext, which provides state management and operations for saved table views throughout the application. Consumers use the `useSavedViews()` hook to access this API.

---

## Context Provider

### `SavedViewsProvider`

```typescript
interface SavedViewsProviderProps {
  children: React.ReactNode;
}

function SavedViewsProvider({ children }: SavedViewsProviderProps): JSX.Element
```

**Description**: React context provider that wraps the component tree requiring access to saved views functionality. Must wrap components that use `useSavedViews()` hook.

**Initialization Behavior**:
1. Load saved views from localStorage on mount
2. Load active view ID from localStorage
3. Detect localStorage availability (full/session/none)
4. Handle corrupted data gracefully (clear and reset)
5. Initialize with empty state if no saved views exist

**Location**: `src/contexts/SavedViewsContext.tsx`

**Usage**:
```typescript
// In DashboardPage.tsx
<SavedViewsProvider>
  <IncidentTable />
</SavedViewsProvider>
```

---

## Hook API

### `useSavedViews()`

```typescript
function useSavedViews(): SavedViewsContextValue
```

**Description**: Custom hook providing access to saved views state and operations. Must be used within `SavedViewsProvider` tree.

**Returns**: `SavedViewsContextValue` object with state and methods (see below)

**Throws**: Error if used outside `SavedViewsProvider`

**Usage**:
```typescript
const {
  savedViews,
  activeViewId,
  createView,
  applyView,
  deleteView
} = useSavedViews();
```

---

## State Properties

### `savedViews`

```typescript
savedViews: SavedView[]
```

**Description**: Array of all user's saved views, ordered by creation date (newest first)

**Read-only**: Yes (mutate via provided methods, not directly)

**Max Length**: 50 views

**Example**:
```typescript
[
  {
    id: "a1b2c3d4-...",
    name: "My View",
    config: { /* ViewConfig */ },
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z"
  },
  // ... more views
]
```

---

### `activeViewId`

```typescript
activeViewId: string | null
```

**Description**: ID of currently active view, or `null` if default view is active

**Read-only**: Yes (change via `applyView()`)

**Guarantees**:
- If not null, ID will match one of `savedViews[].id`
- If active view is deleted, automatically resets to null
- Persists across page refreshes (stored in localStorage)

---

### `storageAvailable`

```typescript
storageAvailable: 'full' | 'session' | 'none'
```

**Description**: Indicates localStorage availability status

**Values**:
- `'full'`: localStorage read/write works, views persist across sessions
- `'session'`: localStorage read failed, views stored in memory only (lost on refresh)
- `'none'`: localStorage write failed, view creation/update disabled

**Read-only**: Yes (automatically detected)

---

### `isDirty`

```typescript
isDirty: boolean
```

**Description**: True if current table state differs from active view's saved config

**Behavior**:
- Only relevant when `activeViewId` is not null
- True = user modified table while view is active
- False = table matches saved view exactly
- Null active view (default view) = always false

**Usage**: Show "unsaved changes" indicator in UI

---

## Methods

### `createView()`

```typescript
createView(name: string, config: ViewConfig): SavedView | null
```

**Description**: Creates a new saved view with the provided name and configuration

**Parameters**:
- `name`: View name (1-100 chars, unique, trimmed)
- `config`: Table configuration to save (columns, filters, sorting)

**Returns**:
- `SavedView` object if successful
- `null` if creation failed

**Failure Conditions**:
- View name is invalid (empty, too long, duplicate)
- Maximum views limit reached (50 views)
- localStorage write fails and storageAvailable is 'none'

**Side Effects**:
- Adds view to `savedViews` array
- Persists to localStorage (if available)
- Does NOT automatically apply the view (activeViewId unchanged)
- Triggers re-render with updated state

**Example**:
```typescript
const newView = createView('Critical Issues', {
  columnVisibility: {},
  columnFilters: [{ id: 'severity', value: 'Critical' }],
  columnFilterFns: { severity: 'equals' },
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: ''
});

if (newView) {
  console.log('Created view:', newView.id);
} else {
  // Handle error (show error dialog)
}
```

---

### `applyView()`

```typescript
applyView(viewId: string | null): ViewConfig | null
```

**Description**: Applies a saved view (or default view if null) and returns its configuration

**Parameters**:
- `viewId`: ID of view to apply, or `null` for default view

**Returns**:
- `ViewConfig` object if successful
- `null` if view ID not found

**Side Effects**:
- Sets `activeViewId` to provided ID (or null)
- Persists active view ID to localStorage
- Resets `isDirty` to false
- Triggers re-render with updated state
- Consumer responsible for applying returned config to table

**Usage Pattern**:
```typescript
const config = applyView('a1b2c3d4-...');
if (config) {
  // Apply config to table
  setColumnVisibility(config.columnVisibility);
  setColumnFilters(config.columnFilters);
  setColumnFilterFns(config.columnFilterFns);
  setSorting(config.sorting);
  setGlobalFilter(config.globalFilter);
}
```

**Default View**:
```typescript
const defaultConfig = applyView(null); // Returns DEFAULT_VIEW_CONFIG
```

---

### `updateView()`

```typescript
updateView(viewId: string, config: ViewConfig): boolean
```

**Description**: Updates an existing view's configuration to match provided config

**Parameters**:
- `viewId`: ID of view to update
- `config`: New configuration to save

**Returns**:
- `true` if update successful
- `false` if view not found or update failed

**Side Effects**:
- Updates view's `config` property
- Updates view's `updatedAt` timestamp
- Persists to localStorage
- Resets `isDirty` to false if updating active view
- Triggers re-render with updated state

**Constraints**:
- Does NOT change view name (use `renameView()` for that)
- Does NOT change view ID, createdAt, or other metadata

**Example**:
```typescript
const success = updateView(activeViewId!, currentTableConfig);
if (success) {
  // Show success message
} else {
  // Show error message
}
```

---

### `renameView()`

```typescript
renameView(viewId: string, newName: string): boolean
```

**Description**: Renames an existing view (does not change configuration)

**Parameters**:
- `viewId`: ID of view to rename
- `newName`: New name (1-100 chars, unique, trimmed)

**Returns**:
- `true` if rename successful
- `false` if view not found, name invalid, or rename failed

**Side Effects**:
- Updates view's `name` property
- Updates view's `updatedAt` timestamp
- Persists to localStorage
- Triggers re-render with updated state

**Validation**:
- New name must pass same validation as `createView()` name
- Uniqueness check excludes current view (can "rename" to same name, no-op)

**Example**:
```typescript
const success = renameView('a1b2c3d4-...', 'Updated View Name');
if (!success) {
  // Show validation error
}
```

---

### `deleteView()`

```typescript
deleteView(viewId: string): boolean
```

**Description**: Permanently deletes a saved view

**Parameters**:
- `viewId`: ID of view to delete

**Returns**:
- `true` if deletion successful
- `false` if view not found or deletion failed

**Side Effects**:
- Removes view from `savedViews` array
- If deleting active view, sets `activeViewId` to null (default view)
- Persists to localStorage
- Triggers re-render with updated state
- Consumer should show confirmation dialog before calling

**Irreversible**: True (no undo functionality)

**Example**:
```typescript
// After user confirms in DeleteViewDialog
const success = deleteView(viewToDelete.id);
if (success && viewToDelete.id === activeViewId) {
  // Apply default view since active view was deleted
  const defaultConfig = applyView(null);
  // Apply defaultConfig to table...
}
```

---

### `validateViewName()`

```typescript
validateViewName(name: string, excludeViewId?: string): ValidationResult
```

**Description**: Validates a view name without creating/updating a view (for inline validation)

**Parameters**:
- `name`: View name to validate
- `excludeViewId`: (Optional) View ID to exclude from uniqueness check (for rename validation)

**Returns**: `ValidationResult` object
```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;  // Present when valid is false
}
```

**Validation Rules**:
- Length: 1-100 characters after trim
- Non-empty: Must have at least one non-whitespace character
- Uniqueness: No other view (except excludeViewId) has same name (case-sensitive)

**Example Error Messages**:
- `"View name is required"` - Empty or whitespace-only
- `"View name must be 100 characters or less"` - Too long
- `"A view with this name already exists"` - Duplicate name

**Usage** (in SaveViewPanel):
```typescript
const handleNameChange = (name: string) => {
  setViewName(name);
  const result = validateViewName(name);
  setNameError(result.valid ? '' : result.error);
};
```

---

## Error Handling

### localStorage Failures

**Detection**: Context automatically detects storage failures on init and during operations

**User Communication**:
- `storageAvailable === 'session'`: Show persistent warning banner
- `storageAvailable === 'none'`: Show error dialog, disable create/update operations

**Graceful Degradation**:
- Session mode: Views work during current session, lost on refresh
- None mode: Can still apply existing views, cannot create/update

### Corrupted Data

**Detection**: On init, validate localStorage data structure

**Recovery**:
1. Log error to console
2. Clear corrupted data
3. Initialize with empty state
4. Show user notification (optional)

### Invalid Operations

**Method Failures**: Return `null` or `false` to indicate failure
**Consumer Responsibility**: Check return values and show appropriate error UI

---

## Performance Considerations

### Debouncing

**isDirty Calculation**: Debounced to avoid excessive comparisons on every table state change

**localStorage Writes**: Writes happen immediately (no debouncing) to ensure data persistence

### Memoization

**Context Value**: Memoized to prevent unnecessary re-renders of consumers

**View Lookups**: Use Map or Set internally for O(1) lookups by ID

---

## Testing Considerations

### Mocking the Context

```typescript
// In tests, provide mock context value
const mockSavedViewsValue: SavedViewsContextValue = {
  savedViews: [/* test data */],
  activeViewId: 'test-id',
  storageAvailable: 'full',
  isDirty: false,
  createView: vi.fn(),
  applyView: vi.fn(),
  updateView: vi.fn(),
  renameView: vi.fn(),
  deleteView: vi.fn(),
  validateViewName: vi.fn()
};

<SavedViewsContext.Provider value={mockSavedViewsValue}>
  <ComponentUnderTest />
</SavedViewsContext.Provider>
```

### Hook Testing

```typescript
// Use renderHook from @testing-library/react
const { result } = renderHook(() => useSavedViews(), {
  wrapper: SavedViewsProvider
});

// Test hook methods
act(() => {
  result.current.createView('Test View', mockConfig);
});
```

---

## Type Exports

All types used in this contract are exported from:
- `src/types/savedViews.ts`
- `src/api/types.ts` (re-exports)

**Public Types**:
- `SavedView`
- `ViewConfig`
- `StorageStatus`
- `SavedViewsState`
- `SavedViewsContextValue`
- `ValidationResult`

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-15

This contract is stable and ready for implementation.
