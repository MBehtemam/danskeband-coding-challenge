import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { SeveritySelect } from './SeveritySelect';
import { AssigneeSelect } from './AssigneeSelect';
import { useCreateIncident } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import type { IncidentSeverity, CreateIncidentInput } from '../../api/types';

interface CreateIncidentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateIncidentDialog({ open, onClose }: CreateIncidentDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const createIncident = useCreateIncident();
  const { data: users } = useUsers();

  const handleSubmit = useCallback(() => {
    // Inline validation
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const input: CreateIncidentInput = {
      title: title.trim(),
      description: description.trim(),
      severity,
      assigneeId,
    };

    createIncident.mutate(input, {
      onSuccess: () => {
        // Reset form and close dialog
        setTitle('');
        setDescription('');
        setSeverity('Medium');
        setAssigneeId(null);
        setErrors({});
        onClose();
      },
    });
  }, [title, description, severity, assigneeId, createIncident, onClose]);

  const handleClose = useCallback(() => {
    if (!createIncident.isPending) {
      setTitle('');
      setDescription('');
      setSeverity('Medium');
      setAssigneeId(null);
      setErrors({});
      onClose();
    }
  }, [createIncident.isPending, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="create-incident-dialog-title"
    >
      <DialogTitle id="create-incident-dialog-title">Create New Incident</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Error Alert - Top of dialog content */}
          {createIncident.isError && (
            <Alert severity="error" sx={{ mb: 2 }} role="alert">
              {createIncident.error?.message || 'Failed to create incident. Please try again.'}
            </Alert>
          )}

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            fullWidth
            autoFocus
            inputProps={{ maxLength: 200, 'aria-label': 'Incident title' }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description || `${description.length}/2000`}
            multiline
            rows={4}
            fullWidth
            inputProps={{ maxLength: 2000, 'aria-label': 'Incident description' }}
          />

          {/* Severity Select - Using refactored component */}
          <SeveritySelect
            value={severity}
            onChange={setSeverity}
            disabled={createIncident.isPending}
            fullWidth
          />

          {/* Assignee Select - Using refactored component */}
          <AssigneeSelect
            value={assigneeId}
            onChange={setAssigneeId}
            users={users || []}
            disabled={createIncident.isPending}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={createIncident.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createIncident.isPending}
        >
          {createIncident.isPending ? 'Creating...' : 'Create Incident'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
