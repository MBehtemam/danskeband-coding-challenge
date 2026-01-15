/**
 * Component Contract: ThemeSwitcher
 *
 * Feature: 009-theme-switcher
 * Stability: SEMI-STABLE - Props can be extended, required props immutable
 *
 * This contract defines the ThemeSwitcher component API.
 */

/**
 * ThemeSwitcher component props
 *
 * @interface ThemeSwitcherProps
 *
 * @description
 * Currently no props required (component is self-contained).
 * Future extensions may add customization options.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeSwitcherProps {
  // No props in initial implementation
  // Future: variant?: 'icon-only' | 'icon-with-label' | 'dropdown'
  // Future: size?: 'small' | 'medium' | 'large'
}

// =============================================================================
// COMPONENT SIGNATURE
// =============================================================================

/**
 * Theme switcher button component
 *
 * @component
 * @param {ThemeSwitcherProps} props - Component props (currently none)
 * @returns {JSX.Element} IconButton with theme toggle functionality
 *
 * @description
 * Displays icon button in navigation bar that toggles between light and dark modes.
 * Icon updates to reflect current theme (light icon in dark mode, dark icon in light mode).
 * Uses MUI IconButton for consistent styling and accessibility.
 *
 * @example
 * // Basic usage in AppLayout
 * <Toolbar>
 *   <Logo />
 *   <Box sx={{ flexGrow: 1 }} />
 *   <ThemeSwitcher />
 *   <SettingsButton />
 * </Toolbar>
 */
export type ThemeSwitcherComponent = React.FC<ThemeSwitcherProps>;

// =============================================================================
// VISUAL SPECIFICATION
// =============================================================================

/**
 * Component structure
 *
 * DOM:
 * <IconButton color="inherit" aria-label="Toggle theme">
 *   <LightModeIcon /> OR <DarkModeIcon />
 * </IconButton>
 *
 * STYLING:
 * - Inherits AppBar text color (white on dark header, dark on light header)
 * - Standard MUI IconButton (48px touch target)
 * - Icon size: 24px (MUI default)
 * - No background (transparent)
 * - Hover: MUI ripple effect
 */

/**
 * Icon display logic
 *
 * RULE: Show opposite mode icon (indicates what will happen on click)
 *
 * Current Theme → Displayed Icon → Tooltip Text
 * ---------------------------------------------
 * Light         → DarkModeIcon   → "Switch to dark mode"
 * Dark          → LightModeIcon  → "Switch to light mode"
 * System (→ Light) → DarkModeIcon → "Switch to dark mode"
 * System (→ Dark)  → LightModeIcon → "Switch to light mode"
 */

/**
 * Interaction behavior
 *
 * CLICK:
 * 1. User clicks button
 * 2. setMode() called with opposite mode
 * 3. Debounced (100ms) state update
 * 4. Icon switches immediately (React state)
 * 5. Theme transitions smoothly (300ms CSS)
 * 6. localStorage updated (async)
 *
 * KEYBOARD:
 * 1. User tabs to button (focus visible)
 * 2. User presses Enter or Space
 * 3. Same behavior as click
 *
 * HOVER:
 * 1. User hovers button
 * 2. Tooltip appears after 500ms (MUI default)
 * 3. Shows "Switch to [mode] mode"
 * 4. Tooltip hides on mouse leave
 */

// =============================================================================
// ACCESSIBILITY SPECIFICATION
// =============================================================================

/**
 * ARIA attributes
 *
 * REQUIRED:
 * - aria-label: "Toggle theme"
 *   (Describes button action for screen readers)
 *
 * PROVIDED BY MUI:
 * - role="button" (implicit from IconButton)
 * - tabindex="0" (keyboard focusable)
 * - aria-pressed: Not used (stateless button, not toggle)
 */

/**
 * Keyboard navigation
 *
 * SUPPORTED KEYS:
 * - Tab: Focus button
 * - Shift+Tab: Focus previous element
 * - Enter: Activate button
 * - Space: Activate button
 * - Escape: (no effect - button has no modal behavior)
 *
 * FOCUS INDICATOR:
 * - MUI default focus ring (blue outline)
 * - Visible in both light and dark themes
 * - Meets WCAG 2.1 focus visible requirement
 */

/**
 * Screen reader support
 *
 * ANNOUNCEMENT ON MOUNT:
 * "Toggle theme, button"
 *
 * ANNOUNCEMENT ON CLICK:
 * (No explicit announcement - theme change is visual)
 * (Future: Add aria-live region announcing "Theme changed to dark mode")
 *
 * TOOLTIP:
 * "Switch to dark mode" (read on focus)
 */

// =============================================================================
// BEHAVIOR SPECIFICATION
// =============================================================================

/**
 * Theme toggle logic
 *
 * @example
 * const { mode, setMode, systemMode } = useThemeMode();
 *
 * // Determine current active theme
 * const activeMode = mode === 'system' ? systemMode : mode;
 *
 * // Toggle to opposite mode
 * const handleToggle = () => {
 *   const nextMode = activeMode === 'light' ? 'dark' : 'light';
 *   setMode(nextMode);
 * };
 *
 * // Display opposite icon
 * const icon = activeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />;
 */

/**
 * Component lifecycle
 *
 * MOUNT:
 * 1. Component renders
 * 2. useThemeMode() reads current theme
 * 3. Icon displayed based on active theme
 * 4. Event listeners attached (click, focus)
 *
 * UPDATE:
 * 1. Theme changes (user click or system preference)
 * 2. useThemeMode() returns new values
 * 3. Component re-renders
 * 4. Icon updates to reflect new theme
 *
 * UNMOUNT:
 * 1. Component removed from DOM
 * 2. Event listeners cleaned up (automatic via React)
 */

/**
 * Edge cases
 *
 * RAPID CLICKING:
 * - setMode() is debounced (100ms)
 * - Multiple clicks within 100ms → only last click applies
 * - Icon updates immediately (React state not debounced)
 * - Theme application delayed by debounce
 *
 * CONTEXT MISSING:
 * - useThemeMode() throws Error
 * - React error boundary catches (if configured)
 * - Component does not render
 *
 * SLOW THEME LOAD:
 * - Icon renders immediately based on mode
 * - Theme CSS applies asynchronously
 * - Brief flash possible (mitigated by transitions)
 */

// =============================================================================
// TESTING SPECIFICATION
// =============================================================================

/**
 * Unit tests
 *
 * @example
 * describe('ThemeSwitcher', () => {
 *   it('renders light mode icon when theme is dark', () => {
 *     const { getByLabelText } = render(<ThemeSwitcher />, {
 *       wrapper: createThemeWrapper({ mode: 'dark' }),
 *     });
 *
 *     const button = getByLabelText('Toggle theme');
 *     expect(button).toContainElement(screen.getByTestId('LightModeIcon'));
 *   });
 *
 *   it('renders dark mode icon when theme is light', () => {
 *     const { getByLabelText } = render(<ThemeSwitcher />, {
 *       wrapper: createThemeWrapper({ mode: 'light' }),
 *     });
 *
 *     const button = getByLabelText('Toggle theme');
 *     expect(button).toContainElement(screen.getByTestId('DarkModeIcon'));
 *   });
 *
 *   it('calls setMode with opposite mode when clicked', () => {
 *     const setMode = vi.fn();
 *     const { getByLabelText } = render(<ThemeSwitcher />, {
 *       wrapper: createThemeWrapper({ mode: 'light', setMode }),
 *     });
 *
 *     const button = getByLabelText('Toggle theme');
 *     fireEvent.click(button);
 *
 *     expect(setMode).toHaveBeenCalledWith('dark');
 *   });
 *
 *   it('is keyboard accessible', () => {
 *     const { getByLabelText } = render(<ThemeSwitcher />);
 *     const button = getByLabelText('Toggle theme');
 *
 *     button.focus();
 *     expect(document.activeElement).toBe(button);
 *
 *     fireEvent.keyDown(button, { key: 'Enter' });
 *     // Verify setMode called
 *   });
 * });
 */

/**
 * Integration tests
 *
 * @example
 * it('switches entire app theme when clicked', async () => {
 *   const { getByLabelText } = render(<App />);
 *
 *   const button = getByLabelText('Toggle theme');
 *   const body = document.body;
 *
 *   // Initial theme
 *   expect(body).toHaveStyle({ backgroundColor: '#FFFFFF' });
 *
 *   // Click to switch
 *   fireEvent.click(button);
 *
 *   // Wait for transition
 *   await waitFor(() => {
 *     expect(body).toHaveStyle({ backgroundColor: '#1a1a1a' });
 *   });
 * });
 */

/**
 * Accessibility tests
 *
 * @example
 * it('has accessible label', () => {
 *   const { getByLabelText } = render(<ThemeSwitcher />);
 *   expect(getByLabelText('Toggle theme')).toBeInTheDocument();
 * });
 *
 * it('shows tooltip on hover', async () => {
 *   const { getByLabelText, findByRole } = render(<ThemeSwitcher />, {
 *     wrapper: createThemeWrapper({ mode: 'light' }),
 *   });
 *
 *   const button = getByLabelText('Toggle theme');
 *   fireEvent.mouseEnter(button);
 *
 *   const tooltip = await findByRole('tooltip');
 *   expect(tooltip).toHaveTextContent('Switch to dark mode');
 * });
 */

// =============================================================================
// RESPONSIVE BEHAVIOR
// =============================================================================

/**
 * Mobile (< 960px)
 *
 * DISPLAY: Icon button only (no text label)
 * SIZE: 48px touch target (MUI default)
 * POSITION: Right side of AppBar Toolbar
 * ORDER: Logo → Title → [spacer] → ThemeSwitcher → SettingsIcon
 */

/**
 * Desktop (≥ 960px)
 *
 * DISPLAY: Icon button only (consistent with mobile)
 * SIZE: 48px (can be clicked with mouse)
 * POSITION: Right side of AppBar Toolbar
 * ORDER: Logo → Title → [spacer] → ThemeSwitcher → Settings (with label)
 *
 * NOTE: Current spec uses icon-only variant.
 * Future: Consider adding text label "Theme" on desktop for clarity.
 */

// =============================================================================
// BREAKING CHANGE POLICY
// =============================================================================
//
// ✅ ALLOWED:
// - Adding optional props (variant, size, onToggle callback)
// - Adding tooltip customization
// - Extending accessibility features
//
// ❌ FORBIDDEN:
// - Removing component from AppLayout
// - Changing core toggle behavior
// - Making props required
// - Removing keyboard support
//
// =============================================================================
