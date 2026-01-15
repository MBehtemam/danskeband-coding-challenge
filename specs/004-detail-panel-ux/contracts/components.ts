/**
 * Component Interface Contracts
 * Feature: 004-detail-panel-ux
 *
 * This file defines the TypeScript interfaces for new and updated components.
 * These contracts serve as the specification for implementation.
 */

import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { IncidentStatus, IncidentSeverity } from '../../../src/api/types';

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Configuration for a single status option
 */
export interface StatusConfig {
  /** Hex color code for chip background */
  color: string;
  /** MUI icon component to display in chip */
  icon: React.ComponentType<SvgIconProps>;
  /** Display label */
  label: string;
}

/**
 * Configuration for a single severity option
 */
export interface SeverityConfig {
  /** Hex color code for chip background */
  color: string;
  /** Display label */
  label: string;
}

/**
 * Complete status configuration map
 */
export type StatusConfigMap = Record<IncidentStatus, StatusConfig>;

/**
 * Complete severity configuration map
 */
export type SeverityConfigMap = Record<IncidentSeverity, SeverityConfig>;

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the StatusChip component
 * @see FR-014, FR-015, FR-017
 */
export interface StatusChipProps {
  /** The status value to display */
  status: IncidentStatus;
  /** Size variant - affects padding and font size */
  size?: 'small' | 'medium';
}

/**
 * Props for the SeverityChip component
 * @see FR-016
 */
export interface SeverityChipProps {
  /** The severity value to display */
  severity: IncidentSeverity;
  /** Size variant - affects padding and font size */
  size?: 'small' | 'medium';
}

/**
 * Props for the CopyButton component
 * @see FR-001, FR-002, FR-003, FR-004, FR-005
 */
export interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Tooltip label shown on hover (default: "Copy ID") */
  label?: string;
  /** Button size variant */
  size?: 'small' | 'medium';
}

/**
 * Props for the StatusSelect component (updated)
 * @see FR-010, FR-012
 */
export interface StatusSelectProps {
  /** ID of the incident being edited */
  incidentId: string;
  /** Current status value */
  currentStatus: IncidentStatus;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether to use full width (for vertical layout) */
  fullWidth?: boolean;
}

/**
 * Props for the SeveritySelect component (updated)
 * @see FR-011, FR-012
 */
export interface SeveritySelectProps {
  /** Current severity value */
  value: IncidentSeverity;
  /** Callback when severity changes */
  onChange: (severity: IncidentSeverity) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether to use full width (for vertical layout) */
  fullWidth?: boolean;
}

// =============================================================================
// Hook Return Types
// =============================================================================

/**
 * Return type for useCopyToClipboard hook
 * @see FR-002, FR-003, FR-005
 */
export interface UseCopyToClipboardReturn {
  /** True when copy succeeded (resets after timeout) */
  isCopied: boolean;
  /** True when copy failed (resets after timeout) */
  isError: boolean;
  /** Function to trigger copy operation */
  copy: (text: string) => Promise<void>;
}

// =============================================================================
// Color Constants (for reference)
// =============================================================================

/**
 * Status color constants
 * @see FR-015
 */
export const STATUS_COLORS = {
  Open: '#42A5F5',
  'In Progress': '#1E88E5',
  Resolved: '#1565C0',
} as const;

/**
 * Severity color constants
 * @see FR-016
 */
export const SEVERITY_COLORS = {
  Low: '#4CAF50',
  Medium: '#2196F3',
  High: '#FF9800',
  Critical: '#F44336',
} as const;

// =============================================================================
// Test IDs (for testing)
// =============================================================================

/**
 * Test ID constants for component testing
 */
export const TEST_IDS = {
  copyButton: 'copy-id-button',
  statusChip: 'status-chip',
  severityChip: 'severity-chip',
  statusSelect: 'status-select',
  severitySelect: 'severity-select',
  editableFieldsContainer: 'editable-fields-container',
} as const;
