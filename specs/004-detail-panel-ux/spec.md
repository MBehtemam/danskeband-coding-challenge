# Feature Specification: Detail Panel UX Improvements

**Feature Branch**: `004-detail-panel-ux`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Add copy button for ID, vertical dropdown layout, chips in select dropdowns, and improved color scheme with icons to differentiate status from severity"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy Incident ID (Priority: P1)

As an operations team member, I want to easily copy the incident ID with a single click so that I can paste it into emails, tickets, or other communication tools without manual selection.

**Why this priority**: Copying incident IDs is a frequent task in incident management workflows. The current implementation requires manual text selection which is error-prone and slow. A copy button significantly improves efficiency for a common action.

**Independent Test**: Can be fully tested by opening an incident, clicking the copy button next to the ID, and pasting to verify the correct ID was copied to clipboard.

**Acceptance Scenarios**:

1. **Given** the detail panel is open, **When** viewing the incident ID, **Then** a copy icon button is displayed immediately after the ID text
2. **Given** the copy button is visible, **When** the user clicks it, **Then** the incident ID is copied to the system clipboard
3. **Given** the copy button is clicked, **When** the copy succeeds, **Then** visual feedback confirms the action (e.g., tooltip "Copied!" or icon change)
4. **Given** the user hovers over the copy button, **When** waiting briefly, **Then** a tooltip displays "Copy ID" or similar hint
5. **Given** the clipboard operation fails, **When** the error occurs, **Then** the user sees appropriate feedback (e.g., tooltip "Failed to copy")

---

### User Story 2 - Vertical Layout for Editable Fields (Priority: P1)

As an operations team member, I want the status, severity, and assignee dropdowns to be arranged vertically (stacked) so that the layout is cleaner and each field has more horizontal space for readability.

**Why this priority**: The current horizontal layout can feel cramped, especially on smaller screens. A vertical layout provides better visual hierarchy and makes the form easier to scan top-to-bottom.

**Independent Test**: Can be tested by opening the detail panel and verifying that status, severity, and assignee fields are stacked vertically with consistent alignment.

**Acceptance Scenarios**:

1. **Given** the detail panel is open, **When** viewing the editable fields section, **Then** status, severity, and assignee are displayed in a vertical stack (one per row)
2. **Given** the vertical layout, **When** viewing each field, **Then** labels are positioned consistently (either inline or above the field)
3. **Given** the vertical layout, **When** comparing field widths, **Then** all dropdowns have uniform width for visual consistency
4. **Given** a mobile viewport, **When** viewing the layout, **Then** the vertical arrangement adapts appropriately without overlap

---

### User Story 3 - Chips Displayed in Select Dropdowns (Priority: P2)

As an operations team member, I want to see colored chips (badges) inside the status and severity dropdown menus so that I can quickly identify options by color in addition to text, making selection faster and reducing errors.

**Why this priority**: Color-coded chips provide instant visual recognition. Showing chips in the dropdown options creates consistency between how values appear when selected vs. when choosing from the menu.

**Independent Test**: Can be tested by clicking on the status or severity dropdown and verifying that each option displays as a colored chip rather than plain text.

**Acceptance Scenarios**:

1. **Given** the status dropdown is open, **When** viewing the menu options, **Then** each status (Open, In Progress, Resolved) displays as a colored chip
2. **Given** the severity dropdown is open, **When** viewing the menu options, **Then** each severity (Low, Medium, High, Critical) displays as a colored chip
3. **Given** a status/severity is selected, **When** viewing the closed dropdown, **Then** the selected value displays as a chip (not plain text)
4. **Given** chips are displayed in dropdowns, **When** the colors are applied, **Then** they match the chip colors used elsewhere in the application

---

### User Story 4 - Improved Chip Color Scheme with Icons (Priority: P1)

As an operations team member, I want status and severity chips to use distinct color schemes (and optionally icons) so that I can instantly distinguish between "In Progress" status and "High" severity without confusion.

**Why this priority**: The current color scheme uses orange/warning color for both "In Progress" (status) and "High" (severity), creating confusion. Users cannot quickly tell if an orange chip indicates urgency (severity) or progress state (status). This directly impacts decision-making speed.

**Independent Test**: Can be tested by viewing an incident with "In Progress" status and "High" severity side-by-side and verifying they are visually distinct.

**Acceptance Scenarios**:

1. **Given** an incident with "In Progress" status and "High" severity, **When** viewing both chips, **Then** they are visually distinguishable (different colors, icons, or both)
2. **Given** the status chips, **When** viewing their colors, **Then** they follow a neutral progression color scheme (not urgency-based) - for example: blue variants for workflow states
3. **Given** the severity chips, **When** viewing their colors, **Then** they follow an urgency-based color scheme (green to red gradient indicating increasing severity)
4. **Given** status chips, **When** viewing them, **Then** each chip includes an icon that represents its workflow state (e.g., circle-outline for Open, spinner/progress for In Progress, checkmark for Resolved)
5. **Given** severity chips, **When** viewing them, **Then** each chip optionally includes an icon or visual indicator that reinforces the urgency level
6. **Given** the color scheme changes, **When** viewing the application, **Then** all instances of status and severity chips use the updated colors consistently (detail panel, table, history)

---

### Edge Cases

- What happens when clipboard API is not available (older browsers)? Graceful degradation: hide the copy button or show a "select and copy manually" fallback.
- How does the vertical layout handle very narrow panels? On extremely narrow widths, fields should still stack without horizontal overflow.
- What happens with very long assignee names in the dropdown? Names should truncate with ellipsis while chips remain readable.
- How do color-blind users distinguish chips? Icons provide an additional differentiation mechanism beyond color alone (accessibility benefit).

## Requirements *(mandatory)*

### Functional Requirements

**Copy Button for ID:**
- **FR-001**: System MUST display a copy icon button immediately after the incident ID text
- **FR-002**: Copy button MUST copy the incident ID to the system clipboard when clicked
- **FR-003**: System MUST provide visual feedback (tooltip or icon change) confirming successful copy
- **FR-004**: Copy button MUST show a tooltip on hover indicating its purpose
- **FR-005**: System MUST handle clipboard failures gracefully with appropriate user feedback

**Vertical Dropdown Layout:**
- **FR-006**: Status, severity, and assignee fields MUST be arranged in a vertical stack layout
- **FR-007**: All dropdown fields MUST have consistent and uniform width
- **FR-008**: Field labels MUST be positioned consistently across all fields
- **FR-009**: Vertical layout MUST adapt appropriately on mobile viewports

**Chips in Select Dropdowns:**
- **FR-010**: Status dropdown options MUST display as colored chips matching their status colors
- **FR-011**: Severity dropdown options MUST display as colored chips matching their severity colors
- **FR-012**: Selected values in closed dropdowns MUST display as chips (not plain text)
- **FR-013**: Chip colors in dropdowns MUST match chip colors used elsewhere in the application

**Improved Chip Color Scheme:**
- **FR-014**: Status chips MUST use a color scheme distinct from severity chips
- **FR-015**: Status chips MUST use workflow-oriented colors with light-to-dark blue progression: Open=#42A5F5, In Progress=#1E88E5, Resolved=#1565C0
- **FR-016**: Severity chips MUST use urgency-oriented colors (green-to-red gradient: Low=green, Medium=blue/neutral, High=orange, Critical=red)
- **FR-017**: Status chips MUST include icons representing workflow state (Open=outline circle, In Progress=sync/refresh icon, Resolved=checkmark)
- **FR-018**: Color scheme changes MUST be applied consistently across all chip instances (detail panel, incident table, status history)

### Key Entities

- **StatusChip**: Updated to use blue-variant colors and include workflow state icons
- **SeverityChip**: Updated to maintain urgency colors (green to red) and optionally include severity indicator icons
- **IncidentDetailPanel**: Modified to use vertical layout and include copy button for ID
- **StatusSelect / SeveritySelect**: Enhanced to display chips in dropdown options and selected state

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can copy an incident ID in a single click (vs. manual select + copy)
- **SC-002**: Users can distinguish between status and severity chips instantly without reading the labels
- **SC-003**: 100% of status chips display with consistent colors and icons across all application views
- **SC-004**: Users report no confusion between "In Progress" and "High" severity in usability testing
- **SC-005**: Vertical layout provides at least 40% more horizontal space for each dropdown compared to horizontal layout
- **SC-006**: Copy success feedback is displayed within 500ms of clicking the copy button
- **SC-007**: All chips remain accessible to color-blind users via icon differentiation

## Assumptions

- The browser Clipboard API is available in target browsers (modern browsers support navigator.clipboard)
- Material UI provides sufficient icon options for workflow state representation
- The existing SeverityChip colors (Critical=red, High=orange, Low=green) are acceptable; only status colors need significant changes
- Icons in chips will be small enough to not significantly increase chip width
- The vertical layout will not significantly increase the overall panel height to an unacceptable degree

## Clarifications

### Session 2026-01-14

- Q: Which specific blue color scheme should be used for the three status states (Open, In Progress, Resolved)? → A: Light-to-dark progression: Open=Light Blue (#42A5F5), In Progress=Medium Blue (#1E88E5), Resolved=Dark Blue (#1565C0)

## Out of Scope

- Custom user-configurable color schemes or themes
- Animated icons or transitions for chip state changes
- Changing severity color scheme (only status colors are being modified)
- Accessibility audit beyond icon addition for color-blind support
- Tooltip customization or localization
