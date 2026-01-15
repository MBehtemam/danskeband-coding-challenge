import Box from '@mui/material/Box';
import { SeverityChip, SEVERITY_CONFIG } from '../../common/SeverityChip';
import type { IncidentSeverity } from '../../../api/types';

interface SeverityFilterChipProps {
  severity: IncidentSeverity;
}

/**
 * Severity chip component for use in filter dropdown menus.
 * Displays a smaller version of the SeverityChip for filter selections.
 */
export function SeverityFilterChip({ severity }: SeverityFilterChipProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SeverityChip severity={severity} size="small" />
    </Box>
  );
}

/**
 * Get all severity filter options with chip rendering
 */
export const SEVERITY_FILTER_OPTIONS: IncidentSeverity[] = [
  'Critical',
  'High',
  'Medium',
  'Low',
];

export { SEVERITY_CONFIG };
