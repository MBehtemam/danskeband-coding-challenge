import Chip from '@mui/material/Chip';
import type { IncidentSeverity } from '../../api/types';

/**
 * Configuration for a single severity option
 */
interface SeverityConfig {
  /** Hex color code for chip background */
  color: string;
  /** Display label */
  label: string;
}

/**
 * Severity configuration map with urgency colors (green to red gradient).
 * These colors represent urgency intensity and are distinct from status colors.
 * No icons are used for severity to maintain visual distinction from status chips.
 */
export const SEVERITY_CONFIG: Record<IncidentSeverity, SeverityConfig> = {
  Low: {
    color: '#4CAF50',
    label: 'Low',
  },
  Medium: {
    color: '#2196F3',
    label: 'Medium',
  },
  High: {
    color: '#FF9800',
    label: 'High',
  },
  Critical: {
    color: '#F44336',
    label: 'Critical',
  },
};

interface SeverityChipProps {
  severity: IncidentSeverity;
  size?: 'small' | 'medium';
}

export function SeverityChip({ severity, size = 'small' }: SeverityChipProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <Chip
      label={config.label}
      size={size}
      aria-label={`Severity: ${severity}`}
      sx={{
        backgroundColor: config.color,
        color: '#FFFFFF',
      }}
    />
  );
}
