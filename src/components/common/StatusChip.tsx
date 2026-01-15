import Chip from '@mui/material/Chip';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CheckIcon from '@mui/icons-material/Check';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { IncidentStatus } from '../../api/types';
import { statusColors } from '../../theme';

/**
 * Configuration for a single status option
 */
interface StatusConfig {
  /** Hex color code for chip background */
  backgroundColor: string;
  /** Hex color code for chip text */
  textColor: string;
  /** MUI icon component to display in chip */
  icon: React.ComponentType<SvgIconProps>;
  /** Display label */
  label: string;
}

/**
 * Status configuration map with Danske Bank brand colors and workflow icons.
 * Icons provide visual differentiation for color-blind users (FR-017).
 */
export const STATUS_CONFIG: Record<IncidentStatus, StatusConfig> = {
  Open: {
    backgroundColor: statusColors.open.background,
    textColor: statusColors.open.text,
    icon: HourglassEmptyOutlinedIcon,
    label: 'Open',
  },
  'In Progress': {
    backgroundColor: statusColors.inProgress.background,
    textColor: statusColors.inProgress.text,
    icon: AutorenewOutlinedIcon,
    label: 'In Progress',
  },
  Resolved: {
    backgroundColor: statusColors.resolved.background,
    textColor: statusColors.resolved.text,
    icon: CheckIcon,
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
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        '& .MuiChip-icon': {
          color: config.textColor,
        },
      }}
    />
  );
}
