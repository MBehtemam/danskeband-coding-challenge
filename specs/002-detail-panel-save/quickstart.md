# Quickstart: Detail Panel with Explicit Save

**Feature**: 002-detail-panel-save | **Date**: 2026-01-14

This guide helps developers quickly understand and work on the detail panel with explicit save feature.

---

## Prerequisites

1. Complete the [001-incident-dashboard](../001-incident-dashboard/quickstart.md) setup
2. Node.js 18+ installed
3. Feature branch checked out: `git checkout 002-detail-panel-save`

## Quick Setup

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm test -- --watch
```

## Feature Overview

This feature replaces the current row expansion pattern with a MUI Drawer-based side panel and changes from auto-save to explicit save.

### Current Behavior (001-incident-dashboard)
- Click incident row → Row expands inline
- Change status/assignee → Saves immediately (auto-save)

### New Behavior (002-detail-panel-save)
- Click incident row → Side drawer opens on right
- Change status/assignee → Updates local state only
- Click Save → Persists all changes
- Click Cancel → Reverts to original values

## Key Files to Understand

### New Components

| File | Purpose |
|------|---------|
| `src/components/incidents/IncidentDrawer.tsx` | Main drawer container component |
| `src/components/incidents/IncidentDetailForm.tsx` | Editable form with Save/Cancel |
| `src/components/common/SaveButton.tsx` | Reusable save button with loading state |

### Modified Components

| File | Changes |
|------|---------|
| `src/components/incidents/IncidentTable.tsx` | Remove row expansion, add drawer trigger |
| `src/components/incidents/StatusSelect.tsx` | Add controlled mode support |
| `src/components/incidents/AssigneeSelect.tsx` | Add controlled mode support |

### New Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useIncidentForm.ts` | Form state management (values, hasChanges, save/cancel) |

### Removed Components

| File | Reason |
|------|--------|
| `src/components/incidents/IncidentDetailPanel.tsx` | Replaced by IncidentDrawer |

## Development Workflow

### 1. TDD Pattern (Required by Constitution)

```typescript
// 1. Write failing test first
it('should display Save button disabled when no changes', () => {
  render(<IncidentDetailForm {...defaultProps} hasChanges={false} />);
  expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
});

// 2. Run test - verify it fails
npm test

// 3. Implement minimal code to pass
const SaveButton = ({ disabled }) => (
  <Button disabled={disabled}>Save</Button>
);

// 4. Run test - verify it passes
npm test

// 5. Refactor if needed, keeping tests green
```

### 2. Component Development Pattern

```typescript
// Example: IncidentDrawer component

interface IncidentDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  users: User[];
}

export function IncidentDrawer({ incident, onClose, users }: IncidentDrawerProps) {
  // Use form hook for state management
  const form = useIncidentForm(incident!);

  if (!incident) return null;

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      sx={{ width: { xs: '100%', md: '33%' } }}
    >
      <IncidentDetailForm
        incident={incident}
        formValues={form.formValues}
        hasChanges={form.hasChanges}
        isSaving={form.isSaving}
        saveError={form.saveError}
        users={users}
        onStatusChange={form.setStatus}
        onAssigneeChange={form.setAssigneeId}
        onSave={form.handleSave}
        onCancel={form.handleCancel}
      />
    </Drawer>
  );
}
```

### 3. Hook Development Pattern

```typescript
// Example: useIncidentForm hook

export function useIncidentForm(incident: Incident): UseIncidentFormReturn {
  const [formValues, setFormValues] = useState<IncidentFormValues>({
    status: incident.status,
    assigneeId: incident.assigneeId,
  });

  const [originalValues] = useState<IncidentFormValues>({
    status: incident.status,
    assigneeId: incident.assigneeId,
  });

  const hasChanges = useMemo(() => {
    return formValues.status !== originalValues.status ||
           formValues.assigneeId !== originalValues.assigneeId;
  }, [formValues, originalValues]);

  const updateIncident = useUpdateIncident();

  const handleSave = async () => {
    await updateIncident.mutateAsync({
      id: incident.id,
      data: {
        status: formValues.status,
        assigneeId: formValues.assigneeId,
      },
    });
  };

  const handleCancel = () => {
    setFormValues(originalValues);
  };

  return {
    formValues,
    hasChanges,
    isSaving: updateIncident.isPending,
    saveError: updateIncident.error,
    setStatus: (status) => setFormValues(prev => ({ ...prev, status })),
    setAssigneeId: (assigneeId) => setFormValues(prev => ({ ...prev, assigneeId })),
    handleSave,
    handleCancel,
  };
}
```

## Testing Guide

### Component Test Example

```typescript
// IncidentDrawer.test.tsx

describe('IncidentDrawer', () => {
  const mockIncident: Incident = {
    id: '1',
    title: 'Test Incident',
    // ... other fields
  };

  const mockUsers: User[] = [
    { id: '1', name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  ];

  it('renders incident details', () => {
    render(
      <IncidentDrawer
        incident={mockIncident}
        onClose={vi.fn()}
        users={mockUsers}
      />
    );

    expect(screen.getByText('Test Incident')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(
      <IncidentDrawer
        incident={mockIncident}
        onClose={onClose}
        users={mockUsers}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

### Hook Test Example

```typescript
// useIncidentForm.test.ts

describe('useIncidentForm', () => {
  it('detects changes when status is modified', () => {
    const { result } = renderHook(() => useIncidentForm(mockIncident));

    expect(result.current.hasChanges).toBe(false);

    act(() => {
      result.current.setStatus('Resolved');
    });

    expect(result.current.hasChanges).toBe(true);
  });

  it('reverts changes on cancel', () => {
    const { result } = renderHook(() => useIncidentForm(mockIncident));

    act(() => {
      result.current.setStatus('Resolved');
    });

    expect(result.current.formValues.status).toBe('Resolved');

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.formValues.status).toBe(mockIncident.status);
    expect(result.current.hasChanges).toBe(false);
  });
});
```

## Responsive Testing

Test at these breakpoints:

| Breakpoint | Width | Expected Drawer Width |
|------------|-------|-----------------------|
| Mobile (xs) | 320px | 100% (full screen) |
| Tablet (sm) | 600px | 400px fixed |
| Desktop (md) | 900px | 33% of screen |

```bash
# Use browser dev tools to test responsive behavior
# Chrome: Cmd+Shift+M (Mac) or Ctrl+Shift+M (Windows)
```

## Accessibility Checklist

- [ ] Drawer can be closed with Escape key
- [ ] Focus moves to drawer when opened
- [ ] Focus returns to trigger when closed
- [ ] Tab navigation works within drawer
- [ ] Save/Cancel buttons have clear labels
- [ ] Loading state announced to screen readers
- [ ] Error messages associated with form

## Common Issues

### Issue: Changes not detected
**Solution**: Ensure `useIncidentForm` is comparing values correctly. Check that the comparison handles `null` assigneeId properly.

### Issue: Form resets on every render
**Solution**: Ensure `useState` initial value is set from `incident` prop only once, not on every render. Use the `incident.id` as a key or use `useEffect` to reset only when incident changes.

### Issue: Drawer doesn't close after save
**Solution**: The parent component should handle closing. After successful save, call `onClose()` from the parent.

## Related Documentation

- [Plan](./plan.md) - Architecture decisions
- [Research](./research.md) - Technical research
- [Data Model](./data-model.md) - TypeScript interfaces
- [Spec](./spec.md) - Requirements and acceptance criteria
