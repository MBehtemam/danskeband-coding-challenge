import Chip from '@mui/material/Chip';
import type { IncidentSeverity } from '../../api/types';

const severityColorMap: Record<
  IncidentSeverity,
  'error' | 'warning' | 'info' | 'success'
> = {
  Critical: 'error',
  High: 'warning',
  Medium: 'info',
  Low: 'success',
};

interface SeverityChipProps {
  severity: IncidentSeverity;
  size?: 'small' | 'medium';
}

export function SeverityChip({ severity, size = 'small' }: SeverityChipProps) {
  return (
    <Chip
      label={severity}
      color={severityColorMap[severity]}
      size={size}
      aria-label={`Severity: ${severity}`}
    />
  );
}
