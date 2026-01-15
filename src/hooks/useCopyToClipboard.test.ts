import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';
import { mockWriteText } from '../test/setup';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    mockWriteText.mockReset();
    mockWriteText.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should return isCopied as false initially', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      expect(result.current.isCopied).toBe(false);
    });

    it('should return isError as false initially', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      expect(result.current.isError).toBe(false);
    });

    it('should return a copy function', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      expect(typeof result.current.copy).toBe('function');
    });
  });

  describe('successful copy', () => {
    it('should set isCopied to true on successful copy', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(result.current.isCopied).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it('should call navigator.clipboard.writeText with the provided text', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('incident-123');
      });

      expect(mockWriteText).toHaveBeenCalledWith('incident-123');
    });

    it('should reset isCopied to false after timeout', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.isCopied).toBe(true);

      // Advance timers by 2000ms (the reset timeout)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isCopied).toBe(false);
    });
  });

  describe('failed copy', () => {
    it('should set isError to true when copy fails', async () => {
      mockWriteText.mockRejectedValue(new Error('Copy failed'));

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.isCopied).toBe(false);
    });

    it('should reset isError to false after timeout', async () => {
      mockWriteText.mockRejectedValue(new Error('Copy failed'));

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.isError).toBe(true);

      // Advance timers by 2000ms (the reset timeout)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isError).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clear timeout on unmount', async () => {
      const { result, unmount } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.isCopied).toBe(true);

      // Unmount before timeout completes
      unmount();

      // Advance timers - this should not cause errors
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // No error means cleanup worked properly
    });
  });
});
