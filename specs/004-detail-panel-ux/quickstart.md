# Quickstart: Detail Panel UX Improvements

**Feature**: 004-detail-panel-ux
**Date**: 2026-01-14

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Setup

```bash
# Clone and switch to feature branch
git checkout 004-detail-panel-ux

# Install dependencies
npm install

# Start development server
npm run dev
```

## Key Files to Modify

### 1. Status Chip (Priority P1)

**File**: `src/components/common/StatusChip.tsx`

Update to use custom blue colors and add icons:

```typescript
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const STATUS_CONFIG = {
  Open: { color: '#42A5F5', icon: RadioButtonUncheckedIcon },
  'In Progress': { color: '#1E88E5', icon: PlayArrowIcon },
  Resolved: { color: '#1565C0', icon: CheckCircleIcon },
};
```

### 2. Copy Button (Priority P1)

**New File**: `src/components/common/CopyButton.tsx`

```typescript
// Key implementation points:
// - Use navigator.clipboard.writeText() with fallback
// - Show CheckCircleIcon on success, ContentCopyIcon default
// - Tooltip feedback: "Copy ID" → "Copied!" → "Copy ID"
// - Reset feedback after 2000ms
```

**New File**: `src/hooks/useCopyToClipboard.ts`

```typescript
// Custom hook handling:
// - Clipboard API check (navigator.clipboard && window.isSecureContext)
// - Fallback to document.execCommand('copy')
// - Return { isCopied, isError, copy }
```

### 3. Vertical Layout (Priority P1)

**File**: `src/components/incidents/IncidentDetailForm.tsx`

Change editable fields layout from horizontal to vertical:

```typescript
// Before
<Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

// After
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
```

### 4. Chips in Dropdowns (Priority P2)

**Files**:
- `src/components/incidents/StatusSelect.tsx`
- `src/components/incidents/SeveritySelect.tsx`

Add `renderValue` prop and chips in MenuItems:

```typescript
<Select
  renderValue={(selected) => <StatusChip status={selected} size="small" />}
>
  <MenuItem value="Open">
    <StatusChip status="Open" size="small" />
  </MenuItem>
  {/* ... */}
</Select>
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Component Tests

```bash
# Status chip tests
npm test -- StatusChip

# Copy button tests
npm test -- CopyButton

# Detail form tests
npm test -- IncidentDetailForm
```

### Test Coverage

```bash
npm test -- --coverage
```

## TDD Workflow

Follow the constitution's Test-First Development principle:

1. **Write failing test** (Red)
   ```typescript
   // StatusChip.test.tsx
   it('should display Open status with light blue background', () => {
     render(<StatusChip status="Open" />);
     const chip = screen.getByRole('status');
     expect(chip).toHaveStyle({ backgroundColor: '#42A5F5' });
   });
   ```

2. **Implement minimum code** (Green)
   ```typescript
   // StatusChip.tsx
   export function StatusChip({ status }: StatusChipProps) {
     return (
       <Chip
         sx={{ backgroundColor: STATUS_CONFIG[status].color }}
         // ...
       />
     );
   }
   ```

3. **Refactor** while keeping tests green

## Verification Checklist

### FR-001 to FR-005: Copy Button
- [ ] Copy icon visible next to incident ID
- [ ] Clicking copies ID to clipboard
- [ ] "Copied!" feedback shown on success
- [ ] Tooltip shows "Copy ID" on hover
- [ ] Error feedback on clipboard failure

### FR-006 to FR-009: Vertical Layout
- [ ] Status, severity, assignee stacked vertically
- [ ] Uniform dropdown width
- [ ] Consistent label positioning
- [ ] Mobile responsive (no overflow)

### FR-010 to FR-013: Chips in Dropdowns
- [ ] Status options show as colored chips
- [ ] Severity options show as colored chips
- [ ] Selected value displays as chip
- [ ] Colors match chips elsewhere

### FR-014 to FR-018: Color Scheme
- [ ] "In Progress" (blue) distinct from "High" (orange)
- [ ] Status uses blue progression
- [ ] Severity uses green-to-red gradient
- [ ] Status chips have workflow icons
- [ ] Colors consistent across all views

## Common Issues

### Clipboard Not Working in Dev

The Clipboard API requires HTTPS. In development (HTTP localhost), the fallback `execCommand` is used. This is expected behavior.

### Icon Import Errors

Ensure you import icons from the correct path:

```typescript
// Correct
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Wrong
import { CheckCircleIcon } from '@mui/icons-material';
```

### TypeScript Errors with SvgIconProps

If you see type errors with icon components:

```typescript
import type { SvgIconProps } from '@mui/material/SvgIcon';

interface Config {
  icon: React.ComponentType<SvgIconProps>;
}
```

## Next Steps

After implementation, run:

```bash
# Lint check
npm run lint

# Type check
npm run type-check

# Full test suite
npm test

# Build verification
npm run build
```

All checks must pass before submitting PR.
