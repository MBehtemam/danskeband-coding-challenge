import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUpdateIncident } from './useIncidents';
import type { Incident, IncidentStatus, IncidentSeverity } from '../api/types';
import type { IncidentFormValues, UseIncidentFormReturn } from '../types/form';

/**
 * Hook for managing incident form state with explicit save.
 * Tracks local edits separate from server state and provides save/cancel actions.
 */
export function useIncidentForm(incident: Incident): UseIncidentFormReturn {
  // Initialize original values from incident
  const [originalValues, setOriginalValues] = useState<IncidentFormValues>(() => ({
    status: incident.status,
    severity: incident.severity,
    assigneeId: incident.assigneeId,
  }));

  // Current form values (local edits)
  const [formValues, setFormValues] = useState<IncidentFormValues>(() => ({
    status: incident.status,
    severity: incident.severity,
    assigneeId: incident.assigneeId,
  }));

  // Track save success state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track save error state (separate from mutation error for clearing on cancel)
  const [saveError, setSaveError] = useState<Error | null>(null);

  // Get the update mutation
  const updateIncident = useUpdateIncident();

  // Reset form when incident changes (e.g., selecting a different incident)
  useEffect(() => {
    const newValues: IncidentFormValues = {
      status: incident.status,
      severity: incident.severity,
      assigneeId: incident.assigneeId,
    };
    setOriginalValues(newValues);
    setFormValues(newValues);
    setSaveSuccess(false);
    setSaveError(null);
  }, [incident.id, incident.status, incident.severity, incident.assigneeId]);

  // Compute hasChanges by comparing current values to original
  const hasChanges = useMemo(() => {
    return (
      formValues.status !== originalValues.status ||
      formValues.severity !== originalValues.severity ||
      formValues.assigneeId !== originalValues.assigneeId
    );
  }, [formValues, originalValues]);

  // Set status value
  const setStatus = useCallback((status: IncidentStatus) => {
    setFormValues((prev) => ({ ...prev, status }));
    setSaveSuccess(false);
  }, []);

  // Set severity value
  const setSeverity = useCallback((severity: IncidentSeverity) => {
    setFormValues((prev) => ({ ...prev, severity }));
    setSaveSuccess(false);
  }, []);

  // Set assignee ID value
  const setAssigneeId = useCallback((assigneeId: string | null) => {
    setFormValues((prev) => ({ ...prev, assigneeId }));
    setSaveSuccess(false);
  }, []);

  // Handle save action
  const handleSave = useCallback(async () => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateIncident.mutateAsync({
        id: incident.id,
        data: {
          status: formValues.status,
          severity: formValues.severity,
          assigneeId: formValues.assigneeId,
        },
      });

      // On success, update original values to current values
      setOriginalValues({ ...formValues });
      setSaveSuccess(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error('Save failed'));
      throw error;
    }
  }, [incident.id, formValues, updateIncident]);

  // Handle cancel action - reset to original values
  const handleCancel = useCallback(() => {
    setFormValues({ ...originalValues });
    setSaveError(null);
    setSaveSuccess(false);
  }, [originalValues]);

  // Reset form to original values
  const resetForm = useCallback(() => {
    setFormValues({ ...originalValues });
    setSaveError(null);
    setSaveSuccess(false);
  }, [originalValues]);

  return {
    formValues,
    hasChanges,
    isSaving: updateIncident.isPending,
    saveError,
    saveSuccess,
    setStatus,
    setSeverity,
    setAssigneeId,
    handleSave,
    handleCancel,
    resetForm,
  };
}
