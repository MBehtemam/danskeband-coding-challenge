/**
 * SavedViewsDropdown Component
 *
 * Feature: 011-saved-views
 * User Story: US001 - View Selection
 * Task: T034 - Implement SavedViewsDropdown component
 *
 * A dropdown selector for saved views with the following features:
 * - Button shows current view name or "Default View"
 * - Menu with list of saved views
 * - "Default View" option at top to clear active view
 * - "Create New View" button at bottom
 * - Active view indicator with checkmark
 * - Relative timestamps for views
 * - Keyboard navigation support
 */

import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSavedViews } from '../../../contexts/SavedViewsContext';
import { formatRelativeTime } from '../../../utils/dateUtils';

export interface SavedViewsDropdownProps {
  onCreateNew: () => void;
  onViewSelect: (viewId: string | null) => void;
  onRename?: (viewId: string) => void;
  onUpdate?: (viewId: string) => void;
  onDelete?: (viewId: string) => void;
}

export function SavedViewsDropdown({
  onCreateNew,
  onViewSelect,
  onRename,
  onUpdate,
  onDelete,
}: SavedViewsDropdownProps) {
  const { savedViews, activeViewId, isDirty } = useSavedViews();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Get the current view name with dirty indicator
  const currentViewName = activeViewId
    ? `${savedViews.find(v => v.id === activeViewId)?.name ?? 'Default View'}${isDirty ? ' *' : ''}`
    : 'Default View';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewSelect = (viewId: string | null) => {
    onViewSelect(viewId);
    handleClose();
  };

  const handleCreateNew = () => {
    onCreateNew();
    handleClose();
  };

  const handleRename = (event: MouseEvent<HTMLButtonElement>, viewId: string) => {
    event.stopPropagation(); // Prevent menu item click
    onRename?.(viewId);
    handleClose();
  };

  const handleUpdate = (event: MouseEvent<HTMLButtonElement>, viewId: string) => {
    event.stopPropagation(); // Prevent menu item click
    onUpdate?.(viewId);
    handleClose();
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, viewId: string) => {
    event.stopPropagation(); // Prevent menu item click
    onDelete?.(viewId);
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls={open ? 'saved-views-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        variant="text"
        sx={{
          textTransform: 'none',
          justifyContent: 'space-between',
          minWidth: '200px',
        }}
      >
        {currentViewName}
      </Button>
      <Menu
        id="saved-views-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'saved-views-button',
          dense: false,
        }}
        PaperProps={{
          sx: {
            minWidth: '250px',
            maxHeight: '400px',
          },
        }}
      >
        {/* Default View Option */}
        <MenuItem
          onClick={() => handleViewSelect(null)}
          selected={activeViewId === null}
        >
          <ListItemIcon sx={{ minWidth: '32px' }}>
            {activeViewId === null && <CheckIcon data-testid="CheckIcon" fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={activeViewId === null ? 600 : 400}>
              Default View
            </Typography>
          </ListItemText>
        </MenuItem>

        {/* Divider if there are saved views */}
        {savedViews.length > 0 && <Divider />}

        {/* Saved Views */}
        {savedViews.map(view => {
          const isActive = activeViewId === view.id;
          return (
            <MenuItem
              key={view.id}
              onClick={() => handleViewSelect(view.id)}
              selected={isActive}
              sx={{
                '&:hover .action-buttons': {
                  opacity: 1,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '32px' }}>
                {isActive && <CheckIcon data-testid="CheckIcon" fontSize="small" />}
              </ListItemIcon>
              <ListItemText>
                <Box>
                  <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                    {view.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created {formatRelativeTime(view.createdAt)}
                  </Typography>
                </Box>
              </ListItemText>
              {/* Action buttons - shown on hover */}
              <Box
                className="action-buttons"
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <Tooltip title="Rename view">
                  <IconButton
                    size="small"
                    onClick={(e) => handleRename(e, view.id)}
                    aria-label={`Rename ${view.name}`}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {isActive && isDirty && (
                  <Tooltip title="Update view with current config">
                    <IconButton
                      size="small"
                      onClick={(e) => handleUpdate(e, view.id)}
                      aria-label={`Update ${view.name}`}
                    >
                      <UpdateIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete view">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(e, view.id)}
                    aria-label={`Delete ${view.name}`}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
          );
        })}

        {/* Create New View Button */}
        <Divider />
        <MenuItem onClick={handleCreateNew}>
          <ListItemIcon sx={{ minWidth: '32px' }}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Create New View
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
