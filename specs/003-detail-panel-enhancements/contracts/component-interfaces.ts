/**
 * Component Interface Contracts: Detail Panel Enhancements
 *
 * This file defines the TypeScript interfaces that components must implement.
 * These serve as contracts between components and their consumers.
 *
 * Feature Branch: 003-detail-panel-enhancements
 * Date: 2026-01-14
 */

import type { Incident, IncidentStatus, IncidentSeverity, User } from '../../../src/api/types';

// =============================================================================
// Form State Types (Modified)
// =============================================================================

/**
 * Form values for editing an incident in the detail panel.
 * Extended to include severity field.
 *
 * @location src/types/form.ts
 */
export interface IncidentFormValues {
  /** Current status selection (may differ from saved) */
  status: IncidentStatus;

  /** Current severity selection (may differ from saved) - NEW */
  severity: IncidentSeverity;

  /** Current assignee selection (may differ from saved) */
  assigneeId: string | null;
}

/**
 * Return type for the useIncidentForm hook.
 * Extended to include severity setter.
 *
 * @location src/types/form.ts
 */
export interface UseIncidentFormReturn {
  // State
  formValues: IncidentFormValues;
  hasChanges: boolean;
  isSaving: boolean;
  saveError: Error | null;
  saveSuccess: boolean;

  // Setters
  setStatus: (status: IncidentStatus) => void;
  setSeverity: (severity: IncidentSeverity) => void; // NEW
  setAssigneeId: (assigneeId: string | null) => void;

  // Actions
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}

// =============================================================================
// Component Props (Modified)
// =============================================================================

/**
 * Props for the IncidentDetailForm component.
 * Extended to include severity handler and close callback.
 *
 * @location src/components/incidents/IncidentDetailForm.tsx
 */
export interface IncidentDetailFormProps {
  /** The incident being edited */
  incident: Incident;

  /** Current form values */
  formValues: IncidentFormValues;

  /** Whether there are unsaved changes */
  hasChanges: boolean;

  /** Whether save is in progress */
  isSaving: boolean;

  /** Error from save operation */
  saveError: Error | null;

  /** Whether save was successful */
  saveSuccess: boolean;

  /** List of users for assignee dropdown */
  users: User[];

  /** Callback when status changes */
  onStatusChange: (status: IncidentStatus) => void;

  /** Callback when severity changes - NEW */
  onSeverityChange: (severity: IncidentSeverity) => void;

  /** Callback when assignee changes */
  onAssigneeChange: (assigneeId: string | null) => void;

  /** Callback when Save button is clicked */
  onSave: () => void;

  /** Callback when Cancel button is clicked (reverts changes) */
  onCancel: () => void;

  /** Callback to close the panel (for cancel-when-no-changes) - NEW */
  onClose: () => void;
}

// =============================================================================
// New Component Props
// =============================================================================

/**
 * Props for the SeveritySelect component.
 *
 * @location src/components/incidents/SeveritySelect.tsx (NEW FILE)
 */
export interface SeveritySelectProps {
  /** Current severity value */
  value: IncidentSeverity;

  /** Callback when severity changes */
  onChange: (severity: IncidentSeverity) => void;

  /** Whether the select is disabled (e.g., during save) */
  disabled?: boolean;
}

/**
 * Props for the collapsible StatusHistorySection component.
 * Wraps existing StatusHistoryTimeline with Accordion.
 *
 * @location src/components/incidents/StatusHistorySection.tsx (NEW FILE)
 * @alternative Could be integrated directly into IncidentDetailForm
 */
export interface StatusHistorySectionProps {
  /** Status history entries to display */
  history: Incident['statusHistory'];

  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
}

// =============================================================================
// Behavioral Contracts
// =============================================================================

/**
 * Cancel button behavior contract.
 *
 * The Cancel button MUST:
 * 1. Be always enabled (never disabled when no changes)
 * 2. Call onCancel() when hasChanges is true (revert behavior)
 * 3. Call onClose() when hasChanges is false (close behavior)
 * 4. Be disabled only during save operation (isSaving === true)
 *
 * Implementation example:
 * ```tsx
 * const handleCancelClick = () => {
 *   if (hasChanges) {
 *     onCancel();
 *   } else {
 *     onClose();
 *   }
 * };
 *
 * <Button
 *   onClick={handleCancelClick}
 *   disabled={isSaving}
 *   aria-label={hasChanges ? "Cancel changes" : "Close panel"}
 * >
 *   Cancel
 * </Button>
 * ```
 */
export type CancelButtonBehavior = {
  hasChanges: true;
  action: 'revert';
} | {
  hasChanges: false;
  action: 'close';
};

// =============================================================================
// Constants
// =============================================================================

/**
 * Available severity levels for the dropdown.
 * Order: Low to Critical (ascending severity)
 */
export const SEVERITY_OPTIONS: readonly IncidentSeverity[] = [
  'Low',
  'Medium',
  'High',
  'Critical',
] as const;
