# Research: Detail Panel UX Improvements

**Feature**: 004-detail-panel-ux
**Date**: 2026-01-14
**Status**: Complete

## Research Tasks

### 1. Clipboard API Implementation

**Decision**: Use `navigator.clipboard.writeText()` with fallback to `document.execCommand('copy')`

**Rationale**:
- Modern Clipboard API is widely supported (Chrome 63+, Firefox 53+, Safari 13.1+, Edge 79+)
- Requires secure context (HTTPS) which is standard for production deployments
- Fallback ensures older browsers/non-HTTPS dev environments still work
- Async API allows proper error handling and user feedback

**Alternatives Considered**:
- Clipboard.js library - Rejected: adds unnecessary dependency for simple use case
- Only modern API - Rejected: would break in development (localhost HTTP)
- Only execCommand - Rejected: deprecated, less reliable

**Implementation Pattern**:
```typescript
async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers or non-HTTPS contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
```

---

### 2. Custom Chip Colors (Not Using Theme Palette)

**Decision**: Use `sx` prop with custom color values directly on Chip components

**Rationale**:
- Simpler than extending theme palette for 3 status + 4 severity colors
- More explicit and readable in component code
- Allows per-chip customization without global theme changes
- Consistent with existing codebase patterns

**Alternatives Considered**:
- Theme palette extension - Rejected: overkill for 7 color values, adds complexity
- styled() components - Rejected: adds indirection, less readable for simple color changes
- CSS variables - Rejected: not integrated with MUI's styling system

**Color Mapping**:
```typescript
// Status colors (workflow progression - blue spectrum)
const STATUS_COLORS = {
  Open: '#42A5F5',        // Light Blue
  'In Progress': '#1E88E5', // Medium Blue
  Resolved: '#1565C0',     // Dark Blue
};

// Severity colors (urgency gradient - green to red)
const SEVERITY_COLORS = {
  Low: '#4CAF50',     // Green (existing)
  Medium: '#2196F3',  // Blue (existing)
  High: '#FF9800',    // Orange (existing)
  Critical: '#F44336', // Red (existing)
};
```

---

### 3. Chips in Select Dropdowns

**Decision**: Use `renderValue` prop for selected state + Chip components inside MenuItem

**Rationale**:
- `renderValue` allows custom rendering of selected value as a chip
- MenuItem can contain any React element including Chip
- Maintains full MUI Select accessibility features
- Pattern is well-documented in MUI examples

**Alternatives Considered**:
- Autocomplete component - Rejected: different UX, more complex than needed
- Custom dropdown - Rejected: loses accessibility, reinvents the wheel

**Implementation Pattern**:
```typescript
<Select
  value={value}
  renderValue={(selected) => (
    <StatusChip status={selected} size="small" />
  )}
>
  <MenuItem value="Open">
    <StatusChip status="Open" size="small" />
  </MenuItem>
  {/* ... more options */}
</Select>
```

---

### 4. Icon Selection for Workflow States

**Decision**: Use MUI icons - RadioButtonUnchecked (Open), PlayArrow (In Progress), CheckCircle (Resolved)

**Rationale**:
- Already available via @mui/icons-material (existing dependency)
- Semantically clear: empty circle = not started, play = active, check = done
- Render well at small sizes (1rem for small chips)
- Recognizable workflow state metaphors

**Alternatives Considered**:
- FiberManualRecord + PlayArrow + Done - Rejected: filled circle less distinct from other icons
- Custom SVG icons - Rejected: adds maintenance burden, MUI icons sufficient
- Animated Sync icon - Rejected: spec says no animated icons (out of scope)

**Icon Configuration**:
```typescript
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const STATUS_ICONS = {
  Open: RadioButtonUncheckedIcon,
  'In Progress': PlayArrowIcon,
  Resolved: CheckCircleIcon,
};
```

---

### 5. Color Theory: Status vs Severity Distinction

**Decision**: Blue spectrum for status (workflow), Green-to-Red for severity (urgency)

**Rationale**:
- Blue does not carry urgency connotation (neutral workflow progression)
- Red/Orange/Yellow spectrum naturally signals danger/urgency levels
- Clear visual separation eliminates "In Progress" vs "High" confusion
- Icons provide secondary differentiation for color-blind users

**Alternatives Considered**:
- Purple spectrum for status - Rejected: less commonly associated with workflow states
- Grayscale for status - Rejected: appears disabled/inactive
- Same spectrum different shades - Rejected: still causes confusion between categories

**Color Philosophy**:
| Category | Principle | Color Range | Icon Strategy |
|----------|-----------|-------------|---------------|
| Status | Workflow progression | Light → Dark Blue | Shape-based (circle, arrow, check) |
| Severity | Urgency intensity | Green → Red | Optional warning indicators |

---

### 6. Vertical Layout Best Practices

**Decision**: Use `flexDirection: 'column'` with consistent gap and full-width fields

**Rationale**:
- Simpler than switching to Stack component (existing flex pattern)
- Provides 100% width for each dropdown (FR-007: uniform width)
- Maintains responsive breakpoint patterns already in codebase
- Gap property ensures consistent spacing

**Implementation Pattern**:
```typescript
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
}}>
  <StatusSelect fullWidth />
  <SeveritySelect fullWidth />
  <AssigneeSelect fullWidth />
</Box>
```

---

### 7. Testing Clipboard Operations

**Decision**: Mock `navigator.clipboard` in test setup with vi.fn()

**Rationale**:
- jsdom doesn't implement Clipboard API
- Mocking allows testing both success and failure scenarios
- Consistent with existing Vitest + Testing Library patterns

**Test Setup**:
```typescript
// src/test/setup.ts
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
```

---

## Research Completion Summary

| Topic | Status | Decision |
|-------|--------|----------|
| Clipboard API | ✅ Complete | Modern API with execCommand fallback |
| Chip Colors | ✅ Complete | sx prop with custom hex values |
| Chips in Select | ✅ Complete | renderValue + MenuItem with Chip |
| Workflow Icons | ✅ Complete | RadioButtonUnchecked, PlayArrow, CheckCircle |
| Color Distinction | ✅ Complete | Blue (status) vs Green-Red (severity) |
| Vertical Layout | ✅ Complete | flexDirection: column with gap |
| Testing Strategy | ✅ Complete | Mock clipboard in vitest setup |

All NEEDS CLARIFICATION items resolved. Proceed to Phase 1 design.
