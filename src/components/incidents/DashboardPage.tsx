import { useState, useCallback } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { IncidentTable } from './IncidentTable';
import { CreateIncidentDialog } from './CreateIncidentDialog';
import { SavedViewsProvider } from '../../contexts/SavedViewsContext';

export function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleOpenCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  return (
    <SavedViewsProvider>
      <AppLayout>
        <IncidentTable onCreateClick={handleOpenCreateDialog} />
        <CreateIncidentDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
        />
      </AppLayout>
    </SavedViewsProvider>
  );
}
