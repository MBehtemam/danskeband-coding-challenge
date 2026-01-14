import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { AppLayout } from '../layout/AppLayout';
import { IncidentTable } from './IncidentTable';
import { CreateIncidentDialog } from './CreateIncidentDialog';

export function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleOpenCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  return (
    <AppLayout>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          aria-label="Create new incident"
        >
          Create Incident
        </Button>
      </Box>
      <IncidentTable />
      <CreateIncidentDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </AppLayout>
  );
}
