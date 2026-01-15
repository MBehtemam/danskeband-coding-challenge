# Feature Specification: Detail Panel with Explicit Save

**Feature Branch**: `002-detail-panel-save`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Show details in a Detail Panel using MRT instead of expanding the row. Change from auto-save to explicit save (user makes changes, then clicks Save)."

## Clarifications

### Session 2026-01-14

- Q: What panel width on desktop? → A: ~33% of screen width on desktop; full-width on mobile (responsive)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Incident Details in Side Panel (Priority: P1)

As an operations team member, I want to click on an incident row and see its details in a side panel (drawer) so that I can view the full incident information while keeping the incident list visible for context.

**Why this priority**: This is the core UX change - replacing row expansion with a dedicated side panel improves the user experience by maintaining list context and providing more screen space for incident details.

**Independent Test**: Can be fully tested by clicking an incident row and verifying a side panel opens showing all incident details (title, description, status, severity, assignee, timestamps, status history) without expanding the table row.

**Acceptance Scenarios**:

1. **Given** the incident list is displayed, **When** the user clicks on an incident row, **Then** a side panel opens on the right showing full incident details
2. **Given** the side panel is open, **When** the user views the panel, **Then** they see title, description, status, severity, assignee, created date, updated date, and status history
3. **Given** the side panel is open, **When** the user clicks the close button or clicks outside the panel, **Then** the panel closes and the list is fully visible
4. **Given** an incident is selected, **When** the user clicks a different incident row, **Then** the panel updates to show the newly selected incident's details
5. **Given** the side panel is open, **When** the incident list is visible behind it, **Then** the user can still see the list context (the panel overlays but doesn't hide the entire list)

---

### User Story 2 - Edit Incident with Explicit Save (Priority: P1)

As an operations team member, I want to make changes to an incident's status and assignee and then explicitly save those changes by clicking a Save button, so that I have control over when my changes are committed and can review them before saving.

**Why this priority**: This changes the fundamental interaction model from auto-save to explicit save. Users need to feel in control of when their changes are persisted, especially in an operations context where changes may be reviewed before committing.

**Independent Test**: Can be tested by opening an incident, changing status and/or assignee, observing that changes are not saved automatically, then clicking Save and verifying the changes persist.

**Acceptance Scenarios**:

1. **Given** the detail panel is open, **When** the user changes the status, **Then** the change is shown locally but NOT saved to the system until Save is clicked
2. **Given** the detail panel is open, **When** the user changes the assignee, **Then** the change is shown locally but NOT saved to the system until Save is clicked
3. **Given** the user has made changes, **When** they click the Save button, **Then** all pending changes are saved and success feedback is displayed
4. **Given** the user has made changes, **When** the save operation is in progress, **Then** a loading indicator is shown and the Save button is disabled
5. **Given** the user has made changes, **When** the save fails, **Then** an error message is displayed and the user can retry
6. **Given** the user has made changes, **When** they close the panel without saving, **Then** changes are discarded (no unsaved prompt for MVP)

---

### User Story 3 - Visual Indication of Unsaved Changes (Priority: P2)

As an operations team member, I want to see a visual indication when I have unsaved changes so that I know my edits haven't been persisted yet.

**Why this priority**: Provides important feedback to users about the state of their changes, preventing confusion about whether changes have been saved.

**Independent Test**: Can be tested by making a change and observing visual feedback (e.g., modified indicator, Save button enabled/highlighted) that indicates unsaved changes exist.

**Acceptance Scenarios**:

1. **Given** the detail panel is open with no changes, **When** viewing the Save button, **Then** it is disabled or visually muted
2. **Given** the user has made a change, **When** viewing the panel, **Then** the Save button becomes enabled/highlighted
3. **Given** the user has made changes, **When** changes are successfully saved, **Then** the Save button returns to its disabled/muted state
4. **Given** the user has made changes, **When** they revert the changes to original values, **Then** the Save button returns to its disabled/muted state

---

### User Story 4 - Cancel Edits (Priority: P2)

As an operations team member, I want to cancel my edits and revert to the original values so that I can undo changes I don't want to save.

**Why this priority**: Complements explicit save by allowing users to easily undo changes before saving, reducing the risk of accidental modifications.

**Independent Test**: Can be tested by making changes, clicking Cancel/Discard, and verifying the panel reverts to showing original values.

**Acceptance Scenarios**:

1. **Given** the user has made changes in the detail panel, **When** they click the Cancel/Discard button, **Then** all changes are reverted to the original values
2. **Given** the user has made no changes, **When** viewing the panel, **Then** the Cancel/Discard button is disabled or hidden

---

### Edge Cases

- What happens when the user tries to select a different incident with unsaved changes? Discard changes silently and load the new incident (for MVP simplicity)
- How does the panel behave on mobile viewports? Panel should be full-width or use a bottom sheet approach to remain usable
- What happens if the underlying incident data changes while the user is editing? On save, if data has changed, show the updated data and allow user to re-apply their changes
- What happens if the network fails during save? Display error message with retry option; keep the form editable with the user's changes preserved

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display incident details in a side panel (drawer) when an incident is clicked, instead of expanding the table row
- **FR-002**: Side panel MUST show: title, description, status, severity, assignee, created date, updated date, and status history
- **FR-003**: System MUST allow users to edit incident status within the detail panel
- **FR-004**: System MUST allow users to edit incident assignee within the detail panel
- **FR-005**: System MUST NOT automatically save changes when status or assignee is modified
- **FR-006**: System MUST provide a Save button that persists all pending changes when clicked
- **FR-007**: System MUST display a loading indicator during save operations
- **FR-008**: System MUST display success feedback when save completes successfully
- **FR-009**: System MUST display error messages when save fails and allow retry
- **FR-010**: System MUST visually indicate when unsaved changes exist (e.g., enabled Save button)
- **FR-011**: System MUST provide a way to cancel/discard unsaved changes and revert to original values
- **FR-012**: Side panel MUST include a close button to dismiss the panel
- **FR-013**: System MUST update the URL to reflect the selected incident (deep linking support)
- **FR-014**: System MUST preserve filter state when opening/closing the detail panel
- **FR-015**: Side panel MUST be responsive: ~33% screen width on desktop (keeping list visible), full-width on mobile

### Key Entities

- **Incident**: A tracked issue containing title, description, status, severity, assignee, timestamps, and status history (unchanged from current)
- **Pending Changes**: Local state representing modifications to an incident that have not yet been saved (status change, assignee change)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view incident details within 1 second of clicking a row (side panel opens promptly)
- **SC-002**: Users can make multiple edits (status and assignee) and save them in a single action
- **SC-003**: Users can clearly distinguish between saved state and unsaved changes through visual indicators
- **SC-004**: Save operation completes and shows feedback within 2 seconds
- **SC-005**: Users on mobile devices can access and use the detail panel without horizontal scrolling
- **SC-006**: 100% of save errors display actionable error messages with retry capability
- **SC-007**: Users can cancel edits and revert to original values without page refresh

## Assumptions

- The existing mock API update endpoint supports batch updates (status and assignee in one call) or will be called sequentially
- The side panel (MUI Drawer component) is an acceptable UX pattern for this use case
- Single-user usage assumed; no real-time collaboration or conflict resolution beyond basic optimistic updates
- Discarding unsaved changes when switching incidents is acceptable behavior for MVP
- The existing StatusSelect and AssigneeSelect components can be adapted to work in "controlled" mode without auto-save

## Out of Scope

- Confirmation dialog when closing panel with unsaved changes (may be added in future iteration)
- Inline editing within the table row (all editing happens in side panel)
- Editing fields other than status and assignee (title, description, severity remain read-only)
- Real-time conflict resolution or collaborative editing
- Undo after save (changes are final once saved)
