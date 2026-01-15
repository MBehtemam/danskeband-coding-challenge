# Quickstart: README Features Documentation

**Date**: 2026-01-15
**Feature**: 014-readme-features-table
**Purpose**: Step-by-step guide for implementing README documentation

---

## Prerequisites

- [ ] Application is functional and runs locally (`npm run dev`)
- [ ] Browser with DevTools (Chrome or Firefox)
- [ ] Screenshot tool (OS native or browser built-in)
- [ ] Image optimization tool (ImageOptim for macOS, or TinyPNG web service)

---

## Phase 1: Capture Screenshots

### Setup

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: Navigate to `http://localhost:5173`

3. **Ensure realistic data**: If needed, create some test incidents with varied statuses and severities

### Screenshot 1: Main Table View (Desktop)

**Viewport**: 1400px width x 900px height

**Steps**:
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Set custom dimensions: 1400 x 900
4. In the application:
   - Ensure some filters are visible (expand a column filter)
   - Show pagination with multiple pages
   - Show some incidents in table
5. **Capture**: Screenshot the entire viewport
6. **Save as**: `screenshots/01-desktop-main-table.png`

**What to show**:
- Full incident table with data
- Visible column headers with sort indicators
- Pagination controls at bottom
- At least one column filter expanded or active
- "Create Incident" button visible

---

### Screenshot 2: Dark Theme (Desktop)

**Viewport**: 1400px width x 900px height

**Steps**:
1. Click the theme switcher button (moon/sun icon in top-right)
2. Wait for smooth theme transition
3. **Capture**: Screenshot the entire viewport
4. **Save as**: `screenshots/02-desktop-dark-theme.png`

**What to show**:
- Same table view as Screenshot 1, but in dark mode
- Demonstrate the Danske Bank dark theme colors
- Ensure good contrast and readability

---

### Screenshot 3: Saved Views Dropdown

**Viewport**: 1400px width x 900px height

**Steps**:
1. If no saved views exist, create 2-3 sample views:
   - "My Open Incidents" (filter: status = Open)
   - "Critical Issues" (filter: severity = Critical)
   - "This Week" (filter: created this week)
2. Click the "Views" button in top toolbar
3. **Capture**: Screenshot with dropdown menu expanded
4. **Save as**: `screenshots/03-desktop-saved-views.png`

**What to show**:
- Expanded saved views dropdown
- List of saved views with names
- View management options (create, rename, update, delete)
- Default view option

---

### Screenshot 4: Create Incident Dialog

**Viewport**: 1400px width x 900px height

**Steps**:
1. Click "Create Incident" button
2. Fill in some sample data (don't submit):
   - Title: "Database Connection Timeout"
   - Description: "Production database experiencing timeout errors"
   - Severity: "Critical"
   - Assignee: Select a user
3. **Capture**: Screenshot with dialog open and form partially filled
4. **Save as**: `screenshots/04-desktop-create-incident.png`

**What to show**:
- Modal dialog centered on screen
- Form fields visible and labeled
- Severity selector
- Assignee dropdown
- Cancel and Create buttons

---

### Screenshot 5: Detail Panel

**Viewport**: 1400px width x 900px height

**Steps**:
1. Close create dialog (if open)
2. Click on any incident row to open detail panel
3. Ensure the panel is fully expanded
4. **Capture**: Screenshot showing table + open detail panel
5. **Save as**: `screenshots/05-desktop-detail-panel.png`

**What to show**:
- Table on left side
- Detail panel open on right side
- Incident details visible (title, description, status, severity)
- Edit form in detail panel
- Status history timeline
- Close button

---

### Screenshot 6: Tablet Responsive View

**Viewport**: 768px width x 1024px height

**Steps**:
1. In DevTools device emulation, select "iPad" or set custom 768 x 1024
2. Close any open dialogs/panels
3. Show main table view
4. **Capture**: Screenshot showing responsive layout
5. **Save as**: `screenshots/06-tablet-responsive.png`

**What to show**:
- Table with responsive column visibility (some columns hidden)
- Adjusted layout for tablet breakpoint
- Readable text and proper spacing
- Touch-friendly button sizes

---

### Screenshot 7: Mobile Responsive View

**Viewport**: 375px width x 667px height (iPhone SE)

**Steps**:
1. In DevTools device emulation, select "iPhone SE" or set custom 375 x 667
2. Show main table view
3. **Capture**: Screenshot showing mobile layout
4. **Save as**: `screenshots/07-mobile-responsive.png`

**What to show**:
- Minimal columns visible (usually just title and status)
- Compact layout optimized for small screen
- Touch-friendly controls
- Proper text wrapping

---

## Phase 2: Optimize Screenshots

### Image Optimization

**For each screenshot**:

1. **Verify dimensions and quality**:
   - Desktop screenshots: ~1400px width
   - Tablet screenshots: ~768px width
   - Mobile screenshots: ~375px width

2. **Optimize file size**:
   - **Option A - macOS**: Use ImageOptim
     - Drag and drop PNG files into ImageOptim
     - Wait for compression
     - Should reduce size by 30-50%

   - **Option B - Web**: Use TinyPNG.com
     - Upload screenshots
     - Download optimized versions

   - **Target**: Each screenshot under 200KB

3. **Verify quality**:
   - Open each optimized screenshot
   - Ensure text is still readable
   - Check that colors are accurate

---

## Phase 3: Create Screenshots Directory

```bash
# From repository root
mkdir screenshots

# Move all optimized screenshots
mv 01-desktop-main-table.png screenshots/
mv 02-desktop-dark-theme.png screenshots/
mv 03-desktop-saved-views.png screenshots/
mv 04-desktop-create-incident.png screenshots/
mv 05-desktop-detail-panel.png screenshots/
mv 06-tablet-responsive.png screenshots/
mv 07-mobile-responsive.png screenshots/
```

**Verify**:
```bash
ls -lh screenshots/
# Should show 7 PNG files, each under 200KB
```

---

## Phase 4: Update README.md

### Step 1: Locate Insertion Point

Open `README.md` and find the **Project Structure** section (around line 58-76).

**Insert new sections AFTER** Project Structure and **BEFORE** Mock API section.

### Step 2: Add Features Section

Copy this content into README.md:

```markdown
## Features

The Team Incident Dashboard is a comprehensive incident management application with robust filtering, search, and data management capabilities. Built with modern web technologies, it provides a responsive, accessible interface for managing team incidents efficiently.

### Core Capabilities

| Category | Feature | Description |
|----------|---------|-------------|
| Data Management | Create Incident | Create new incidents with title, description, severity, and assignee |
| Data Management | Update Incident | Edit incident details including status, severity, and assignee |
| Data Management | View Incident Details | Display full incident information in side panel with status history |
| Data Management | Delete Incident | Remove incidents from the system with confirmation |
| Search & Filtering | Global Search | Full-text search across incident titles and descriptions |
| Search & Filtering | Column Filters | Filter by status, severity, assignee, and created date |
| Search & Filtering | Filter Modes | Advanced filtering with multiple operators (equals, not equals, date ranges) |
| Search & Filtering | Clear Filters | Reset all active filters and search in one click |
| Table Features | Column Sorting | Sort any column in ascending or descending order |
| Table Features | Pagination | Navigate through incidents with configurable page sizes (10, 20, 50, 100) |
| Table Features | Column Visibility | Show/hide columns via column selector |
| Table Features | Table Density | Switch between compact and comfortable viewing modes |
| Table Features | Row Selection | Click any row to open detail panel with keyboard support |
| Saved Views | Create View | Save current table configuration (filters, sorting, columns, search) |
| Saved Views | Load View | Restore previously saved table configuration |
| Saved Views | Update View | Overwrite existing view with current configuration |
| Saved Views | Rename View | Change saved view name with duplicate prevention |
| Saved Views | Delete View | Remove saved view with confirmation |
| Saved Views | Default View | Reset to application's initial state |
| UI/UX | Dark/Light Theme | Toggle between light and dark color schemes with Danske Bank branding |
| UI/UX | System Theme Detection | Automatically match user's OS theme preference |
| UI/UX | Responsive Design | Optimized layouts for mobile (320px+), tablet (768px+), and desktop |
| UI/UX | Detail Panel | Slide-out panel for viewing and editing incidents with status history |
| UI/UX | Loading States | Visual feedback with skeleton loaders and progress indicators |
| UI/UX | Empty States | Helpful guidance with contextual messages when no data exists |
| UI/UX | Error Handling | User-friendly error messages with recovery options |
| State Management | URL State Persistence | All filters, sorting, and search stored in shareable URL |
| State Management | Shareable Links | Copy URL to share exact table state with team members |
| State Management | Browser Navigation | Back/forward buttons work seamlessly with table state |

### Saved Views

**Saved Views** allow you to save your current table configuration and quickly switch between different views. When you save a view, it captures your active filters, sorting, column visibility, search query, and filter modes. This is particularly useful for common workflows like "My Open Incidents", "Critical Issues This Week", or "Unassigned Tickets". You can create unlimited views, update them as your needs change, rename them for clarity, and delete views you no longer need. The default view resets everything to the application's initial state.

## Screenshots

### Desktop Features

**Main Table View**

![Main incident table showing filters, sorting, and pagination](screenshots/01-desktop-main-table.png)
*The main incident dashboard with comprehensive table features including filtering, sorting, and pagination controls.*

**Dark Theme**

![Application in dark mode with Danske Bank branding](screenshots/02-desktop-dark-theme.png)
*Dark theme mode featuring Danske Bank's color scheme with excellent contrast and readability.*

**Saved Views**

![Saved views dropdown menu showing custom view management](screenshots/03-desktop-saved-views.png)
*Saved Views feature allowing users to create, load, update, rename, and delete custom table configurations.*

**Create Incident**

![Create incident dialog with form fields](screenshots/04-desktop-create-incident.png)
*Create incident dialog with comprehensive form validation and user-friendly controls.*

**Detail Panel**

![Incident detail panel with edit form and status history](screenshots/05-desktop-detail-panel.png)
*Incident detail panel showing full incident information, edit capabilities, and status change history.*

### Responsive Design

**Tablet View**

![Application on tablet showing responsive layout](screenshots/06-tablet-responsive.png)
*Responsive tablet layout (768px) with optimized column visibility and touch-friendly controls.*

**Mobile View**

![Application on mobile showing compact layout](screenshots/07-mobile-responsive.png)
*Mobile-optimized view (375px) featuring compact layout with essential information prioritized.*

```

### Step 3: Verify Markdown Rendering

1. **Save README.md**

2. **Preview locally**:
   - Use VS Code markdown preview (Cmd+Shift+V)
   - Check that table renders correctly
   - Verify all image paths are correct

3. **Verify line breaks**:
   - Ensure blank lines before and after:
     - All headings
     - Tables
     - Images
     - Sections

---

## Phase 5: Commit and Verify on GitHub

### Commit Changes

```bash
# Stage files
git add screenshots/
git add README.md

# Commit with descriptive message
git commit -m "docs: add comprehensive feature documentation and screenshots

- Add Features section with 29 documented capabilities
- Add Saved Views explanation section
- Include 7 screenshots demonstrating features and responsive design
- Optimize all screenshots for file size (<200KB each)

Addresses: 014-readme-features-table"

# Push to feature branch
git push origin 014-readme-features-table
```

### Verify on GitHub

1. **Navigate to branch on GitHub**
2. **Open README.md**
3. **Verify**:
   - [ ] Features table renders correctly
   - [ ] All 29 features are listed
   - [ ] Saved Views section is present with 4 sentences
   - [ ] All 7 screenshots display correctly
   - [ ] Screenshot file sizes are reasonable
   - [ ] Captions appear below each image
   - [ ] No broken images or formatting issues

---

## Success Criteria Checklist

Review against spec.md Success Criteria:

- [ ] **SC-001**: Reviewers can identify all major features within 2 minutes ✓
- [ ] **SC-002**: At least 12 features documented (29 features) ✓
- [ ] **SC-003**: At least 4 feature screenshots (5 feature screenshots) ✓
- [ ] **SC-004**: At least 2 responsive screenshots (2 responsive screenshots) ✓
- [ ] **SC-005**: Screenshots display correctly on GitHub ✓
- [ ] **SC-006**: Features table renders correctly ✓
- [ ] **SC-007**: Saved Views has 3-4 sentence explanation (4 sentences) ✓

---

## Maintenance Notes

### When to Update Screenshots

- **Major UI changes**: Re-capture affected screenshots
- **New features**: Add screenshot demonstrating new feature
- **Branding updates**: Re-capture all screenshots with new branding

### How to Update

1. Follow Phase 1 steps for specific screenshots needing updates
2. Replace old screenshot files with new ones (same filenames)
3. Commit with message: `docs: update screenshots for [feature/change]`

### Screenshot Versioning

Consider adding metadata to quickstart.md:

```markdown
**Last Updated**: 2026-01-15
**Application Version**: v0.0.0
**Captured by**: [Your name]
```

---

## Troubleshooting

### Issue: Screenshots too large (>500KB each)

**Solution**: Use more aggressive compression
- Try TinyPNG.com with higher compression
- Convert to JPEG if PNG is too large (but prefer PNG for UI screenshots)
- Reduce screenshot dimensions slightly

### Issue: Text not readable in screenshots

**Solution**: Capture at higher resolution, then scale down
- Capture at 2x size (2800px for desktop)
- Scale down to 1400px in image editor
- Increases clarity while keeping file size reasonable

### Issue: Screenshots look different on GitHub vs locally

**Solution**: Test in incognito/private browsing
- Clear browser cache
- Verify image paths are relative (not absolute)
- Check that images are actually pushed to repository

### Issue: Table not rendering correctly

**Solution**: Check markdown syntax
- Ensure consistent pipe characters `|`
- Verify spaces around pipes: `| Cell |` not `|Cell|`
- Check that header separator has dashes: `|------|`
- Validate with markdown linter

---

## Complete! 🎉

Once all steps are complete and verified, the README documentation is ready for review by Danske Bank stakeholders.
