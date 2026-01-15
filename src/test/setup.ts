import "@testing-library/jest-dom";
import { vi } from 'vitest';

// Create mock functions for clipboard
const mockWriteText = vi.fn(() => Promise.resolve());
const mockReadText = vi.fn(() => Promise.resolve(''));

// Mock Clipboard API for testing copy functionality
const mockClipboard = {
  writeText: mockWriteText,
  readText: mockReadText,
};

// Override navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
  configurable: true,
});

// Mock window.isSecureContext for clipboard API detection
Object.defineProperty(window, 'isSecureContext', {
  value: true,
  writable: true,
});

// Export mocks for tests to use
export { mockWriteText, mockReadText };
