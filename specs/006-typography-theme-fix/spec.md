# Feature Specification: Typography and Theme Fix

**Feature Branch**: `006-typography-theme-fix`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Fix typography and theme styling to match Danske Bank website - update font hierarchy, sizes, button border radius to 48px pill shape, and correct font family"

## Clarifications

### Session 2026-01-14

- Q: Should this feature include font loading setup, or can we verify it's already present? → A: Verify first, implement if needed - check if Play font is loaded; add Google Fonts import if missing

## Summary

Update the application's theme to accurately match the Danske Bank website's design system. This includes correcting typography (font family, sizes, weights, line heights), button styling (pill-shaped buttons with 48px border radius), and ensuring consistent visual hierarchy throughout the application, particularly in data tables.

## Research Findings from Danskebank.dk

Based on direct inspection of the live Danske Bank website, the following design tokens were extracted:

### Typography
- **Font Family**: `Danske, Arial, sans-serif` (proprietary brand font with Arial fallback)
- **Application Font**: `"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (Google Font that approximates Danske's clean, modern aesthetic)
- **H1**: 36px, weight 400, line-height 44px (1.22)
- **H2**: 40px, weight 500, line-height 52px (1.3)
- **H3**: 24px, weight 400, line-height 28px (1.17)
- **H5**: 20px, weight 500, line-height 26px (1.3)
- **H6**: 16px, weight 500, line-height 20.8px (1.3)
- **Body**: 16px, weight 400, line-height 24px (1.5)
- **Small/Caption**: 14px, weight 400

### Colors
- **Primary Text**: `rgb(0, 36, 71)` / `#002447`
- **Primary Button Background**: `rgb(10, 94, 240)` / `#0A5EF0`
- **Secondary Button Background**: `rgba(51, 51, 0, 0.098)` (translucent warm gray)

### Button Styling
- **Border Radius**: 48px (pill/stadium shape)
- **Padding**: 0px 24px (horizontal) with 48px height
- **Min Width**: 144px
- **Font Size**: 16px
- **Font Weight**: 400

### Input Fields
- **Border Radius**: 0px (square corners)
- **Height**: 48px
- **Padding**: 0px 16px
- **Font Size**: 16px

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Consistency with Brand (Priority: P1)

Users viewing the incident dashboard should see typography and UI elements that match the Danske Bank brand, creating a cohesive visual experience with other bank applications.

**Why this priority**: Brand consistency is critical for professional enterprise applications. Users expect the dashboard to look like an official Danske Bank tool.

**Independent Test**: Can be fully tested by visual comparison - open the application alongside danskebank.dk and verify fonts, button shapes, and text hierarchy match.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** viewing any text content, **Then** the font family should use "Play" as the primary font (Google Font that approximates Danske's aesthetic)
2. **Given** the application displays buttons, **When** viewing primary action buttons, **Then** buttons should have 48px border radius (pill shape) with blue background
3. **Given** the application displays buttons, **When** viewing secondary action buttons, **Then** buttons should have 48px border radius with translucent background

---

### User Story 2 - Readable Table Typography (Priority: P1)

Users viewing the incident table should see clear typography hierarchy where column headers are visually distinct from data cells, and text sizes are appropriate for scanning data.

**Why this priority**: The data table is the primary interface element. Correct typography ensures users can quickly scan and find information.

**Independent Test**: Can be fully tested by viewing the incident table and verifying header text is distinguishable from body text, font sizes are readable, and line heights provide adequate spacing.

**Acceptance Scenarios**:

1. **Given** the incident table is displayed, **When** viewing column headers, **Then** headers should use 14px font with weight 500
2. **Given** the incident table is displayed, **When** viewing cell content, **Then** body text should use 14px font with weight 400
3. **Given** the incident table is displayed, **When** viewing the table, **Then** all text should have adequate line-height for readability (1.5)

---

### User Story 3 - Consistent Heading Hierarchy (Priority: P2)

Users viewing different sections of the application should see a clear visual hierarchy through properly sized headings.

**Why this priority**: Proper heading hierarchy improves navigation and content organization, though it's secondary to table readability.

**Independent Test**: Can be fully tested by navigating through the application and verifying heading sizes decrease progressively from H1 to H6.

**Acceptance Scenarios**:

1. **Given** the detail panel is open, **When** viewing the incident title, **Then** it should be styled as a prominent heading (H2 equivalent)
2. **Given** the application header is visible, **When** viewing the app title, **Then** it should be styled appropriately for page context

---

### Edge Cases

- What happens when long text content wraps? Line heights should accommodate wrapped text without clipping
- How does the button styling work with icon-only buttons? Border radius should create circular buttons for icon-only cases
- What happens with different button sizes? Small buttons may use smaller border radius while maintaining pill shape

## Requirements *(mandatory)*

### Functional Requirements

#### Typography Requirements
- **FR-000**: System MUST verify Play font is loaded; if missing, implementation MUST add Google Fonts import (via `<link>` in index.html or @font-face)
- **FR-001**: System MUST use `"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` as the font stack (Play is a Google Font that approximates Danske's aesthetic)
- **FR-002**: System MUST render H1 at 36px with font-weight 400 and line-height 1.22
- **FR-003**: System MUST render H2 at 32px with font-weight 500 and line-height 1.3
- **FR-004**: System MUST render H3 at 24px with font-weight 400 and line-height 1.17
- **FR-005**: System MUST render H4 at 20px with font-weight 500 and line-height 1.3
- **FR-006**: System MUST render H5 at 16px with font-weight 500 and line-height 1.3
- **FR-007**: System MUST render H6 at 14px with font-weight 500 and line-height 1.3
- **FR-008**: System MUST render body text at 16px with font-weight 400 and line-height 1.5
- **FR-009**: System MUST render small/caption text at 14px with font-weight 400 and line-height 1.5

#### Button Requirements
- **FR-010**: System MUST render primary buttons with 48px border-radius (pill shape)
- **FR-011**: System MUST render secondary buttons with 48px border-radius (pill shape)
- **FR-012**: System MUST render buttons with minimum height of 48px
- **FR-013**: System MUST render buttons with horizontal padding of 24px
- **FR-014**: System MUST render button text at 16px with font-weight 400
- **FR-015**: System MUST render primary buttons with background color `#0A5EF0`

#### Color Requirements
- **FR-016**: System MUST use `#002447` as primary text color
- **FR-017**: System MUST use `#002447` as heading text color

#### Table Requirements
- **FR-018**: System MUST render table header text at 14px with font-weight 500
- **FR-019**: System MUST render table body text at 14px with font-weight 400

### Key Entities

- **Typography Config**: Configuration object containing font sizes, weights, and line heights for all text variants
- **Shape Config**: Configuration object containing border radius values for buttons, cards, and other UI elements
- **Color Palette**: Configuration object containing primary, secondary, text, and background colors

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All buttons in the application display with pill-shaped (48px border-radius) styling
- **SC-002**: Typography hierarchy (H1-H6, body, caption) matches specified sizes within 2px tolerance
- **SC-003**: Primary text color matches `#002447` (Danske Bank navy)
- **SC-004**: Table text is readable with clear distinction between headers and body content
- **SC-005**: Visual comparison with danskebank.dk shows consistent button styling
- **SC-006**: All existing automated tests pass after theme updates
- **SC-007**: Application renders correctly without layout shifts caused by font changes

## Assumptions

- The proprietary "Danske" font is not available, so "Play" (Google Font) is used as an approximation of the clean, modern aesthetic
- The application should prioritize matching the overall visual feel rather than pixel-perfect accuracy
- Button border radius of 48px applies to medium and large buttons; smaller buttons may use proportionally smaller radius
- The blue primary button color `#0A5EF0` is acceptable even though it differs slightly from the current `#003755` primary brand color (it matches the actual website's button color)
- The Play font loading will be verified during implementation; if not present, Google Fonts import will be added to index.html or via @font-face
