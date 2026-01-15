# Research: Detail Panel Enhancements

**Feature Branch**: `003-detail-panel-enhancements`
**Date**: 2026-01-14

## Research Summary

This document consolidates research findings for the detail panel enhancement feature, resolving all technical decisions and establishing best practices for implementation.

---

## Decision 1: Panel Layout Structure

**Decision**: Organize panel into 4 logical sections using section-specific container components

**Rationale**:
- Users scan incident information in a predictable pattern: critical info first, actionable items second, context third, audit trail last
- Logical grouping reduces cognitive load and improves scan-ability
- Matches the functional requirements (FR-006) for distinct visual sections

**Alternatives Considered**:
1. **Flat layout with dividers only** - Rejected: Insufficient visual hierarchy for information-dense panels
2. **Tab-based organization** - Rejected: Fragments information, requires extra clicks for common workflows
3. **Two-column layout** - Rejected: Already implemented in current design but lacks clear sectioning

**Implementation**:
```
Section 1: Header (Incident ID, Title, Description)
   - Box component, no elevation
   - Typography h6 for title, body1 for description

Section 2: Editable Fields (Status, Severity, Assignee)
   - Box with subtle background (grey.50 or similar)
   - Section header: "Quick Actions" or "Details"
   - Grid layout for fields: xs:12, sm:6, md:4

Section 3: Metadata (Created, Last Updated)
   - Box with caption labels and body2 values
   - Horizontal layout on desktop, stacked on mobile

Section 4: Status History (Collapsible Timeline)
   - Accordion component
   - Expanded by default (per clarification)
   - User can collapse to reduce visual clutter
```

---

## Decision 2: Collapsible Status History Implementation

**Decision**: Use Material UI Accordion component for status history section

**Rationale**:
- Built-in WCAG 2.1 AA accessibility compliance (proper ARIA attributes, keyboard navigation)
- Performance optimization via `unmountOnExit` prop
- Semantic HTML structure with proper heading elements
- Matches user expectation from clarification: "expanded by default, user can collapse"

**Alternatives Considered**:
1. **Custom Collapse component** - Rejected: Would require manual accessibility implementation
2. **Collapse with toggle button** - Rejected: Less semantic than Accordion, more code to maintain
3. **Always visible (no collapse)** - Rejected: User specifically requested ability to collapse

**Implementation Details**:
```tsx
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

**Accessibility Considerations**:
- Accordion provides `aria-expanded` state automatically
- Enter/Space keys toggle expand/collapse
- Focus management handled by component

---

## Decision 3: Editable Fields Layout

**Decision**: Use responsive Grid layout with consistent FormControl sizing

**Rationale**:
- Mobile-first approach ensures usability on all devices (FR-009)
- Grid's 12-column system provides flexible, maintainable responsive behavior
- Consistent field sizing improves visual alignment (SC-005)

**Alternatives Considered**:
1. **Flexbox with wrap** - Rejected: Less predictable field alignment at breakpoints
2. **Stack component** - Rejected: Better for purely vertical layouts, not responsive grids
3. **Fixed width fields** - Rejected: Poor mobile experience

**Implementation**:
```tsx
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <Typography variant="subtitle2">Details</Typography>
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
    {/* Status - consistent width */}
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Status</InputLabel>
      <Select ... />
    </FormControl>

    {/* Severity - matches status */}
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Severity</InputLabel>
      <Select ... />
    </FormControl>

    {/* Assignee - slightly wider for names */}
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel>Assignee</InputLabel>
      <Select ... />
    </FormControl>
  </Box>
</Box>
```

**Responsive Behavior**:
- Mobile (xs): Fields stack vertically, full width
- Tablet+ (sm): Fields wrap in rows as space allows
- Desktop: All three fields in single row

---

## Decision 4: Severity Dropdown Component

**Decision**: Create new `SeveritySelect` component mirroring existing `StatusSelect` pattern

**Rationale**:
- Consistency with existing codebase patterns
- Reuses established Select component styling
- Integrates with existing form state management hook

**Alternatives Considered**:
1. **Inline Select in form** - Rejected: Less reusable, duplicates code
2. **Radio button group** - Rejected: Takes more vertical space, inconsistent with Status field
3. **Chip selector** - Rejected: Less clear for editing, better for read-only display

**Implementation Pattern** (following StatusSelect):
```tsx
interface SeveritySelectProps {
  value: IncidentSeverity;
  onChange: (severity: IncidentSeverity) => void;
  disabled?: boolean;
}

const SEVERITIES: IncidentSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

export function SeveritySelect({ value, onChange, disabled }: SeveritySelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel id="severity-select-label">Severity</InputLabel>
      <Select
        labelId="severity-select-label"
        id="severity-select"
        value={value}
        label="Severity"
        onChange={(e) => onChange(e.target.value as IncidentSeverity)}
        disabled={disabled}
        aria-label="Severity"
      >
        {SEVERITIES.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
```

---

## Decision 5: Cancel Button Dual Behavior

**Decision**: Cancel button always enabled with context-aware behavior

**Rationale**:
- FR-010: Cancel closes panel when no unsaved changes
- FR-011: Cancel reverts changes when unsaved changes exist
- FR-012: Cancel button always enabled (never disabled)
- Clear user expectation: button labeled "Cancel" should always do something

**Alternatives Considered**:
1. **Two separate buttons (Close + Revert)** - Rejected: More complex UI, unclear which to use when
2. **Cancel + confirmation dialog** - Rejected: Out of scope per spec
3. **Keep current disabled behavior** - Rejected: Violates FR-012

**Implementation**:
```tsx
// In IncidentDetailForm or wrapper
const handleCancel = () => {
  if (hasChanges) {
    // Revert to original values
    onRevert();
  } else {
    // Close the panel
    onClose();
  }
};

<Button
  variant="outlined"
  onClick={handleCancel}
  disabled={isSaving}  // Only disabled during save operation
  aria-label={hasChanges ? "Cancel changes" : "Close panel"}
>
  Cancel
</Button>
```

**State Transitions**:
1. Panel opens with no changes → Cancel closes panel
2. User makes changes → Cancel reverts changes
3. After revert (no changes) → Cancel closes panel
4. User saves → No changes → Cancel closes panel

---

## Decision 6: Incident ID Display

**Decision**: Display incident ID in header area with subtle styling

**Rationale**:
- FR-013/FR-014: ID must be visible but not dominate view
- Users need ID for reference in communications/documentation
- Header is natural location (already contains title)

**Alternatives Considered**:
1. **ID as main header** - Rejected: Title is more meaningful for quick scanning
2. **Separate metadata row** - Rejected: Adds visual weight to simple information
3. **Copy button with ID** - Rejected: Out of scope (spec says selection/copy sufficient)

**Implementation**:
```tsx
<Box sx={{ mb: 2 }}>
  {/* Incident ID - subtle but accessible */}
  <Typography
    variant="caption"
    color="text.secondary"
    sx={{ display: 'block', mb: 0.5 }}
  >
    ID: {incident.id}
  </Typography>

  {/* Title - prominent */}
  <Typography variant="h6" component="h2">
    {incident.title}
  </Typography>
</Box>
```

**Accessibility**: ID is selectable text, can be copied via standard OS selection.

---

## Decision 7: Typography Hierarchy

**Decision**: Use consistent Material UI typography scale

**Rationale**:
- Maintains visual hierarchy for quick scanning (SC-002)
- Follows Material Design guidelines
- Consistent with existing codebase patterns

**Typography Scale**:
| Element | Variant | Weight | Purpose |
|---------|---------|--------|---------|
| Drawer title | h6 | 500 | "Incident Details" header |
| Incident title | h6 | 400 | Main incident title |
| Section headers | subtitle2 | 600 | "Details", "Status History" |
| Field labels | caption | 400 | Above form fields |
| Field values | body2 | 400 | Timestamps, metadata |
| Description | body1 | 400 | Incident description |
| ID display | caption | 400 | Subtle ID reference |

---

## Decision 8: Responsive Breakpoints

**Decision**: Follow existing project patterns with mobile-first approach

**Rationale**:
- FR-009: Layout must maintain readability across desktop and mobile
- SC-006: No overlapping elements at mobile viewport widths
- Consistent with Material UI breakpoint system

**Breakpoint Behavior**:
| Viewport | Layout Changes |
|----------|----------------|
| xs (0-599px) | Fields stack vertically, full width; single column |
| sm (600-899px) | Fields wrap in rows; two-column metadata |
| md (900px+) | All fields in row; optimal reading width |

**Implementation via useMediaQuery**:
```tsx
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// Conditional layouts based on isMobile
```

---

## Research Sources

- Material UI Accordion: https://mui.com/material-ui/react-accordion/
- Material UI Grid System: https://mui.com/material-ui/react-grid/
- Material UI Typography: https://mui.com/material-ui/react-typography/
- Material Design Responsive UI: https://m1.material.io/layout/responsive-ui.html
- WCAG 2.1 AA Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
