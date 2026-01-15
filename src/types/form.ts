import type { IncidentStatus, IncidentSeverity } from '../api/types';

/**
 * Form values for editing an incident in the detail panel.
 * Only contains fields that can be edited (status, severity, assigneeId).
 */
export interface IncidentFormValues {
  /** Current status selection (may differ from saved) */
  status: IncidentStatus;

  /** Current severity selection (may differ from saved) */
  severity: IncidentSeverity;

  /** Current assignee selection (may differ from saved) */
  assigneeId: string | null;
}

/**
 * Complete form state including values, change detection, and save state.
 */
export interface IncidentFormState {
  /** Current form values */
  formValues: IncidentFormValues;

  /** Original values from the incident (for comparison) */
  originalValues: IncidentFormValues;

  /** True if formValues differ from originalValues */
  hasChanges: boolean;

  /** True while save mutation is in progress */
  isSaving: boolean;

  /** Error from last save attempt, null if none */
  saveError: Error | null;

  /** True if last save was successful */
  saveSuccess: boolean;
}

/**
 * Return type for the useIncidentForm hook.
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
  setSeverity: (severity: IncidentSeverity) => void;
  setAssigneeId: (assigneeId: string | null) => void;

  // Actions
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  resetForm: () => void;
}
