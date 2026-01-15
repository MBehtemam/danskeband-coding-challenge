# Research: Refactor Select Components and Improve Form UX

**Date**: 2026-01-15
**Feature**: 013-refactor-select-components

## Research Questions

### Q1: How should StatusSelect and AssigneeSelect be refactored to follow the SeveritySelect pattern?

**Decision**: Adopt controlled component pattern with value/onChange props, removing internal state and API calls.

**Rationale**:
- **Current State**: StatusSelect and AssigneeSelect call `useUpdateIncident` directly, implementing auto-save behavior with internal state management
- **Target Pattern**: SeveritySelect uses controlled component pattern (lines 19-31 in SeveritySelect.tsx):
  - Accepts `value` prop for current selection
  - Accepts `onChange` callback to notify parent of changes
  - Accepts `disabled` prop for loading states
  - Accepts `fullWidth` prop for layout flexibility
  - No internal state, no API calls - purely presentational
- **Benefits**:
  1. **Reusability**: Components can be used in both DetailPanel (explicit save) and CreateIncidentDialog (form submission)
  2. **Separation of Concerns**: Select components handle UI only, parent components handle business logic
  3. **Testability**: Easier to test without mocking API hooks
  4. **Consistency**: All three select components follow the same pattern

**Implementation Approach**:
1. Remove `useUpdateIncident` hook imports from StatusSelect and AssigneeSelect
2. Remove internal state (`useState` for status/assigneeId)
3. Replace props interface:
   - Remove: `incidentId`, `currentStatus`/`currentAssigneeId`, `onSuccess`
   - Add: `value`, `onChange`, `disabled`, `fullWidth`
4. Simplify onChange handler to just call parent's onChange callback
5. Update parent components (IncidentDetailForm, CreateIncidentDialog) to manage state and API calls

**Alternatives Considered**:
- **Keep auto-save in DetailPanel**: Rejected because spec explicitly requires explicit Save button (FR-005)
- **Create wrapper components**: Rejected as it adds unnecessary complexity; parent components already manage state via useIncidentForm hook

---

### Q2: How should success notifications be positioned at top-center with 5-second auto-dismiss?

**Decision**: Update Snackbar component's anchorOrigin prop and autoHideDuration to match requirements.

**Rationale**:
- **Current State**: IncidentDetailForm.tsx:263-271 shows success Snackbar positioned at `bottom-center` with 3-second auto-dismiss
- **Required Change**: Spec (FR-006, FR-007) requires top-center positioning with 5-second auto-dismiss
- **Material UI Support**: Snackbar component supports this configuration natively:
  ```tsx
  <Snackbar
    open={saveSuccess}
    autoHideDuration={5000}  // Change from 3000
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Change from bottom
  >
  ```

**Implementation Details**:
- Update `autoHideDuration` from 3000ms to 5000ms
- Update `anchorOrigin.vertical` from 'bottom' to 'top'
- Maintain Alert severity="success" with variant="filled" for visual prominence

**Alternatives Considered**:
- **Custom toast library**: Rejected - Material UI Snackbar already meets all requirements
- **Portal-based notification system**: Rejected - unnecessary complexity for simple success messages

---

### Q3: How should error alerts be displayed inline at the top of forms?

**Decision**: Use Material UI Alert component with severity="error", positioned at top of form content area.

**Rationale**:
- **Current State**:
  - IncidentDetailForm.tsx:238-242 shows error Alert in footer (next to buttons)
  - CreateIncidentDialog.tsx:100-104 already has error Alert at top of dialog content
- **Required Change**: Spec (FR-008, FR-009) requires error alerts at top of form
- **Best Practices**:
  1. Errors should be visible before action buttons (accessibility)
  2. Errors should appear at top of scrollable content area (users see immediately)
  3. Errors should be persistent (not auto-dismiss) until resolved (WCAG 2.1)

**Implementation Details**:
- Move error Alert from IncidentDetailForm footer to top of form content (after header, before fields)
- Maintain CreateIncidentDialog's existing error Alert position (already correct)
- Error Alert should:
  - Display descriptive error message from API (FR-010)
  - Remain visible until user successfully saves or cancels (FR-011)
  - Be programmatically associated with form via aria-describedby
  - Clear when user clicks Cancel or makes successful save

**Material UI Pattern**:
```tsx
<Box sx={{ p: 2 }}>
  {saveError && (
    <Alert severity="error" sx={{ mb: 2 }} role="alert">
      {saveError.message || 'Failed to save changes'}
    </Alert>
  )}
  {/* Form fields below */}
</Box>
```

**Alternatives Considered**:
- **Field-level error messages**: Not applicable - these are server/API errors, not validation errors
- **Modal error dialog**: Rejected - interrupts user flow; inline errors are less disruptive

---

### Q4: What testing strategy should be used for refactored components?

**Decision**: Follow existing test patterns with React Testing Library, focusing on component contracts and user interactions.

**Rationale**:
- **Existing Patterns**: SeveritySelect.test.tsx demonstrates the testing approach:
  - Test component renders with correct initial value
  - Test onChange callback fires with correct arguments
  - Test disabled state prevents interaction
  - Use `screen.getByRole` for accessibility-focused queries
- **TDD Requirement**: Constitution Principle I requires tests written before implementation

**Test Strategy**:

1. **StatusSelect.test.tsx** (new):
   ```typescript
   - renders with correct status value
   - calls onChange when status changes
   - respects disabled prop
   - displays all status options
   - renders StatusChip in selected value
   ```

2. **AssigneeSelect.test.tsx** (new):
   ```typescript
   - renders with correct assignee value
   - renders "Unassigned" when value is null
   - calls onChange when assignee changes
   - respects disabled prop
   - displays all user options from users prop
   ```

3. **IncidentDetailForm.test.tsx** (update):
   ```typescript
   - displays error alert at top when saveError prop is set
   - clears error alert when user clicks Cancel
   - displays success Snackbar at top-center
   - auto-dismisses success Snackbar after 5 seconds
   - disables form fields during save (isSaving=true)
   - disables Save button when no changes (hasChanges=false)
   ```

4. **Integration Test** (new):
   ```typescript
   - complete save flow: change -> click Save -> success notification
   - error recovery flow: change -> click Save -> error -> fix -> retry
   - multiple field changes before single save
   ```

**Alternatives Considered**:
- **Snapshot testing**: Not recommended for this refactoring - too brittle for component changes
- **E2E tests**: Out of scope - integration tests sufficient for this feature

---

### Q5: How should the explicit Save button pattern work with disabled state and loading indicator?

**Decision**: Reuse existing SaveButton component, control via hasChanges and isSaving props.

**Rationale**:
- **Current State**: IncidentDetailForm.tsx:255-259 already uses SaveButton component with proper props
- **SaveButton Component**: Located at src/components/common/SaveButton.tsx (referenced in imports)
- **Props Pattern**:
  - `disabled={!hasChanges}` - prevents save when no changes (FR-014)
  - `loading={isSaving}` - shows spinner during API call (FR-015)
  - `onClick={onSave}` - triggers save handler

**Implementation Status**: Already implemented correctly in IncidentDetailForm. No changes needed to Save button logic.

**Form Field Disabling**: All select components should accept `disabled={isSaving}` prop to prevent interaction during save (FR-012).

**Alternatives Considered**:
- **Custom save button with more states**: Rejected - existing SaveButton already handles required states
- **Optimistic updates**: Rejected - spec requires explicit save, not auto-save or optimistic patterns

---

### Q6: How should useIncidentForm hook be used with refactored select components?

**Decision**: No changes needed to useIncidentForm hook - it already implements explicit save pattern correctly.

**Rationale**:
- **Current Implementation**: useIncidentForm.ts already provides:
  - Local form state separate from server state (lines 12-23)
  - Change tracking via hasChanges computed property (lines 48-54)
  - Explicit save handler that calls API (lines 75-96)
  - Cancel handler that reverts to original values (lines 99-103)
  - Separate error and success state management (lines 26-29)
- **Integration**: IncidentDrawer.tsx shows correct pattern:
  - Create form instance: `const form = useIncidentForm(incident)`
  - Pass setters to select components: `onStatusChange={form.setStatus}`
  - Pass state to form: `formValues={form.formValues}`, `hasChanges={form.hasChanges}`, etc.

**Refactored Flow**:
1. User changes StatusSelect → `form.setStatus(newStatus)` → updates local state only
2. User changes AssigneeSelect → `form.setAssigneeId(newId)` → updates local state only
3. User clicks Save → `form.handleSave()` → calls API with all changes
4. On success → success notification shown, originalValues updated
5. On error → error alert shown, local values preserved for retry

**No Research Required**: Hook already supports the required pattern.

---

## Summary of Findings

### Key Decisions
1. **Component Pattern**: Adopt controlled component pattern (value/onChange) for all select components
2. **Notification Position**: Top-center with 5-second auto-dismiss
3. **Error Display**: Inline Alert at top of form content area
4. **Testing**: TDD with React Testing Library, following existing patterns
5. **Save Pattern**: Reuse existing useIncidentForm hook and SaveButton component

### No Additional Dependencies Required
All requirements can be met with existing Material UI components and patterns.

### Risk Assessment
**Low Risk**:
- Refactoring follows established patterns (SeveritySelect as reference)
- useIncidentForm hook already implements explicit save logic
- Material UI components already support required positioning and timing
- No breaking changes to public APIs (internal component refactoring only)

### Next Steps (Phase 1)
1. Document data model (form state, component props interfaces)
2. Generate component contracts (prop type definitions)
3. Create quickstart guide for explicit save pattern usage
