import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentDetailForm } from './IncidentDetailForm';
import type { Incident, User } from '../../api/types';
import type { IncidentFormValues } from '../../types/form';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const mockIncident: Incident = {
  id: 'inc-1',
  title: 'Test Incident',
  description: 'Test description for the incident',
  status: 'Open',
  severity: 'High',
  assigneeId: 'user-1',
  createdAt: '2026-01-14T10:00:00Z',
  updatedAt: '2026-01-14T12:00:00Z',
  statusHistory: [
    { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-1' },
  ],
};

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@test.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@test.com' },
];

const defaultFormValues: IncidentFormValues = {
  status: 'Open',
  severity: 'High',
  assigneeId: 'user-1',
};

const defaultProps = {
  incident: mockIncident,
  formValues: defaultFormValues,
  hasChanges: false,
  isSaving: false,
  saveError: null,
  saveSuccess: false,
  users: mockUsers,
  onStatusChange: vi.fn(),
  onSeverityChange: vi.fn(),
  onAssigneeChange: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
  onClose: vi.fn(),
};

describe('IncidentDetailForm', () => {
  describe('read-only fields display', () => {
    it('displays incident title', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Test Incident')).toBeInTheDocument();
    });

    it('displays incident description', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Test description for the incident')).toBeInTheDocument();
    });

    it('displays description text', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Test description for the incident')).toBeInTheDocument();
    });

    it('displays created timestamp', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // Should contain the "Created" label
      expect(screen.getByText('Created')).toBeInTheDocument();
    });

    it('displays updated timestamp', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // Should contain the "Last Updated" label
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });

    it('displays status history', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Status History')).toBeInTheDocument();
    });

    it('shows "No description provided" when description is empty', () => {
      const incidentWithoutDesc = { ...mockIncident, description: '' };
      render(<IncidentDetailForm {...defaultProps} incident={incidentWithoutDesc} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/no description provided/i)).toBeInTheDocument();
    });
  });

  describe('editable fields', () => {
    it('renders status select with current value', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // Should have a status selector (combobox)
      const statusSelect = screen.getByRole('combobox', { name: /status/i });
      expect(statusSelect).toBeInTheDocument();
    });

    it('renders assignee select with current value', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // Should have an assignee selector (combobox)
      const assigneeSelect = screen.getByRole('combobox', { name: /assignee/i });
      expect(assigneeSelect).toBeInTheDocument();
    });

    it('calls onStatusChange when status is changed', async () => {
      const user = userEvent.setup();
      const onStatusChange = vi.fn();

      render(
        <IncidentDetailForm {...defaultProps} onStatusChange={onStatusChange} />,
        { wrapper: createWrapper() }
      );

      const statusSelect = screen.getByRole('combobox', { name: /status/i });
      await user.click(statusSelect);

      // Options now have chip aria-labels like "Status: In Progress"
      const inProgressOption = screen.getByRole('option', { name: /in progress/i });
      await user.click(inProgressOption);

      expect(onStatusChange).toHaveBeenCalledWith('In Progress');
    });

    it('calls onAssigneeChange when assignee is changed', async () => {
      const user = userEvent.setup();
      const onAssigneeChange = vi.fn();

      render(
        <IncidentDetailForm {...defaultProps} onAssigneeChange={onAssigneeChange} />,
        { wrapper: createWrapper() }
      );

      const assigneeSelect = screen.getByRole('combobox', { name: /assignee/i });
      await user.click(assigneeSelect);

      const bobOption = screen.getByRole('option', { name: 'Bob Smith' });
      await user.click(bobOption);

      expect(onAssigneeChange).toHaveBeenCalledWith('user-2');
    });

    it('renders severity select dropdown', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      const severitySelect = screen.getByRole('combobox', { name: /severity/i });
      expect(severitySelect).toBeInTheDocument();
    });

    it('calls onSeverityChange when severity is changed', async () => {
      const user = userEvent.setup();
      const onSeverityChange = vi.fn();

      render(
        <IncidentDetailForm {...defaultProps} onSeverityChange={onSeverityChange} />,
        { wrapper: createWrapper() }
      );

      const severitySelect = screen.getByRole('combobox', { name: /severity/i });
      await user.click(severitySelect);

      const criticalOption = screen.getByRole('option', { name: /critical/i });
      await user.click(criticalOption);

      expect(onSeverityChange).toHaveBeenCalledWith('Critical');
    });
  });

  describe('save and cancel buttons', () => {
    it('renders Save button', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders Cancel button (with Close panel label when no changes)', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // When no changes, button has "Close panel" aria-label
      expect(screen.getByRole('button', { name: /close panel/i })).toBeInTheDocument();
    });

    it('Save button is disabled when hasChanges is false', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('Save button is enabled when hasChanges is true', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();
    });

    it('calls onSave when Save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(
        <IncidentDetailForm {...defaultProps} hasChanges={true} onSave={onSave} />,
        { wrapper: createWrapper() }
      );

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(
        <IncidentDetailForm {...defaultProps} hasChanges={true} onCancel={onCancel} />,
        { wrapper: createWrapper() }
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('shows loading state on Save button when isSaving is true', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={true} isSaving={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });

    it('shows error message when saveError is set', () => {
      const error = new Error('Network error');

      render(
        <IncidentDetailForm {...defaultProps} hasChanges={true} saveError={error} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('shows success snackbar when saveSuccess is true', () => {
      render(<IncidentDetailForm {...defaultProps} saveSuccess={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('Changes saved successfully')).toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('displays incident ID in header section', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText(/inc-1/)).toBeInTheDocument();
    });

    it('displays copy button next to incident ID (FR-001)', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByRole('button', { name: /copy incident id/i })).toBeInTheDocument();
    });

    it('displays dropdowns in vertical layout (FR-010)', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // All three dropdowns should be present
      expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /severity/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /assignee/i })).toBeInTheDocument();
    });

    it('displays status chip in status dropdown (FR-012)', async () => {
      const user = userEvent.setup();
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // The status dropdown should show a chip for the current value
      const statusSelect = screen.getByRole('combobox', { name: /status/i });
      expect(statusSelect).toBeInTheDocument();

      // Click to open dropdown and verify chips in menu
      await user.click(statusSelect);

      // Options should display as chips
      const openOption = screen.getByRole('option', { name: /open/i });
      expect(openOption).toBeInTheDocument();
    });

    it('displays severity chip in severity dropdown (FR-013)', async () => {
      const user = userEvent.setup();
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // The severity dropdown should show a chip
      const severitySelect = screen.getByRole('combobox', { name: /severity/i });
      expect(severitySelect).toBeInTheDocument();

      // Click to open dropdown
      await user.click(severitySelect);

      // Options should display as chips
      const highOption = screen.getByRole('option', { name: /high/i });
      expect(highOption).toBeInTheDocument();
    });

    it('groups editable fields together with a section heading', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('displays metadata section with Created and Last Updated', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Created')).toBeInTheDocument();
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });

    it('wraps status history in a collapsible accordion', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      // Accordion should have a button role (the expand/collapse control)
      const accordionButton = screen.getByRole('button', { name: /status history/i });
      expect(accordionButton).toBeInTheDocument();
    });

    it('has accordion expanded by default', () => {
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      const accordionButton = screen.getByRole('button', { name: /status history/i });
      expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('can collapse the status history accordion', async () => {
      const user = userEvent.setup();
      render(<IncidentDetailForm {...defaultProps} />, { wrapper: createWrapper() });

      const accordionButton = screen.getByRole('button', { name: /status history/i });
      await user.click(accordionButton);

      expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('cancel button dual behavior', () => {
    it('calls onClose when Cancel is clicked and hasChanges is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onCancel = vi.fn();

      render(
        <IncidentDetailForm
          {...defaultProps}
          hasChanges={false}
          onClose={onClose}
          onCancel={onCancel}
        />,
        { wrapper: createWrapper() }
      );

      await user.click(screen.getByRole('button', { name: /close panel/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when Cancel is clicked and hasChanges is true', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onCancel = vi.fn();

      render(
        <IncidentDetailForm
          {...defaultProps}
          hasChanges={true}
          onClose={onClose}
          onCancel={onCancel}
        />,
        { wrapper: createWrapper() }
      );

      await user.click(screen.getByRole('button', { name: /cancel changes/i }));

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('Cancel button is never disabled except during save', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={false} isSaving={false} />, {
        wrapper: createWrapper(),
      });

      // Cancel button should be enabled even when no changes
      const cancelButton = screen.getByRole('button', { name: /close panel/i });
      expect(cancelButton).not.toBeDisabled();
    });

    it('Cancel button is disabled during save operation', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={true} isSaving={true} />, {
        wrapper: createWrapper(),
      });

      const cancelButton = screen.getByRole('button', { name: /cancel changes/i });
      expect(cancelButton).toBeDisabled();
    });

    it('has dynamic aria-label Close panel when no changes', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole('button', { name: /close panel/i })).toBeInTheDocument();
    });

    it('has dynamic aria-label Cancel changes when changes exist', () => {
      render(<IncidentDetailForm {...defaultProps} hasChanges={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole('button', { name: /cancel changes/i })).toBeInTheDocument();
    });
  });
});
