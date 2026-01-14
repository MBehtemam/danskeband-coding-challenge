# Research: Detail Panel with Explicit Save

**Feature**: 002-detail-panel-save | **Date**: 2026-01-14

This document captures research findings and decisions for implementing the detail panel with explicit save functionality.

---

## 1. MUI Drawer Component Patterns

### Decision: Use MUI Drawer with `anchor="right"` and `variant="persistent"`

**Rationale**:
- MUI Drawer is already included in the project dependencies (@mui/material v7.3.7)
- `variant="persistent"` allows the drawer to push/overlay content rather than fully covering it
- `anchor="right"` aligns with standard detail panel UX patterns (list on left, detail on right)
- Built-in accessibility support (focus trap, escape key handling, ARIA attributes)

**Alternatives Considered**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| MUI Drawer (persistent) | Native to stack, accessible, responsive | Need to manage width manually | ✅ Selected |
| MUI Drawer (temporary) | Simple modal overlay | Covers entire content on mobile | Rejected - spec requires list context visible on desktop |
| Custom side panel | Full control | Extra development, accessibility burden | Rejected - unnecessary complexity |
| Dialog/Modal | Centered focus | Doesn't fit "side panel" UX requirement | Rejected - spec explicitly requires side panel |

**Implementation Pattern**:
```typescript
<Drawer
  anchor="right"
  variant="persistent"
  open={selectedIncidentId !== null}
  sx={{
    width: { xs: '100%', sm: '50%', md: '33%' },
    '& .MuiDrawer-paper': {
      width: { xs: '100%', sm: '50%', md: '33%' },
    },
  }}
>
  {/* Content */}
</Drawer>
```

---

## 2. Form State Management Approach

### Decision: Custom `useIncidentForm` hook with React useState

**Rationale**:
- TanStack Form is available but adds complexity for a simple two-field form
- The form only needs to manage status and assignee - two simple fields
- useState provides sufficient capabilities for tracking original vs. current values
- Simpler testing and debugging compared to form library abstractions

**Alternatives Considered**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Custom useState hook | Simple, testable, minimal abstraction | Manual change tracking | ✅ Selected |
| TanStack Form | Already in project, validation built-in | Overkill for 2 fields | Rejected - unnecessary complexity |
| React Hook Form | Popular, performant | New dependency, overkill | Rejected - new dependency |
| Formik | Feature-rich | New dependency, heavyweight | Rejected - new dependency |

**Hook Interface Design**:
```typescript
interface UseIncidentFormReturn {
  // State
  formValues: { status: IncidentStatus; assigneeId: string | null };
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;

  // Actions
  setStatus: (status: IncidentStatus) => void;
  setAssigneeId: (assigneeId: string | null) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}
```

---

## 3. Controlled Component Pattern for StatusSelect/AssigneeSelect

### Decision: Add `mode` prop to support both auto-save and controlled modes

**Rationale**:
- Current components work with auto-save pattern (call mutation on change)
- New feature requires controlled mode (just update local state, no mutation)
- Adding a mode prop allows backward compatibility if needed
- Single component with clear interface is better than duplicating components

**Alternatives Considered**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Add mode prop | Single component, backward compatible | Slightly more complex props | ✅ Selected |
| Create new controlled components | Clean separation | Code duplication | Rejected - unnecessary duplication |
| Remove auto-save entirely | Simplest | Breaking change to other potential usages | Rejected - may break if used elsewhere |

**Interface Pattern**:
```typescript
// Original (auto-save mode)
<StatusSelect incidentId={id} currentStatus={status} />

// New (controlled mode)
<StatusSelect
  value={formValues.status}
  onChange={(status) => setStatus(status)}
  disabled={isSaving}
/>
```

---

## 4. URL State and Deep Linking

### Decision: Use URL parameter for selected incident ID

**Rationale**:
- Current implementation already uses `/incidents/:incidentId` route pattern
- Preserves filter state in URL search params
- Enables sharing links directly to incident detail view
- Browser back/forward navigation works naturally

**Alternatives Considered**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| URL route param | Deep linking, shareable, native nav | URL changes on selection | ✅ Selected (already implemented) |
| URL search param | Simpler for optional state | Different from current pattern | Rejected - maintain consistency |
| Local state only | Simplest | No deep linking | Rejected - spec requires deep linking |

**Current Pattern (maintained)**:
```typescript
// Open detail
navigate(`/incidents/${rowId}${window.location.search}`, { replace: true });

// Close detail (preserve filters)
navigate('/' + window.location.search, { replace: true });
```

---

## 5. Save Operation and Error Handling

### Decision: Use existing `useUpdateIncident` mutation with local error state

**Rationale**:
- The existing `useUpdateIncident` hook handles optimistic updates and rollback
- Error state can be surfaced to the form for display
- Retry is built into the mutation flow
- No new API endpoints needed - existing PATCH handles status + assigneeId

**Implementation Pattern**:
```typescript
const handleSave = async () => {
  try {
    await updateIncident.mutateAsync({
      id: incident.id,
      data: {
        status: formValues.status,
        assigneeId: formValues.assigneeId,
      },
    });
    // Success - reset form to new values
    resetForm();
  } catch (error) {
    // Error state managed by mutation, display in UI
    // User can retry
  }
};
```

---

## 6. Accessibility Implementation

### Decision: Follow WAI-ARIA dialog/drawer patterns with focus management

**Rationale**:
- MUI Drawer provides baseline ARIA attributes
- Need to add focus management when drawer opens (focus first interactive element)
- Need to trap focus within drawer when open
- Escape key should close drawer (built-in to MUI Drawer)

**Key Accessibility Requirements**:

| Requirement | Implementation |
|-------------|----------------|
| Focus trap | MUI Drawer handles automatically |
| Escape to close | MUI Drawer handles automatically |
| Focus on open | Auto-focus first interactive element (Close button) |
| Screen reader announcement | `aria-labelledby` pointing to drawer title |
| Button states | `aria-disabled` for Save when no changes |
| Loading state | `aria-busy` during save operation |

---

## 7. Responsive Design Strategy

### Decision: Use MUI breakpoint system with drawer width variants

**Rationale**:
- Project already uses MUI breakpoints consistently
- Drawer should adapt: full-width mobile, partial overlay on larger screens
- List context should remain visible on desktop (spec requirement)

**Breakpoint Implementation**:
```typescript
// MUI theme breakpoints (existing)
// xs: 0px, sm: 600px, md: 900px, lg: 1200px, xl: 1536px

const drawerWidth = {
  xs: '100%',     // Mobile: full width overlay
  sm: '400px',    // Tablet: fixed width
  md: '33%',      // Desktop: percentage
};
```

---

## 8. Discarding Changes on Incident Switch

### Decision: Silently discard unsaved changes when selecting different incident

**Rationale**:
- Spec explicitly states: "Discard changes silently and load the new incident (for MVP simplicity)"
- Adding confirmation dialog is explicitly out of scope
- Simplifies implementation and reduces complexity
- Can be enhanced in future iteration

**Implementation**:
```typescript
// When selectedIncidentId changes, form resets to new incident values
useEffect(() => {
  if (incident) {
    setFormValues({
      status: incident.status,
      assigneeId: incident.assigneeId,
    });
  }
}, [incident.id]); // Reset when incident changes
```

---

## Summary of Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| Panel Component | MUI Drawer (persistent, right) | Native to stack, accessible |
| Form State | Custom useState hook | Simple, 2 fields only |
| Select Components | Add mode prop | Backward compatible, no duplication |
| URL State | Maintain existing pattern | Already works, supports deep linking |
| Save Operation | Existing useUpdateIncident | PATCH endpoint ready, optimistic updates |
| Accessibility | MUI Drawer defaults + focus management | Built-in ARIA support |
| Responsive | MUI breakpoint system | Consistent with project |
| Unsaved Changes | Silent discard on switch | Per spec, MVP simplicity |

---

## No Remaining NEEDS CLARIFICATION Items

All technical decisions have been made based on:
1. Existing codebase patterns
2. Available dependencies
3. Spec requirements
4. Constitution principles
