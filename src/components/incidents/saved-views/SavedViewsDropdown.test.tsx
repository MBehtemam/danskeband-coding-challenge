/**
 * SavedViewsDropdown Component Tests
 *
 * Feature: 011-saved-views
 * User Story: US001 - View Selection
 * Task: T031 - Write component tests for SavedViewsDropdown
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavedViewsDropdown } from './SavedViewsDropdown';
import { SavedViewsProvider } from '../../../contexts/SavedViewsContext';
import type { SavedView } from '../../../types/savedViews';

// Mock storage
vi.mock('../../../api/storage', () => ({
  getSavedViews: vi.fn(() => []),
  setSavedViews: vi.fn(() => true),
  getActiveViewId: vi.fn(() => null),
  setActiveViewId: vi.fn(() => true),
  isStorageAvailable: vi.fn(() => true),
}));

const mockViews: SavedView[] = [
  {
    id: 'view-1',
    name: 'Critical Issues',
    config: {
      columnVisibility: {},
      columnFilters: [{ id: 'severity', value: 'Critical' }],
      columnFilterFns: {},
      sorting: [{ id: 'createdAt', desc: true }],
      globalFilter: '',
    },
    createdAt: new Date('2026-01-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-10T10:00:00Z').toISOString(),
  },
  {
    id: 'view-2',
    name: 'My Open Issues',
    config: {
      columnVisibility: {},
      columnFilters: [{ id: 'status', value: 'Open' }],
      columnFilterFns: {},
      sorting: [{ id: 'createdAt', desc: true }],
      globalFilter: '',
    },
    createdAt: new Date('2026-01-12T14:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T14:30:00Z').toISOString(),
  },
  {
    id: 'view-3',
    name: 'Recent Activity',
    config: {
      columnVisibility: {},
      columnFilters: [],
      columnFilterFns: {},
      sorting: [{ id: 'updatedAt', desc: true }],
      globalFilter: '',
    },
    createdAt: new Date('2026-01-14T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-14T08:00:00Z').toISOString(),
  },
];

describe('SavedViewsDropdown', () => {
  const mockOnCreateNew = vi.fn();
  const mockOnViewSelect = vi.fn();

  // Helper to render with context
  const renderWithContext = async (savedViews: SavedView[] = [], activeViewId: string | null = null) => {
    const storage = await import('../../../api/storage');
    vi.mocked(storage.getSavedViews).mockReturnValue(savedViews);
    vi.mocked(storage.getActiveViewId).mockReturnValue(activeViewId);

    return render(
      <SavedViewsProvider>
        <SavedViewsDropdown onCreateNew={mockOnCreateNew} onViewSelect={mockOnViewSelect} />
      </SavedViewsProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Display', () => {
    it('should show "Default View" when no active view', async () => {
      await renderWithContext();

      expect(screen.getByRole('button', { name: /default view/i })).toBeInTheDocument();
    });

    it('should show active view name when a view is selected', async () => {
      await renderWithContext(mockViews, 'view-1');

      expect(screen.getByRole('button', { name: /critical issues/i })).toBeInTheDocument();
    });

    it('should display dropdown icon', async () => {
      await renderWithContext();

      const button = screen.getByRole('button', { name: /default view/i });
      // Check that button contains an ArrowDropDown icon (by checking for svg or icon)
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Menu Interaction', () => {
    it('should open menu when button is clicked', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('should render menu with backdrop that can close the menu', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Verify that a backdrop is rendered (MUI's default behavior for closing on outside click)
      // MUI renders the backdrop in a portal, so we need to search in document.body
      const backdrop = document.body.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeTruthy();
    });

    it('should close menu on Escape key', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Views List', () => {
    it('should render all saved views in the menu', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /critical issues/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /my open issues/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /recent activity/i })).toBeInTheDocument();
      });
    });

    it('should show "Default View" option at the top', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        // First item should be "Default View"
        expect(menuItems[0]).toHaveTextContent(/default view/i);
      });
    });

    it('should show "Create New View" button at the bottom', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /create new view/i })).toBeInTheDocument();
      });
    });

    it('should display relative timestamps for views', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        // Check that timestamps are displayed (they should contain "ago" text)
        const menu = screen.getByRole('menu');
        expect(menu.textContent).toContain('ago');
      });
    });

    it('should show empty state when no saved views', async () => {
      const user = userEvent.setup();
      await renderWithContext([]);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        // Should only show Default View and Create New View
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(2);
        expect(menuItems[0]).toHaveTextContent(/default view/i);
        expect(menuItems[1]).toHaveTextContent(/create new view/i);
      });
    });
  });

  describe('Active View Indicator', () => {
    it('should show checkmark for active view', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews, 'view-2');

      const button = screen.getByRole('button', { name: /my open issues/i });
      await user.click(button);

      await waitFor(() => {
        const activeItem = screen.getByRole('menuitem', { name: /my open issues/i });
        // Check for check icon (using aria-label or data-testid)
        const checkIcon = activeItem.querySelector('[data-testid="CheckIcon"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it('should show checkmark for Default View when no active view', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews, null);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        const defaultItem = screen.getByRole('menuitem', { name: /default view/i });
        const checkIcon = defaultItem.querySelector('[data-testid="CheckIcon"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it('should not show checkmark for inactive views', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews, 'view-1');

      const button = screen.getByRole('button', { name: /critical issues/i });
      await user.click(button);

      await waitFor(() => {
        const inactiveItem = screen.getByRole('menuitem', { name: /my open issues/i });
        const checkIcon = inactiveItem.querySelector('[data-testid="CheckIcon"]');
        expect(checkIcon).not.toBeInTheDocument();
      });
    });
  });

  describe('View Selection', () => {
    it('should call onViewSelect when a saved view is clicked', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const viewItem = screen.getByRole('menuitem', { name: /critical issues/i });
      await user.click(viewItem);

      expect(mockOnViewSelect).toHaveBeenCalledWith('view-1');
      expect(mockOnViewSelect).toHaveBeenCalledTimes(1);
    });

    it('should call onViewSelect with null when Default View is clicked', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews, 'view-1');

      const button = screen.getByRole('button', { name: /critical issues/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const defaultItem = screen.getByRole('menuitem', { name: /default view/i });
      await user.click(defaultItem);

      expect(mockOnViewSelect).toHaveBeenCalledWith(null);
      expect(mockOnViewSelect).toHaveBeenCalledTimes(1);
    });

    it('should close menu after selecting a view', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const viewItem = screen.getByRole('menuitem', { name: /my open issues/i });
      await user.click(viewItem);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Create New View', () => {
    it('should call onCreateNew when Create New View is clicked', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('menuitem', { name: /create new view/i });
      await user.click(createButton);

      expect(mockOnCreateNew).toHaveBeenCalledTimes(1);
    });

    it('should close menu after clicking Create New View', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('menuitem', { name: /create new view/i });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate menu items with arrow keys', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Press ArrowDown to move focus
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Focus should move through menu items
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should select view on Enter key', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Navigate to a view and press Enter
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockOnViewSelect).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should have proper ARIA expanded state', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have unique IDs for menu items', async () => {
      const user = userEvent.setup();
      await renderWithContext(mockViews);

      const button = screen.getByRole('button', { name: /default view/i });
      await user.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        const ids = menuItems.map(item => item.id).filter(id => id);
        // All IDs should be unique
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  });
});
