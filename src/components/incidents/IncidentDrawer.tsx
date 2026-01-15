import { useEffect, useRef, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useIncidentForm } from '../../hooks/useIncidentForm';
import { IncidentDetailForm } from './IncidentDetailForm';
import type { Incident, User } from '../../api/types';

interface IncidentDrawerProps {
  /** The incident to display, or null if none selected */
  incident: Incident | null;

  /** Callback when drawer should close */
  onClose: () => void;

  /** List of users for assignee selection */
  users: User[];
}

// Responsive drawer width
const drawerWidth = {
  xs: '100%',
  sm: '400px',
  md: '33%',
};

export function IncidentDrawer({ incident, onClose, users }: IncidentDrawerProps) {
  // If no incident, don't render
  if (!incident) {
    return null;
  }

  return (
    <IncidentDrawerContent incident={incident} onClose={onClose} users={users} />
  );
}

// Separate component to ensure hooks are only called when incident exists
function IncidentDrawerContent({
  incident,
  onClose,
  users,
}: {
  incident: Incident;
  onClose: () => void;
  users: User[];
}) {
  // Use the form hook for state management
  const form = useIncidentForm(incident);

  // Ref to the close button for initial focus
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close drawer
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Set up keyboard listener and focus management
  useEffect(() => {
    // Add Escape key listener
    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button when drawer opens
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      variant="persistent"
      role="dialog"
      aria-labelledby="incident-drawer-title"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          id="incident-drawer-title"
          variant="h6"
          component="h1"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            mr: 1,
          }}
        >
          Incident Details
        </Typography>
        <IconButton
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close drawer"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form Content */}
      <IncidentDetailForm
        incident={incident}
        formValues={form.formValues}
        hasChanges={form.hasChanges}
        isSaving={form.isSaving}
        saveError={form.saveError}
        saveSuccess={form.saveSuccess}
        users={users}
        onStatusChange={form.setStatus}
        onSeverityChange={form.setSeverity}
        onAssigneeChange={form.setAssigneeId}
        onSave={form.handleSave}
        onCancel={form.handleCancel}
        onClose={onClose}
      />
    </Drawer>
  );
}
