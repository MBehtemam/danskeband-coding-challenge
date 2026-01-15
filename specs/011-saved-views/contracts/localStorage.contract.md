# Contract: localStorage API for Saved Views

**Feature**: 011-saved-views | **Date**: 2026-01-15
**Type**: Storage Layer API Contract

## Overview

This document defines the contract for localStorage operations used by the Saved Views feature. These functions provide low-level storage access with error handling and validation. They are used internally by SavedViewsContext and not exposed to UI components.

---

## Storage Functions

All functions defined in: `src/api/storage.ts` (additions to existing file)

### `getSavedViews()`

```typescript
function getSavedViews(): SavedView[]
```

**Description**: Retrieves all saved views from localStorage

**Returns**: Array of SavedView objects, or empty array if:
- localStorage is unavailable
- Key doesn't exist (first-time user)
- Data is corrupted (invalid JSON or structure)

**Error Handling**:
- Catches SecurityError, DOMException
- Logs warnings to console
- Returns empty array on any error
- Clears corrupted data if detected

**Side Effects**: May clear corrupted data from localStorage

**Example**:
```typescript
const views = getSavedViews();
// Always returns array, safe to iterate
views.forEach(view => console.log(view.name));
```

---

### `setSavedViews()`

```typescript
function setSavedViews(views: SavedView[]): boolean
```

**Description**: Persists saved views array to localStorage

**Parameters**:
- `views`: Array of SavedView objects to save (max 50)

**Returns**:
- `true` if write successful
- `false` if write failed

**Error Handling**:
- Catches QuotaExceededError, SecurityError, DOMException
- Logs warnings to console
- Returns false on any error (consumer should handle)

**Validation**: None (assumes views array is already validated)

**Example**:
```typescript
const updatedViews = [...views, newView];
if (!setSavedViews(updatedViews)) {
  // Show error to user: "Unable to save view"
}
```

---

### `getActiveViewId()`

```typescript
function getActiveViewId(): string | null
```

**Description**: Retrieves the currently active view ID from localStorage

**Returns**:
- View ID string if active view exists
- `null` if no active view (default view) or localStorage unavailable

**Error Handling**:
- Catches SecurityError, DOMException
- Logs warnings to console
- Returns null on any error

**Validation**: Does NOT validate that ID exists in saved views (consumer's responsibility)

**Example**:
```typescript
const activeId = getActiveViewId();
if (activeId) {
  const activeView = views.find(v => v.id === activeId);
  // Check activeView exists before using
}
```

---

### `setActiveViewId()`

```typescript
function setActiveViewId(viewId: string | null): boolean
```

**Description**: Persists active view ID to localStorage

**Parameters**:
- `viewId`: View ID to set as active, or `null` for default view

**Returns**:
- `true` if write successful
- `false` if write failed

**Error Handling**:
- Catches QuotaExceededError, SecurityError, DOMException
- Logs warnings to console
- Returns false on any error

**Validation**: Does NOT validate that viewId exists in saved views

**Example**:
```typescript
if (!setActiveViewId(selectedViewId)) {
  console.warn('Failed to persist active view');
  // Continue anyway - active view is in memory
}
```

---

### `validateSavedViewsData()`

```typescript
function validateSavedViewsData(data: unknown): data is SavedView[]
```

**Description**: Type guard to validate saved views data structure from localStorage

**Parameters**:
- `data`: Parsed JSON data from localStorage

**Returns**:
- `true` if data is valid SavedView[] structure
- `false` if data is corrupted, wrong type, or invalid

**Validation Checks**:
1. Is array
2. All elements have required fields (id, name, config, createdAt, updatedAt)
3. All IDs are valid UUID format
4. All names are 1-100 chars
5. All configs are valid ViewConfig structure
6. All timestamps are valid ISO 8601 format

**Usage** (internal to getSavedViews()):
```typescript
const raw = localStorage.getItem(STORAGE_KEY_SAVED_VIEWS);
const parsed = JSON.parse(raw);
if (!validateSavedViewsData(parsed)) {
  console.warn('Corrupted saved views data, resetting');
  localStorage.removeItem(STORAGE_KEY_SAVED_VIEWS);
  return [];
}
return parsed;
```

---

### `isStorageAvailable()`

```typescript
function isStorageAvailable(): boolean
```

**Description**: Tests whether localStorage is available and writable

**Returns**:
- `true` if localStorage read/write works
- `false` if localStorage is unavailable (private mode, blocked, etc.)

**Test Method**:
1. Attempt to write test key
2. Attempt to read test key back
3. Remove test key
4. Return success/failure

**Caching**: Result should be cached (storage availability doesn't change during session)

**Example**:
```typescript
const [storageStatus, setStorageStatus] = useState<StorageStatus>(
  isStorageAvailable() ? 'full' : 'session'
);
```

---

## Storage Keys

### Constants

```typescript
export const STORAGE_KEY_SAVED_VIEWS = 'saved-views';
export const STORAGE_KEY_ACTIVE_VIEW_ID = 'active-view-id';
```

**Naming Convention**: kebab-case, descriptive, namespaced to feature

**Uniqueness**: Guaranteed not to conflict with existing keys:
- `incidents` (existing)
- `users` (existing)
- `theme-mode` (existing)

---

## Data Format

### saved-views Key

```typescript
// localStorage["saved-views"]
'[{"id":"...","name":"...","config":{...},"createdAt":"...","updatedAt":"..."},...]'
```

**Format**: JSON string of SavedView array
**Max Size**: ~25KB (50 views × ~500 bytes)
**Encoding**: UTF-8 (default for localStorage)

### active-view-id Key

```typescript
// localStorage["active-view-id"]
'"a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789"'  // With JSON quotes
// OR
'null'  // JSON null for default view
```

**Format**: JSON string of string or null
**Max Size**: ~50 bytes

---

## Error Codes

### DOMException Codes

| Code | Name | Meaning | Handling |
|------|------|---------|----------|
| 18 | SecurityError | Access denied (private mode, cross-origin) | Return default, show warning |
| 22 | QuotaExceededError | Storage quota full | Return false, disable writes |
| - | Other | Unknown storage error | Return default, log error |

### Error Logging

```typescript
// Example error log format
console.warn('[SavedViews] localStorage unavailable:', error.message);
console.warn('[SavedViews] Corrupted data, resetting saved views');
console.warn('[SavedViews] Quota exceeded, cannot save view');
```

---

## Concurrency Considerations

### Multi-Tab Behavior

**Current Scope**: Out of scope - each tab operates independently

**Future Enhancement**: Could listen to `storage` event to sync across tabs
```typescript
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY_SAVED_VIEWS) {
    // Reload views from storage
  }
});
```

### Race Conditions

**Write-after-read**: Not a concern (single-threaded JS)
**Read-modify-write**: Safe (operations are synchronous)

---

## Migration Strategy

### Initial Version (1.0)

No migration needed (new feature, no existing data)

### Future Versions

If schema changes are needed:

```typescript
function migrateSavedViews(data: unknown): SavedView[] {
  // Check schema version (could add version field)
  // Transform old data to new schema
  // Return migrated data or empty array if migration fails
}
```

**Principles**:
- Always backward compatible (old data readable)
- Graceful failure (clear data if migration impossible)
- Log migration events

---

## Testing Considerations

### Mocking localStorage

```typescript
// In tests, mock localStorage
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }),
  length: 0,
  key: vi.fn()
};
```

### Test Scenarios

1. **Normal operation**: Read/write succeeds
2. **First-time user**: getItem returns null, returns empty array
3. **Corrupted data**: Invalid JSON, returns empty array, clears storage
4. **Invalid structure**: Valid JSON but wrong shape, returns empty array
5. **Quota exceeded**: setItem throws QuotaExceededError, returns false
6. **Private mode**: getItem throws SecurityError, returns empty array

### Example Test

```typescript
describe('getSavedViews', () => {
  it('returns empty array when localStorage is empty', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
    expect(getSavedViews()).toEqual([]);
  });

  it('returns parsed views when valid data exists', () => {
    const mockViews: SavedView[] = [/* valid data */];
    vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockViews));
    expect(getSavedViews()).toEqual(mockViews);
  });

  it('returns empty array and clears storage when data is corrupted', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('invalid json');
    vi.spyOn(localStorage, 'removeItem');
    expect(getSavedViews()).toEqual([]);
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY_SAVED_VIEWS);
  });
});
```

---

## Performance

### Read Performance

- **getSavedViews()**: O(n) for parsing + validation (n = number of views, max 50)
- **getActiveViewId()**: O(1) - single JSON parse

**Optimization**: Results should be cached in Context, not re-read on every access

### Write Performance

- **setSavedViews()**: O(n) for JSON.stringify (n = number of views, max 50)
- **setActiveViewId()**: O(1) - single JSON.stringify

**Typical Latency**: < 10ms for 50 views (~25KB JSON)

---

## Security Considerations

### XSS Prevention

**Data Sanitization**: NOT needed - data stored in localStorage never rendered as HTML
**UUID Generation**: Use crypto.randomUUID() (browser API, cryptographically secure)

### Data Privacy

**Personal Data**: View names and configs may contain sensitive info (user IDs, search terms)
**Storage Scope**: Per-origin (isolated from other websites)
**Persistence**: Survives browser close (not session-only)

### Recommendations for Future

- Consider encryption for sensitive view data
- Consider allowing users to export/import views (backup/restore)
- Consider server-side sync for cross-device access (requires backend)

---

## Dependencies

### Browser APIs

- `window.localStorage` (Storage API)
- `JSON.parse()` / `JSON.stringify()`
- `crypto.randomUUID()` (for generating view IDs)

### TypeScript Types

- `SavedView` from `src/types/savedViews.ts`
- `ViewConfig` from `src/types/savedViews.ts`

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-15

This contract is stable and ready for implementation.
