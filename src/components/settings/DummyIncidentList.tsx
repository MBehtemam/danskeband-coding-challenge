import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useIncidents, useDeleteIncident } from '../../hooks/useIncidents';
import { StatusChip } from '../common/StatusChip';
import { SeverityChip } from '../common/SeverityChip';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { Incident } from '../../api/types';

/**
 * Component for displaying and managing dummy incidents.
 * Allows deletion of dummy incidents with confirmation dialog.
 */
export function DummyIncidentList() {
  const { data: incidents, isLoading, error } = useIncidents();
  const deleteIncident = useDeleteIncident();
  const [deleteTarget, setDeleteTarget] = useState<Incident | null>(null);

  // Filter to only show dummy incidents
  const dummyIncidents = incidents?.filter((inc) => inc.isDummy) ?? [];

  const handleDeleteClick = useCallback((incident: Incident) => {
    setDeleteTarget(incident);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;

    deleteIncident.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  }, [deleteTarget, deleteIncident]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load incidents: {error.message}
      </Alert>
    );
  }

  if (dummyIncidents.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No dummy incidents found. Create one using the button above.
      </Typography>
    );
  }

  return (
    <>
      <List sx={{ width: '100%' }}>
        {dummyIncidents.map((incident) => (
          <ListItem
            key={incident.id}
            divider
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`Delete ${incident.title}`}
                onClick={() => handleDeleteClick(incident)}
                disabled={deleteIncident.isPending}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" component="span">
                    {incident.title}
                  </Typography>
                  <StatusChip status={incident.status} size="small" />
                  <SeverityChip severity={incident.severity} size="small" />
                </Box>
              }
              secondary={`Created ${formatRelativeTime(incident.createdAt)}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Dummy Incident?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteIncident.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteIncident.isPending}
            startIcon={deleteIncident.isPending && <CircularProgress size={16} color="inherit" />}
          >
            {deleteIncident.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {deleteIncident.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to delete incident: {deleteIncident.error.message}
        </Alert>
      )}
    </>
  );
}
