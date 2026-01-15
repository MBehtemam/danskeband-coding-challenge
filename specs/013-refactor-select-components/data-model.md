# Data Model: Refactor Select Components and Improve Form UX

**Date**: 2026-01-15
**Feature**: 013-refactor-select-components

## Overview

This feature involves refactoring existing components to change their data flow and state management patterns. No new entities are created; instead, we're modifying how existing entities are passed through the component hierarchy.

## Core Entities

### 1. IncidentFormValues

**Description**: Local form state maintained during incident editing, separate from persisted server state.

**Source**: Already defined in `src/types/form.ts`

**Fields**:
- `status: IncidentStatus` - Current status value in form
- `severity: IncidentSeverity` - Current severity value in form
- `assigneeId: string | null` - Current assignee ID in form (null = unassigned)

**Lifecycle**:
1. **Initialization**: Created from incident data when DetailPanel opens
2. **Updates**: Modified locally when user changes select components
3. **Persistence**: Sent to API only when user clicks Save button
4. **Revert**: Reset to original values when user clicks Cancel

**State Transitions**:
```
Initial (from server) → Editing (local changes) → Saving (API call) → Saved (synced)
                              ↓
                         Cancelled → Reset to Initial
                              ↓
                         Error → Preserved for Retry
```

**Validation Rules**: None - all values are pre-validated (status/severity from dropdown, assigneeId from user list)

---

### 2. Select Component Props (Refactored Pattern)

**Description**: Standardized prop interface for all select components (StatusSelect, AssigneeSelect, SeveritySelect).

#### StatusSelectProps

**Fields**:
- `value: IncidentStatus` - Currently selected status ('Open' | 'In Progress' | 'Resolved')
- `onChange: (status: IncidentStatus) => void` - Callback when selection changes
- `disabled?: boolean` - Whether select is disabled (default: false), used during save operations
- `fullWidth?: boolean` - Whether select takes full container width (default: false)

**Relationships**:
- Parent component (IncidentDetailForm or CreateIncidentDialog) owns the state
- Component notifies parent of changes via onChange callback
- Component receives current value from parent via value prop

**Before Refactoring**:
```typescript
interface StatusSelectProps {
  incidentId: string;              // ❌ Remove - component shouldn't know incident ID
  currentStatus: IncidentStatus;   // ❌ Rename to 'value'
  onSuccess?: () => void;          // ❌ Remove - component shouldn't handle API success
}
```

**After Refactoring**:
```typescript
interface StatusSelectProps {
  value: IncidentStatus;           // ✅ Controlled component pattern
  onChange: (status: IncidentStatus) => void;  // ✅ Simple callback
  disabled?: boolean;              // ✅ For loading states
  fullWidth?: boolean;             // ✅ Layout flexibility
}
```

#### AssigneeSelectProps

**Fields**:
- `value: string | null` - Currently selected assignee ID (null = unassigned)
- `onChange: (assigneeId: string | null) => void` - Callback when selection changes
- `disabled?: boolean` - Whether select is disabled (default: false)
- `fullWidth?: boolean` - Whether select takes full container width (default: false)
- `users: User[]` - List of available users for dropdown options

**Relationships**:
- Requires users array to populate dropdown options
- Supports null value for "Unassigned" state
- Parent manages actual user data fetching

**Before Refactoring**:
```typescript
interface AssigneeSelectProps {
  incidentId: string;              // ❌ Remove
  currentAssigneeId: string | null; // ❌ Rename to 'value'
  onSuccess?: () => void;          // ❌ Remove
  // users fetched internally with useUsers hook  // ❌ Move to parent
}
```

**After Refactoring**:
```typescript
interface AssigneeSelectProps {
  value: string | null;            // ✅ Controlled component pattern
  onChange: (assigneeId: string | null) => void;  // ✅ Simple callback
  disabled?: boolean;              // ✅ For loading states
  fullWidth?: boolean;             // ✅ Layout flexibility
  users: User[];                   // ✅ Explicit dependency injection
}
```

#### SeveritySelectProps (Reference - No Changes)

**Fields**:
- `value: IncidentSeverity` - Currently selected severity
- `onChange: (severity: IncidentSeverity) => void` - Callback when selection changes
- `disabled?: boolean` - Whether select is disabled
- `fullWidth?: boolean` - Whether select takes full container width

**Status**: Already follows correct pattern - used as reference for refactoring other selects.

---

### 3. Form State Management (useIncidentForm Hook)

**Description**: Custom React hook managing local form state, change tracking, and save/cancel operations.

**Source**: Already implemented in `src/hooks/useIncidentForm.ts`

**State Variables**:
- `originalValues: IncidentFormValues` - Values from server (reset point for Cancel)
- `formValues: IncidentFormValues` - Current local form values (with user edits)
- `saveSuccess: boolean` - Whether last save succeeded (for success notification)
- `saveError: Error | null` - Error from last save attempt (for error alert)

**Computed Values**:
- `hasChanges: boolean` - True if formValues ≠ originalValues
- `isSaving: boolean` - True if API call in progress (from updateIncident.isPending)

**Actions**:
- `setStatus(status)` - Update local status value
- `setSeverity(severity)` - Update local severity value
- `setAssigneeId(assigneeId)` - Update local assignee ID value
- `handleSave()` - Persist all changes to server via API
- `handleCancel()` - Discard changes and revert to originalValues

**State Transitions**:
```
No Changes (hasChanges=false):
  - Save button disabled
  - Cancel button closes panel

Has Changes (hasChanges=true):
  - Save button enabled
  - Cancel button reverts changes

Saving (isSaving=true):
  - All form fields disabled
  - Save button shows loading spinner
  - Cancel button disabled

Save Success:
  - originalValues updated to current formValues
  - saveSuccess=true for 5 seconds (notification shown)
  - hasChanges becomes false

Save Error:
  - formValues preserved (user can retry without re-entering)
  - saveError set with error details
  - hasChanges remains true
  - Save button re-enabled for retry
```

**No Changes Required**: Hook already implements correct pattern for explicit save.

---

### 4. Notification State

**Description**: Transient UI state for displaying success and error feedback.

#### Success Notification (Snackbar)

**Trigger**: `saveSuccess` state becomes true after successful save
**Display**: Top-center of viewport
**Duration**: 5 seconds auto-dismiss
**Content**: "Changes saved successfully" with success icon
**Styling**: Material UI Alert with severity="success", variant="filled"

**Implementation**:
```typescript
<Snackbar
  open={saveSuccess}
  autoHideDuration={5000}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  onClose={() => setSaveSuccess(false)}
>
  <Alert severity="success" variant="filled">
    Changes saved successfully
  </Alert>
</Snackbar>
```

#### Error Alert (Inline)

**Trigger**: `saveError` state is non-null after failed save
**Display**: Top of form content area (before form fields)
**Duration**: Persistent until cleared (user must cancel or retry)
**Content**: Descriptive error message from API response
**Styling**: Material UI Alert with severity="error", role="alert"

**Implementation**:
```typescript
{saveError && (
  <Alert severity="error" sx={{ mb: 2 }} role="alert">
    {saveError.message || 'Failed to save changes'}
  </Alert>
)}
```

**Clearing Conditions**:
- User clicks Cancel (handleCancel clears saveError)
- User successfully saves (handleSave clears saveError before API call)

---

## Component Data Flow

### DetailPanel Flow (Explicit Save Pattern)

```
Incident (server data)
    ↓
useIncidentForm(incident)
    ↓
┌─────────────────────────────────┐
│ Local State (formValues)        │
│  - status                        │
│  - severity                      │
│  - assigneeId                    │
└─────────────────────────────────┘
    ↓                    ↓                    ↓
StatusSelect        SeveritySelect      AssigneeSelect
  value={formValues.status}    value={formValues.severity}    value={formValues.assigneeId}
  onChange={setStatus}         onChange={setSeverity}         onChange={setAssigneeId}
  disabled={isSaving}          disabled={isSaving}            disabled={isSaving}
    ↓                    ↓                    ↓
User changes select → Local state updates → hasChanges=true
                                                ↓
                                        User clicks Save
                                                ↓
                                        handleSave() → API call
                                                ↓
                                    ┌───────────┴───────────┐
                                    ↓                       ↓
                            Success                     Error
                                    ↓                       ↓
                    - originalValues updated    - formValues preserved
                    - saveSuccess=true          - saveError set
                    - Snackbar shown           - Alert shown
                    - Auto-dismiss 5s          - User must retry/cancel
```

### CreateIncidentDialog Flow (Form Submission Pattern)

```
User opens dialog
    ↓
┌─────────────────────────────────┐
│ Local Form State                │
│  - title                         │
│  - description                   │
│  - status (default: 'Open')     │
│  - severity (default: 'Medium') │
│  - assigneeId (default: null)   │
└─────────────────────────────────┘
    ↓                    ↓                    ↓
StatusSelect        SeveritySelect      AssigneeSelect
  value={status}          value={severity}          value={assigneeId}
  onChange={setStatus}    onChange={setSeverity}    onChange={setAssigneeId}
  disabled={isCreating}   disabled={isCreating}     disabled={isCreating}
    ↓                    ↓                    ↓
User fills form → Local state updates
                        ↓
                User clicks Create
                        ↓
            Validate → Create API call
                        ↓
            ┌───────────┴───────────┐
            ↓                       ↓
        Success                 Error
            ↓                       ↓
    - Dialog closes         - Error alert shown
    - Form resets          - Form preserved
    - List refreshes       - User can retry
```

---

## Validation Rules

### Select Components
**No Validation Required**: All options are pre-validated (from enums or user list).

### Form Submission
**DetailPanel**:
- At least one field must change (hasChanges=true) before save enabled
- No empty value validation needed (all fields already have valid values from incident)

**CreateIncidentDialog**:
- Title required, max 200 characters (already implemented)
- Description optional, max 2000 characters (already implemented)
- Status, severity, assigneeId have valid defaults (no validation needed)

---

## State Persistence

### Local Storage
**Not Applicable**: Form state is ephemeral. Changes only persist to localStorage via API call when Save succeeds.

### API Persistence
**Update Flow** (DetailPanel):
```
PATCH /api/incidents/:id
Body: { status?, severity?, assigneeId? }
Response: Updated Incident object
Effect: TanStack Query cache invalidated, UI re-fetches incident data
```

**Create Flow** (CreateIncidentDialog):
```
POST /api/incidents
Body: { title, description, severity, assigneeId, status: 'Open' }
Response: Created Incident object
Effect: TanStack Query cache invalidated, incident list refreshed
```

---

## Migration Notes

### Breaking Changes
**None**: This is an internal refactoring. External API and data persistence patterns unchanged.

### Component API Changes (Internal Only)

**StatusSelect**:
- Old: `<StatusSelect incidentId={id} currentStatus={status} onSuccess={fn} />`
- New: `<StatusSelect value={status} onChange={setStatus} disabled={isSaving} />`

**AssigneeSelect**:
- Old: `<AssigneeSelect incidentId={id} currentAssigneeId={assigneeId} onSuccess={fn} />`
- New: `<AssigneeSelect value={assigneeId} onChange={setAssigneeId} users={users} disabled={isSaving} />`

### Behavior Changes
**DetailPanel**:
- **Before**: Select changes trigger immediate API calls (auto-save)
- **After**: Select changes update local state only; explicit Save button triggers API call
- **User Impact**: Users can now change multiple fields before saving once

**CreateIncidentDialog**:
- **Before**: Custom select dropdowns (not using reusable components)
- **After**: Uses refactored StatusSelect and AssigneeSelect components
- **User Impact**: No behavior change, improved consistency across UI
