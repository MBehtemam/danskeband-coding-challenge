/**
 * SaveViewPanel Component
 *
 * Feature: 011-saved-views
 * User Story 1: Save Current View
 * Task: T033 - Implement SaveViewPanel component
 *
 * A drawer panel for saving/renaming table view configurations.
 * Displays a form with name input and preview of the current configuration.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import { useSavedViews } from '../../../contexts/SavedViewsContext';
import type { ViewConfig } from '../../../types/savedViews';
import { MAX_VIEW_NAME_LENGTH } from '../../../types/savedViews';

export interface SaveViewPanelProps {
  /** Whether the drawer is open */
  open: boolean;

  /** Callback when drawer should close */
  onClose: () => void;

  /** Callback when view should be saved with the given name */
  onSave: (name: string) => void;

  /** Current table configuration to preview and save */
  currentConfig: ViewConfig;

  /** Mode: 'create' (default) or 'rename' */
  mode?: 'create' | 'rename';

  /** Initial name for rename mode */
  initialName?: string;
}

// Responsive drawer width (similar to IncidentDrawer)
const drawerWidth = {
  xs: '100%',
  sm: '400px',
  md: '33%',
};

/**
 * SaveViewPanel Component
 */
export function SaveViewPanel({
  open,
  onClose,
  onSave,
  currentConfig,
  mode = 'create',
  initialName = '',
}: SaveViewPanelProps) {
  const [viewName, setViewName] = useState(initialName);
  const [validationError, setValidationError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const { validateViewName } = useSavedViews();

  // Reset state when drawer opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setViewName(initialName);
      setValidationError(undefined);
      setTouched(false);
    }
  }, [open, initialName]);

  // Auto-focus name field when drawer opens
  useEffect(() => {
    if (open && nameFieldRef.current) {
      // Small delay to ensure drawer animation completes
      const timer = setTimeout(() => {
        nameFieldRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Real-time validation
  useEffect(() => {
    if (touched || viewName.length > 0) {
      const result = validateViewName(viewName);
      setValidationError(result.valid ? undefined : result.error);
    }
  }, [viewName, validateViewName, touched]);

  // Handle name change
  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setViewName(event.target.value);
    setTouched(true);
  }, []);

  // Handle name blur
  const handleNameBlur = useCallback(() => {
    setTouched(true);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    setTouched(true);
    const result = validateViewName(viewName);

    if (!result.valid) {
      setValidationError(result.error);
      return;
    }

    // Call onSave with trimmed name
    onSave(viewName.trim());
  }, [viewName, validateViewName, onSave]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, handleKeyDown]);

  // Check if save button should be disabled
  const isSaveDisabled = !viewName.trim() || !!validationError;

  // Determine title based on mode
  const title = mode === 'rename' ? 'Rename View' : 'Save View';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      role="dialog"
      aria-labelledby="save-view-drawer-title"
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
          id="save-view-drawer-title"
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
          {title}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close drawer" size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Name Input */}
        <TextField
          inputRef={nameFieldRef}
          label="View Name"
          value={viewName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          error={touched && !!validationError}
          helperText={
            touched && validationError
              ? validationError
              : `${viewName.length}/${MAX_VIEW_NAME_LENGTH}`
          }
          required
          fullWidth
          inputProps={{
            maxLength: MAX_VIEW_NAME_LENGTH,
            'aria-label': 'View name',
          }}
        />

        <Divider />

        {/* Config Preview */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Preview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This view will save your current table configuration:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Hidden Columns */}
            {Object.keys(currentConfig.columnVisibility).filter(
              (key) => currentConfig.columnVisibility[key] === false
            ).length > 0 && (
              <PreviewSection
                icon={<VisibilityOffIcon fontSize="small" />}
                title="Hidden Columns"
                items={Object.keys(currentConfig.columnVisibility)
                  .filter((key) => currentConfig.columnVisibility[key] === false)
                  .map((col) => col)}
              />
            )}

            {/* Active Filters */}
            {currentConfig.columnFilters.length > 0 && (
              <PreviewSection
                icon={<FilterAltIcon fontSize="small" />}
                title="Active Filters"
                items={currentConfig.columnFilters.map(
                  (filter) => `${filter.id}: ${String(filter.value)}`
                )}
              />
            )}

            {/* Sorting */}
            {currentConfig.sorting.length > 0 && (
              <PreviewSection
                icon={<SortIcon fontSize="small" />}
                title="Sorting"
                items={currentConfig.sorting.map(
                  (sort) => `${sort.id} (${sort.desc ? 'descending' : 'ascending'})`
                )}
              />
            )}

            {/* Global Filter */}
            {currentConfig.globalFilter && (
              <PreviewSection
                icon={<SearchIcon fontSize="small" />}
                title="Global Filter"
                items={[currentConfig.globalFilter]}
              />
            )}

            {/* No customizations message */}
            {Object.keys(currentConfig.columnVisibility).filter(
              (key) => currentConfig.columnVisibility[key] === false
            ).length === 0 &&
              currentConfig.columnFilters.length === 0 &&
              currentConfig.sorting.length === 0 &&
              !currentConfig.globalFilter && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No customizations applied yet
                </Typography>
              )}
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          p: 2,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={handleCancel} aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaveDisabled}
          aria-label="Save"
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
}

/**
 * PreviewSection Component
 * Displays a section of the config preview
 */
interface PreviewSectionProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function PreviewSection({ icon, title, items }: PreviewSectionProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {items.map((item, index) => (
          <Chip key={index} label={item} size="small" variant="outlined" />
        ))}
      </Box>
    </Box>
  );
}
