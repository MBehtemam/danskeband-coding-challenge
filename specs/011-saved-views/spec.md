# Feature Specification: Saved Table Views

**Feature Branch**: `011-saved-views`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "I want to have a component called "Saved Views" - a dropdown with list of views and a create new button which opens a panel allowing users to save a new view. A view is a different configuration of the table (which columns to show, default filters, sorting, etc.). For example, I can have a view showing only Status and Title columns, or a view with "Assignee" filter pre-filled by default. Each view has a unique name and is saved in localStorage. The saved views dropdown should exist in the table toolbar. Also move the "Create Incident" button to the left side of table."

## Clarifications

### Session 2026-01-15

- Q: When a user has a saved view active and manually changes the table configuration (e.g., adds a filter, hides a column), how should the system handle this divergence? → A: Keep the saved view unchanged; treat manual changes as temporary overrides until user explicitly clicks "Update View"
- Q: How should users access the view management actions (Rename, Update, Delete) for a saved view? → A: Display individual action buttons (icons) next to each view name in the dropdown
- Q: When a user has made manual table configuration changes (temporary overrides) and refreshes the page or navigates away and back, what should happen to those unsaved changes? → A: Store a defaultView reference in localStorage pointing to the active view ID. On page load: if defaultView is set and the referenced view exists, apply it (discarding any unsaved manual changes); if defaultView is not set or referenced view doesn't exist, show default table layout

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Apply Saved Views (Priority: P1)

Users frequently work with different subsets of incident data depending on their current task. For example, a developer might want to see only incidents assigned to them with status and priority columns visible, while a manager might want to see all incidents with creation date and severity columns. Users need to save these different table configurations as named views and quickly switch between them without manually reconfiguring the table each time.

**Why this priority**: Core functionality that delivers immediate productivity value. Users can save time by not having to repeatedly adjust columns, filters, and sorting. This is the MVP that makes the feature useful.

**Independent Test**: Can be fully tested by creating a new view with specific column visibility and filters, saving it with a unique name, switching to another configuration, then reapplying the saved view to verify the table returns to the saved state. Delivers immediate time-saving value.

**Acceptance Scenarios**:

1. **Given** a user is viewing the incident table, **When** they click the saved views button (showing "Current View: [name]" or default text), **Then** a dropdown menu opens showing the list of saved views, action icons for each view, and a "Create New View" option
2. **Given** the saved views dropdown is open, **When** the user clicks "Create New View", **Then** a panel opens allowing them to enter a view name and save the current table configuration
3. **Given** a user has entered a unique view name in the save panel, **When** they click "Save", **Then** the view is saved with the current column visibility, filters, and sorting configuration
4. **Given** a user has multiple saved views, **When** they click the saved views button, **Then** they see a list of all their saved views by name with action icons (rename, update, delete) next to each view
5. **Given** a user selects a saved view name from the dropdown, **When** the view is applied, **Then** the table updates to show the columns, filters, and sorting saved in that view, and the button text updates to "Current View: [view name]"
6. **Given** a user tries to save a view with a name that already exists, **When** they attempt to save, **Then** the system shows an error message indicating the name must be unique

---

### User Story 2 - Manage Saved Views (Priority: P2)

After using saved views for a while, users may need to update a view's configuration (e.g., add a new column to an existing view) or remove views they no longer use. Without management capabilities, users would need to delete and recreate views to make changes, or accumulate unused views cluttering the dropdown.

**Why this priority**: Enhances the usability of saved views by allowing users to maintain their view library. Requires P1 to exist first, but significantly improves long-term user experience.

**Independent Test**: Can be tested by editing an existing view's name or configuration, applying it to verify changes persisted, and deleting unused views to verify they're removed from the dropdown. Delivers view maintenance value.

**Acceptance Scenarios**:

1. **Given** a user opens the saved views dropdown, **When** they click the rename icon button next to a saved view, **Then** they can change the view's name while preserving its configuration
2. **Given** a user has a saved view applied and makes manual table changes, **When** they click the update icon button next to that view in the dropdown, **Then** the view's configuration updates to match the current table state (column visibility, filters, sorting)
3. **Given** a user has a saved view applied and makes manual configuration changes (adds filter, hides column), **When** they do NOT click the update icon, **Then** the saved view remains unchanged and manual changes are temporary overrides
4. **Given** a user has made manual configuration changes without updating the saved view, **When** they reapply the same saved view from the dropdown, **Then** the table reverts to the saved configuration discarding manual changes
5. **Given** a user opens the saved views dropdown, **When** they click the delete icon button next to a saved view, **Then** the view is removed from their saved views list and from localStorage
6. **Given** a user deletes the currently active view, **When** the deletion completes, **Then** the table reverts to the default view and the button shows default text (e.g., "Select View" or "Default View")

---

### User Story 3 - View Persistence and Default State (Priority: P3)

Users expect the application to remember which view they were using when they return to the incident table, so they don't have to reselect their preferred view every time they navigate away and back or refresh the page.

**Why this priority**: Quality-of-life improvement that reduces repetitive actions. Depends on P1 functionality and enhances user experience but isn't critical for the feature to be useful.

**Independent Test**: Can be tested by applying a saved view, refreshing the browser, and verifying the same view is still active. Also test first-time usage to verify default behavior. Delivers convenience value.

**Acceptance Scenarios**:

1. **Given** a user has applied a saved view, **When** they refresh the browser page, **Then** the same view is still active with its configuration applied (manual changes are discarded)
2. **Given** a user has applied a saved view, **When** they navigate to a different page and return to the incident table, **Then** the same view is still active (manual changes are discarded)
3. **Given** a new user or user with no saved views (defaultView not set in localStorage), **When** they first view the incident table, **Then** the default table layout shows all columns with no filters and default sorting
4. **Given** a user's defaultView reference points to a view that no longer exists (deleted or corrupted), **When** they return to the incident table, **Then** the default table layout is displayed and defaultView is cleared from localStorage
5. **Given** a user has made manual table configuration changes without updating the saved view, **When** they refresh the page, **Then** those manual changes are discarded and the saved view configuration is restored

---

### User Story 4 - Toolbar Layout Update (Priority: P4)

The current table toolbar layout places the "Create Incident" button on the right side, but users would benefit from having it more prominently positioned on the left side for better visibility and consistency with primary action button placement patterns.

**Why this priority**: Visual/UX improvement that can be implemented independently. Not functionally dependent on saved views feature but mentioned as part of the toolbar updates. Low priority as it's cosmetic.

**Independent Test**: Can be visually tested by inspecting the toolbar and verifying the "Create Incident" button is positioned on the left side. Delivers improved visual hierarchy.

**Acceptance Scenarios**:

1. **Given** a user views the incident table toolbar, **When** they look at the button layout, **Then** the "Create Incident" button is positioned on the left side
2. **Given** the saved views dropdown is present, **When** viewing the toolbar, **Then** both the "Create Incident" button and saved views dropdown are clearly visible and don't overlap

---

### Edge Cases

- **localStorage unavailable or full**: System displays an error message to the user indicating saved views cannot be persisted. User can still modify table configuration in the current session, but changes won't be saved across sessions. System gracefully degrades to stateless operation.
- **Corrupted view data in localStorage**: System detects invalid view data structure, logs error, removes corrupted data, and displays default view. User is notified that saved views were reset.
- **View saved with columns that no longer exist**: If table schema changes and a saved view references non-existent columns, system shows only the columns that still exist and notifies user the view has outdated configuration.
- **Maximum number of saved views**: System limits users to 50 saved views maximum. When limit is reached, user must delete an existing view before creating a new one. Error message clearly indicates the limit.
- **Duplicate view names**: System prevents saving views with duplicate names. Validation occurs before save operation completes, with clear error message prompting user to choose a different name.
- **Empty view name**: System prevents saving views with empty or whitespace-only names. Validation requires at least one non-whitespace character.
- **Very long view names**: System limits view names to 100 characters maximum to ensure dropdown remains usable. Truncation with ellipsis in dropdown if needed.
- **Deleting all saved views**: User can delete all their saved views. When no views remain, dropdown shows only the "Create New View" button. System clears defaultView from localStorage and applies default table layout.
- **Deleting the currently active view**: When user deletes the view currently referenced by defaultView, the system immediately clears defaultView from localStorage, applies the default table layout, and updates the button to show default text.
- **defaultView references non-existent view**: On page load, if defaultView points to a view ID that doesn't exist (deleted, corrupted, or never existed), system clears defaultView from localStorage and displays the default table layout. No error shown to user - graceful fallback.
- **Switching views with unsaved manual changes**: When a user has made manual table configuration changes (temporary overrides) and switches to a different saved view, the unsaved changes are discarded and the new view's saved configuration is applied. No warning is shown as manual changes are explicitly temporary until user clicks "Update View".
- **Page refresh with unsaved manual changes**: When a user has made manual configuration changes and refreshes the page, those changes are lost. The system restores the saved view referenced by defaultView (or default table layout if defaultView not set). This is expected behavior - only explicitly saved configurations persist.
- **Concurrent edits in multiple tabs**: Out of scope - each browser tab operates independently. If user modifies views in one tab, changes won't reflect in other open tabs until refresh. This is acceptable given localStorage limitations.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a saved views button dropdown component in the incident table toolbar that displays "Current View: [view name]" when a view is active, or default text (e.g., "Select View") when no view is active
- **FR-002**: Saved views dropdown MUST display a list of all user-created views by name when the button is clicked
- **FR-003**: Saved views dropdown MUST include a "Create New View" option accessible at all times within the dropdown menu
- **FR-003a**: Each saved view in the dropdown MUST display action icon buttons (rename, update, delete) next to the view name for quick access to management operations
- **FR-004**: System MUST provide a panel interface for creating and saving new views
- **FR-005**: Save view panel MUST allow users to enter a unique name for the view (1-100 characters, non-empty)
- **FR-006**: System MUST save the following table configuration in each view: visible columns, column order, active filters with their values, and sorting configuration (column and direction)
- **FR-007**: System MUST prevent users from saving views with duplicate names, showing a clear error message
- **FR-008**: System MUST store all saved views in browser localStorage with the user's unique identifier as the storage key, and maintain a separate defaultView key that references the currently active view ID
- **FR-009**: Users MUST be able to apply any saved view by clicking the view name in the dropdown
- **FR-009a**: System MUST update the defaultView reference in localStorage whenever a user applies a saved view
- **FR-010**: System MUST immediately update the incident table to reflect the selected view's configuration (columns, filters, sorting) without page reload, and update the button text to show "Current View: [view name]"
- **FR-011**: System MUST visually indicate which view is currently active in the dropdown (e.g., checkmark, highlight, or bold text)
- **FR-012**: Users MUST be able to rename existing saved views by clicking the rename icon button next to the view in the dropdown, preserving the view's configuration
- **FR-013**: Users MUST be able to update an existing view's configuration to match the current table state by explicitly clicking the update icon button next to the view in the dropdown
- **FR-013a**: System MUST treat manual table configuration changes (columns, filters, sorting) as temporary overrides that do NOT automatically modify the active saved view
- **FR-013b**: System MUST discard all manual temporary changes when the page is refreshed or the user navigates away and returns to the incident table
- **FR-014**: Users MUST be able to delete any saved view by clicking the delete icon button next to the view in the dropdown
- **FR-014a**: System MUST clear the defaultView reference in localStorage if the deleted view is currently referenced by defaultView
- **FR-015**: System MUST persist the currently active view ID in a defaultView key in localStorage and automatically apply that view when the user returns to the incident table (if the view still exists)
- **FR-016**: System MUST provide a default table layout (all columns visible, no filters, default sorting) when defaultView is not set in localStorage or when the referenced view no longer exists
- **FR-017**: System MUST position the "Create Incident" button on the left side of the table toolbar
- **FR-018**: System MUST limit users to a maximum of 50 saved views
- **FR-019**: System MUST handle localStorage unavailability gracefully by showing an error message and allowing stateless table configuration
- **FR-020**: System MUST validate view data structure on load and remove corrupted data if detected

### Key Entities

- **Saved View**: Represents a named table configuration created by a user
  - Attributes: unique view ID, view name (string, 1-100 chars), visible columns (array of column identifiers), column order (array of column identifiers), active filters (object mapping filter names to values), sorting configuration (column identifier and direction), creation timestamp, last modified timestamp
  - Uniqueness: View names must be unique per user
  - Lifecycle: Created when user saves a new view, updated when user modifies view configuration or renames it, deleted when user removes view
  - Storage: Persisted in localStorage under a user-specific key (e.g., `savedViews`), serialized as JSON array of view objects
  - Relationships: Each view belongs to one user (identified by browser/localStorage context)

- **Default View Reference**: Tracks which saved view is currently active
  - Attributes: view ID (string reference to a saved view's unique ID)
  - Storage: Persisted in localStorage under a separate key (e.g., `defaultView`)
  - Lifecycle: Updated when user applies a saved view, cleared when the referenced view is deleted or doesn't exist on page load
  - Purpose: Enables restoration of the last active view on page refresh or navigation

- **Default Table Layout**: Represents the system's fallback table configuration
  - Attributes: all columns visible in default order, no active filters, default sorting (typically by creation date descending)
  - Lifecycle: Always available, cannot be modified or deleted, applied when defaultView is not set or when referenced view doesn't exist
  - Not stored in localStorage - defined in application code as baseline configuration

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a saved view in under 30 seconds from opening the save panel to completion
- **SC-002**: Switching between saved views updates the table within 500 milliseconds
- **SC-003**: 100% of saved views persist across browser sessions (when localStorage is available)
- **SC-004**: Users can manage up to 50 saved views without performance degradation
- **SC-005**: The saved views dropdown is visible and accessible from the table toolbar on all screen sizes (desktop and tablet)
- **SC-006**: 85% of users successfully create and apply their first saved view without requiring help documentation
- **SC-007**: Table configuration (columns, filters, sorting) matches saved view specification with 100% accuracy when view is applied
- **SC-008**: System gracefully handles localStorage failures in 100% of cases without crashing or blocking core incident table functionality
- **SC-009**: View management operations (rename, update, delete) complete within 300 milliseconds
- **SC-010**: The "Create Incident" button remains accessible and visible in its new left-side position across all table states (empty, filtered, with data)

## Assumptions

- Users are accessing the application via modern browsers that support localStorage (Chrome, Firefox, Safari, Edge)
- The incident table already has filtering, sorting, and column visibility controls that can be captured in view configurations
- Each user's saved views are isolated to their browser/device - no cross-device synchronization or sharing between users
- The table has a stable set of column identifiers that can be reliably referenced in saved views
- localStorage has sufficient space (typically 5-10MB) to store up to 50 views per user
- View names are case-sensitive for uniqueness validation (e.g., "My View" and "my view" are considered different)
- When a view is applied, it completely replaces the current table state - no partial merging of configurations
- The default sort order for the table (in the default table layout) is by incident creation date in descending order (newest first)
- Manual table configuration changes (temporary overrides) are not persisted across page refreshes - only explicitly saved view configurations persist
- The defaultView localStorage key stores a simple view ID reference (string), not the full view configuration
- Column visibility changes in a view do not affect the underlying data structure or available columns in the system
- Users understand that saved views are personal and local to their browser - no confusion expected about views not appearing on other devices
- The incident table uses Material React Table or similar library that supports programmatic control of columns, filters, and sorting
- The maximum view name length of 100 characters is sufficient for descriptive naming while preventing dropdown layout issues
