import { useState, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useUpdateIncident } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';

interface AssigneeSelectProps {
  incidentId: string;
  currentAssigneeId: string | null;
  onSuccess?: () => void;
}

export function AssigneeSelect({
  incidentId,
  currentAssigneeId,
  onSuccess,
}: AssigneeSelectProps) {
  const [assigneeId, setAssigneeId] = useState<string>(currentAssigneeId ?? '');
  const updateIncident = useUpdateIncident();
  const { data: users } = useUsers();

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const newAssigneeId = event.target.value || null;
      setAssigneeId(event.target.value);

      updateIncident.mutate(
        { id: incidentId, data: { assigneeId: newAssigneeId } },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: () => {
            // Revert on error
            setAssigneeId(currentAssigneeId ?? '');
          },
        },
      );
    },
    [incidentId, currentAssigneeId, updateIncident, onSuccess],
  );

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id={`assignee-select-label-${incidentId}`}>Assignee</InputLabel>
      <Select
        labelId={`assignee-select-label-${incidentId}`}
        id={`assignee-select-${incidentId}`}
        value={assigneeId}
        label="Assignee"
        onChange={handleChange}
        disabled={updateIncident.isPending}
        aria-label="Change incident assignee"
        sx={{ minHeight: 44 }}
      >
        <MenuItem value="" sx={{ minHeight: 44 }}>
          <em>Unassigned</em>
        </MenuItem>
        {users?.map((user) => (
          <MenuItem key={user.id} value={user.id} sx={{ minHeight: 44 }}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
