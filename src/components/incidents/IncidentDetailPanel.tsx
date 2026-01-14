import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { SeverityChip } from '../common/SeverityChip';
import { StatusHistoryTimeline } from './StatusHistoryTimeline';
import { StatusSelect } from './StatusSelect';
import { AssigneeSelect } from './AssigneeSelect';
import { formatDateTime } from '../../utils/dateUtils';
import type { Incident } from '../../api/types';

interface IncidentDetailPanelProps {
  incident: Incident;
}

export function IncidentDetailPanel({ incident }: IncidentDetailPanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {/* Left column - Main details */}
        <Box sx={{ flex: { xs: '1 1 auto', md: '2 1 0' } }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {incident.title}
          </Typography>

          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {incident.description || 'No description provided.'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
              mb: 2,
              alignItems: 'flex-end',
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Status
              </Typography>
              <StatusSelect
                incidentId={incident.id}
                currentStatus={incident.status}
              />
            </Box>
            <Box sx={{ width: isMobile ? '100%' : 'auto', minHeight: 44, display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Severity
                </Typography>
                <SeverityChip severity={incident.severity} />
              </Box>
            </Box>
            <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Assignee
              </Typography>
              <AssigneeSelect
                incidentId={incident.id}
                currentAssigneeId={incident.assigneeId}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Created
              </Typography>
              <Typography variant="body2">
                {formatDateTime(incident.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {formatDateTime(incident.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right column - Status history */}
        <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0' } }}>
          <Typography variant="subtitle2" gutterBottom>
            Status History
          </Typography>
          <StatusHistoryTimeline history={incident.statusHistory} />
        </Box>
      </Box>
    </Paper>
  );
}
