import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import { useCreateIncident } from '../../hooks/useIncidents';
import type { CreateIncidentInput, IncidentSeverity } from '../../api/types';

// Random data for generating dummy incidents
const TITLES = [
  'Database connection timeout',
  'API endpoint returning 500',
  'UI component not rendering',
  'Memory leak detected',
  'Authentication failure',
  'Payment processing error',
  'Cache invalidation issue',
  'Network latency spike',
  'Data sync failure',
  'Security vulnerability found',
  'Performance degradation',
  'Mobile app crash',
  'Email service outage',
  'Search functionality broken',
  'User session expired unexpectedly',
];

const DESCRIPTIONS = [
  'Users are experiencing issues with this functionality. Impact is moderate.',
  'This issue is affecting production systems. Needs immediate attention.',
  'Intermittent problem reported by multiple users. Investigating root cause.',
  'Low priority issue that can be addressed in the next sprint.',
  'Critical system component is failing. Business impact is high.',
  'Performance tests revealed this problem. Needs optimization.',
  'User feedback indicates this is causing confusion. UX improvement needed.',
  'Monitoring alerts triggered for this issue. Checking system health.',
];

const SEVERITIES: IncidentSeverity[] = ['Critical', 'High', 'Medium', 'Low'];

const USER_IDS = ['user-1', 'user-2', 'user-3', 'user-4', null];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDummyIncident(): CreateIncidentInput {
  return {
    title: `[Test] ${randomFrom(TITLES)}`,
    description: randomFrom(DESCRIPTIONS),
    severity: randomFrom(SEVERITIES),
    assigneeId: randomFrom(USER_IDS),
    isDummy: true,
  };
}

/**
 * Component for creating dummy/test incidents with random data.
 */
export function DummyIncidentCreator() {
  const createIncident = useCreateIncident();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreate = () => {
    const incident = generateDummyIncident();
    createIncident.mutate(incident, {
      onSuccess: (data) => {
        setSuccessMessage(`Created dummy incident: "${data.title}"`);
        setTimeout(() => setSuccessMessage(null), 3000);
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={
          createIncident.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <AddIcon />
          )
        }
        onClick={handleCreate}
        disabled={createIncident.isPending}
      >
        {createIncident.isPending ? 'Creating...' : 'Add Dummy Incident'}
      </Button>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {createIncident.isError && (
        <Alert severity="error">
          Failed to create incident: {createIncident.error.message}
        </Alert>
      )}
    </Box>
  );
}
