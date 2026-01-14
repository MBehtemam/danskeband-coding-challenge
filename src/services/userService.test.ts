import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUsers } from './userService';
import type { User } from '../api/types';

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com' },
];

describe('userService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('fetchUsers', () => {
    it('should fetch all users', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      } as Response);

      const result = await fetchUsers();

      expect(global.fetch).toHaveBeenCalledWith('/api/users');
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when fetch fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
    });
  });
});
