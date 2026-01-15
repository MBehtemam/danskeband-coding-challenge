import Box from '@mui/material/Box';
import { StatusChip, STATUS_CONFIG } from '../../common/StatusChip';
import type { IncidentStatus } from '../../../api/types';

interface StatusFilterChipProps {
  status: IncidentStatus;
}

/**
 * Status chip component for use in filter dropdown menus.
 * Displays a smaller version of the StatusChip for filter selections.
 */
export function StatusFilterChip({ status }: StatusFilterChipProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <StatusChip status={status} size="small" />
    </Box>
  );
}

/**
 * Get all status filter options with chip rendering
 */
export const STATUS_FILTER_OPTIONS: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

export { STATUS_CONFIG };
