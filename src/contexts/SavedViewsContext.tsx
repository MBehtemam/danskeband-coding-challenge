/**
 * SavedViewsContext
 *
 * Feature: 011-saved-views
 * Provides saved views state management with localStorage persistence
 */

import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  SavedView,
  ViewConfig,
  SavedViewsContextValue,
  StorageStatus,
  ValidationResult,
} from '../types/savedViews';
import {
  DEFAULT_VIEW_CONFIG,
  MAX_SAVED_VIEWS,
  MIN_VIEW_NAME_LENGTH,
  MAX_VIEW_NAME_LENGTH,
} from '../types/savedViews';
import * as storage from '../api/storage';

/**
 * Create context with undefined default (forces provider usage)
 */
const SavedViewsContext = createContext<SavedViewsContextValue | undefined>(undefined);

/**
 * Detect storage availability and return appropriate status
 */
function detectStorageStatus(): StorageStatus {
  if (storage.isStorageAvailable()) {
    return 'full';
  }
  return 'session';
}

/**
 * SavedViewsProvider Component
 */
export function SavedViewsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from storage
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => storage.getSavedViews());
  const [activeViewId, setActiveViewIdState] = useState<string | null>(() => {
    const storedActiveId = storage.getActiveViewId();
    const views = storage.getSavedViews();

    // Validate that the stored active ID actually exists in saved views
    if (storedActiveId && views.some(v => v.id === storedActiveId)) {
      return storedActiveId;
    }

    // Clear invalid active view ID
    if (storedActiveId) {
      storage.setActiveViewId(null);
    }

    return null;
  });
  const [storageAvailable, setStorageAvailable] = useState<StorageStatus>(() => detectStorageStatus());
  const [isDirty] = useState<boolean>(false); // Default to false as per requirements

  /**
   * Persist views to storage and handle failure
   */
  const persistViews = (views: SavedView[]): boolean => {
    const success = storage.setSavedViews(views);
    if (!success) {
      setStorageAvailable('none');
    }
    return success;
  };

  /**
   * Persist active view ID to storage and handle failure
   */
  const persistActiveViewId = (viewId: string | null): boolean => {
    const success = storage.setActiveViewId(viewId);
    if (!success) {
      setStorageAvailable('none');
    }
    return success;
  };

  /**
   * Validate view name
   */
  const validateViewName = (name: string, excludeViewId?: string): ValidationResult => {
    const trimmedName = name.trim();

    // Check empty
    if (trimmedName.length < MIN_VIEW_NAME_LENGTH) {
      return { valid: false, error: 'View name is required' };
    }

    // Check max length
    if (trimmedName.length > MAX_VIEW_NAME_LENGTH) {
      return { valid: false, error: `View name must not exceed ${MAX_VIEW_NAME_LENGTH} characters` };
    }

    // Check for duplicates (excluding the specified view ID for renames)
    const isDuplicate = savedViews.some(
      view => view.name === trimmedName && view.id !== excludeViewId
    );
    if (isDuplicate) {
      return { valid: false, error: 'A view with this name already exists' };
    }

    return { valid: true };
  };

  /**
   * Create a new saved view
   */
  const createView = (name: string, config: ViewConfig): SavedView | null => {
    // Validate name
    const validation = validateViewName(name);
    if (!validation.valid) {
      return null;
    }

    // Check max views limit
    if (savedViews.length >= MAX_SAVED_VIEWS) {
      return null;
    }

    // Create new view
    const now = new Date().toISOString();
    const newView: SavedView = {
      id: uuidv4(),
      name: name.trim(),
      config,
      createdAt: now,
      updatedAt: now,
    };

    // Update state
    const updatedViews = [...savedViews, newView];
    const success = persistViews(updatedViews);

    if (!success) {
      return null;
    }

    setSavedViews(updatedViews);
    return newView;
  };

  /**
   * Apply a view by ID (or null for default view)
   */
  const applyView = (viewId: string | null): ViewConfig | null => {
    // Handle default view
    if (viewId === null) {
      setActiveViewIdState(null);
      persistActiveViewId(null);
      return DEFAULT_VIEW_CONFIG;
    }

    // Find the view
    const view = savedViews.find(v => v.id === viewId);
    if (!view) {
      return null;
    }

    // Set active view
    setActiveViewIdState(viewId);
    persistActiveViewId(viewId);
    return view.config;
  };

  /**
   * Update view configuration
   */
  const updateView = (viewId: string, config: ViewConfig): boolean => {
    const viewIndex = savedViews.findIndex(v => v.id === viewId);
    if (viewIndex === -1) {
      return false;
    }

    // Update view
    const updatedView: SavedView = {
      ...savedViews[viewIndex],
      config,
      updatedAt: new Date().toISOString(),
    };

    const updatedViews = [...savedViews];
    updatedViews[viewIndex] = updatedView;

    // Persist to storage
    const success = persistViews(updatedViews);
    if (!success) {
      return false;
    }

    setSavedViews(updatedViews);
    return true;
  };

  /**
   * Rename a view
   */
  const renameView = (viewId: string, newName: string): boolean => {
    const viewIndex = savedViews.findIndex(v => v.id === viewId);
    if (viewIndex === -1) {
      return false;
    }

    // Validate new name
    const validation = validateViewName(newName, viewId);
    if (!validation.valid) {
      return false;
    }

    // Update view
    const updatedView: SavedView = {
      ...savedViews[viewIndex],
      name: newName.trim(),
      updatedAt: new Date().toISOString(),
    };

    const updatedViews = [...savedViews];
    updatedViews[viewIndex] = updatedView;

    // Persist to storage
    const success = persistViews(updatedViews);
    if (!success) {
      return false;
    }

    setSavedViews(updatedViews);
    return true;
  };

  /**
   * Delete a view
   */
  const deleteView = (viewId: string): boolean => {
    const viewIndex = savedViews.findIndex(v => v.id === viewId);
    if (viewIndex === -1) {
      return false;
    }

    // Remove view
    const updatedViews = savedViews.filter(v => v.id !== viewId);

    // Persist to storage
    const success = persistViews(updatedViews);
    if (!success) {
      return false;
    }

    // Clear active view if it was deleted
    if (activeViewId === viewId) {
      setActiveViewIdState(null);
      persistActiveViewId(null);
    }

    setSavedViews(updatedViews);
    return true;
  };

  const value: SavedViewsContextValue = {
    savedViews,
    activeViewId,
    storageAvailable,
    isDirty,
    createView,
    updateView,
    renameView,
    deleteView,
    applyView,
    validateViewName,
  };

  return <SavedViewsContext.Provider value={value}>{children}</SavedViewsContext.Provider>;
}

/**
 * useSavedViews Hook
 *
 * @throws {Error} If used outside SavedViewsProvider
 */
export function useSavedViews(): SavedViewsContextValue {
  const context = useContext(SavedViewsContext);
  if (context === undefined) {
    throw new Error('useSavedViews must be used within SavedViewsProvider');
  }
  return context;
}
