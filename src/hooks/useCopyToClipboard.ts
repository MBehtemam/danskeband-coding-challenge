import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCopyToClipboardReturn {
  /** True when copy succeeded (resets after timeout) */
  isCopied: boolean;
  /** True when copy failed (resets after timeout) */
  isError: boolean;
  /** Function to trigger copy operation */
  copy: (text: string) => Promise<void>;
}

const RESET_TIMEOUT_MS = 2000;

/**
 * Custom hook for copying text to clipboard with feedback state.
 * Uses the modern Clipboard API with a fallback for older browsers.
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string): Promise<void> => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      // Use modern Clipboard API if available in secure context
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setIsCopied(true);
      setIsError(false);

      // Reset state after timeout
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, RESET_TIMEOUT_MS);
    } catch {
      setIsError(true);
      setIsCopied(false);

      // Reset error state after timeout
      timeoutRef.current = setTimeout(() => {
        setIsError(false);
      }, RESET_TIMEOUT_MS);
    }
  }, []);

  return { isCopied, isError, copy };
}
