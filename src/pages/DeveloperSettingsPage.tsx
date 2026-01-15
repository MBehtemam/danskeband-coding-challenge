import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { AppLayout } from '../components/layout/AppLayout';
import { DummyIncidentCreator } from '../components/settings/DummyIncidentCreator';
import { DummyIncidentList } from '../components/settings/DummyIncidentList';

/**
 * Developer Settings page for managing dummy test incidents.
 * Allows creating dummy incidents with random data and deleting them.
 */
export function DeveloperSettingsPage() {
  return (
    <AppLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Developer Settings
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage test data for development and testing purposes. Dummy incidents
          created here can be deleted, while regular incidents cannot be deleted.
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create Dummy Incident
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Generate a new incident with random test data. Dummy incidents are
            marked and can be identified in the main incident table.
          </Typography>
          <DummyIncidentCreator />
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Dummy Incidents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            View and manage all dummy incidents. Only dummy incidents can be deleted.
          </Typography>
          <DummyIncidentList />
        </Paper>
      </Box>
    </AppLayout>
  );
}
