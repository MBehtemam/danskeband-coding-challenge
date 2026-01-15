import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { StatusChip } from '../common/StatusChip';
import type { IncidentStatus } from '../../api/types';

/**
 * Available status values for the dropdown.
 * Order: Open → In Progress → Resolved (workflow progression)
 */
export const STATUS_OPTIONS: readonly IncidentStatus[] = [
  'Open',
  'In Progress',
  'Resolved',
] as const;

interface StatusSelectProps {
  /** Current status value */
  value: IncidentStatus;

  /** Callback when status changes */
  onChange: (status: IncidentStatus) => void;

  /** Whether the select is disabled (e.g., during save) */
  disabled?: boolean;

  /** Whether the select should take full width of its container */
  fullWidth?: boolean;
}

export function StatusSelect({ value, onChange, disabled, fullWidth = false }: StatusSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as IncidentStatus);
  };

  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{ minWidth: fullWidth ? undefined : 140 }}>
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        id="status-select"
        value={value}
        label="Status"
        onChange={handleChange}
        disabled={disabled}
        aria-label="Status"
        sx={{ minHeight: 44 }}
        renderValue={(selected) => <StatusChip status={selected as IncidentStatus} size="small" />}
      >
        {STATUS_OPTIONS.map((s) => (
          <MenuItem key={s} value={s} sx={{ minHeight: 44 }}>
            <StatusChip status={s} size="small" />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
