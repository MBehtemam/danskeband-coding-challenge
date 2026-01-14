# Data Model: Detail Panel with Explicit Save

**Feature**: 002-detail-panel-save | **Date**: 2026-01-14

This document defines the data structures, state models, and TypeScript interfaces for the detail panel with explicit save feature.

---

## 1. Existing Entities (Unchanged)

### Incident (from src/api/types.ts)

```typescript
interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assigneeId: string | null;
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
  statusHistory: StatusHistoryEntry[];
}

type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';
type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
```

### User (from src/api/types.ts)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
```

### StatusHistoryEntry (from src/api/types.ts)

```typescript
interface StatusHistoryEntry {
  status: IncidentStatus;
  changedAt: string;      // ISO 8601
  changedBy: string;
}
```

---

## 2. New Entities (Feature-Specific)

### IncidentFormValues

Represents the editable fields in the detail panel form. Tracks local state before save.

```typescript
/**
 * Form values for editing an incident in the detail panel.
 * Only contains fields that can be edited (status, assigneeId).
 */
interface IncidentFormValues {
  /** Current status selection (may differ from saved) */
  status: IncidentStatus;

  /** Current assignee selection (may differ from saved) */
  assigneeId: string | null;
}
```

**Validation Rules**:
- `status`: Must be one of `'Open' | 'In Progress' | 'Resolved'`
- `assigneeId`: Must be a valid user ID or `null` (unassigned)

### IncidentFormState

Extended state object returned by the `useIncidentForm` hook.

```typescript
/**
 * Complete form state including values, change detection, and save state.
 */
interface IncidentFormState {
  /** Current form values */
  formValues: IncidentFormValues;

  /** Original values from the incident (for comparison) */
  originalValues: IncidentFormValues;

  /** True if formValues differ from originalValues */
  hasChanges: boolean;

  /** True while save mutation is in progress */
  isSaving: boolean;

  /** Error from last save attempt, null if none */
  saveError: Error | null;

  /** True if last save was successful */
  saveSuccess: boolean;
}
```

**State Transitions**:

```
Initial Load:
  formValues = originalValues = { status: incident.status, assigneeId: incident.assigneeId }
  hasChanges = false
  isSaving = false
  saveError = null
  saveSuccess = false

User Edits:
  formValues updates
  hasChanges = formValues !== originalValues (deep compare)

Save Started:
  isSaving = true
  saveError = null
  saveSuccess = false

Save Success:
  isSaving = false
  saveSuccess = true
  originalValues = formValues (reset baseline)
  hasChanges = false

Save Error:
  isSaving = false
  saveError = error
  saveSuccess = false
  hasChanges = true (still has unsaved changes)

Cancel:
  formValues = originalValues
  hasChanges = false
  saveError = null
  saveSuccess = false
```

### DrawerState

State for managing the drawer UI component.

```typescript
/**
 * State for the incident detail drawer.
 */
interface DrawerState {
  /** The ID of the currently selected incident, or null if none */
  selectedIncidentId: string | null;

  /** Whether the drawer is open (derived from selectedIncidentId !== null) */
  isOpen: boolean;
}
```

---

## 3. Component Props Interfaces

### IncidentDrawerProps

```typescript
interface IncidentDrawerProps {
  /** The incident to display, or null if none selected */
  incident: Incident | null;

  /** Callback when drawer should close */
  onClose: () => void;

  /** List of users for assignee selection */
  users: User[];
}
```

### IncidentDetailFormProps

```typescript
interface IncidentDetailFormProps {
  /** The incident being edited */
  incident: Incident;

  /** Current form values */
  formValues: IncidentFormValues;

  /** Whether there are unsaved changes */
  hasChanges: boolean;

  /** Whether save is in progress */
  isSaving: boolean;

  /** Error from save operation */
  saveError: Error | null;

  /** Whether save was successful */
  saveSuccess: boolean;

  /** List of users for assignee dropdown */
  users: User[];

  /** Callback when status changes */
  onStatusChange: (status: IncidentStatus) => void;

  /** Callback when assignee changes */
  onAssigneeChange: (assigneeId: string | null) => void;

  /** Callback when Save button is clicked */
  onSave: () => void;

  /** Callback when Cancel button is clicked */
  onCancel: () => void;
}
```

### StatusSelectProps (Updated)

```typescript
/**
 * Props for StatusSelect component.
 * Supports both controlled mode (for detail panel) and auto-save mode (legacy).
 */
interface StatusSelectProps {
  /** Current status value */
  value: IncidentStatus;

  /** Callback when status changes (controlled mode) */
  onChange: (status: IncidentStatus) => void;

  /** Whether the select is disabled */
  disabled?: boolean;

  /** Accessible label for the select */
  'aria-label'?: string;
}
```

### AssigneeSelectProps (Updated)

```typescript
/**
 * Props for AssigneeSelect component.
 * Supports both controlled mode (for detail panel) and auto-save mode (legacy).
 */
interface AssigneeSelectProps {
  /** Current assignee ID value */
  value: string | null;

  /** Callback when assignee changes (controlled mode) */
  onChange: (assigneeId: string | null) => void;

  /** List of available users */
  users: User[];

  /** Whether the select is disabled */
  disabled?: boolean;

  /** Accessible label for the select */
  'aria-label'?: string;
}
```

### SaveButtonProps

```typescript
interface SaveButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;

  /** Whether button is disabled (no changes or saving) */
  disabled: boolean;

  /** Whether save operation is in progress */
  loading: boolean;

  /** Button text (default: "Save") */
  children?: React.ReactNode;
}
```

---

## 4. Hook Return Types

### UseIncidentFormReturn

```typescript
interface UseIncidentFormReturn {
  // State
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;

  // Setters
  setStatus: (status: IncidentStatus) => void;
  setAssigneeId: (assigneeId: string | null) => void;

  // Actions
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}

/**
 * Hook signature
 */
function useIncidentForm(incident: Incident): UseIncidentFormReturn;
```

---

## 5. API Request/Response (Existing - No Changes)

### Update Incident Request (PATCH /api/incidents/:id)

```typescript
interface UpdateIncidentInput {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assigneeId?: string | null;
}
```

### Update Incident Response

```typescript
// Returns the updated Incident object
type UpdateIncidentResponse = Incident;
```

---

## 6. Entity Relationships

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Incident  │      │ IncidentFormState│      │    User     │
├─────────────┤      ├──────────────────┤      ├─────────────┤
│ id          │──┐   │ formValues       │      │ id          │
│ title       │  │   │ originalValues   │      │ name        │
│ description │  │   │ hasChanges       │      │ email       │
│ status      │  │   │ isSaving         │      │ role        │
│ severity    │  │   │ saveError        │      └─────────────┘
│ assigneeId ─┼──┼──▶│ saveSuccess      │            │
│ createdAt   │  │   └──────────────────┘            │
│ updatedAt   │  │                                   │
│ statusHistory│ │   ┌──────────────────┐            │
└─────────────┘  │   │ IncidentFormValues│            │
                 │   ├──────────────────┤            │
                 │   │ status           │            │
                 │   │ assigneeId ──────┼────────────┘
                 │   └──────────────────┘
                 │
                 │   ┌──────────────────┐
                 └──▶│ StatusHistoryEntry│
                     ├──────────────────┤
                     │ status           │
                     │ changedAt        │
                     │ changedBy        │
                     └──────────────────┘
```

---

## 7. Type File Location

New types should be added to:
- **`src/types/form.ts`** (new file) - Form-related interfaces
- Or added directly in component/hook files if only used locally

Existing types remain in:
- **`src/api/types.ts`** - API/entity types (Incident, User, etc.)
