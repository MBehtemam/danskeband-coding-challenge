import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface SaveButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;

  /** Whether button is disabled (no changes) */
  disabled: boolean;

  /** Whether save operation is in progress */
  loading: boolean;

  /** Button text (default: "Save") */
  children?: React.ReactNode;
}

export function SaveButton({ onClick, disabled, loading, children }: SaveButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={loading ? 'Saving...' : (children?.toString() ?? 'Save')}
      sx={{ minWidth: 100, minHeight: 44 }}
    >
      {loading ? (
        <>
          <CircularProgress
            size={20}
            color="inherit"
            sx={{ mr: 1 }}
            role="progressbar"
            aria-label="Saving"
          />
          Saving...
        </>
      ) : (
        children ?? 'Save'
      )}
    </Button>
  );
}
