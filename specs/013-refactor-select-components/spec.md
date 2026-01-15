# Feature Specification: Refactor Select Components and Improve Form UX

**Feature Branch**: `013-refactor-select-components`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "SeveritySelect is a good example that just pass the value to its parent, and they don't call useUpdateIncident directly. I like to have similar thing for StatusSelect, and AssigneeSelect, then we can use these in create new incident modal as well. That means DetailPanel would be responsible for calling updateIncident. Also when update panel success, the notification should be on top center with auto dismiss 5 second. Also add alert in the create incident and also in update incident for showing server errors if any happened."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reusable Status and Assignee Selection (Priority: P1)

Users need to change incident status and assignee in a consistent way across the application, whether viewing incident details or creating new incidents.

**Why this priority**: Foundation for other improvements. Enables component reusability and consistent behavior across create and update flows.

**Independent Test**: Can be fully tested by verifying StatusSelect and AssigneeSelect components accept value/onChange props and don't directly call update APIs. Delivers reusable components that work in isolation.

**Acceptance Scenarios**:

1. **Given** StatusSelect component is used in DetailPanel, **When** user changes status dropdown, **Then** component passes new status value to parent via onChange callback without directly calling API
2. **Given** AssigneeSelect component is used in DetailPanel, **When** user changes assignee dropdown, **Then** component passes new assignee value to parent via onChange callback without directly calling API
3. **Given** StatusSelect component is used in CreateIncidentDialog, **When** user selects a status, **Then** component correctly updates local form state
4. **Given** AssigneeSelect component is used in CreateIncidentDialog, **When** user selects an assignee, **Then** component correctly updates local form state

---

### User Story 2 - Explicit Save Pattern in DetailPanel (Priority: P2)

When users update incident details, they should be able to change multiple fields and then explicitly save all changes with a Save button. The DetailPanel should handle the update operation and provide consistent feedback.

**Why this priority**: Improves maintainability, enables centralized error handling, and gives users control over when changes are persisted. Depends on P1 component refactoring.

**Independent Test**: Can be tested by changing multiple fields in DetailPanel and verifying changes only persist when Save button is clicked.

**Acceptance Scenarios**:

1. **Given** user views incident detail panel, **When** user changes status via StatusSelect, **Then** DetailPanel receives onChange event and updates local form state without calling API
2. **Given** user views incident detail panel, **When** user changes assignee via AssigneeSelect, **Then** DetailPanel receives onChange event and updates local form state without calling API
3. **Given** user has made changes in DetailPanel, **When** user clicks Save button, **Then** DetailPanel calls updateIncident API with all changed fields
4. **Given** DetailPanel calls updateIncident, **When** update fails, **Then** DetailPanel displays error alert and preserves user's edited values for retry
5. **Given** DetailPanel calls updateIncident, **When** update succeeds, **Then** DetailPanel shows success notification at top center with auto-dismiss after 5 seconds and updates form state to reflect saved values

---

### User Story 3 - Improved Error Visibility (Priority: P3)

Users need clear, visible feedback when server errors occur during incident creation or updates.

**Why this priority**: Enhances user experience by providing explicit error messages. Can be implemented independently after core refactoring.

**Independent Test**: Can be tested by simulating server errors and verifying error alerts appear in both CreateIncidentDialog and DetailPanel.

**Acceptance Scenarios**:

1. **Given** user submits CreateIncidentDialog, **When** server returns error, **Then** error alert displays in dialog with descriptive message
2. **Given** user updates incident in DetailPanel, **When** server returns error, **Then** error alert displays in panel with descriptive message
3. **Given** error alert is displayed, **When** user corrects issue and retries, **Then** error alert is cleared on successful operation

---

### Edge Cases

- How does system handle network timeout during Save operation?
- What happens when user closes DetailPanel or navigates away while Save is in progress?
- How does system handle concurrent updates to the same incident by multiple users?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: StatusSelect component MUST accept value and onChange props and pass selected status to parent without calling update API directly
- **FR-002**: AssigneeSelect component MUST accept value and onChange props and pass selected assignee to parent without calling update API directly
- **FR-003**: StatusSelect and AssigneeSelect components MUST support disabled state to prevent interaction during operations
- **FR-004**: DetailPanel MUST maintain local form state when StatusSelect or AssigneeSelect onChange events fire (without calling API immediately)
- **FR-005**: DetailPanel MUST provide a Save button that triggers updateIncident API call with all changed fields
- **FR-006**: DetailPanel MUST display success notification at top center of screen when update succeeds
- **FR-007**: Success notifications MUST automatically dismiss after 5 seconds
- **FR-008**: DetailPanel MUST display error alert at top of panel when update operation fails
- **FR-009**: CreateIncidentDialog MUST display error alert at top of dialog when creation operation fails
- **FR-010**: Error alerts MUST include descriptive messages indicating the nature of the failure
- **FR-011**: When update fails, DetailPanel MUST preserve user's edited values to allow retry without re-entering data
- **FR-012**: Components MUST be disabled during pending Save/Create operations to prevent multiple simultaneous submissions
- **FR-013**: CreateIncidentDialog MUST use refactored StatusSelect and AssigneeSelect components for consistency
- **FR-014**: Save button MUST be disabled when no changes have been made or when save operation is in progress
- **FR-015**: Save button MUST show loading indicator (spinner/progress) while save operation is in progress

### Key Entities

- **Select Components**: Reusable UI components (StatusSelect, AssigneeSelect, SeveritySelect) that present dropdown options and communicate value changes to parent components via callbacks without triggering API calls
- **DetailPanel**: Container component responsible for maintaining local form state, orchestrating incident updates via explicit Save button, and managing update lifecycle (loading, success, error states)
- **Save Button**: Action button in DetailPanel that triggers updateIncident API call when clicked, disabled when no changes exist or operation is pending
- **Notification**: Transient message displayed at top center to confirm successful operations, automatically dismissed after timeout
- **Error Alert**: Persistent message displayed inline to communicate operation failures, requiring user acknowledgment or retry action

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: StatusSelect and AssigneeSelect components can be successfully reused in both DetailPanel and CreateIncidentDialog without code duplication
- **SC-002**: Success notifications appear within 200ms of successful update and auto-dismiss exactly 5 seconds later
- **SC-003**: Error alerts appear immediately when server errors occur (within 200ms) and remain visible until user takes corrective action
- **SC-004**: Users can identify the cause of form errors from error alert messages without needing to check console or network logs
- **SC-005**: Component architecture reduces update-related code duplication by at least 50% compared to current implementation

## Clarifications

### Session 2026-01-15

- Q: When a user changes status/assignee while a previous update is still pending, how should the system handle this? → A: DetailPanel uses explicit Save button pattern (not auto-save), so concurrent updates don't apply to select components - they only pass values to parent.
- Q: Where should the Save button be positioned in the DetailPanel? → A: DetailPanel already has a Save button - no changes needed to button placement.
- Q: When an update fails in DetailPanel and you display an error alert, where should this error alert be positioned? → A: Top of the DetailPanel
- Q: When the user clicks Save multiple times in quick succession, how should the system handle this? → A: Disable Save button and show loading indicator during API call
- Q: Should unsaved changes in DetailPanel trigger a warning if the user tries to close the panel or navigate away? → A: No
- Q: Where should error alerts be positioned in the CreateIncidentDialog when creation fails? → A: Top of the dialog

## Assumptions

- Existing useUpdateIncident hook provides adequate error information for displaying descriptive error messages
- Current notification system (likely Snackbar or Toast) supports top-center positioning and auto-dismiss configuration
- StatusSelect and AssigneeSelect currently call useUpdateIncident directly (auto-save pattern)
- SeveritySelect pattern (value/onChange props without direct API calls) is the desired architecture pattern
- DetailPanel will change from auto-save-on-change to explicit Save button pattern
- Same refactored select components will be used in both DetailPanel and CreateIncidentDialog
- 5-second auto-dismiss duration is appropriate for all success notifications regardless of operation complexity
- Error alerts should be persistent (not auto-dismiss) to ensure users see critical error information
- Form components should prevent submission during pending operations to avoid race conditions
