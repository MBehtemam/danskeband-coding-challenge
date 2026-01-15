# Feature Specification: Layout Improvements, Status Colors, and Filter Bug Fixes

**Feature Branch**: `008-layout-filters-fix`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Make navigation bar full width and table at the center as the current layout is good. Fix the position of 'Create Incident' at the right side of table, even if we show/hide columns the 'Create Incident' button should always be on the right side. Change the colors of 'Resolved' to '#ebece7' (and adjust text colors and icons), 'In Progress' to '#bad7e5' (adjust text colors) and 'Open' to '#4672c2' (adjust text colors). Review 'Filter by Assignee' and 'Created' - when filtering by them it shows nothing, other filters are working."

## Clarifications

### Session 2026-01-15

- Q: When filtering by assignee, how should "Unassigned" incidents be handled? → A: Add "Unassigned" as a filter option in the dropdown; selecting it shows only incidents with null/empty assigneeId.
- Q: How should the system handle date filtering with invalid date ranges (end date before start date)? → A: Prevent invalid range selection in UI by disabling end dates before the start date.
- Q: Where should the "Create Incident" button be positioned? → A: Integrate into MRT's renderToolbar; position within table toolbar (left or right side acceptable) so it stays aligned with the table.
- Q: Should print mode and high contrast mode styling for status colors be addressed in this feature? → A: Deferred; colors meet WCAG AA for normal display. Print/high-contrast modes are out of scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtering Incidents by Assignee (Priority: P1)

A dashboard user wants to filter the incident table by a specific assignee to view only incidents assigned to that person.

**Why this priority**: This is a critical bug fix. Users cannot currently filter by assignee, which breaks core functionality. Without working filters, users cannot efficiently manage their incident workload.

**Independent Test**: Can be fully tested by selecting an assignee from the filter dropdown and verifying that only incidents assigned to that user appear in the table.

**Acceptance Scenarios**:

1. **Given** incidents exist with various assignees, **When** user selects an assignee name from the Assignee filter dropdown, **Then** only incidents assigned to that user are displayed in the table.
2. **Given** user has filtered by an assignee, **When** user clears the filter, **Then** all incidents are displayed again.
3. **Given** user has selected an assignee filter, **When** user refreshes the page, **Then** the filter persists and shows the correct filtered results.
4. **Given** incidents exist with null/empty assigneeId, **When** user selects "Unassigned" from the Assignee filter dropdown, **Then** only incidents with no assigned user are displayed in the table.

---

### User Story 2 - Filtering Incidents by Created Date (Priority: P1)

A dashboard user wants to filter incidents by their creation date to focus on recent or historical incidents.

**Why this priority**: This is a critical bug fix alongside assignee filtering. Date filtering is essential for incident management workflows.

**Independent Test**: Can be fully tested by selecting a date range in the Created filter and verifying that only incidents created within that range appear.

**Acceptance Scenarios**:

1. **Given** incidents exist with various creation dates, **When** user selects a date range in the Created filter, **Then** only incidents created within that range are displayed.
2. **Given** user has filtered by date, **When** user clears the filter, **Then** all incidents are displayed again.
3. **Given** incidents exist, **When** user applies "greater than" date filter, **Then** only incidents created after the specified date appear.

---

### User Story 3 - Create Incident Button Positioning (Priority: P2)

A dashboard user wants the "Create Incident" button to remain consistently positioned on the right side of the table, regardless of column visibility changes.

**Why this priority**: This improves usability by providing a consistent action button location. Users should always find the primary action in the same place.

**Independent Test**: Can be fully tested by toggling column visibility and verifying the "Create Incident" button remains on the right side.

**Acceptance Scenarios**:

1. **Given** user is on the dashboard page, **When** all columns are visible, **Then** the "Create Incident" button appears on the right side of the table toolbar area.
2. **Given** user is on the dashboard page, **When** user hides one or more columns, **Then** the "Create Incident" button remains on the right side of the table toolbar area.
3. **Given** user is on the dashboard page, **When** user shows previously hidden columns, **Then** the "Create Incident" button remains on the right side of the table toolbar area.

---

### User Story 4 - Updated Status Chip Colors (Priority: P3)

A dashboard user views incidents with status indicators that use updated color coding for better visual distinction.

**Why this priority**: This is a visual enhancement that improves the user experience but does not block core functionality.

**Independent Test**: Can be fully tested by viewing incidents with each status and verifying the correct background and text colors are applied.

**Acceptance Scenarios**:

1. **Given** an incident has "Resolved" status, **When** displayed in the table, **Then** the status chip displays with background color #ebece7 and appropriate dark text for contrast.
2. **Given** an incident has "In Progress" status, **When** displayed in the table, **Then** the status chip displays with background color #bad7e5 and appropriate dark text for contrast.
3. **Given** an incident has "Open" status, **When** displayed in the table, **Then** the status chip displays with background color #4672c2 and white text for contrast.
4. **Given** a status chip is displayed, **When** the user views it, **Then** the icon color matches the text color for visual consistency.

---

### User Story 5 - Full-Width Navigation with Centered Table (Priority: P3)

A dashboard user views the application with a full-width navigation bar and the incident table centered within the content area.

**Why this priority**: This is a layout refinement. The current layout is described as "good" so this is confirming/maintaining the existing behavior.

**Independent Test**: Can be fully tested by viewing the dashboard on different screen sizes and verifying the navigation spans full width while the table remains centered.

**Acceptance Scenarios**:

1. **Given** user is on the dashboard page, **When** the page loads, **Then** the navigation bar spans the full width of the viewport.
2. **Given** user is on the dashboard page, **When** the page loads, **Then** the incident table is centered within the main content area.
3. **Given** user resizes the browser window, **When** the viewport changes, **Then** the navigation bar continues to span full width and the table remains centered.

---

### Edge Cases

- ~~What happens when filtering by assignee for "Unassigned" incidents (null assigneeId)?~~ **Resolved**: "Unassigned" is added as a filter option; selecting it shows incidents with null/empty assigneeId.
- ~~How does the system handle date filtering with invalid date ranges (end date before start date)?~~ **Resolved**: UI prevents invalid selection by disabling end dates before the start date.
- ~~What happens if all columns except title are hidden - does the Create Incident button still appear correctly?~~ **Resolved**: Button integrated into MRT toolbar via `renderToolbar`, so it stays aligned with table regardless of column visibility.
- ~~How do status colors appear when printed or in high contrast mode?~~ **Deferred**: Out of scope; colors meet WCAG AA for normal display. Print/high-contrast modes to be addressed in future accessibility feature if needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST correctly filter incidents by assignee name, matching the selected name to the incident's assigned user.
- **FR-001a**: System MUST include an "Unassigned" option in the Assignee filter dropdown that filters to show only incidents with null/empty assigneeId.
- **FR-002**: System MUST correctly filter incidents by creation date using date range, greater than, or less than operators.
- **FR-002a**: System MUST prevent selection of invalid date ranges by disabling end dates that are before the selected start date in the date picker UI.
- **FR-003**: System MUST display the "Create Incident" button within the MRT table toolbar using the `renderToolbar` prop.
- **FR-004**: System MUST ensure the "Create Incident" button stays properly aligned with the table toolbar regardless of column visibility state changes.
- **FR-005**: System MUST display "Resolved" status chips with background color #ebece7 and dark text color for sufficient contrast (WCAG AA compliant).
- **FR-006**: System MUST display "In Progress" status chips with background color #bad7e5 and dark text color for sufficient contrast.
- **FR-007**: System MUST display "Open" status chips with background color #4672c2 and white text color for sufficient contrast.
- **FR-008**: System MUST display status chip icons in the same color as the status chip text.
- **FR-009**: System MUST display the navigation bar spanning the full width of the viewport.
- **FR-010**: System MUST center the incident table within the main content area.
- **FR-011**: System MUST persist filter selections (including assignee and date filters) in the URL for shareability and page refresh persistence.

### Key Entities *(include if feature involves data)*

- **Incident**: The core data entity with properties including status, assigneeId, and createdAt that are affected by this feature.
- **User**: Referenced by incidents via assigneeId; user name is displayed and used for filtering.
- **Status**: Enumerated value ("Open", "In Progress", "Resolved") with associated visual styling.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully filter incidents by any assignee and see matching results (100% accuracy).
- **SC-002**: Users can successfully filter incidents by date range and see matching results (100% accuracy).
- **SC-003**: The "Create Incident" button remains visually positioned on the right side of the table area across all column visibility configurations.
- **SC-004**: All three status colors display with their specified hex values (#ebece7 for Resolved, #bad7e5 for In Progress, #4672c2 for Open).
- **SC-005**: All status chips maintain minimum WCAG AA contrast ratio (4.5:1 for normal text).
- **SC-006**: Users can complete a filter-by-assignee action in under 3 seconds.
- **SC-007**: Navigation bar spans 100% of viewport width on all supported screen sizes.

## Assumptions

- The current centered table layout within the content area is acceptable and should be preserved.
- The navigation bar is already full-width based on MUI AppBar default behavior; this requirement confirms the existing implementation.
- The assignee filter bug is caused by a mismatch between the filter value (user name stored in URL) and the comparison logic in the custom filterFn.
- The date filter bug may be related to date format or comparison logic in the filter function.
- WCAG AA contrast compliance is required for accessibility.
- The "Create Incident" button should be integrated into the MRT table toolbar using the `renderToolbar` prop for proper alignment.
