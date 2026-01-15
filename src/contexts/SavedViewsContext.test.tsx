import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SavedViewsProvider, useSavedViews } from './SavedViewsContext';
import type { SavedView, ViewConfig } from '../types/savedViews';
import * as storage from '../api/storage';

// Mock the storage module
vi.mock('../api/storage', async () => {
  const actual = await vi.importActual('../api/storage');
  return {
    ...actual,
    getSavedViews: vi.fn(() => []),
    setSavedViews: vi.fn(() => true),
    getActiveViewId: vi.fn(() => null),
    setActiveViewId: vi.fn(() => true),
    isStorageAvailable: vi.fn(() => true),
  };
});

describe('SavedViewsContext', () => {
  const mockConfig: ViewConfig = {
    columnVisibility: { severity: false },
    columnFilters: [{ id: 'status', value: 'Open' }],
    columnFilterFns: { status: 'equals' },
    sorting: [{ id: 'createdAt', desc: true }],
    globalFilter: '',
  };

  const mockView: SavedView = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test View',
    config: mockConfig,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    vi.mocked(storage.getSavedViews).mockReturnValue([]);
    vi.mocked(storage.setSavedViews).mockReturnValue(true);
    vi.mocked(storage.getActiveViewId).mockReturnValue(null);
    vi.mocked(storage.setActiveViewId).mockReturnValue(true);
    vi.mocked(storage.isStorageAvailable).mockReturnValue(true);
  });

  describe('initialization', () => {
    it('should load saved views from storage on init', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);
      vi.mocked(storage.getActiveViewId).mockReturnValue(mockView.id);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      expect(result.current.savedViews).toEqual([mockView]);
      expect(result.current.activeViewId).toBe(mockView.id);
    });

    it('should detect storage availability on init', () => {
      vi.mocked(storage.isStorageAvailable).mockReturnValue(true);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      expect(result.current.storageAvailable).toBe('full');
    });

    it('should handle storage unavailable', () => {
      vi.mocked(storage.isStorageAvailable).mockReturnValue(false);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      expect(result.current.storageAvailable).toBe('session');
    });

    it('should handle corrupted data gracefully', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([]);
      vi.mocked(storage.getActiveViewId).mockReturnValue('invalid-id');

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      // Should clear invalid activeViewId
      expect(result.current.activeViewId).toBeNull();
    });
  });

  describe('createView', () => {
    it('should create a new view successfully', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const view = result.current.createView('Test View', mockConfig);
        expect(view).not.toBeNull();
        expect(view?.name).toBe('Test View');
        expect(view?.config).toEqual(mockConfig);
      });

      expect(result.current.savedViews).toHaveLength(1);
      expect(storage.setSavedViews).toHaveBeenCalled();
    });

    it('should reject empty view name', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const view = result.current.createView('   ', mockConfig);
        expect(view).toBeNull();
      });

      expect(result.current.savedViews).toHaveLength(0);
      expect(storage.setSavedViews).not.toHaveBeenCalled();
    });

    it('should reject view name that exceeds max length', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const longName = 'a'.repeat(101);

      act(() => {
        const view = result.current.createView(longName, mockConfig);
        expect(view).toBeNull();
      });

      expect(result.current.savedViews).toHaveLength(0);
    });

    it('should reject duplicate view names', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const view = result.current.createView('Test View', mockConfig);
        expect(view).toBeNull();
      });
    });

    it('should enforce max views limit', () => {
      const maxViews = Array.from({ length: 50 }, (_, i) => ({
        ...mockView,
        id: `view-${i}`,
        name: `View ${i}`,
      }));
      vi.mocked(storage.getSavedViews).mockReturnValue(maxViews);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const view = result.current.createView('New View', mockConfig);
        expect(view).toBeNull();
      });

      expect(result.current.savedViews).toHaveLength(50);
    });

    it('should handle storage failure gracefully', () => {
      vi.mocked(storage.setSavedViews).mockReturnValue(false);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const view = result.current.createView('Test View', mockConfig);
        expect(view).toBeNull();
      });

      expect(result.current.storageAvailable).toBe('none');
    });
  });

  describe('applyView', () => {
    it('should apply view by ID', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const config = result.current.applyView(mockView.id);
        expect(config).toEqual(mockConfig);
      });

      expect(result.current.activeViewId).toBe(mockView.id);
      expect(storage.setActiveViewId).toHaveBeenCalledWith(mockView.id);
    });

    it('should apply null for default view', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const config = result.current.applyView(null);
        expect(config).not.toBeNull();
      });

      expect(result.current.activeViewId).toBeNull();
      expect(storage.setActiveViewId).toHaveBeenCalledWith(null);
    });

    it('should return null for invalid ID', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const config = result.current.applyView('invalid-id');
        expect(config).toBeNull();
      });

      expect(result.current.activeViewId).toBeNull();
    });
  });

  describe('updateView', () => {
    it('should update view configuration', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const updatedConfig: ViewConfig = {
        ...mockConfig,
        sorting: [{ id: 'severity', desc: false }],
      };

      act(() => {
        const success = result.current.updateView(mockView.id, updatedConfig);
        expect(success).toBe(true);
      });

      expect(result.current.savedViews[0].config).toEqual(updatedConfig);
      expect(storage.setSavedViews).toHaveBeenCalled();
    });

    it('should update updatedAt timestamp', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        result.current.updateView(mockView.id, mockConfig);
      });

      const updated = result.current.savedViews[0];
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date(mockView.updatedAt).getTime()
      );
    });

    it('should return false for non-existent view', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.updateView('invalid-id', mockConfig);
        expect(success).toBe(false);
      });
    });

    it('should handle storage failure', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);
      vi.mocked(storage.setSavedViews).mockReturnValue(false);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.updateView(mockView.id, mockConfig);
        expect(success).toBe(false);
      });

      expect(result.current.storageAvailable).toBe('none');
    });
  });

  describe('renameView', () => {
    it('should rename view successfully', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.renameView(mockView.id, 'New Name');
        expect(success).toBe(true);
      });

      expect(result.current.savedViews[0].name).toBe('New Name');
      expect(storage.setSavedViews).toHaveBeenCalled();
    });

    it('should reject empty name', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.renameView(mockView.id, '   ');
        expect(success).toBe(false);
      });

      expect(result.current.savedViews[0].name).toBe('Test View');
    });

    it('should reject duplicate name', () => {
      const views = [
        mockView,
        { ...mockView, id: 'view-2', name: 'Another View' },
      ];
      vi.mocked(storage.getSavedViews).mockReturnValue(views);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.renameView(mockView.id, 'Another View');
        expect(success).toBe(false);
      });
    });

    it('should allow renaming to same name (case-sensitive)', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.renameView(mockView.id, 'Test View');
        expect(success).toBe(true);
      });
    });
  });

  describe('deleteView', () => {
    it('should delete view successfully', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.deleteView(mockView.id);
        expect(success).toBe(true);
      });

      expect(result.current.savedViews).toHaveLength(0);
      expect(storage.setSavedViews).toHaveBeenCalled();
    });

    it('should clear activeViewId when deleting active view', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);
      vi.mocked(storage.getActiveViewId).mockReturnValue(mockView.id);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        result.current.deleteView(mockView.id);
      });

      expect(result.current.activeViewId).toBeNull();
      expect(storage.setActiveViewId).toHaveBeenCalledWith(null);
    });

    it('should return false for non-existent view', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      act(() => {
        const success = result.current.deleteView('invalid-id');
        expect(success).toBe(false);
      });
    });
  });

  describe('validateViewName', () => {
    it('should accept valid name', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const validation = result.current.validateViewName('Valid Name');
      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject empty name', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const validation = result.current.validateViewName('   ');
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('required');
    });

    it('should reject name that exceeds max length', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const validation = result.current.validateViewName('a'.repeat(101));
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('100 characters');
    });

    it('should reject duplicate name', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const validation = result.current.validateViewName('Test View');
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('already exists');
    });

    it('should allow duplicate name when excluding view ID', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      const validation = result.current.validateViewName('Test View', mockView.id);
      expect(validation.valid).toBe(true);
    });
  });

  describe('isDirty', () => {
    it('should be false when no active view', () => {
      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      expect(result.current.isDirty).toBe(false);
    });

    it('should be false when current config matches active view', () => {
      vi.mocked(storage.getSavedViews).mockReturnValue([mockView]);
      vi.mocked(storage.getActiveViewId).mockReturnValue(mockView.id);

      const { result } = renderHook(() => useSavedViews(), {
        wrapper: SavedViewsProvider,
      });

      // Note: isDirty requires external table state comparison
      // This test verifies initial state only
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('provider requirement', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSavedViews());
      }).toThrow('useSavedViews must be used within SavedViewsProvider');

      consoleSpy.mockRestore();
    });
  });
});
