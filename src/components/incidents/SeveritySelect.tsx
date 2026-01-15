import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SeverityChip } from '../common/SeverityChip';
import type { IncidentSeverity } from '../../api/types';

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

interface SeveritySelectProps {
  /** Current severity value */
  value: IncidentSeverity;

  /** Callback when severity changes */
  onChange: (severity: IncidentSeverity) => void;

  /** Whether the select is disabled (e.g., during save) */
  disabled?: boolean;

  /** Whether the select should take full width of its container */
  fullWidth?: boolean;
}

export function SeveritySelect({ value, onChange, disabled, fullWidth = false }: SeveritySelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as IncidentSeverity);
  };

  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{ minWidth: fullWidth ? undefined : 140 }}>
      <InputLabel id="severity-select-label">Severity</InputLabel>
      <Select
        labelId="severity-select-label"
        id="severity-select"
        value={value}
        label="Severity"
        onChange={handleChange}
        disabled={disabled}
        aria-label="Severity"
        sx={{ minHeight: 44 }}
        renderValue={(selected) => <SeverityChip severity={selected as IncidentSeverity} size="small" />}
      >
        {SEVERITY_OPTIONS.map((s) => (
          <MenuItem key={s} value={s} sx={{ minHeight: 44 }}>
            <SeverityChip severity={s} size="small" />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
