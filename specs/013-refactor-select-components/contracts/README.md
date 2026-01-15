# Component Contracts

**Feature**: 013-refactor-select-components
**Date**: 2026-01-15

## Overview

This directory contains TypeScript interface definitions (contracts) for refactored components. These contracts define the API boundary between components and their consumers.

## Files

### component-interfaces.ts

Defines TypeScript interfaces for:
- **Select Component Props**: StatusSelectProps, AssigneeSelectProps, SeveritySelectProps
- **Form Component Props**: IncidentDetailFormProps (updated)
- **Hook Return Types**: UseIncidentFormReturn (reference)
- **Notification Configs**: SuccessNotificationConfig, ErrorAlertConfig

## Usage in Implementation

### 1. Import interfaces in component files

```typescript
import type { StatusSelectProps } from './contracts/component-interfaces';

export function StatusSelect({ value, onChange, disabled, fullWidth }: StatusSelectProps) {
  // Implementation
}
```

### 2. Ensure strict type checking

All components must:
- Accept only props defined in their interface
- Return values matching the specified types
- Handle all optional props with appropriate defaults

### 3. Update existing components

**StatusSelect.tsx**:
- Replace current `StatusSelectProps` with contract definition
- Remove `useUpdateIncident` hook usage
- Remove internal state management
- Implement controlled component pattern

**AssigneeSelect.tsx**:
- Replace current `AssigneeSelectProps` with contract definition
- Remove `useUpdateIncident` hook usage
- Remove internal state management
- Accept `users` prop instead of fetching with `useUsers` hook
- Implement controlled component pattern

## Contract Guarantees

### Backward Compatibility
**None**: This refactoring changes component APIs. All consumers (IncidentDetailForm, CreateIncidentDialog) must be updated simultaneously.

### Type Safety
All interfaces use strict TypeScript typing:
- No `any` types
- Explicit null handling for optional values
- Union types for enums (IncidentStatus, IncidentSeverity)

### Runtime Validation
TypeScript provides compile-time validation. No runtime prop validation needed (no PropTypes).

## Testing

Tests should verify components adhere to contracts:

```typescript
describe('StatusSelect', () => {
  it('accepts value prop and displays it', () => {
    render(<StatusSelect value="Open" onChange={jest.fn()} />);
    expect(screen.getByDisplayValue('Open')).toBeInTheDocument();
  });

  it('calls onChange with selected value', () => {
    const onChange = jest.fn();
    render(<StatusSelect value="Open" onChange={onChange} />);
    userEvent.selectOptions(screen.getByRole('combobox'), 'Resolved');
    expect(onChange).toHaveBeenCalledWith('Resolved');
  });

  it('respects disabled prop', () => {
    render(<StatusSelect value="Open" onChange={jest.fn()} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
```

## Migration Guide

### Before (Auto-save pattern)

```typescript
// Component calls API directly
<StatusSelect
  incidentId={incident.id}
  currentStatus={incident.status}
  onSuccess={() => console.log('Updated')}
/>
```

### After (Controlled component pattern)

```typescript
// Parent manages state and API calls
const [status, setStatus] = useState(incident.status);
const updateIncident = useUpdateIncident();

<StatusSelect
  value={status}
  onChange={(newStatus) => {
    setStatus(newStatus);
    // Parent decides when to call API (immediately or on explicit save)
  }}
  disabled={updateIncident.isPending}
/>
```

## Validation

Run TypeScript compiler to verify contract compliance:

```bash
npm run type-check
```

No runtime errors should occur if all components implement contracts correctly.
