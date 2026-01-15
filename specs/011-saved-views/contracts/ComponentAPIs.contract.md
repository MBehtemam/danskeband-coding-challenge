# Contract: UI Component APIs

**Feature**: 011-saved-views | **Date**: 2026-01-15
**Type**: React Component Props and Events Contract

## Overview

This document defines the public API contracts for all UI components in the Saved Views feature. These are the props interfaces and event handlers that consumers use to integrate these components.

---

## SavedViewsDropdown Component

### Location
`src/components/incidents/saved-views/SavedViewsDropdown.tsx`

### Interface

```typescript
interface SavedViewsDropdownProps {
  /**
   * Optional CSS class name for styling
   */
  className?: string;

  /**
   * Optional size variant for button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Callback when a view is selected/applied
   * Receives viewId or null for default view
   * Consumer should apply the view's config to table
   */
  onViewApplied?: (viewId: string | null) => void;

  /**
   * Callback when "Create New View" is clicked
   * Consumer can optionally capture current table state before panel opens
   */
  onCreateViewClick?: () => void;
}

export default function SavedViewsDropdown(props: SavedViewsDropdownProps): JSX.Element
```

### Behavior

**Rendering**:
- Material-UI Button with dropdown icon
- Shows current view name or "Default View"
- Shows "*" indicator if `isDirty` is true
- Disabled state if no saved views and storageAvailable is 'none'

**Dropdown Menu Items**:
1. "Default View" (with checkmark if active)
2. Divider
3. List of saved views (alphabetical order)
   - Each view shows name
   - Checkmark if active
   - Hover reveals secondary actions menu (rename, update, delete)
4. Divider
5. "Create New View" button

**Keyboard Navigation**:
- Tab: Focus dropdown button
- Enter/Space: Open menu
- Arrow keys: Navigate menu items
- Enter: Select item
- Escape: Close menu

**Accessibility**:
- `aria-label="Saved views"` on button
- `aria-expanded` on button
- `aria-checked` on menu items
- `role="menuitem"` on items

### Example Usage

```typescript
<SavedViewsDropdown
  size="medium"
  onViewApplied={(viewId) => {
    const config = applyView(viewId);
    if (config) {
      setColumnVisibility(config.columnVisibility);
      // ... apply other config
    }
  }}
  onCreateViewClick={() => {
    console.log('Opening create view panel');
  }}
/>
```

---

## SaveViewPanel Component

### Location
`src/components/incidents/saved-views/SaveViewPanel.tsx`

### Interface

```typescript
interface SaveViewPanelProps {
  /**
   * Whether the panel is open
   */
  open: boolean;

  /**
   * Callback when panel should close (cancel, backdrop click, escape key)
   */
  onClose: () => void;

  /**
   * Mode: create new view or rename existing view
   * @default 'create'
   */
  mode: 'create' | 'rename';

  /**
   * If mode is 'rename', the view being renamed
   * Required when mode is 'rename'
   */
  view?: SavedView;

  /**
   * Current table configuration to save (for preview display)
   * Required when mode is 'create'
   */
  config?: ViewConfig;

  /**
   * Callback when view is successfully saved/renamed
   * Receives the created/updated SavedView object
   */
  onSaved?: (view: SavedView) => void;
}

export default function SaveViewPanel(props: SaveViewPanelProps): JSX.Element
```

### Behavior

**Create Mode** (`mode: 'create'`):
- Title: "Save Current View"
- Text field for view name (empty initial value)
- Preview of config (formatted summary: "3 filters, Status column hidden, Sorted by Created Date")
- Save button (disabled until valid name entered)
- Cancel button

**Rename Mode** (`mode: 'rename'`):
- Title: "Rename View"
- Text field for view name (pre-filled with current name)
- Note: "Configuration will not be changed"
- Save button (disabled until valid name entered)
- Cancel button

**Validation**:
- Real-time: Character count (X/100)
- On blur: Check uniqueness, show error below field
- On submit: Check all rules, prevent save if invalid

**Keyboard**:
- Escape: Close panel (calls onClose)
- Enter in text field: Submit form (if valid)
- Tab: Navigate between field and buttons

**Accessibility**:
- `role="dialog"` on drawer
- `aria-labelledby` pointing to title
- Focus trap within panel
- Auto-focus text field on open

### Example Usage

```typescript
// Create mode
<SaveViewPanel
  open={isPanelOpen}
  onClose={() => setIsPanelOpen(false)}
  mode="create"
  config={currentTableConfig}
  onSaved={(newView) => {
    console.log('Created view:', newView.name);
    setIsPanelOpen(false);
  }}
/>

// Rename mode
<SaveViewPanel
  open={isRenamePanelOpen}
  onClose={() => setIsRenamePanelOpen(false)}
  mode="rename"
  view={viewToRename}
  onSaved={(updatedView) => {
    console.log('Renamed to:', updatedView.name);
    setIsRenamePanelOpen(false);
  }}
/>
```

---

## DeleteViewDialog Component

### Location
`src/components/incidents/saved-views/DeleteViewDialog.tsx`

### Interface

```typescript
interface DeleteViewDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog should close (cancel, backdrop click, escape key)
   */
  onClose: () => void;

  /**
   * The view to be deleted
   * Required when open is true
   */
  view?: SavedView;

  /**
   * Callback when deletion is confirmed
   * Consumer should call deleteView() after this
   */
  onConfirm?: () => void;
}

export default function DeleteViewDialog(props: DeleteViewDialogProps): JSX.Element
```

### Behavior

**Content**:
- Title: "Delete Saved View?"
- Body: "Are you sure you want to delete '[View Name]'? This action cannot be undone."
- Warning icon (destructive action indicator)
- Delete button (red, destructive color)
- Cancel button (default, focused initially)

**Confirmation Flow**:
1. User clicks "Delete" action on view in dropdown
2. Parent opens dialog with view prop set
3. User clicks "Delete" button → onConfirm() called
4. Parent calls `deleteView(view.id)`
5. If deleting active view, parent applies default view
6. Dialog closes

**Keyboard**:
- Escape: Close dialog (calls onClose)
- Enter: Confirm deletion (calls onConfirm)
- Tab: Toggle between Cancel and Delete buttons

**Accessibility**:
- `role="alertdialog"` (destructive action)
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to body text
- Focus trap within dialog
- Auto-focus Cancel button (safe default)

### Example Usage

```typescript
<DeleteViewDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  view={viewToDelete}
  onConfirm={() => {
    const wasActive = viewToDelete.id === activeViewId;

    if (deleteView(viewToDelete.id)) {
      // Show success message

      if (wasActive) {
        // Apply default view since active view was deleted
        const defaultConfig = applyView(null);
        setColumnVisibility(defaultConfig.columnVisibility);
        // ... apply other config
      }
    }

    setIsDeleteDialogOpen(false);
  }}
/>
```

---

## Integration Pattern

### Complete Integration in IncidentTable.tsx

```typescript
// In IncidentTable component
const {
  savedViews,
  activeViewId,
  isDirty,
  createView,
  applyView,
  updateView,
  deleteView
} = useSavedViews();

const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [viewToDelete, setViewToDelete] = useState<SavedView | null>(null);

// Capture current table config for saving
const captureCurrentConfig = (): ViewConfig => ({
  columnVisibility,
  columnFilters,
  columnFilterFns,
  sorting,
  globalFilter
});

// Apply view config to table
const applyConfigToTable = (config: ViewConfig) => {
  setColumnVisibility(config.columnVisibility);
  setColumnFilters(config.columnFilters);
  setColumnFilterFns(config.columnFilterFns);
  setSorting(config.sorting);
  setGlobalFilter(config.globalFilter);
};

// In toolbar render
<SavedViewsDropdown
  onViewApplied={(viewId) => {
    const config = applyView(viewId);
    if (config) {
      applyConfigToTable(config);
    }
  }}
  onCreateViewClick={() => setIsCreatePanelOpen(true)}
/>

<SaveViewPanel
  open={isCreatePanelOpen}
  onClose={() => setIsCreatePanelOpen(false)}
  mode="create"
  config={captureCurrentConfig()}
  onSaved={() => {
    setIsCreatePanelOpen(false);
    // Optionally show success message
  }}
/>

<DeleteViewDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  view={viewToDelete}
  onConfirm={() => {
    if (viewToDelete) {
      const wasActive = viewToDelete.id === activeViewId;

      deleteView(viewToDelete.id);

      if (wasActive) {
        const defaultConfig = applyView(null);
        applyConfigToTable(defaultConfig);
      }

      setIsDeleteDialogOpen(false);
      setViewToDelete(null);
    }
  }}
/>
```

---

## Styling Contracts

### Theme Integration

All components use Material-UI theme:
- Colors: `theme.palette.primary`, `theme.palette.error`, etc.
- Spacing: `theme.spacing(1)`, `theme.spacing(2)`, etc.
- Typography: `theme.typography.h6`, `theme.typography.body1`, etc.
- Breakpoints: `theme.breakpoints.up('md')`, etc.

### Custom Styling

Components accept `className` prop for custom styles:
```typescript
<SavedViewsDropdown className="custom-dropdown" />
```

Use Emotion's `styled` or `sx` prop for component-specific styling.

---

## Testing Contracts

### Component Test Requirements

Each component must have:
1. **Render tests**: Component renders without errors
2. **Interaction tests**: User events trigger correct callbacks
3. **Accessibility tests**: ARIA attributes present, keyboard navigation works
4. **State tests**: Component responds to prop changes correctly
5. **Error tests**: Component handles invalid props gracefully

### Example Test Structure

```typescript
describe('SavedViewsDropdown', () => {
  it('renders with default view active', () => {
    render(<SavedViewsDropdown />);
    expect(screen.getByText('Default View')).toBeInTheDocument();
  });

  it('calls onViewApplied when view is selected', async () => {
    const onViewApplied = vi.fn();
    render(<SavedViewsDropdown onViewApplied={onViewApplied} />);

    await userEvent.click(screen.getByLabelText('Saved views'));
    await userEvent.click(screen.getByText('My View'));

    expect(onViewApplied).toHaveBeenCalledWith('view-id');
  });

  it('shows dirty indicator when view is modified', () => {
    // Mock context with isDirty: true
    render(<SavedViewsDropdown />);
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });
});
```

---

## Error Handling Contracts

### Component-Level Errors

Components should handle errors gracefully:

**Invalid Props**: Show error in console (dev mode), render fallback UI
**Missing Context**: Throw error (enforced by useSavedViews hook)
**Async Failures**: Show error message to user (snackbar, inline error)

### Error Boundaries

Components do NOT implement error boundaries themselves. Parent should wrap:

```typescript
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <SavedViewsDropdown />
</ErrorBoundary>
```

---

## Performance Contracts

### Rendering Performance

- **SavedViewsDropdown**: Memo-ized, only re-renders when savedViews or activeViewId changes
- **SaveViewPanel**: Only renders when `open` is true
- **DeleteViewDialog**: Only renders when `open` is true

### Event Debouncing

- **Text input validation**: Debounced 300ms to avoid excessive validation on keystroke

---

## Version

**Version**: 1.0
**Last Updated**: 2026-01-15

This contract is stable and ready for implementation.
