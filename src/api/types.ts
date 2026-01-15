export type IncidentStatus = "Open" | "In Progress" | "Resolved";
export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface StatusHistoryEntry {
  status: IncidentStatus;
  changedAt: string;
  changedBy: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  /** True if created via Developer Settings (dummy/test incident) */
  isDummy: boolean;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  severity: IncidentSeverity;
  assigneeId: string | null;
  /** Optional: set to true when creating dummy/test incidents */
  isDummy?: boolean;
}

export interface UpdateIncidentInput {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assigneeId?: string | null;
}

/**
 * Re-export saved views types for convenience
 */
export type {
  SavedView,
  ViewConfig,
  StorageStatus,
  SavedViewsState,
  SavedViewsContextValue,
  ValidationResult
} from '../types/savedViews';
