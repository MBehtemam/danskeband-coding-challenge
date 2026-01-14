import { useState, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useUpdateIncident } from '../../hooks/useIncidents';
import type { IncidentStatus } from '../../api/types';

const STATUSES: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

interface StatusSelectProps {
  incidentId: string;
  currentStatus: IncidentStatus;
  onSuccess?: () => void;
}

export function StatusSelect({ incidentId, currentStatus, onSuccess }: StatusSelectProps) {
  const [status, setStatus] = useState<IncidentStatus>(currentStatus);
  const updateIncident = useUpdateIncident();

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const newStatus = event.target.value as IncidentStatus;
      setStatus(newStatus);

      updateIncident.mutate(
        { id: incidentId, data: { status: newStatus } },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: () => {
            // Revert on error
            setStatus(currentStatus);
          },
        },
      );
    },
    [incidentId, currentStatus, updateIncident, onSuccess],
  );

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel id={`status-select-label-${incidentId}`}>Status</InputLabel>
      <Select
        labelId={`status-select-label-${incidentId}`}
        id={`status-select-${incidentId}`}
        value={status}
        label="Status"
        onChange={handleChange}
        disabled={updateIncident.isPending}
        aria-label="Change incident status"
        sx={{ minHeight: 44 }}
      >
        {STATUSES.map((s) => (
          <MenuItem key={s} value={s} sx={{ minHeight: 44 }}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
