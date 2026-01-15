/**
 * DeleteViewDialog Component
 *
 * Feature: 011-saved-views
 * User Story 2: Manage Saved Views
 * Task: T047 - Create DeleteViewDialog component
 *
 * Confirmation dialog for deleting a saved view.
 * Displays warning message and provides Cancel/Delete actions.
 */

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useId } from 'react';
import type { SavedView } from '../../../types/savedViews';

export interface DeleteViewDialogProps {
  /** Whether the dialog is open */
  open: boolean;

  /** Callback when dialog should close (cancel, backdrop click, escape key) */
  onClose: () => void;

  /** The view to be deleted (required when open is true) */
  view?: SavedView;

  /** Callback when deletion is confirmed */
  onConfirm?: () => void;
}

/**
 * DeleteViewDialog Component
 *
 * Confirmation dialog for deleting a saved view with:
 * - Warning icon and destructive action styling
 * - View name display
 * - Irreversible action warning
 * - Cancel and Delete buttons
 * - Full keyboard and accessibility support
 *
 * @example
 * ```tsx
 * <DeleteViewDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   view={viewToDelete}
 *   onConfirm={() => {
 *     deleteView(viewToDelete.id);
 *     setIsOpen(false);
 *   }}
 * />
 * ```
 */
export default function DeleteViewDialog({
  open,
  onClose,
  view,
  onConfirm,
}: DeleteViewDialogProps): JSX.Element {
  const titleId = useId();
  const descriptionId = useId();

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        role: 'alertdialog',
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        'aria-modal': 'true',
      }}
    >
      <DialogTitle id={titleId}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="error" />
          Delete Saved View?
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id={descriptionId}>
          Are you sure you want to delete '{view?.name || 'this view'}'? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} autoFocus>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
