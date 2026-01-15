# Quickstart Guide: Explicit Save Pattern with Refactored Select Components

**Feature**: 013-refactor-select-components
**Date**: 2026-01-15
**Audience**: Developers implementing or maintaining incident form components

## Overview

This guide demonstrates how to use the refactored select components (StatusSelect, AssigneeSelect, SeveritySelect) with the explicit save pattern. After this refactoring, all three select components follow a consistent controlled component pattern.

## Key Concepts

### 1. Controlled Components
Select components no longer manage their own state or make API calls. They are "controlled" by their parent:
- Parent provides current `value` via props
- Component notifies parent of changes via `onChange` callback
- Parent decides when to persist changes (immediately or on explicit save)

### 2. Explicit Save Pattern
Used in DetailPanel for incident updates:
- User can change multiple fields
- Changes stored in local form state (not persisted immediately)
- User clicks Save button to persist all changes at once
- Clear feedback: loading states, success notifications, error alerts

### 3. Form Submission Pattern
Used in CreateIncidentDialog for new incidents:
- User fills form fields (including selects)
- All values stored in local component state
- User clicks Create button to submit entire form
- Validation occurs before submission

---

## Quick Start: Using Refactored Select Components

### StatusSelect

```typescript
import { StatusSelect } from './components/incidents/StatusSelect';
import type { IncidentStatus } from './api/types';

function MyForm() {
  const [status, setStatus] = useState<IncidentStatus>('Open');

  return (
    <StatusSelect
      value={status}
      onChange={setStatus}
      disabled={false}
      fullWidth
    />
  );
}
```

**Props**:
- `value`: Current status ('Open' | 'In Progress' | 'Resolved')
- `onChange`: Callback receiving new status
- `disabled?`: Disable during operations (default: false)
- `fullWidth?`: Take full container width (default: false)

### AssigneeSelect

```typescript
import { AssigneeSelect } from './components/incidents/AssigneeSelect';
import { useUsers } from './hooks/useUsers';

function MyForm() {
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const { data: users } = useUsers();

  return (
    <AssigneeSelect
      value={assigneeId}
      onChange={setAssigneeId}
      users={users || []}
      disabled={false}
      fullWidth
    />
  );
}
```

**Props**:
- `value`: Current assignee ID or null for unassigned
- `onChange`: Callback receiving new assignee ID or null
- `users`: Array of User objects for dropdown options
- `disabled?`: Disable during operations (default: false)
- `fullWidth?`: Take full container width (default: false)

### SeveritySelect

```typescript
import { SeveritySelect } from './components/incidents/SeveritySelect';
import type { IncidentSeverity } from './api/types';

function MyForm() {
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');

  return (
    <SeveritySelect
      value={severity}
      onChange={setSeverity}
      disabled={false}
      fullWidth
    />
  );
}
```

**Props**:
- `value`: Current severity ('Low' | 'Medium' | 'High' | 'Critical')
- `onChange`: Callback receiving new severity
- `disabled?`: Disable during operations (default: false)
- `fullWidth?`: Take full container width (default: false)

---

## Pattern 1: Explicit Save (DetailPanel)

### Complete Example

```typescript
import { useIncidentForm } from '../../hooks/useIncidentForm';
import { useUsers } from '../../hooks/useUsers';
import { StatusSelect } from './StatusSelect';
import { SeveritySelect } from './SeveritySelect';
import { AssigneeSelect } from './AssigneeSelect';
import { SaveButton } from '../common/SaveButton';
import type { Incident } from '../../api/types';

interface DetailPanelProps {
  incident: Incident;
  onClose: () => void;
}

export function DetailPanel({ incident, onClose }: DetailPanelProps) {
  // 1. Initialize form state with explicit save pattern
  const form = useIncidentForm(incident);

  // 2. Fetch users for assignee dropdown
  const { data: users } = useUsers();

  return (
    <Box>
      {/* Error Alert - Top of form */}
      {form.saveError && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          {form.saveError.message || 'Failed to save changes'}
        </Alert>
      )}

      {/* Form Fields - All disabled during save */}
      <StatusSelect
        value={form.formValues.status}
        onChange={form.setStatus}
        disabled={form.isSaving}
        fullWidth
      />

      <SeveritySelect
        value={form.formValues.severity}
        onChange={form.setSeverity}
        disabled={form.isSaving}
        fullWidth
      />

      <AssigneeSelect
        value={form.formValues.assigneeId}
        onChange={form.setAssigneeId}
        users={users || []}
        disabled={form.isSaving}
        fullWidth
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={form.hasChanges ? form.handleCancel : onClose}
          disabled={form.isSaving}
        >
          Cancel
        </Button>

        <SaveButton
          onClick={form.handleSave}
          disabled={!form.hasChanges}
          loading={form.isSaving}
        />
      </Box>

      {/* Success Notification - Top center, auto-dismiss 5s */}
      <Snackbar
        open={form.saveSuccess}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Changes saved successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
```

### Step-by-Step Breakdown

#### Step 1: Initialize Form State

```typescript
const form = useIncidentForm(incident);
```

The `useIncidentForm` hook provides:
- `formValues`: Current local values (with user edits)
- `hasChanges`: True if any field differs from original
- `isSaving`: True during API call
- `saveError`: Error object if save failed, null otherwise
- `saveSuccess`: True after successful save (for 5 seconds)
- `setStatus`, `setSeverity`, `setAssigneeId`: Update local state
- `handleSave`: Persist changes to API
- `handleCancel`: Revert to original values

#### Step 2: Connect Select Components

```typescript
<StatusSelect
  value={form.formValues.status}    // Current value from form state
  onChange={form.setStatus}         // Update form state on change
  disabled={form.isSaving}          // Disable during save
  fullWidth                         // Layout option
/>
```

**Flow**:
1. User clicks dropdown → opens menu
2. User selects new value → `onChange(newValue)` fires
3. `form.setStatus(newValue)` updates local state
4. Component re-renders with new value
5. `form.hasChanges` becomes true → Save button enables
6. **No API call yet** - changes are local only

#### Step 3: Display Error Feedback

```typescript
{form.saveError && (
  <Alert severity="error" sx={{ mb: 2 }} role="alert">
    {form.saveError.message || 'Failed to save changes'}
  </Alert>
)}
```

**Error appears when**:
- API call fails during save
- Positioned at top of form (before fields)
- Persistent (doesn't auto-dismiss)
- User must Cancel or retry successful save to clear

#### Step 4: Handle Save Action

```typescript
<SaveButton
  onClick={form.handleSave}
  disabled={!form.hasChanges}  // Only enabled when changes exist
  loading={form.isSaving}      // Shows spinner during save
/>
```

**Save flow**:
1. User clicks Save → `form.handleSave()` called
2. `form.isSaving` becomes true → all fields disabled, button shows spinner
3. API call made with all changed fields
4. On success:
   - `form.saveSuccess` becomes true → success notification shows
   - `form.hasChanges` becomes false → Save button disables
   - Success notification auto-dismisses after 5 seconds
5. On error:
   - `form.saveError` set → error alert appears
   - `form.formValues` preserved → user can retry without re-entering
   - `form.hasChanges` remains true → Save button stays enabled

#### Step 5: Display Success Notification

```typescript
<Snackbar
  open={form.saveSuccess}
  autoHideDuration={5000}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity="success" variant="filled">
    Changes saved successfully
  </Alert>
</Snackbar>
```

**Notification behavior**:
- Appears at top-center of viewport
- Auto-dismisses after exactly 5 seconds
- Non-blocking (user can continue working)
- Uses Material UI filled variant for prominence

---

## Pattern 2: Form Submission (CreateIncidentDialog)

### Complete Example

```typescript
import { useState } from 'react';
import { useCreateIncident } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import { StatusSelect } from './StatusSelect';
import { SeveritySelect } from './SeveritySelect';
import { AssigneeSelect } from './AssigneeSelect';
import type { IncidentStatus, IncidentSeverity } from '../../api/types';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateIncidentDialog({ open, onClose }: CreateDialogProps) {
  // 1. Local form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IncidentStatus>('Open');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  // 2. API hook and data
  const createIncident = useCreateIncident();
  const { data: users } = useUsers();

  // 3. Submit handler
  const handleSubmit = () => {
    createIncident.mutate(
      {
        title,
        description,
        status,
        severity,
        assigneeId,
      },
      {
        onSuccess: () => {
          // Reset form and close
          setTitle('');
          setDescription('');
          setStatus('Open');
          setSeverity('Medium');
          setAssigneeId(null);
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Incident</DialogTitle>

      <DialogContent>
        {/* Error Alert - Top of form */}
        {createIncident.isError && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            Failed to create incident. Please try again.
          </Alert>
        )}

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        {/* Refactored select components */}
        <StatusSelect
          value={status}
          onChange={setStatus}
          disabled={createIncident.isPending}
          fullWidth
        />

        <SeveritySelect
          value={severity}
          onChange={setSeverity}
          disabled={createIncident.isPending}
          fullWidth
        />

        <AssigneeSelect
          value={assigneeId}
          onChange={setAssigneeId}
          users={users || []}
          disabled={createIncident.isPending}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={createIncident.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createIncident.isPending}
        >
          {createIncident.isPending ? 'Creating...' : 'Create Incident'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Key Differences from DetailPanel

1. **No useIncidentForm hook**: CreateDialog manages state directly with useState
2. **Immediate submission**: Form submitted as a whole on Create button click
3. **Success behavior**: Dialog closes and form resets (no success notification)
4. **Error display**: Same pattern as DetailPanel (inline alert at top)

---

## Common Patterns

### Disable All Fields During Operations

```typescript
const disabled = form.isSaving;  // or createIncident.isPending

<StatusSelect disabled={disabled} {...otherProps} />
<SeveritySelect disabled={disabled} {...otherProps} />
<AssigneeSelect disabled={disabled} {...otherProps} />
```

### Fetch Users Once for AssigneeSelect

```typescript
const { data: users, isLoading } = useUsers();

// Provide empty array while loading to prevent errors
<AssigneeSelect
  users={users || []}
  {...otherProps}
/>
```

### Handle Optional Users Gracefully

```typescript
// If users might be undefined, provide fallback
<AssigneeSelect
  users={users ?? []}
  value={assigneeId}
  onChange={setAssigneeId}
/>
```

---

## Testing

### Test Select Components in Isolation

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusSelect } from './StatusSelect';

test('calls onChange with selected status', async () => {
  const onChange = jest.fn();
  render(<StatusSelect value="Open" onChange={onChange} />);

  const select = screen.getByRole('combobox', { name: /status/i });
  await userEvent.click(select);

  const resolvedOption = screen.getByRole('option', { name: /resolved/i });
  await userEvent.click(resolvedOption);

  expect(onChange).toHaveBeenCalledWith('Resolved');
});
```

### Test Explicit Save Flow

```typescript
test('saves changes when Save button clicked', async () => {
  const { container } = render(<DetailPanel incident={mockIncident} />);

  // Change status
  const statusSelect = screen.getByRole('combobox', { name: /status/i });
  await userEvent.click(statusSelect);
  await userEvent.click(screen.getByRole('option', { name: /resolved/i }));

  // Verify Save button enabled
  const saveButton = screen.getByRole('button', { name: /save/i });
  expect(saveButton).toBeEnabled();

  // Click save
  await userEvent.click(saveButton);

  // Verify success notification appears
  await waitFor(() => {
    expect(screen.getByText(/changes saved successfully/i)).toBeInTheDocument();
  });
});
```

---

## Migration Checklist

### Before Refactoring
- [ ] StatusSelect and AssigneeSelect call useUpdateIncident directly
- [ ] Select changes trigger immediate API calls (auto-save)
- [ ] Each select manages its own state and loading

### After Refactoring
- [x] All select components use value/onChange props
- [x] No select components make API calls directly
- [x] Parent components (DetailPanel, CreateDialog) manage state
- [x] DetailPanel uses explicit Save button
- [x] Success notifications at top-center with 5s auto-dismiss
- [x] Error alerts at top of form (inline, persistent)

---

## Troubleshooting

### Select not updating when I change it
**Problem**: Select shows old value after selection change
**Cause**: Not updating parent state in onChange callback
**Fix**: Ensure onChange callback updates state: `onChange={(val) => setState(val)}`

### Save button always disabled
**Problem**: Save button never enables even after changes
**Cause**: `hasChanges` not computing correctly
**Fix**: Verify form.setStatus/setSeverity/setAssigneeId are being called on select changes

### Error alert not appearing
**Problem**: Error doesn't show after failed save
**Cause**: `saveError` not being set or conditional rendering incorrect
**Fix**: Check `{form.saveError && <Alert>...</Alert>}` pattern is used

### Success notification wrong position
**Problem**: Notification appears at bottom instead of top
**Cause**: Incorrect anchorOrigin prop
**Fix**: Use `anchorOrigin={{ vertical: 'top', horizontal: 'center' }}`

---

## References

- **Component Contracts**: See `contracts/component-interfaces.ts` for full TypeScript interfaces
- **Data Model**: See `data-model.md` for state management details
- **Research**: See `research.md` for architectural decisions and alternatives
- **Existing Pattern**: See `src/components/incidents/SeveritySelect.tsx` for reference implementation
