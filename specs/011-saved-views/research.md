# Research: Saved Table Views

**Feature**: 011-saved-views | **Date**: 2026-01-15
**Status**: Complete

## Overview

This document captures research and design decisions for the Saved Table Views feature. The goal is to allow users to save, manage, and quickly switch between different incident table configurations (columns, filters, sorting).

## Research Areas

### 1. State Management Pattern

**Question**: How should we manage saved views state across the application?

**Research Findings**:
- Examined existing `ThemeContext` pattern in [src/contexts/ThemeContext.tsx](../../src/contexts/ThemeContext.tsx)
- Context pattern provides clean API for state sharing without prop drilling
- Custom hook pattern (`useThemeMode()`) enforces provider requirement and provides better error messages
- Debounced updates (100ms) prevent excessive localStorage writes during rapid state changes

**Decision**: Create `SavedViewsContext` following the ThemeContext pattern

**Rationale**:
- Consistency with existing codebase patterns
- Context provides access to views from any component (dropdown, table, panels)
- Custom hook (`useSavedViews()`) provides clean API: `createView()`, `updateView()`, `deleteView()`, `applyView()`, `activeViewId`
- Encapsulates localStorage interaction complexity away from UI components
- Easy to test in isolation

**Alternatives Considered**:
- **Local component state**: Rejected because multiple components need access (dropdown, table, dialogs)
- **Redux/Zustand**: Rejected as overkill for this feature, adds dependency, breaks from existing patterns
- **Props drilling**: Rejected due to depth (DashboardPage → IncidentTable → SavedViewsDropdown) and poor maintainability

---

### 2. localStorage Data Structure

**Question**: How should we structure saved views data in localStorage?

**Research Findings**:
- Current localStorage usage in [src/api/storage.ts](../../src/api/storage.ts):
  - Simple key-value structure: `"incidents"`, `"users"`, `"theme-mode"`
  - JSON serialization for complex objects
  - Try-catch error handling with console warnings
  - Graceful fallback to defaults on failures
- Material React Table state types available:
  - `MRT_ColumnFiltersState`: `Array<{ id: string, value: unknown }>`
  - `MRT_ColumnFilterFnsState`: `Record<string, MRT_FilterFn>`
  - `MRT_SortingState`: `Array<{ id: string, desc: boolean }>`
  - `MRT_VisibilityState`: `Record<string, boolean>`
- Current table captures: column visibility, filters, filter modes, sorting, global filter

**Decision**: Store as array of view objects with this structure:

```typescript
interface SavedView {
  id: string;                                    // UUID for stable reference
  name: string;                                  // User-provided name (1-100 chars, unique)
  config: {
    columnVisibility: MRT_VisibilityState;       // e.g., { severity: false, createdAt: false }
    columnFilters: MRT_ColumnFiltersState;       // e.g., [{ id: 'status', value: 'Open' }]
    columnFilterFns: MRT_ColumnFilterFnsState;   // e.g., { status: 'equals', severity: 'equals' }
    sorting: MRT_SortingState;                   // e.g., [{ id: 'createdAt', desc: true }]
    globalFilter: string;                        // e.g., "authentication bug"
  };
  createdAt: string;                             // ISO 8601 timestamp
  updatedAt: string;                             // ISO 8601 timestamp
}

// localStorage structure
{
  "saved-views": SavedView[],           // Array of up to 50 views
  "active-view-id": string | null       // Currently active view ID or null for default
}
```

**Rationale**:
- Directly maps to MRT state types - no transformation needed when applying views
- Separate `active-view-id` key allows persistence without modifying view objects
- UUID IDs allow safe renaming without breaking references
- Timestamps support future features (sort by recently used, auto-cleanup old views)
- Single array structure simplifies CRUD operations
- JSON-serializable types ensure localStorage compatibility

**Alternatives Considered**:
- **Object keyed by view name**: Rejected because renaming becomes complex, name changes would require key updates
- **Storing only diff from default**: Rejected due to complexity and brittleness when default changes
- **Separate keys per view**: Rejected as it complicates listing, max count enforcement, and cleanup
- **Including pagination state**: Rejected as it's not part of "view" concept (users don't think "I want to save being on page 3")

---

### 3. View Application Strategy

**Question**: How should applying a view interact with the existing URL synchronization?

**Research Findings**:
- Current implementation in [src/components/incidents/IncidentTable.tsx](../../src/components/incidents/IncidentTable.tsx):
  - All table state (filters, sorting, pagination, column visibility) syncs to URL params
  - Uses custom hooks: `useUrlState`, `useUrlPagination`
  - URL updates use `{ replace: true }` to avoid history pollution
  - State initialized from URL on mount
  - Effects sync state changes back to URL
- URL parameters defined in [src/types/filters.ts](../../src/types/filters.ts)

**Decision**: When a view is applied, update the table's internal state directly, then let existing URL sync effects handle URL updates

**Rationale**:
- Preserves existing URL sync behavior - no breaking changes
- Users can still share URLs (URLs represent current state, not view name)
- Bookmarked URLs continue to work
- Browser back/forward navigation works as expected
- View application is just setting multiple state values at once
- No need to modify URL sync logic or add special view handling

**Implementation Flow**:
1. User selects view from dropdown
2. Context's `applyView(viewId)` function:
   - Finds view by ID
   - Returns view config object
3. IncidentTable receives config, calls setters:
   - `setColumnVisibility(config.columnVisibility)`
   - `setColumnFilters(config.columnFilters)`
   - `setColumnFilterFns(config.columnFilterFns)`
   - `setSorting(config.sorting)`
   - `setGlobalFilter(config.globalFilter)`
4. Existing useEffect hooks detect state changes and update URL
5. Table re-renders with new configuration

**Alternatives Considered**:
- **Add `?view=<view-id>` URL param**: Rejected because it creates ambiguity (does view param override state params?), complicates sharing (people share view IDs they don't have), and breaks when views are deleted
- **Replace URL sync with view sync**: Rejected as it breaks existing URL sharing/bookmarking functionality
- **Modify URL sync to be view-aware**: Rejected as unnecessary complexity, violates single responsibility principle

---

### 4. UI Component Structure

**Question**: How should the saved views UI components be organized?

**Research Findings**:
- Current toolbar implementation uses MRT's `renderTopToolbarCustomActions` prop
- Material-UI provides `Select`, `Menu`, `MenuItem`, `Button`, `Dialog`, `Drawer` components
- Existing filter components ([src/components/incidents/filters/](../../src/components/incidents/filters/)) show pattern of small, focused components
- Material-UI `Menu` component provides better UX for action lists (rename, update, delete) compared to `Select`

**Decision**: Create three focused components:

1. **SavedViewsDropdown**: Main UI in toolbar
   - Material-UI `Button` + `Menu` for view selection (not `Select` which is for forms)
   - Shows current view name or "Default View"
   - List of saved views as `MenuItem` components
   - Each view item has secondary actions (rename, update, delete) in nested menu or tooltip actions
   - "Create New View" button at bottom of menu
   - Positioned left of Create Incident button (which moves left)

2. **SaveViewPanel**: Create/rename view panel
   - Material-UI `Drawer` (side panel, consistent with incident detail drawer)
   - Text field for view name with validation (1-100 chars, no duplicates)
   - Preview of current table config (columns, filters, sorting)
   - Save/Cancel buttons
   - Shows validation errors inline
   - Opens from "Create New View" or "Rename" action

3. **DeleteViewDialog**: Confirmation for deletion
   - Material-UI `Dialog` (modal)
   - Shows view name being deleted
   - Explains this action is irreversible
   - Delete/Cancel buttons
   - Opens from "Delete" action on view menu item

**Rationale**:
- Small, focused components are easier to test and maintain
- Drawer (vs Dialog) for save panel provides more space for config preview
- Separate delete dialog follows Material Design patterns for destructive actions
- Menu (vs Select) provides better UX for items with secondary actions
- Component separation allows independent testing of each UX flow

**Alternatives Considered**:
- **Single "ViewManager" component**: Rejected as it violates SRP and makes testing harder
- **Dialog for save panel**: Rejected as drawer provides better UX for form with preview content
- **Inline editing in dropdown**: Rejected as it's cramped and harder to validate
- **Select dropdown**: Rejected as Menu provides better support for action buttons per item

---

### 5. Default View Representation

**Question**: How should the "default view" (no saved view active) be represented?

**Research Findings**:
- Current table defaults:
  - All columns visible
  - No filters active
  - Sorting: `[{ id: 'createdAt', desc: true }]`
  - No global filter
- Default view is the fallback when:
  - User has no saved views
  - User explicitly returns to default
  - User deletes currently active view
  - Active view ID in localStorage is invalid/corrupted

**Decision**: Default view is NOT stored as a SavedView object, but defined in code

```typescript
const DEFAULT_VIEW_CONFIG: ViewConfig = {
  columnVisibility: {},                          // Empty = all visible
  columnFilters: [],
  columnFilterFns: {},
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: '',
};
```

**Rationale**:
- Default view is application logic, not user data
- Cannot be renamed, updated, or deleted
- Always available as fallback
- Simplifies storage (don't need to handle "permanent" view)
- Clear distinction: SavedViews are user-created, default is system-provided
- Easier to update default if product requirements change

**Implementation**:
- When `activeViewId` is `null`, table uses DEFAULT_VIEW_CONFIG
- Dropdown shows "Default View" when `activeViewId` is `null`
- "Reset to Default" action sets `activeViewId` to `null` (vs creating a "Default" view)

**Alternatives Considered**:
- **Store default as SavedView**: Rejected as it complicates CRUD (can't delete, name fixed), wastes storage
- **No default concept**: Rejected as users need a way to clear all customizations
- **Default = empty state**: Rejected as table needs defined sorting for usability

---

### 6. View Name Validation

**Question**: What validation rules should apply to view names?

**Research Findings**:
- Spec requirement: 1-100 characters, unique, non-empty
- Material-UI TextField provides inline validation feedback
- Common validation needs: length, uniqueness, empty/whitespace, special characters

**Decision**: Apply these validation rules:

1. **Length**: 1-100 characters (enforced at input level with maxLength)
2. **Non-empty**: At least one non-whitespace character (trim before validation)
3. **Uniqueness**: Case-sensitive comparison against existing view names (except when renaming same view)
4. **Characters**: Allow all Unicode characters (no restriction) for internationalization

**Validation Timing**:
- **On blur**: Check uniqueness, show error message if duplicate
- **On submit**: Check all rules, prevent save if any fail
- **Real-time**: Character count display (X/100)

**Error Messages**:
- Empty: "View name is required"
- Too long: "View name must be 100 characters or less"
- Duplicate: "A view with this name already exists"

**Rationale**:
- Uniqueness prevents confusion when selecting views
- 100 char limit prevents dropdown UI issues while allowing descriptive names
- Trim prevents accidental " MyView" vs "MyView" duplicates
- Case-sensitive matching respects user intent ("MyView" vs "myview" are different)
- No special char restrictions avoids i18n issues (emoji names are fine)

**Alternatives Considered**:
- **Case-insensitive uniqueness**: Rejected as users may want "API Bugs" and "api bugs" as different views
- **Slug generation**: Rejected as unnecessary complexity for local-only feature
- **Character restrictions**: Rejected as overly restrictive and not needed for localStorage

---

### 7. Maximum Views Limit

**Question**: How to enforce the 50 view maximum?

**Research Findings**:
- Spec requirement: 50 views maximum
- localStorage typical limit: 5-10MB per origin (50 views ≈ 25KB, safe)
- Need to handle limit gracefully without data loss

**Decision**: Enforce limit at creation time

**Implementation**:
- `createView()` function checks `savedViews.length >= 50` before allowing creation
- Show error dialog: "Maximum saved views reached. Please delete a view before creating a new one."
- Display count in UI: "Views: 15/50" (optional, in dropdown footer)
- No automatic deletion or LRU eviction

**Rationale**:
- Explicit limit prevents silent failures or performance issues
- User controls what to delete (vs automatic eviction causing confusion)
- 50 is generous limit that most users won't hit
- Clear error message explains the constraint and action needed

**Alternatives Considered**:
- **LRU eviction**: Rejected as users may be surprised when old views disappear
- **Higher limit**: Rejected as 50 views is already generous, higher limits may cause performance issues
- **Soft limit with warnings**: Rejected as it doesn't prevent the actual problem (too many views)

---

### 8. localStorage Failure Handling

**Question**: How to handle localStorage unavailability or quota exceeded errors?

**Research Findings**:
- localStorage can fail for: private browsing, quota exceeded, permissions, browser bugs
- Current pattern in [src/api/storage.ts](../../src/api/storage.ts): try-catch with console.warn
- localStorage operations can throw SecurityError, QuotaExceededError
- Graceful degradation is critical per constitution requirement (UX Excellence)

**Decision**: Implement three-tier fallback strategy

**Tier 1: Normal Operation (localStorage available)**
- Views persist across sessions
- All features work as specified

**Tier 2: Session-Only Mode (localStorage read fails on init)**
- Show warning banner: "Saved views are unavailable. Changes will not persist after closing the browser."
- Views stored in memory only (Context state)
- All features work during session but lost on refresh
- Warning dismissible but persists across page navigations

**Tier 3: Disabled Mode (localStorage write fails during operation)**
- Show error dialog: "Unable to save view. Your browser may be in private mode or storage is full."
- View creation/update operations disabled
- View selection still works (for session-stored views)
- Users can still modify table configuration directly

**Implementation**:
```typescript
// In SavedViewsContext
const [storageAvailable, setStorageAvailable] = useState<'full' | 'session' | 'none'>('full');

// On init: test localStorage
try {
  const test = localStorage.getItem('saved-views');
  setStorageAvailable('full');
} catch (e) {
  console.warn('localStorage unavailable, using session-only mode');
  setStorageAvailable('session');
}

// On write: handle quota exceeded
try {
  localStorage.setItem('saved-views', JSON.stringify(views));
} catch (e) {
  if (e instanceof DOMException && e.code === 22) {
    // Quota exceeded
    setStorageAvailable('none');
    showError('Unable to save view. Browser storage is full.');
  }
}
```

**Rationale**:
- Users can still use the feature even when localStorage fails (constitution: graceful degradation)
- Clear communication about limitations prevents confusion
- Session storage fallback better than complete feature loss
- Separate handling for init vs runtime failures provides better UX

**Alternatives Considered**:
- **Disable feature entirely**: Rejected as too harsh, users can still benefit from session-only views
- **Silent failure**: Rejected as users would be confused when views disappear
- **Alternative storage (IndexedDB, cookies)**: Rejected as unnecessary complexity and breaks from existing patterns

---

### 9. View Update Strategy

**Question**: When user modifies table while a view is active, should we auto-update the view or require explicit update?

**Research Findings**:
- Two common patterns:
  - **Auto-save**: Changes to table automatically update active view (Google Sheets filters)
  - **Explicit save**: User must explicitly save changes (browser bookmarks)
- Spec requirement FR-013: "Users MUST be able to update an existing view's configuration to match the current table state"

**Decision**: Require explicit update (do NOT auto-save)

**UX Flow**:
1. User has "My View" active (dropdown shows "My View")
2. User changes a filter or hides a column
3. Dropdown shows indicator: "My View *" (asterisk indicates unsaved changes)
4. User can:
   - Click "Update My View" to save changes
   - Click "Save as New View" to create new view with changes
   - Select another view (discards changes, applies new view)
   - Continue working (changes remain but not saved to view)
5. If user refreshes browser, unsaved changes are lost, "My View" loads with original config

**Rationale**:
- Explicit update prevents accidental view modifications (user might be experimenting)
- Clearer mental model: saved views are stable references, not live state
- Allows "Save as New View" workflow (modify existing view A, save as new view B)
- Matches user expectations from similar features (bookmarks, saved filters in other apps)
- Constitution requirement: confirmation for critical actions (updating a view is semi-destructive)

**Implementation**:
- Track view "dirty" state: compare current table state to active view config
- Show indicator in dropdown when dirty
- Provide two actions when dirty: "Update [View Name]" and "Save as New View"

**Alternatives Considered**:
- **Auto-save**: Rejected as it makes views unstable and prevents "save as new" workflow
- **Prompt on navigation**: Rejected as too intrusive for exploratory browsing
- **Undo/redo**: Rejected as unnecessarily complex for this feature scope

---

### 10. Component Testing Strategy

**Question**: What testing approach should we use for the saved views feature?

**Research Findings**:
- Current test setup: Vitest + React Testing Library
- Existing test examples in [src/components/incidents/IncidentTable.test.tsx](../../src/components/incidents/IncidentTable.test.tsx)
- Constitution requirement: TDD with tests before implementation
- Three test levels needed: unit (storage), component (UI), integration (end-to-end flows)

**Decision**: Three-layer testing approach following TDD

**Layer 1: Unit Tests (`savedViewsStorage.test.ts`)**
- Test localStorage functions in isolation
- Mock localStorage to test failure scenarios
- Test cases:
  - Save/load/delete operations
  - Quota exceeded handling
  - Corrupted data handling
  - Max views limit enforcement
  - Name uniqueness validation

**Layer 2: Component Tests (co-located `.test.tsx` files)**
- Test each component in isolation with mocked context
- Test cases:
  - SavedViewsDropdown: render views, select view, open panels
  - SaveViewPanel: validate name, show errors, submit form
  - DeleteViewDialog: show warning, confirm deletion, cancel
- Use React Testing Library: user events, accessibility queries, assertions

**Layer 3: Integration Tests (`tests/integration/saved-views.test.tsx`)**
- Test complete user workflows end-to-end
- Test cases:
  - Create view → apply view → modify table → update view
  - Create view → delete view → verify default applied
  - Create view → refresh browser → verify view persists
  - Create 50 views → attempt 51st → verify error
  - localStorage unavailable → verify session-only mode

**TDD Workflow**:
1. Write failing test for storage function
2. Implement storage function to pass test
3. Write failing test for context function
4. Implement context function to pass test
5. Write failing test for component behavior
6. Implement component to pass test
7. Write failing integration test for user flow
8. Wire up components to pass integration test

**Rationale**:
- TDD ensures high coverage and design validation before implementation
- Three layers provide comprehensive coverage without redundancy
- Integration tests catch cross-component issues (context + UI + storage)
- Follows constitution requirement (Principle I: Test-First Development)
- Matches existing test patterns in codebase

**Alternatives Considered**:
- **Only component tests**: Rejected as they wouldn't catch integration issues or storage edge cases
- **Only integration tests**: Rejected as they're slower and provide less specific failure information
- **E2E tests with Playwright**: Rejected as overkill for this feature, unit+component+integration is sufficient

---

## Summary of Key Decisions

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| **State Management** | Context + custom hook (SavedViewsContext, useSavedViews) | Consistency with existing patterns (ThemeContext), clean API |
| **Data Structure** | Array of view objects with UUID keys in localStorage | Direct MRT type mapping, simple CRUD operations |
| **View Application** | Update table state directly, let URL sync handle URL | Preserves existing URL behavior, no breaking changes |
| **UI Components** | Three focused components (Dropdown, Panel, Dialog) | SRP, testability, follows Material Design patterns |
| **Default View** | Code-defined constant, not stored | Clear system vs user data distinction, simpler logic |
| **Name Validation** | 1-100 chars, unique, case-sensitive, all Unicode allowed | Balance between usability and i18n support |
| **View Limit** | Hard limit of 50 views, error on exceed | Prevents performance issues, user control over deletion |
| **Storage Failures** | Three-tier fallback (full → session → disabled) | Graceful degradation per constitution |
| **Update Strategy** | Explicit update with dirty indicator | Prevents accidental changes, clearer mental model |
| **Testing Approach** | TDD with unit + component + integration layers | Constitution requirement, comprehensive coverage |

---

## Open Questions

**None.** All technical decisions are resolved and documented above.

---

## References

- Feature Spec: [spec.md](./spec.md)
- Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- Existing Code:
  - [src/components/incidents/IncidentTable.tsx](../../src/components/incidents/IncidentTable.tsx)
  - [src/contexts/ThemeContext.tsx](../../src/contexts/ThemeContext.tsx)
  - [src/api/storage.ts](../../src/api/storage.ts)
  - [src/types/filters.ts](../../src/types/filters.ts)
