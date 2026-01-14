import Chip from '@mui/material/Chip';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { IncidentStatus } from '../../api/types';

/**
 * Configuration for a single status option
 */
interface StatusConfig {
  /** Hex color code for chip background */
  color: string;
  /** MUI icon component to display in chip */
  icon: React.ComponentType<SvgIconProps>;
  /** Display label */
  label: string;
}

/**
 * Status configuration map with blue spectrum colors and workflow icons.
 * Blue colors represent workflow progression (neutral, not urgency).
 * Icons provide visual differentiation for color-blind users (FR-017).
 */
export const STATUS_CONFIG: Record<IncidentStatus, StatusConfig> = {
  Open: {
    color: '#42A5F5',
    icon: RadioButtonUncheckedIcon,
    label: 'Open',
  },
  'In Progress': {
    color: '#1E88E5',
    icon: PlayArrowIcon,
    label: 'In Progress',
  },
  Resolved: {
    color: '#1565C0',
    icon: CheckCircleIcon,
    label: 'Resolved',
  },
};

interface StatusChipProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;

  return (
    <Chip
      label={config.label}
      icon={<IconComponent sx={{ fontSize: size === 'small' ? '1rem' : '1.25rem' }} />}
      size={size}
      aria-label={`Status: ${status}`}
      sx={{
        backgroundColor: config.color,
        color: '#FFFFFF',
        '& .MuiChip-icon': {
          color: '#FFFFFF',
        },
      }}
    />
  );
}
