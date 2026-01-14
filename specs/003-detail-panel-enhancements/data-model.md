# Data Model: Detail Panel Enhancements

**Feature Branch**: `003-detail-panel-enhancements`
**Date**: 2026-01-14

## Overview

This feature enhances the incident detail panel with additional editing capabilities and improved layout. The underlying data model remains unchanged; only the form state types require extension.

---

## Existing Entities (No Changes)

### Incident

The `Incident` entity already supports all fields needed for this feature. No schema changes required.

```typescript
// src/api/types.ts - EXISTING, NO CHANGES
interface Incident {
  id: string;                          // Display in header (FR-013)
  title: string;                       // Read-only display
  description: string;                 // Read-only display
  status: IncidentStatus;              // Editable (existing)
  severity: IncidentSeverity;          // Editable (NEW capability)
  assigneeId: string | null;           // Editable (existing)
  createdAt: string;                   // Metadata display
  updatedAt: string;                   // Metadata display
  statusHistory: StatusHistoryEntry[]; // Collapsible section
}
```

### IncidentSeverity

Existing enum, used for severity dropdown options.

```typescript
// src/api/types.ts - EXISTING, NO CHANGES
type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
```

### UpdateIncidentInput

Existing API input type already supports severity updates.

```typescript
// src/api/types.ts - EXISTING, NO CHANGES
interface UpdateIncidentInput {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;    // Already supported
  assigneeId?: string | null;
}
```

---

## Modified Types

### IncidentFormValues

**Location**: `src/types/form.ts`
**Change**: Add `severity` field to track pending severity changes

```typescript
// BEFORE
interface IncidentFormValues {
  status: IncidentStatus;
  assigneeId: string | null;
}

// AFTER
interface IncidentFormValues {
  status: IncidentStatus;
  severity: IncidentSeverity;     // NEW: Track severity changes
  assigneeId: string | null;
}
```

**Validation Rules**:
- `severity` must be one of: "Low", "Medium", "High", "Critical"
- Required field (cannot be null/undefined)
- No state transition restrictions (any severity can change to any other)

**State Transitions**:
- Initial value: `incident.severity` (from server)
- On change: Update local form state
- On save: Include in `UpdateIncidentInput` payload
- On cancel: Revert to original `incident.severity`

---

## Component Props Updates

### IncidentDetailFormProps

**Location**: `src/components/incidents/IncidentDetailForm.tsx`
**Change**: Add severity change handler

```typescript
// BEFORE
interface IncidentDetailFormProps {
  incident: Incident;
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;
  users: User[];
  onStatusChange: (status: IncidentStatus) => void;
  onAssigneeChange: (assigneeId: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

// AFTER
interface IncidentDetailFormProps {
  incident: Incident;
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;
  users: User[];
  onStatusChange: (status: IncidentStatus) => void;
  onSeverityChange: (severity: IncidentSeverity) => void;  // NEW
  onAssigneeChange: (assigneeId: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;                                      // NEW: For cancel-close behavior
}
```

### UseIncidentFormReturn

**Location**: `src/types/form.ts`
**Change**: Add severity setter

```typescript
// BEFORE
interface UseIncidentFormReturn {
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;
  setStatus: (status: IncidentStatus) => void;
  setAssigneeId: (assigneeId: string | null) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}

// AFTER
interface UseIncidentFormReturn {
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;
  setStatus: (status: IncidentStatus) => void;
  setSeverity: (severity: IncidentSeverity) => void;    // NEW
  setAssigneeId: (assigneeId: string | null) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}
```

---

## New Component Types

### SeveritySelectProps

**Location**: `src/components/incidents/SeveritySelect.tsx` (new file)

```typescript
interface SeveritySelectProps {
  /** Current severity value */
  value: IncidentSeverity;

  /** Callback when severity changes */
  onChange: (severity: IncidentSeverity) => void;

  /** Whether the select is disabled (e.g., during save) */
  disabled?: boolean;
}
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Incident Detail Form                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              useIncidentForm Hook                        │   │
│  │                                                          │   │
│  │  originalValues: { status, severity, assigneeId }        │   │
│  │            ↓                                             │   │
│  │  formValues: { status, severity, assigneeId }           │   │
│  │            ↓                                             │   │
│  │  hasChanges = compare(formValues, originalValues)       │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Form Actions                                │   │
│  │                                                          │   │
│  │  setStatus(s)    → formValues.status = s                │   │
│  │  setSeverity(s)  → formValues.severity = s     [NEW]    │   │
│  │  setAssigneeId(a)→ formValues.assigneeId = a            │   │
│  │                                                          │   │
│  │  handleSave()    → API update, originalValues = form    │   │
│  │  handleCancel()  → formValues = originalValues          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Cancel Button Logic                         │   │
│  │                                                          │   │
│  │  if (hasChanges) {                                       │   │
│  │    handleCancel()  // Revert changes                     │   │
│  │  } else {                                                │   │
│  │    onClose()       // Close panel           [NEW]        │   │
│  │  }                                                       │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationships

```
┌─────────────────────┐
│      Incident       │
├─────────────────────┤
│ id: string          │──────┐
│ title: string       │      │
│ description: string │      │
│ status: Status      │      │
│ severity: Severity  │      │  Displayed in
│ assigneeId: string? │      │  Detail Panel
│ createdAt: string   │      │
│ updatedAt: string   │      │
│ statusHistory: []   │──────┘
└─────────────────────┘
         │
         │ Maps to
         ↓
┌─────────────────────┐
│ IncidentFormValues  │
├─────────────────────┤
│ status: Status      │ ← Editable (existing)
│ severity: Severity  │ ← Editable (NEW)
│ assigneeId: string? │ ← Editable (existing)
└─────────────────────┘
         │
         │ Included in
         ↓
┌─────────────────────┐
│ UpdateIncidentInput │
├─────────────────────┤
│ status?: Status     │
│ severity?: Severity │ ← API already supports
│ assigneeId?: string?│
└─────────────────────┘
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| severity | Must be one of: Low, Medium, High, Critical | N/A (enforced by Select options) |
| severity | Required (cannot be empty) | N/A (always has value from incident) |

**Note**: No business rule restrictions on severity transitions (e.g., Critical → Low is allowed per edge case clarification in spec).

---

## Migration Notes

- **No database migration required**: Severity field already exists in Incident entity
- **No API changes required**: UpdateIncidentInput already accepts severity
- **Backward compatible**: Only form state types extended
