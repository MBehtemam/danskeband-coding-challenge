import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { SavedView } from '../../src/types/savedViews';

// Import functions that will be implemented
import {
  getSavedViews,
  setSavedViews,
  getActiveViewId,
  setActiveViewId,
  validateSavedViewsData,
  isStorageAvailable,
  resetStorageAvailableCache
} from '../../src/api/storage';

describe('savedViewsStorage', () => {
  const mockView: SavedView = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test View',
    config: {
      columnVisibility: {},
      columnFilters: [],
      columnFilterFns: {},
      sorting: [{ id: 'createdAt', desc: true }],
      globalFilter: '',
    },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset storage availability cache
    resetStorageAvailableCache();
    // Clear all mocks
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Also reset cache after each test
    resetStorageAvailableCache();
  });

  describe('getSavedViews', () => {
    it('should return empty array when localStorage is empty', () => {
      const result = getSavedViews();
      expect(result).toEqual([]);
    });

    it('should return saved views when valid data exists', () => {
      localStorage.setItem('saved-views', JSON.stringify([mockView]));
      const result = getSavedViews();
      expect(result).toEqual([mockView]);
    });

    it('should return empty array when data is corrupted (invalid JSON)', () => {
      localStorage.setItem('saved-views', 'invalid json');
      const result = getSavedViews();
      expect(result).toEqual([]);
    });

    it('should return empty array when data structure is invalid', () => {
      localStorage.setItem('saved-views', JSON.stringify({ not: 'array' }));
      const result = getSavedViews();
      expect(result).toEqual([]);
    });

    it('should return empty array when storage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const result = getSavedViews();
      expect(result).toEqual([]);
    });
  });

  describe('setSavedViews', () => {
    it('should save views to localStorage successfully', () => {
      const success = setSavedViews([mockView]);
      expect(success).toBe(true);
      expect(localStorage.getItem('saved-views')).toBe(JSON.stringify([mockView]));
    });

    it('should handle empty array', () => {
      const success = setSavedViews([]);
      expect(success).toBe(true);
      expect(localStorage.getItem('saved-views')).toBe(JSON.stringify([]));
    });

    it('should return false when QuotaExceededError occurs', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('QuotaExceededError');
        error.code = 22;
        throw error;
      });
      const success = setSavedViews([mockView]);
      expect(success).toBe(false);
    });

    it('should return false when SecurityError occurs', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('SecurityError');
      });
      const success = setSavedViews([mockView]);
      expect(success).toBe(false);
    });
  });

  describe('getActiveViewId', () => {
    it('should return null when no active view is set', () => {
      const result = getActiveViewId();
      expect(result).toBeNull();
    });

    it('should return active view ID when set', () => {
      localStorage.setItem('active-view-id', JSON.stringify(mockView.id));
      const result = getActiveViewId();
      expect(result).toBe(mockView.id);
    });

    it('should return null when data is corrupted', () => {
      localStorage.setItem('active-view-id', 'invalid json');
      const result = getActiveViewId();
      expect(result).toBeNull();
    });

    it('should return null when storage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const result = getActiveViewId();
      expect(result).toBeNull();
    });
  });

  describe('setActiveViewId', () => {
    it('should save active view ID successfully', () => {
      const success = setActiveViewId(mockView.id);
      expect(success).toBe(true);
      expect(localStorage.getItem('active-view-id')).toBe(JSON.stringify(mockView.id));
    });

    it('should save null successfully', () => {
      const success = setActiveViewId(null);
      expect(success).toBe(true);
      expect(localStorage.getItem('active-view-id')).toBe(JSON.stringify(null));
    });

    it('should return false when storage fails', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const success = setActiveViewId(mockView.id);
      expect(success).toBe(false);
    });
  });

  describe('validateSavedViewsData', () => {
    it('should return true for valid array of views', () => {
      const result = validateSavedViewsData([mockView]);
      expect(result).toBe(true);
    });

    it('should return true for empty array', () => {
      const result = validateSavedViewsData([]);
      expect(result).toBe(true);
    });

    it('should return false for non-array', () => {
      const result = validateSavedViewsData({ not: 'array' });
      expect(result).toBe(false);
    });

    it('should return false for array with invalid view structure', () => {
      const invalidView = { id: '123', name: 'test' }; // missing required fields
      const result = validateSavedViewsData([invalidView]);
      expect(result).toBe(false);
    });

    it('should return false for view missing id', () => {
      const invalidView = { ...mockView, id: undefined };
      const result = validateSavedViewsData([invalidView]);
      expect(result).toBe(false);
    });

    it('should return false for view missing name', () => {
      const invalidView = { ...mockView, name: undefined };
      const result = validateSavedViewsData([invalidView]);
      expect(result).toBe(false);
    });

    it('should return false for view missing config', () => {
      const invalidView = { ...mockView, config: undefined };
      const result = validateSavedViewsData([invalidView]);
      expect(result).toBe(false);
    });

    it('should return false for view with invalid config structure', () => {
      const invalidView = { ...mockView, config: { invalid: 'config' } };
      const result = validateSavedViewsData([invalidView]);
      expect(result).toBe(false);
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      const result = isStorageAvailable();
      expect(result).toBe(true);
    });

    it('should return false when localStorage.getItem throws', () => {
      // Make sure we reset cache so the check happens
      resetStorageAvailableCache();

      // Mock both getItem and setItem since we test with setItem
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const result = isStorageAvailable();
      expect(result).toBe(false);
    });

    it('should return false when localStorage.setItem throws', () => {
      // Make sure we reset cache so the check happens
      resetStorageAvailableCache();

      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const result = isStorageAvailable();
      expect(result).toBe(false);
    });

    it('should cache result after first call', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      // First call
      isStorageAvailable();
      const firstCallCount = setItemSpy.mock.calls.length;
      expect(firstCallCount).toBeGreaterThan(0);

      // Second call should use cache (no additional storage calls)
      isStorageAvailable();
      expect(setItemSpy).toHaveBeenCalledTimes(firstCallCount);
      expect(removeItemSpy).toHaveBeenCalledTimes(1); // Only once from first call
    });
  });
});
