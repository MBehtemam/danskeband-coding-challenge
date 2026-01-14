import Chip from '@mui/material/Chip';
import type { IncidentStatus } from '../../api/types';

const statusColorMap: Record<IncidentStatus, 'info' | 'warning' | 'success'> = {
  Open: 'info',
  'In Progress': 'warning',
  Resolved: 'success',
};

interface StatusChipProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  return (
    <Chip
      label={status}
      color={statusColorMap[status]}
      size={size}
      aria-label={`Status: ${status}`}
    />
  );
}
