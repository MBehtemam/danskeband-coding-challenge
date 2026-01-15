import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StatusSelect } from './StatusSelect';
import { SeveritySelect } from './SeveritySelect';
import { AssigneeSelect } from './AssigneeSelect';
import { StatusHistoryTimeline } from './StatusHistoryTimeline';
import { SaveButton } from '../common/SaveButton';
import { CopyButton } from '../common/CopyButton';
import { formatDateTime } from '../../utils/dateUtils';
import type { Incident, User, IncidentStatus, IncidentSeverity } from '../../api/types';
import type { IncidentFormValues } from '../../types/form';

interface IncidentDetailFormProps {
  /** The incident being edited */
  incident: Incident;

  /** Current form values */
  formValues: IncidentFormValues;

  /** Whether there are unsaved changes */
  hasChanges: boolean;

  /** Whether save is in progress */
  isSaving: boolean;

  /** Error from save operation */
  saveError: Error | null;

  /** Whether save was successful */
  saveSuccess: boolean;

  /** List of users for assignee dropdown */
  users: User[];

  /** Callback when status changes */
  onStatusChange: (status: IncidentStatus) => void;

  /** Callback when severity changes */
  onSeverityChange: (severity: IncidentSeverity) => void;

  /** Callback when assignee changes */
  onAssigneeChange: (assigneeId: string | null) => void;

  /** Callback when Save button is clicked */
  onSave: () => void;

  /** Callback when Cancel button is clicked (reverts changes) */
  onCancel: () => void;

  /** Callback to close the panel (for cancel-when-no-changes) */
  onClose: () => void;
}

export function IncidentDetailForm({
  incident,
  formValues,
  hasChanges,
  isSaving,
  saveError,
  saveSuccess,
  users,
  onStatusChange,
  onSeverityChange,
  onAssigneeChange,
  onSave,
  onCancel,
  onClose,
}: IncidentDetailFormProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main content area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
        {/* Error Alert - Top of form */}
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {saveError.message || 'Failed to save changes'}
          </Alert>
        )}

        {/* Section 1: Header */}
        <Box sx={{ mb: 2 }}>
          {/* Incident ID - subtle but accessible with copy button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              ID: {incident.id}
            </Typography>
            <CopyButton text={incident.id} label="Copy incident ID" size="small" />
          </Box>

          {/* Title - prominent */}
          <Typography variant="h6" component="h2" gutterBottom>
            {incident.title}
          </Typography>

          {/* Description */}
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {incident.description || 'No description provided.'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section 2: Editable Fields - Vertical layout for better touch targets */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Typography variant="subtitle2">Details</Typography>

          {/* Status Select - Using refactored component */}
          <StatusSelect
            value={formValues.status}
            onChange={onStatusChange}
            disabled={isSaving}
            fullWidth
          />

          {/* Severity Select - Full width */}
          <SeveritySelect
            value={formValues.severity}
            onChange={onSeverityChange}
            disabled={isSaving}
            fullWidth
          />

          {/* Assignee Select - Using refactored component */}
          <AssigneeSelect
            value={formValues.assigneeId}
            onChange={onAssigneeChange}
            users={users}
            disabled={isSaving}
            fullWidth
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section 3: Metadata */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

        <Divider sx={{ my: 2 }} />

        {/* Section 4: Status History - Collapsible */}
        <Accordion
          defaultExpanded
          slotProps={{ transition: { unmountOnExit: true } }}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="status-history-content"
            id="status-history-header"
            sx={{ px: 0 }}
          >
            <Typography variant="subtitle2">Status History</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            <StatusHistoryTimeline history={incident.statusHistory} />
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer with Save/Cancel buttons */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        aria-busy={isSaving}
      >
        {/* Cancel button - dual behavior: close when no changes, revert when changes */}
        <Button
          variant="outlined"
          onClick={hasChanges ? onCancel : onClose}
          disabled={isSaving}
          aria-label={hasChanges ? 'Cancel changes' : 'Close panel'}
        >
          Cancel
        </Button>

        {/* Save button */}
        <SaveButton
          onClick={onSave}
          disabled={!hasChanges}
          loading={isSaving}
        />
      </Box>

      {/* Success notification - Top center, 5s auto-dismiss */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Changes saved successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
