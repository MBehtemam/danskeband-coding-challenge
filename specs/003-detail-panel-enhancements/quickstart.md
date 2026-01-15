# Quickstart: Detail Panel Enhancements

**Feature Branch**: `003-detail-panel-enhancements`
**Date**: 2026-01-14

## Overview

This feature enhances the incident detail panel with:
1. Editable severity dropdown (replacing read-only chip)
2. Improved layout with logical section grouping
3. Collapsible status history section
4. Dual-purpose Cancel button (close or revert)
5. Visible incident ID in header

## Prerequisites

- Node.js 18+
- npm installed
- Project dependencies installed (`npm install`)

## Quick Commands

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## Development Workflow

### 1. Start Development

```bash
# Ensure you're on the feature branch
git checkout 003-detail-panel-enhancements

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 2. Test-First Development

Following the constitution's TDD requirement:

```bash
# Run tests in watch mode during development
npm test -- --watch

# Run specific test file
npm test -- src/components/incidents/SeveritySelect.test.tsx

# Run tests with coverage
npm test -- --coverage
```

### 3. Key Files to Modify

| File | Changes |
|------|---------|
| `src/types/form.ts` | Add `severity` to `IncidentFormValues` |
| `src/hooks/useIncidentForm.ts` | Add severity state management |
| `src/components/incidents/SeveritySelect.tsx` | NEW: Severity dropdown component |
| `src/components/incidents/IncidentDetailForm.tsx` | Layout restructure, severity integration |
| `src/components/incidents/IncidentDrawer.tsx` | Pass `onClose` to form |

### 4. Component Development Order

Recommended implementation sequence:

1. **Types first**: Update `IncidentFormValues` in `src/types/form.ts`
2. **Hook update**: Add `setSeverity` to `useIncidentForm`
3. **SeveritySelect**: Create new component with tests
4. **Form updates**: Integrate severity, add layout sections
5. **Cancel behavior**: Implement close-when-no-changes
6. **Incident ID**: Add to header display
7. **Collapsible history**: Wrap in Accordion

## Testing Strategy

### Unit Tests Required

```
src/components/incidents/SeveritySelect.test.tsx       # NEW
src/components/incidents/IncidentDetailForm.test.tsx   # UPDATE
src/hooks/useIncidentForm.test.ts                      # UPDATE
```

### Test Scenarios

**Severity Editing (FR-001 to FR-005)**:
- Renders severity as dropdown (not chip)
- Shows all 4 severity options
- Selecting severity enables Save button
- Saving persists new severity
- Cancel reverts severity to original

**Cancel Button (FR-010 to FR-012)**:
- Closes panel when no unsaved changes
- Reverts changes when unsaved changes exist
- Never disabled (except during save)

**Layout (FR-006 to FR-009)**:
- Sections render in correct order
- Status history is collapsible
- Responsive at mobile breakpoints

**Incident ID (FR-013, FR-014)**:
- ID displays in header area
- ID is selectable for copying

## Key Implementation Notes

### Severity State Management

```typescript
// In useIncidentForm.ts
const [formValues, setFormValues] = useState<IncidentFormValues>(() => ({
  status: incident.status,
  severity: incident.severity,  // NEW
  assigneeId: incident.assigneeId,
}));

const setSeverity = useCallback((severity: IncidentSeverity) => {
  setFormValues((prev) => ({ ...prev, severity }));
  setSaveSuccess(false);
}, []);

// In handleSave
await updateIncident.mutateAsync({
  id: incident.id,
  data: {
    status: formValues.status,
    severity: formValues.severity,  // Include in payload
    assigneeId: formValues.assigneeId,
  },
});
```

### Cancel Button Dual Behavior

```tsx
// In IncidentDetailForm.tsx
const handleCancelClick = () => {
  if (hasChanges) {
    onCancel();  // Revert changes
  } else {
    onClose();   // Close panel
  }
};

<Button
  variant="outlined"
  onClick={handleCancelClick}
  disabled={isSaving}
  aria-label={hasChanges ? "Cancel changes" : "Close panel"}
>
  Cancel
</Button>
```

### Collapsible History

```tsx
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

<Accordion
  defaultExpanded
  slotProps={{ transition: { unmountOnExit: true } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="status-history-content"
    id="status-history-header"
  >
    <Typography variant="subtitle2">Status History</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <StatusHistoryTimeline history={incident.statusHistory} />
  </AccordionDetails>
</Accordion>
```

## Acceptance Criteria Checklist

Before marking complete, verify:

- [ ] Severity displays as editable dropdown
- [ ] All 4 severity options available
- [ ] Severity changes tracked as unsaved
- [ ] Save includes severity in payload
- [ ] Cancel reverts severity changes
- [ ] Layout has clear sections (header, fields, metadata, history)
- [ ] Status history is collapsible (expanded by default)
- [ ] Cancel closes panel when no changes
- [ ] Cancel reverts when changes exist
- [ ] Cancel button never disabled (except during save)
- [ ] Incident ID visible in header
- [ ] ID is selectable for copying
- [ ] Layout works on mobile (320px+)
- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes

## Troubleshooting

### Common Issues

**"Cannot find module '@mui/material/Accordion'"**
```bash
# Accordion is included in @mui/material, check import path
import Accordion from '@mui/material/Accordion';
```

**Tests failing with "form not found"**
- Ensure form controls have proper `aria-label` attributes
- Check that `labelId` matches between InputLabel and Select

**Cancel button still disabled**
- Remove `disabled={!hasChanges}` from Cancel button
- Keep only `disabled={isSaving}`

## References

- [Spec](./spec.md) - Feature requirements
- [Plan](./plan.md) - Implementation plan
- [Research](./research.md) - Design decisions
- [Data Model](./data-model.md) - Type changes
- [Contracts](./contracts/) - Interface definitions
