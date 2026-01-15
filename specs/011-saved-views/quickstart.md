# Quickstart Guide: Saved Table Views Implementation

**Feature**: 011-saved-views | **Date**: 2026-01-15
**Audience**: Developers implementing this feature

## Overview

This guide provides a step-by-step implementation roadmap for the Saved Table Views feature. Follow this TDD (Test-Driven Development) sequence to build the feature systematically with tests written before implementation.

**Estimated Effort**: ~2-3 implementation sessions
**Key Principle**: Write failing tests → implement to pass tests → refactor

---

## Prerequisites

Before starting implementation, ensure you have:

1. ✅ Read all planning documents:
   - [spec.md](./spec.md) - Feature requirements and user stories
   - [research.md](./research.md) - Design decisions and rationale
   - [data-model.md](./data-model.md) - Type definitions and validation rules
   - [contracts/](./contracts/) - API contracts for all modules

2. ✅ Familiarized yourself with existing code:
   - `src/contexts/ThemeContext.tsx` - Context pattern reference
   - `src/api/storage.ts` - localStorage utility pattern
   - `src/components/incidents/IncidentTable.tsx` - Table implementation
   - `src/types/filters.ts` - URL state management

3. ✅ Development environment ready:
   - Node.js 18+, dependencies installed (`npm install`)
   - Tests running (`npm test`)
   - Linter passing (`npm run lint`)
   - TypeScript compiling (`npm run build`)

---

## Implementation Sequence

### Phase 1: Type Definitions (20 mins)

**Goal**: Define all TypeScript types with no implementation yet

**Files to Create**:
- `src/types/savedViews.ts`

**Tasks**:
1. Create `src/types/savedViews.ts` with all type definitions from [data-model.md](./data-model.md):
   - `ViewConfig` interface
   - `SavedView` interface
   - `StorageStatus` type
   - `SavedViewsState` interface
   - `SavedViewsContextValue` interface
   - `ValidationResult` interface
   - Constants: `STORAGE_KEY_*`, `MAX_SAVED_VIEWS`, `DEFAULT_VIEW_CONFIG`

2. Update `src/api/types.ts` to re-export saved views types

**Validation**: TypeScript compiles with no errors, types are imported successfully

**Code Reference**: See [data-model.md § Type Definitions](./data-model.md#type-definitions-new-files)

---

### Phase 2: localStorage Functions (TDD - 1 hour)

**Goal**: Implement localStorage utilities with comprehensive tests first

**Test File**: `tests/unit/savedViewsStorage.test.ts`
**Implementation File**: `src/api/storage.ts` (additions)

**TDD Steps**:

#### Step 2.1: Write Tests for `getSavedViews()`

```typescript
describe('getSavedViews', () => {
  it('returns empty array when localStorage is empty');
  it('returns parsed views when valid data exists');
  it('returns empty array and clears storage when data is corrupted');
  it('returns empty array when localStorage is unavailable');
});
```

#### Step 2.2: Implement `getSavedViews()` to Pass Tests

Add function to `src/api/storage.ts` following [localStorage.contract.md](./contracts/localStorage.contract.md)

#### Step 2.3: Write Tests for `setSavedViews()`

```typescript
describe('setSavedViews', () => {
  it('returns true and persists data when write succeeds');
  it('returns false when localStorage throws QuotaExceededError');
  it('returns false when localStorage is unavailable');
});
```

#### Step 2.4: Implement `setSavedViews()` to Pass Tests

#### Step 2.5: Repeat for Other Functions

- `getActiveViewId()` - tests + implementation
- `setActiveViewId()` - tests + implementation
- `validateSavedViewsData()` - tests + implementation (critical: test all validation rules)
- `isStorageAvailable()` - tests + implementation

**Validation**: All unit tests pass, 100% coverage for storage functions

**Code Reference**: See [localStorage.contract.md](./contracts/localStorage.contract.md)

---

### Phase 3: SavedViewsContext (TDD - 1.5 hours)

**Goal**: Implement context provider with state management and CRUD operations

**Test File**: `src/contexts/SavedViewsContext.test.tsx`
**Implementation File**: `src/contexts/SavedViewsContext.tsx`
**Hook File**: `src/hooks/useSavedViews.ts`

**TDD Steps**:

#### Step 3.1: Write Context Setup Tests

```typescript
describe('SavedViewsContext', () => {
  describe('initialization', () => {
    it('loads saved views from localStorage on mount');
    it('loads active view ID from localStorage on mount');
    it('initializes with empty state when localStorage is empty');
    it('handles corrupted data gracefully');
    it('detects localStorage availability');
  });
});
```

#### Step 3.2: Implement Context Provider Scaffold

Create context, provider component, and custom hook:

```typescript
// src/contexts/SavedViewsContext.tsx
export const SavedViewsContext = createContext<SavedViewsContextValue | undefined>(undefined);

export function SavedViewsProvider({ children }: { children: React.ReactNode }) {
  // State initialization from localStorage
  // ...
}

// src/hooks/useSavedViews.ts
export function useSavedViews(): SavedViewsContextValue {
  const context = useContext(SavedViewsContext);
  if (!context) {
    throw new Error('useSavedViews must be used within SavedViewsProvider');
  }
  return context;
}
```

#### Step 3.3: Write Tests for `createView()`

```typescript
describe('createView', () => {
  it('creates view with valid name and config');
  it('returns null when name is invalid');
  it('returns null when max views limit reached');
  it('returns null when localStorage write fails');
  it('persists view to localStorage');
  it('adds view to savedViews array');
});
```

#### Step 3.4: Implement `createView()` Method

#### Step 3.5: Repeat for Other CRUD Methods

- `applyView()` - tests + implementation
- `updateView()` - tests + implementation
- `renameView()` - tests + implementation
- `deleteView()` - tests + implementation
- `validateViewName()` - tests + implementation

#### Step 3.6: Write Tests for `isDirty` Calculation

```typescript
describe('isDirty state', () => {
  it('is false when no active view');
  it('is false when table state matches active view');
  it('is true when table state differs from active view');
  it('resets to false after updateView');
});
```

#### Step 3.7: Implement `isDirty` Logic

**Validation**: All context tests pass, hook throws error when used incorrectly

**Code Reference**: See [SavedViewsContext.contract.md](./contracts/SavedViewsContext.contract.md)

---

### Phase 4: UI Components (TDD - 2 hours)

**Goal**: Build UI components with tests ensuring correct behavior

#### Step 4.1: SaveViewPanel Component

**Test File**: `src/components/incidents/saved-views/SaveViewPanel.test.tsx`
**Implementation File**: `src/components/incidents/saved-views/SaveViewPanel.tsx`

**TDD Steps**:
1. Write render tests (create mode, rename mode)
2. Write validation tests (name too long, duplicate name, empty name)
3. Write interaction tests (submit form, cancel, keyboard navigation)
4. Write accessibility tests (ARIA attributes, focus management)
5. Implement component to pass all tests

**Key Tests**:
```typescript
describe('SaveViewPanel', () => {
  it('renders in create mode with empty name field');
  it('renders in rename mode with pre-filled name');
  it('shows validation error for duplicate name');
  it('calls onSaved when form is submitted with valid name');
  it('calls onClose when cancel button is clicked');
  it('auto-focuses name field on open');
});
```

#### Step 4.2: DeleteViewDialog Component

**Test File**: `src/components/incidents/saved-views/DeleteViewDialog.test.tsx`
**Implementation File**: `src/components/incidents/saved-views/DeleteViewDialog.tsx`

**TDD Steps**:
1. Write render tests (shows view name, warning message)
2. Write interaction tests (confirm, cancel, keyboard navigation)
3. Write accessibility tests (alert dialog role, focus management)
4. Implement component to pass all tests

#### Step 4.3: SavedViewsDropdown Component

**Test File**: `src/components/incidents/saved-views/SavedViewsDropdown.test.tsx`
**Implementation File**: `src/components/incidents/saved-views/SavedViewsDropdown.tsx`

**TDD Steps**:
1. Write render tests (shows current view, lists all views)
2. Write interaction tests (select view, open create panel, trigger rename/update/delete)
3. Write dirty state tests (shows "*" indicator)
4. Write accessibility tests (menu navigation, ARIA attributes)
5. Implement component to pass all tests

**Key Tests**:
```typescript
describe('SavedViewsDropdown', () => {
  it('displays "Default View" when no active view');
  it('displays active view name when view is active');
  it('shows "*" indicator when isDirty is true');
  it('calls onViewApplied when view is selected');
  it('opens SaveViewPanel when "Create New View" is clicked');
  it('shows rename panel when rename action is clicked');
});
```

**Validation**: All component tests pass, components render correctly in isolation

**Code Reference**: See [ComponentAPIs.contract.md](./contracts/ComponentAPIs.contract.md)

---

### Phase 5: Integration with IncidentTable (1 hour)

**Goal**: Wire up saved views to the existing table

**Files to Modify**:
- `src/components/incidents/DashboardPage.tsx` - Add SavedViewsProvider
- `src/components/incidents/IncidentTable.tsx` - Add dropdown, move Create button
- `src/components/incidents/IncidentTable.test.tsx` - Add integration tests

**Steps**:

#### Step 5.1: Wrap DashboardPage with SavedViewsProvider

```typescript
// src/components/incidents/DashboardPage.tsx
import { SavedViewsProvider } from '../../contexts/SavedViewsContext';

export default function DashboardPage() {
  return (
    <AppLayout>
      <SavedViewsProvider>
        <IncidentTable onCreateClick={() => setIsCreateDialogOpen(true)} />
        {/* ... dialogs ... */}
      </SavedViewsProvider>
    </AppLayout>
  );
}
```

#### Step 5.2: Add SavedViewsDropdown to IncidentTable Toolbar

Modify `renderTopToolbarCustomActions` in `IncidentTable.tsx`:

```typescript
// Move Create Incident button to LEFT, add Saved Views dropdown
renderTopToolbarCustomActions: () => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    {onCreateClick && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateClick}
      >
        Create Incident
      </Button>
    )}

    <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

    {hasActiveFilters && (
      <Button
        variant="text"
        size="small"
        startIcon={<FilterListOffIcon />}
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    )}

    <SavedViewsDropdown
      onViewApplied={handleViewApplied}
      onCreateViewClick={() => setIsCreatePanelOpen(true)}
    />
  </Box>
),
```

#### Step 5.3: Implement View Application Logic

Add helper functions in `IncidentTable.tsx`:

```typescript
const { applyView, isDirty } = useSavedViews();

const captureCurrentConfig = (): ViewConfig => ({
  columnVisibility: table.getState().columnVisibility,
  columnFilters,
  columnFilterFns,
  sorting,
  globalFilter,
});

const applyConfigToTable = (config: ViewConfig) => {
  setColumnVisibility(config.columnVisibility);
  setColumnFilters(config.columnFilters);
  setColumnFilterFns(config.columnFilterFns);
  setSorting(config.sorting);
  setGlobalFilter(config.globalFilter);
};

const handleViewApplied = (viewId: string | null) => {
  const config = applyView(viewId);
  if (config) {
    applyConfigToTable(config);
  }
};
```

#### Step 5.4: Add Panel and Dialog Components

Render `SaveViewPanel` and `DeleteViewDialog` in `IncidentTable.tsx` with appropriate state management.

#### Step 5.5: Write Integration Tests

Add tests to `IncidentTable.test.tsx`:

```typescript
describe('Saved Views Integration', () => {
  it('applies view when selected from dropdown');
  it('creates new view with current table config');
  it('updates view when "Update View" is clicked');
  it('deletes view and reverts to default when confirmed');
  it('shows dirty indicator when table is modified while view active');
});
```

**Validation**: Integration tests pass, feature works end-to-end in table

---

### Phase 6: End-to-End Integration Tests (45 mins)

**Goal**: Test complete user workflows across all components

**Test File**: `tests/integration/saved-views.test.tsx`

**Test Scenarios** (from [spec.md](./spec.md) acceptance criteria):

```typescript
describe('Saved Views - End-to-End Workflows', () => {
  describe('User Story 1: Create and Apply Views', () => {
    it('creates view, switches to default, reapplies view');
    it('prevents duplicate view names');
    it('lists all saved views in dropdown');
  });

  describe('User Story 2: Manage Views', () => {
    it('renames view while preserving config');
    it('updates view configuration');
    it('deletes view and reverts to default if active');
  });

  describe('User Story 3: Persistence', () => {
    it('persists active view across page refresh');
    it('restores views from localStorage on mount');
  });

  describe('Edge Cases', () => {
    it('handles localStorage unavailable gracefully');
    it('prevents creating 51st view');
    it('handles corrupted view data');
  });
});
```

**Validation**: All integration tests pass, feature works in realistic user scenarios

---

## Testing Strategy Summary

| Test Level | Files | Purpose | Coverage Goal |
|------------|-------|---------|---------------|
| **Unit** | `savedViewsStorage.test.ts` | localStorage functions in isolation | 100% |
| **Component** | `*.test.tsx` (co-located) | Individual component behavior | 90%+ |
| **Integration** | `saved-views.test.tsx` | Complete user workflows | Key scenarios |

**Run Tests**: `npm test saved-views` (filter by name)
**Coverage Report**: `npm test -- --coverage`

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Wrap with Provider

**Problem**: `useSavedViews()` throws "must be used within SavedViewsProvider"

**Solution**: Ensure `DashboardPage` wraps table with `<SavedViewsProvider>`

---

### Pitfall 2: URL State Out of Sync

**Problem**: Applying view doesn't update URL, breaking refresh/bookmarking

**Solution**: Use existing state setters (setColumnFilters, etc.), they trigger URL sync via useEffect

---

### Pitfall 3: localStorage Quota Exceeded

**Problem**: Saving many views fails silently

**Solution**: `setSavedViews()` returns false on failure, show error dialog to user

---

### Pitfall 4: View Active After Deletion

**Problem**: Deleting active view leaves table in inconsistent state

**Solution**: After `deleteView()`, check if deleted view was active, call `applyView(null)` if so

---

### Pitfall 5: Name Validation Race Conditions

**Problem**: User submits form before validation completes

**Solution**: Disable submit button until validation passes, run validation on blur AND submit

---

## Verification Checklist

Before marking feature complete, verify:

- [ ] All unit tests pass (`npm test`)
- [ ] All component tests pass
- [ ] All integration tests pass
- [ ] TypeScript compiles with no errors (`npm run build`)
- [ ] ESLint passes with no warnings (`npm run lint`)
- [ ] Feature works in browser (manual QA):
  - [ ] Create view with filters and hidden columns
  - [ ] Apply view, verify table updates correctly
  - [ ] Modify table while view active, see "*" indicator
  - [ ] Update view, see changes persist
  - [ ] Rename view, see new name in dropdown
  - [ ] Delete view, verify it disappears and default applies
  - [ ] Refresh browser, verify active view persists
  - [ ] Test localStorage unavailable (private mode), see graceful degradation
  - [ ] Test 50 view limit, see error when attempting 51st
  - [ ] Test keyboard navigation in all components
  - [ ] Test with screen reader (VoiceOver, NVDA), verify ARIA labels
- [ ] Constitution compliance:
  - [ ] TDD followed (tests before implementation)
  - [ ] TypeScript strict mode (no `any`, explicit types)
  - [ ] Code quality (ESLint, Prettier, functions <50 lines)
  - [ ] UX (loading states, error messages, confirmations)
  - [ ] Accessibility (keyboard nav, ARIA, focus management)

---

## File Checklist

**New Files Created** (13 files):
- [ ] `src/types/savedViews.ts`
- [ ] `src/contexts/SavedViewsContext.tsx`
- [ ] `src/hooks/useSavedViews.ts`
- [ ] `src/components/incidents/saved-views/SavedViewsDropdown.tsx`
- [ ] `src/components/incidents/saved-views/SavedViewsDropdown.test.tsx`
- [ ] `src/components/incidents/saved-views/SaveViewPanel.tsx`
- [ ] `src/components/incidents/saved-views/SaveViewPanel.test.tsx`
- [ ] `src/components/incidents/saved-views/DeleteViewDialog.tsx`
- [ ] `tests/unit/savedViewsStorage.test.ts`
- [ ] `tests/integration/saved-views.test.tsx`
- [ ] `src/contexts/SavedViewsContext.test.tsx`

**Files Modified** (3 files):
- [ ] `src/api/storage.ts` (add view storage functions)
- [ ] `src/api/types.ts` (re-export saved views types)
- [ ] `src/components/incidents/IncidentTable.tsx` (integrate dropdown, move button)
- [ ] `src/components/incidents/IncidentTable.test.tsx` (add integration tests)
- [ ] `src/components/incidents/DashboardPage.tsx` (wrap with provider)

---

## Next Steps After Implementation

1. **Run Full Test Suite**: `npm test && npm run lint`
2. **Manual QA**: Test all user stories from spec.md
3. **Accessibility Audit**: Test with keyboard and screen reader
4. **Create PR**: Follow PR template, reference feature spec
5. **Code Review**: Address reviewer feedback
6. **Merge**: Squash commits, use conventional commit message:
   ```
   feat(incidents): add saved views for table configurations

   - Add SavedViewsContext for state management
   - Add SavedViewsDropdown, SaveViewPanel, DeleteViewDialog components
   - Add localStorage persistence for views
   - Move Create Incident button to left side of toolbar
   - Support max 50 views with graceful localStorage failure handling

   Closes #[issue-number]
   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

---

## Resources

- **Feature Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/](./contracts/)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Material-UI Docs**: https://mui.com/material-ui/
- **Material React Table Docs**: https://www.material-react-table.com/
- **Vitest Docs**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react

---

## Support

If you encounter issues during implementation:

1. **Check Research**: [research.md](./research.md) documents all design decisions
2. **Review Contracts**: [contracts/](./contracts/) defines all APIs
3. **Examine Patterns**: Look at ThemeContext and storage.ts for reference implementations
4. **Ask Questions**: Clarify requirements before making assumptions

**Remember**: When in doubt, prefer simplicity. Follow existing patterns, write tests first, keep components focused.

---

**Good luck with the implementation!** 🚀
