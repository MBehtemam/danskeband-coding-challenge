import Chip from '@mui/material/Chip';
import type { IncidentSeverity } from '../../api/types';
import { severityColors } from '../../theme';

/**
 * Configuration for a single severity option
 */
interface SeverityConfig {
  /** Hex color code for chip background */
  backgroundColor: string;
  /** Hex color code for chip text */
  textColor: string;
  /** Display label */
  label: string;
}

/**
 * Severity configuration map with Danske Bank brand urgency colors.
 * Red→Orange→Gold→Green progression represents severity level.
 * No icons are used for severity to maintain visual distinction from status chips.
 */
export const SEVERITY_CONFIG: Record<IncidentSeverity, SeverityConfig> = {
  Low: {
    backgroundColor: severityColors.low.background,
    textColor: severityColors.low.text,
    label: 'Low',
  },
  Medium: {
    backgroundColor: severityColors.medium.background,
    textColor: severityColors.medium.text,
    label: 'Medium',
  },
  High: {
    backgroundColor: severityColors.high.background,
    textColor: severityColors.high.text,
    label: 'High',
  },
  Critical: {
    backgroundColor: severityColors.critical.background,
    textColor: severityColors.critical.text,
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
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
    />
  );
}
