# Data Model: Detail Panel UX Improvements

**Feature**: 004-detail-panel-ux
**Date**: 2026-01-14
**Status**: Complete

## Overview

This feature introduces UX improvements to the incident detail panel. No new data entities are required - the feature operates on existing `Incident` and `User` entities with UI-only enhancements.

## Existing Entities (No Changes)

### Incident

```typescript
// src/api/types.ts (UNCHANGED)
interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

type IncidentStatus = "Open" | "In Progress" | "Resolved";
type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
```

### User

```typescript
// src/api/types.ts (UNCHANGED)
interface User {
  id: string;
  name: string;
  email: string;
}
```

## New UI Configuration Types

### Status Configuration

```typescript
// src/components/common/StatusChip.tsx
interface StatusConfig {
  color: string;        // Hex color value
  icon: React.ComponentType<SvgIconProps>;  // MUI icon component
  label: string;        // Display label
}

const STATUS_CONFIG: Record<IncidentStatus, StatusConfig> = {
  Open: {
    color: '#42A5F5',
    icon: RadioButtonUncheckedIcon,
    label: 'Open',
  },
  'In Progress': {
    color: '#1E88E5',
    icon: PlayArrowIcon,
    label: 'In Progress',
  },
  Resolved: {
    color: '#1565C0',
    icon: CheckCircleIcon,
    label: 'Resolved',
  },
};
```

### Severity Configuration

```typescript
// src/components/common/SeverityChip.tsx
interface SeverityConfig {
  color: string;        // Hex color value
  label: string;        // Display label
}

const SEVERITY_CONFIG: Record<IncidentSeverity, SeverityConfig> = {
  Low: {
    color: '#4CAF50',
    label: 'Low',
  },
  Medium: {
    color: '#2196F3',
    label: 'Medium',
  },
  High: {
    color: '#FF9800',
    label: 'High',
  },
  Critical: {
    color: '#F44336',
    label: 'Critical',
  },
};
```

### Copy Hook State

```typescript
// src/hooks/useCopyToClipboard.ts
interface CopyState {
  status: 'idle' | 'copied' | 'error';
  copy: (text: string) => Promise<void>;
}

// Return type
interface UseCopyToClipboardReturn {
  isCopied: boolean;
  isError: boolean;
  copy: (text: string) => Promise<void>;
}
```

## Component Props Updates

### StatusChip (Updated)

```typescript
// Before
interface StatusChipProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}

// After (same interface, implementation changes)
interface StatusChipProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}
// Implementation: Add icon, custom background color
```

### SeverityChip (Updated)

```typescript
// Before
interface SeverityChipProps {
  severity: IncidentSeverity;
  size?: 'small' | 'medium';
}

// After (same interface, implementation changes)
interface SeverityChipProps {
  severity: IncidentSeverity;
  size?: 'small' | 'medium';
}
// Implementation: Use custom background colors (no icon required per spec)
```

### CopyButton (New)

```typescript
// src/components/common/CopyButton.tsx
interface CopyButtonProps {
  text: string;           // Text to copy to clipboard
  label?: string;         // Tooltip label (default: "Copy ID")
  size?: 'small' | 'medium';  // Button size
}
```

### StatusSelect (Updated)

```typescript
// src/components/incidents/StatusSelect.tsx
interface StatusSelectProps {
  incidentId: string;
  currentStatus: IncidentStatus;
  disabled?: boolean;
  fullWidth?: boolean;    // NEW: Support full width for vertical layout
}
// Implementation: Render chips in menu items and selected value
```

### SeveritySelect (Updated)

```typescript
// src/components/incidents/SeveritySelect.tsx
interface SeveritySelectProps {
  value: IncidentSeverity;
  onChange: (severity: IncidentSeverity) => void;
  disabled?: boolean;
  fullWidth?: boolean;    // NEW: Support full width for vertical layout
}
// Implementation: Render chips in menu items and selected value
```

## State Transitions

### Copy Button States

```
┌─────────┐    click    ┌─────────┐   2000ms   ┌─────────┐
│  idle   │───────────▶│ copied  │───────────▶│  idle   │
└─────────┘             └─────────┘            └─────────┘
     │                       ▲
     │      error            │
     └───────────────────────┘
           (auto-reset)
```

| State | Icon | Tooltip | Duration |
|-------|------|---------|----------|
| idle | ContentCopyIcon | "Copy ID" | - |
| copied | CheckCircleIcon | "Copied!" | 2000ms |
| error | ErrorIcon | "Failed to copy" | 2000ms |

## Validation Rules

### CopyButton

- `text` must be non-empty string
- Clipboard API requires secure context (HTTPS) or uses fallback
- Visual feedback must appear within 500ms (SC-006)

### Layout

- All dropdowns must have uniform width in vertical layout (FR-007)
- Minimum touch target size: 44px (WCAG accessibility)
- Responsive: column layout on all viewports

## Data Flow

```
┌────────────────────────────────────────────────────────────┐
│                   IncidentDetailForm                        │
├────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Header with CopyButton                             │   │
│  │  ┌────────┐  ┌──────────────┐                       │   │
│  │  │ ID: X  │  │ CopyButton   │ → useCopyToClipboard  │   │
│  │  └────────┘  └──────────────┘                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Editable Fields (Vertical Stack)                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ StatusSelect (fullWidth)                      │  │   │
│  │  │  - renderValue: <StatusChip />                │  │   │
│  │  │  - MenuItem: <StatusChip /> per option        │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ SeveritySelect (fullWidth)                    │  │   │
│  │  │  - renderValue: <SeverityChip />              │  │   │
│  │  │  - MenuItem: <SeverityChip /> per option      │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ AssigneeSelect (fullWidth)                    │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Status History Timeline                            │   │
│  │  - Uses updated StatusChip with new colors/icons    │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Color Reference Table

| Entity | Value | Hex Color | Text Color | Icon |
|--------|-------|-----------|------------|------|
| Status | Open | #42A5F5 | #FFFFFF | RadioButtonUnchecked |
| Status | In Progress | #1E88E5 | #FFFFFF | PlayArrow |
| Status | Resolved | #1565C0 | #FFFFFF | CheckCircle |
| Severity | Low | #4CAF50 | #FFFFFF | - |
| Severity | Medium | #2196F3 | #FFFFFF | - |
| Severity | High | #FF9800 | #FFFFFF | - |
| Severity | Critical | #F44336 | #FFFFFF | - |

## Consistency Requirements

The updated chip colors and icons must be applied consistently across:

1. **IncidentDetailForm** - Status and severity display/editing
2. **IncidentDetailPanel** - Read-only status and severity display
3. **IncidentTable** - Status and severity columns
4. **StatusHistory** - Timeline entries showing status changes

All locations should use the same `StatusChip` and `SeverityChip` components to ensure consistency (FR-018).
