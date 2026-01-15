/**
 * Component Interface Contracts
 * Feature: 013-refactor-select-components
 *
 * This file defines the TypeScript interfaces for refactored select components.
 * These contracts ensure consistent API across all select components.
 */

import type { IncidentStatus, IncidentSeverity, User } from '../../../../src/api/types';

// ============================================================================
// Select Component Props (Refactored)
// ============================================================================

/**
 * Props for StatusSelect component (refactored to controlled component pattern)
 *
 * @example
 * ```tsx
 * <StatusSelect
 *   value={formValues.status}
 *   onChange={setStatus}
 *   disabled={isSaving}
 *   fullWidth
 * />
 * ```
 */
export interface StatusSelectProps {
  /**
   * Currently selected status value
   * Must be one of: 'Open' | 'In Progress' | 'Resolved'
   */
  value: IncidentStatus;

  /**
   * Callback fired when user selects a different status
   * @param status - The newly selected status
   */
  onChange: (status: IncidentStatus) => void;

  /**
   * Whether the select is disabled (e.g., during save operations)
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Props for AssigneeSelect component (refactored to controlled component pattern)
 *
 * @example
 * ```tsx
 * <AssigneeSelect
 *   value={formValues.assigneeId}
 *   onChange={setAssigneeId}
 *   users={users}
 *   disabled={isSaving}
 *   fullWidth
 * />
 * ```
 */
export interface AssigneeSelectProps {
  /**
   * Currently selected assignee ID
   * null represents "Unassigned" state
   */
  value: string | null;

  /**
   * Callback fired when user selects a different assignee
   * @param assigneeId - The newly selected user ID, or null for unassigned
   */
  onChange: (assigneeId: string | null) => void;

  /**
   * List of users to display in dropdown
   * Component renders these as menu options
   */
  users: User[];

  /**
   * Whether the select is disabled (e.g., during save operations)
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Props for SeveritySelect component (already follows correct pattern - included for reference)
 *
 * @example
 * ```tsx
 * <SeveritySelect
 *   value={formValues.severity}
 *   onChange={setSeverity}
 *   disabled={isSaving}
 *   fullWidth
 * />
 * ```
 */
export interface SeveritySelectProps {
  /**
   * Currently selected severity value
   * Must be one of: 'Low' | 'Medium' | 'High' | 'Critical'
   */
  value: IncidentSeverity;

  /**
   * Callback fired when user selects a different severity
   * @param severity - The newly selected severity
   */
  onChange: (severity: IncidentSeverity) => void;

  /**
   * Whether the select is disabled (e.g., during save operations)
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

// ============================================================================
// Form Component Props (Updated)
// ============================================================================

/**
 * Props for IncidentDetailForm component (updated to support error alerts)
 */
export interface IncidentDetailFormProps {
  /** The incident being edited (read-only display data) */
  incident: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    statusHistory: Array<{
      status: IncidentStatus;
      timestamp: string;
      changedBy?: string;
    }>;
  };

  /** Current form values (local edits, may differ from incident) */
  formValues: {
    status: IncidentStatus;
    severity: IncidentSeverity;
    assigneeId: string | null;
  };

  /** Whether there are unsaved changes (enables/disables Save button) */
  hasChanges: boolean;

  /** Whether save operation is in progress (disables form during save) */
  isSaving: boolean;

  /** Error from last save attempt (null if no error or after clear) */
  saveError: Error | null;

  /** Whether last save succeeded (triggers success notification) */
  saveSuccess: boolean;

  /** List of users for assignee dropdown */
  users: User[];

  /** Callback when status select changes */
  onStatusChange: (status: IncidentStatus) => void;

  /** Callback when severity select changes */
  onSeverityChange: (severity: IncidentSeverity) => void;

  /** Callback when assignee select changes */
  onAssigneeChange: (assigneeId: string | null) => void;

  /** Callback when Save button is clicked */
  onSave: () => void;

  /** Callback when Cancel button is clicked (reverts changes) */
  onCancel: () => void;

  /** Callback to close the panel (used when Cancel with no changes) */
  onClose: () => void;
}

// ============================================================================
// Hook Return Types (No changes, included for reference)
// ============================================================================

/**
 * Return type for useIncidentForm hook (already correctly implemented)
 */
export interface UseIncidentFormReturn {
  /** Current local form values (with user edits) */
  formValues: {
    status: IncidentStatus;
    severity: IncidentSeverity;
    assigneeId: string | null;
  };

  /** Whether form has unsaved changes compared to original values */
  hasChanges: boolean;

  /** Whether save operation is currently in progress */
  isSaving: boolean;

  /** Error from last save attempt (null if no error) */
  saveError: Error | null;

  /** Whether last save succeeded (for success notification) */
  saveSuccess: boolean;

  /** Update status value in local form state */
  setStatus: (status: IncidentStatus) => void;

  /** Update severity value in local form state */
  setSeverity: (severity: IncidentSeverity) => void;

  /** Update assignee ID value in local form state */
  setAssigneeId: (assigneeId: string | null) => void;

  /** Save all form changes to server via API */
  handleSave: () => Promise<void>;

  /** Cancel changes and revert to original values */
  handleCancel: () => void;

  /** Reset form to original values (alias for handleCancel) */
  resetForm: () => void;
}

// ============================================================================
// Notification Config (Material UI)
// ============================================================================

/**
 * Configuration for success notification (Snackbar)
 */
export interface SuccessNotificationConfig {
  /** Whether notification is visible */
  open: boolean;

  /** Auto-hide duration in milliseconds */
  autoHideDuration: 5000;

  /** Position of notification */
  anchorOrigin: {
    vertical: 'top';
    horizontal: 'center';
  };

  /** Message to display */
  message: 'Changes saved successfully';
}

/**
 * Configuration for error alert (inline)
 */
export interface ErrorAlertConfig {
  /** Whether alert is visible (derived from saveError !== null) */
  visible: boolean;

  /** Error message to display */
  message: string;

  /** Severity level for Material UI Alert */
  severity: 'error';

  /** ARIA role for accessibility */
  role: 'alert';
}
