import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Tooltip label shown on hover (default: "Copy ID") */
  label?: string;
  /** Button size variant */
  size?: 'small' | 'medium';
}

/**
 * CopyButton component for copying text to clipboard with visual feedback.
 * Shows success/error states with icon and tooltip changes.
 * Feedback resets after 2000ms (matches useCopyToClipboard timeout).
 */
export function CopyButton({ text, label = 'Copy ID', size = 'small' }: CopyButtonProps) {
  const { isCopied, isError, copy } = useCopyToClipboard();

  const handleClick = async () => {
    await copy(text);
  };

  // Determine current state for display
  const getTooltipTitle = (): string => {
    if (isCopied) return 'Copied!';
    if (isError) return 'Failed to copy';
    return label;
  };

  const getAriaLabel = (): string => {
    if (isCopied) return 'Copied!';
    if (isError) return 'Failed to copy';
    return label;
  };

  const getIcon = () => {
    if (isCopied) {
      return <CheckCircleIcon sx={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }} />;
    }
    if (isError) {
      return <ErrorIcon sx={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }} />;
    }
    return <ContentCopyIcon sx={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }} />;
  };

  const getColor = (): 'default' | 'success' | 'error' => {
    if (isCopied) return 'success';
    if (isError) return 'error';
    return 'default';
  };

  return (
    <Tooltip title={getTooltipTitle()} arrow>
      <IconButton
        onClick={handleClick}
        size={size}
        color={getColor()}
        aria-label={getAriaLabel()}
        sx={{ minWidth: 44, minHeight: 44 }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
