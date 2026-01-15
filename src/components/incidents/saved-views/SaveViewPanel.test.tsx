/**
 * SaveViewPanel Component Tests
 *
 * Feature: 011-saved-views
 * User Story 1: Save Current View
 * Task: T030 - Write component tests for SaveViewPanel in create mode
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveViewPanel } from './SaveViewPanel';
import { SavedViewsProvider, useSavedViews } from '../../../contexts/SavedViewsContext';
import type { ViewConfig } from '../../../types/savedViews';

// Test data
const mockViewConfig: ViewConfig = {
  columnVisibility: { status: false },
  columnFilters: [{ id: 'severity', value: 'Critical' }],
  columnFilterFns: {},
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: 'test search',
};

const emptyViewConfig: ViewConfig = {
  columnVisibility: {},
  columnFilters: [],
  columnFilterFns: {},
  sorting: [],
  globalFilter: '',
};

// Helper to render with SavedViewsProvider
function renderWithProvider(ui: React.ReactElement) {
  return render(<SavedViewsProvider>{ui}</SavedViewsProvider>);
}

describe('SaveViewPanel', () => {
  describe('Rendering', () => {
    it('should not render when open is false', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={false}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render in create mode by default', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.getByRole('dialog', { name: /save view/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/view name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render in rename mode when mode is "rename"', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
          mode="rename"
          initialName="My View"
        />
      );

      expect(screen.getByRole('dialog', { name: /rename view/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/view name/i)).toHaveValue('My View');
    });

    it('should have name field ready for input when drawer opens', async () => {
      const onClose = vi.fn();
      const onSave = vi.fn();
      const user = userEvent.setup();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      // Verify field is rendered and can receive input
      const nameField = screen.getByLabelText(/view name/i);
      expect(nameField).toBeInTheDocument();

      // Verify it can be typed into
      await user.type(nameField, 'Test');
      expect(nameField).toHaveValue('Test');
    });
  });

  describe('View Name Validation', () => {
    it('should show error for empty name', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);

      // Clear the field and trigger validation
      await user.clear(nameField);
      await user.tab(); // Blur to trigger validation

      // Wait for validation error to appear
      await vi.waitFor(() => {
        expect(screen.getByText(/view name is required/i)).toBeInTheDocument();
      });

      // Verify save button is disabled
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });

    it('should prevent name exceeding max length', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);

      // Try to enter a name longer than 100 characters
      const longName = 'a'.repeat(101);
      await user.clear(nameField);
      await user.type(nameField, longName);

      // Field should be truncated at 100 characters due to maxLength attribute
      expect(nameField).toHaveValue('a'.repeat(100));
    });

    it('should show error for duplicate name', async () => {
      const user = userEvent.setup();

      // First, render and create a view with name "Existing View"
      const { unmount } = renderWithProvider(<DuplicateTestHelper />);

      let nameField = screen.getByLabelText(/view name/i);
      let saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(nameField);
      await user.type(nameField, 'Existing View');
      await user.click(saveButton);

      // Clean up
      unmount();

      // Now render again with a new panel and try to create duplicate
      renderWithProvider(<DuplicateTestHelper />);

      nameField = screen.getByLabelText(/view name/i);

      await user.clear(nameField);
      await user.type(nameField, 'Existing View');

      // Wait for validation error to appear (real-time validation)
      await vi.waitFor(() => {
        expect(screen.getByText(/view with this name already exists/i)).toBeInTheDocument();
      });

      // Verify save button is disabled
      saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });

    it('should show real-time validation errors', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);

      // Clear field to trigger empty validation
      await user.clear(nameField);
      await user.tab(); // Blur field

      // Wait for validation to appear
      await vi.waitFor(() => {
        expect(screen.getByText(/view name is required/i)).toBeInTheDocument();
      });

      // Type valid name to clear error
      await user.type(nameField, 'Valid Name');

      await vi.waitFor(() => {
        expect(screen.queryByText(/view name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Functionality', () => {
    it('should call onSave with valid name when save button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(nameField);
      await user.type(nameField, 'My Custom View');
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalledWith('My Custom View');
    });

    it('should trim whitespace from view name', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(nameField);
      await user.type(nameField, '  Trimmed View  ');
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalledWith('Trimmed View');
    });

    it('should disable save button when validation fails', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const nameField = screen.getByLabelText(/view name/i);

      await user.clear(nameField);

      // Save button should be disabled for empty name
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();

      // Note: Cannot click disabled button with pointer-events: none
      // Already verified button is disabled, which prevents onSave
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      // Press Escape key
      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Config Preview', () => {
    it('should display preview of current config with columns hidden', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.getByText(/preview/i)).toBeInTheDocument();
      expect(screen.getByText(/hidden columns/i)).toBeInTheDocument();
      expect(screen.getByText(/status/i)).toBeInTheDocument();
    });

    it('should display preview of active filters', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.getByText(/active filters/i)).toBeInTheDocument();
      expect(screen.getByText(/severity/i)).toBeInTheDocument();
      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });

    it('should display preview of sorting configuration', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.getByText(/sorting/i)).toBeInTheDocument();
      expect(screen.getByText(/createdAt/i)).toBeInTheDocument();
      expect(screen.getByText(/descending/i)).toBeInTheDocument();
    });

    it('should display global filter in preview', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={mockViewConfig}
        />
      );

      expect(screen.getByText(/global filter/i)).toBeInTheDocument();
      expect(screen.getByText(/test search/i)).toBeInTheDocument();
    });

    it('should show message when no customizations are applied', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderWithProvider(
        <SaveViewPanel
          open={true}
          onClose={onClose}
          onSave={onSave}
          currentConfig={emptyViewConfig}
        />
      );

      expect(screen.getByText(/no customizations/i)).toBeInTheDocument();
    });
  });
});

// Helper component for duplicate name testing
function DuplicateTestHelper() {
  const { createView } = useSavedViews();

  const handleSave = (name: string) => {
    createView(name, mockViewConfig);
  };

  return (
    <SaveViewPanel
      open={true}
      onClose={() => {}}
      onSave={handleSave}
      currentConfig={mockViewConfig}
    />
  );
}
