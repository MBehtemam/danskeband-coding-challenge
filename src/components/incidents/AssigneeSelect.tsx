import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { User } from '../../api/types';

interface AssigneeSelectProps {
  /** Current assignee ID (null = unassigned) */
  value: string | null;

  /** Callback when assignee changes */
  onChange: (assigneeId: string | null) => void;

  /** List of users to display in dropdown */
  users: User[];

  /** Whether the select is disabled (e.g., during save) */
  disabled?: boolean;

  /** Whether the select should take full width of its container */
  fullWidth?: boolean;
}

export function AssigneeSelect({
  value,
  onChange,
  users,
  disabled,
  fullWidth = false,
}: AssigneeSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : newValue);
  };

  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{ minWidth: fullWidth ? undefined : 160 }}>
      <InputLabel id="assignee-select-label">Assignee</InputLabel>
      <Select
        labelId="assignee-select-label"
        id="assignee-select"
        value={value ?? ''}
        label="Assignee"
        onChange={handleChange}
        disabled={disabled}
        aria-label="Assignee"
        sx={{ minHeight: 44 }}
      >
        <MenuItem value="" sx={{ minHeight: 44 }}>
          <em>Unassigned</em>
        </MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id} sx={{ minHeight: 44 }}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
