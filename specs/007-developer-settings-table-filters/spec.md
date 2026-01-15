# Feature Specification: Developer Settings & Table Enhancements

**Feature Branch**: `007-developer-settings-table-filters`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "add a 'developer setting' page, so user can add/remove dummy incidents and user also developer should be able to remove the incident that they added. manage rows perpage and page on the url also for the first page. Toggle/hide column in table doesn't work. enable filters by default. filter by Status and filter by severity show show the chip, created at show be datepicker with different function like greater than, less than and between."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - URL-Based Pagination Management (Priority: P1)

As a user, I want pagination state (current page and rows per page) to be synchronized with the URL so that I can share links to specific pages and maintain my position when refreshing.

**Why this priority**: This is a foundational UX improvement that affects all users every time they interact with the table. Without URL-persisted pagination, users lose their place on page refresh and cannot share deep links to specific data views.

**Independent Test**: Can be fully tested by navigating the table, changing page/rows-per-page, then refreshing the browser - the same page and settings should be preserved.

**Acceptance Scenarios**:

1. **Given** the user is on the incidents table, **When** they change the page to page 2, **Then** the URL updates to include `?page=2`.
2. **Given** the user is on the incidents table, **When** they change rows per page to 20, **Then** the URL updates to include `?pageSize=20`.
3. **Given** a URL with `?page=3&pageSize=50`, **When** the user loads this URL directly, **Then** the table displays page 3 with 50 rows per page.
4. **Given** the user is on page 1 with default page size, **When** no pagination changes are made, **Then** the URL still includes `?page=1&pageSize=10` to maintain consistency.
5. **Given** a URL with invalid pagination params (e.g., page=999), **When** the user loads this URL, **Then** the system falls back to the nearest valid page.

---

### User Story 2 - Enhanced Column Filtering with Visual Chips (Priority: P1)

As a user, I want column filters to be enabled by default and display visual chips for Status and Severity filters so that filtering is intuitive and filter states are clearly visible.

**Why this priority**: Filtering is a core interaction pattern for finding incidents. The current implementation has broken column toggle functionality and filters are not enabled by default, severely impacting usability.

**Independent Test**: Can be fully tested by opening the table, verifying filters are visible by default, selecting status/severity filters and confirming chip-style display appears in the filter controls.

**Acceptance Scenarios**:

1. **Given** the user loads the incidents table, **When** the page renders, **Then** column filters are visible and enabled by default (filter row is shown).
2. **Given** the user clicks on the Status filter, **When** the filter dropdown opens, **Then** options are displayed as visual chips (Open, In Progress, Resolved) with appropriate styling.
3. **Given** the user clicks on the Severity filter, **When** the filter dropdown opens, **Then** options are displayed as visual chips (Critical, High, Medium, Low) with severity-appropriate colors.
4. **Given** the user has selected a Status filter, **When** viewing the filter control, **Then** the selected value is displayed as a styled chip.

---

### User Story 3 - Advanced Date Filtering for Created At (Priority: P2)

As a user, I want to filter incidents by creation date using a date picker with comparison operators (greater than, less than, between) so that I can find incidents from specific time periods.

**Why this priority**: Date-based filtering is essential for incident management but requires more complex UI. Users need to find incidents created within specific timeframes for reporting and investigation purposes.

**Independent Test**: Can be fully tested by selecting the Created At filter, choosing a comparison operator, selecting dates from the picker, and verifying only matching incidents appear.

**Acceptance Scenarios**:

1. **Given** the user opens the Created At filter, **When** the filter UI appears, **Then** a date picker is displayed with operator selection (greater than, less than, between).
2. **Given** the user selects "greater than" and picks a date, **When** the filter is applied, **Then** only incidents created after that date are displayed.
3. **Given** the user selects "less than" and picks a date, **When** the filter is applied, **Then** only incidents created before that date are displayed.
4. **Given** the user selects "between" and picks two dates, **When** the filter is applied, **Then** only incidents created within that date range are displayed.
5. **Given** the user has applied a date filter, **When** viewing the filter state, **Then** the selected operator and date(s) are clearly displayed.

---

### User Story 4 - Fix Column Toggle/Hide Functionality (Priority: P2)

As a user, I want the column visibility toggle feature to work correctly so that I can customize which columns are displayed in the table.

**Why this priority**: This is a bug fix that restores expected functionality. Users should be able to show/hide columns to focus on relevant data.

**Independent Test**: Can be fully tested by accessing the column visibility menu, toggling columns on/off, and verifying the table updates accordingly.

**Acceptance Scenarios**:

1. **Given** the user opens the column visibility menu, **When** they toggle off a column, **Then** that column is hidden from the table.
2. **Given** the user has hidden a column, **When** they toggle it back on, **Then** the column reappears in the table.
3. **Given** the user has hidden columns and refreshes the page, **When** the page reloads, **Then** column visibility preferences are preserved (via URL or local storage).
4. **Given** the user is on a mobile device, **When** columns are automatically hidden for responsive design, **Then** manual column visibility toggles still work correctly for visible columns.

---

### User Story 5 - Developer Settings Page (Priority: P3)

As a developer, I want a dedicated settings page where I can add dummy incidents for testing and remove incidents I created, so that I can easily test the application without cluttering production-like data.

**Why this priority**: This is a development/testing utility. While useful, it doesn't affect the core user experience of the main incident management workflow.

**Independent Test**: Can be fully tested by navigating to the developer settings page, creating a dummy incident, verifying it appears in the main table, then deleting it from the settings page.

**Acceptance Scenarios**:

1. **Given** the user navigates to the developer settings page, **When** the page loads, **Then** they see options to add dummy incidents and a list of incidents they can manage.
2. **Given** the user is on the developer settings page, **When** they click "Add Dummy Incident," **Then** a new incident with randomly generated test data is created.
3. **Given** the user has created dummy incidents, **When** viewing the developer settings page, **Then** they see a list of all incidents with delete options.
4. **Given** the user clicks delete on an incident from the developer settings page, **When** the action completes, **Then** the incident is removed from the system.
5. **Given** the user has created dummy incidents via developer settings, **When** viewing the developer settings page, **Then** they can only delete incidents created via the developer settings page (dummy incidents), not incidents from the main application.

---

### Edge Cases

- Invalid date range (end date before start date): Display inline validation error message and disable the filter apply action until the user corrects the range.
- How does the system handle URL manipulation with conflicting parameters (e.g., filters in URL don't match actual data values)?
- Deleting a dummy incident while it's viewed in detail drawer: N/A — deletion is limited to dummy incidents only, reducing likelihood; if it occurs, drawer should close automatically after deletion.
- How does the table behave when all columns are hidden via the toggle menu?
- What happens when the page parameter in URL exceeds the number of available pages after data changes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST persist pagination state (page number and rows per page) in the URL query parameters.
- **FR-002**: System MUST load pagination state from URL query parameters on initial page load and navigation.
- **FR-003**: System MUST include page and pageSize parameters in the URL even for default values (page=1, pageSize=10).
- **FR-004**: System MUST display column filters by default when the incidents table loads.
- **FR-005**: System MUST display Status filter options as styled chips matching the status display format.
- **FR-006**: System MUST display Severity filter options as styled chips matching the severity display format.
- **FR-007**: System MUST provide a date picker for the Created At filter with operator selection.
- **FR-008**: System MUST support "greater than," "less than," and "between" operators for date filtering.
- **FR-009**: System MUST fix the column visibility toggle functionality to correctly show/hide columns.
- **FR-010**: System MUST provide a developer settings page accessible via navigation.
- **FR-011**: System MUST allow users to create dummy incidents with auto-generated test data from the developer settings page.
- **FR-012**: System MUST allow users to delete only dummy incidents (created via developer settings) from the developer settings page.
- **FR-013**: System MUST validate date ranges (start date must be before or equal to end date for "between" filter).
- **FR-014**: System MUST gracefully handle invalid URL parameters by falling back to sensible defaults.
- **FR-015**: System MUST display inline validation error and disable filter application when "between" date range has end date before start date.

### Key Entities

- **Incident**: Core entity with id, title, description, status, severity, assigneeId, createdAt, updatedAt, statusHistory. Already exists in the system. Will add `isDummy: boolean` flag to distinguish developer-created test incidents.
- **Pagination State**: Represents current page number and rows per page count, synchronized with URL.
- **Date Filter State**: Represents operator type (gt, lt, between) and selected date value(s).
- **Column Visibility State**: Represents which columns are currently visible in the table.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can share URLs that preserve exact table state including page, rows per page, filters, and sorting.
- **SC-002**: Users can filter incidents by Status and Severity using visually consistent chip-style selectors in under 3 clicks.
- **SC-003**: Users can filter incidents by creation date using date range comparisons within 5 seconds.
- **SC-004**: Column visibility toggle works correctly with 100% reliability (0 failures in normal usage).
- **SC-005**: Developers can add and remove test incidents without navigating away from the settings page.
- **SC-006**: Page refresh preserves all table state including pagination, filters, and column visibility.
- **SC-007**: All filter states are visually clear and users can identify active filters at a glance.

## Clarifications

### Session 2026-01-14

- Q: What should happen when a user applies "between" date filter with an invalid range (end date before start date)? → A: Show inline validation error, disable filter until fixed.
- Q: Can users delete any incident from developer settings, or only dummy incidents? → A: Only dummy incidents (created via developer settings).

## Assumptions

- The developer settings page is intended for development/testing environments; production deployment considerations are out of scope.
- "Dummy incidents" will use auto-generated realistic test data (random titles, severities, dates).
- Column visibility preferences will be stored in the URL to maintain shareability (not localStorage).
- The existing StatusChip and SeverityChip components can be reused for filter displays.
- Date filtering will use a date picker component consistent with Material UI's design system.
- The "between" date filter is inclusive of both boundary dates.
