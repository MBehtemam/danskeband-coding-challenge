import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useCreateIncident } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import type { IncidentSeverity, CreateIncidentInput } from '../../api/types';

const SEVERITIES: IncidentSeverity[] = ['Critical', 'High', 'Medium', 'Low'];

interface CreateIncidentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateIncidentDialog({ open, onClose }: CreateIncidentDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
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
      assigneeId: assigneeId || null,
    };

    createIncident.mutate(input, {
      onSuccess: () => {
        // Reset form and close dialog
        setTitle('');
        setDescription('');
        setSeverity('Medium');
        setAssigneeId('');
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
      setAssigneeId('');
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
          {createIncident.isError && (
            <Alert severity="error">
              Failed to create incident. Please try again.
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

          <FormControl fullWidth>
            <InputLabel id="severity-select-label">Severity</InputLabel>
            <Select
              labelId="severity-select-label"
              value={severity}
              label="Severity"
              onChange={(e: SelectChangeEvent) =>
                setSeverity(e.target.value as IncidentSeverity)
              }
              aria-label="Select incident severity"
            >
              {SEVERITIES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="assignee-select-label">Assignee (Optional)</InputLabel>
            <Select
              labelId="assignee-select-label"
              value={assigneeId}
              label="Assignee (Optional)"
              onChange={(e: SelectChangeEvent) => setAssigneeId(e.target.value)}
              aria-label="Select incident assignee"
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
