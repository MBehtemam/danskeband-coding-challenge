import type { Incident, User } from "./types";
import type { SavedView, ViewConfig } from "../types/savedViews";
import { STORAGE_KEY_SAVED_VIEWS, STORAGE_KEY_ACTIVE_VIEW_ID } from "../types/savedViews";
import { defaultIncidents, defaultUsers } from "./seedData";

const STORAGE_KEY_INCIDENTS = "incidents";
const STORAGE_KEY_USERS = "users";

/**
 * Migrate an incident to ensure it has the isDummy field.
 * Existing incidents without isDummy field default to false.
 */
function migrateIncident(incident: Partial<Incident>): Incident {
  return {
    ...incident,
    isDummy: incident.isDummy ?? false,
  } as Incident;
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
}

export function getIncidents(): Incident[] {
  const incidents = loadFromStorage<Partial<Incident>[]>(STORAGE_KEY_INCIDENTS, defaultIncidents);
  // Migrate incidents to ensure they have the isDummy field
  return incidents.map(migrateIncident);
}

export function setIncidents(incidents: Incident[]): void {
  saveToStorage(STORAGE_KEY_INCIDENTS, incidents);
}

export function getUsers(): User[] {
  return loadFromStorage(STORAGE_KEY_USERS, defaultUsers);
}

export function setUsers(users: User[]): void {
  saveToStorage(STORAGE_KEY_USERS, users);
}

export function resetData(): void {
  setIncidents(defaultIncidents);
  setUsers(defaultUsers);
}

// ============================================================================
// Saved Views Storage Functions
// ============================================================================

/**
 * Cache for storage availability check
 */
let storageAvailableCache: boolean | null = null;

/**
 * Reset storage availability cache (for testing)
 */
export function resetStorageAvailableCache(): void {
  storageAvailableCache = null;
}

/**
 * Check if localStorage is available
 * Result is cached after first call for performance
 */
export function isStorageAvailable(): boolean {
  if (storageAvailableCache !== null) {
    return storageAvailableCache;
  }

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailableCache = true;
    return true;
  } catch {
    storageAvailableCache = false;
    return false;
  }
}

/**
 * Validate that data is a valid array of SavedView objects
 */
export function validateSavedViewsData(data: unknown): data is SavedView[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((item) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const view = item as Partial<SavedView>;

    // Check required fields exist
    if (
      typeof view.id !== 'string' ||
      typeof view.name !== 'string' ||
      typeof view.createdAt !== 'string' ||
      typeof view.updatedAt !== 'string' ||
      typeof view.config !== 'object' ||
      view.config === null
    ) {
      return false;
    }

    const config = view.config as Partial<ViewConfig>;

    // Check config structure
    if (
      typeof config.columnVisibility !== 'object' ||
      !Array.isArray(config.columnFilters) ||
      typeof config.columnFilterFns !== 'object' ||
      !Array.isArray(config.sorting) ||
      typeof config.globalFilter !== 'string'
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Get all saved views from localStorage
 * Returns empty array if no views exist or data is corrupted
 */
export function getSavedViews(): SavedView[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_SAVED_VIEWS);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    // Validate structure before returning
    if (!validateSavedViewsData(parsed)) {
      console.warn('Saved views data is corrupted, returning empty array');
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to load saved views from storage:', error);
    return [];
  }
}

/**
 * Save views array to localStorage
 * Returns true if successful, false if storage fails
 */
export function setSavedViews(views: SavedView[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_VIEWS, JSON.stringify(views));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      console.warn('localStorage quota exceeded, cannot save views');
    } else {
      console.warn('Failed to save views to storage:', error);
    }
    return false;
  }
}

/**
 * Get the active view ID from localStorage
 * Returns null if no active view is set or data is corrupted
 */
export function getActiveViewId(): string | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_VIEW_ID);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    // Must be either string or null
    if (typeof parsed !== 'string' && parsed !== null) {
      console.warn('Active view ID is corrupted, returning null');
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to load active view ID from storage:', error);
    return null;
  }
}

/**
 * Set the active view ID in localStorage
 * Pass null to clear the active view (return to default)
 * Returns true if successful, false if storage fails
 */
export function setActiveViewId(viewId: string | null): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_VIEW_ID, JSON.stringify(viewId));
    return true;
  } catch (error) {
    console.warn('Failed to save active view ID to storage:', error);
    return false;
  }
}
