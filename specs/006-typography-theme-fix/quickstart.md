# Quickstart: Typography and Theme Fix

**Feature**: 006-typography-theme-fix
**Date**: 2026-01-14

## Overview

This feature updates the application's Material-UI theme to match Danske Bank's website design system. Changes are isolated to theme configuration files with minimal impact on components.

## Prerequisites

- Node.js 18+
- Repository cloned and dependencies installed (`npm install`)
- Branch `006-typography-theme-fix` checked out

## Files to Modify

| File | Type of Change |
|------|---------------|
| `index.html` | Optional: Add font-weight 500 to Google Fonts |
| `src/theme/types.ts` | Add h5, h6, caption, button type definitions |
| `src/theme/constants.ts` | Update typography values, colors, add button config |
| `src/theme/index.ts` | Apply new constants to MUI theme |

## Implementation Steps

### Step 1: Extend Type Definitions

Add missing typography variants and button configuration to `types.ts`:

```typescript
// Add to TypographyConfig interface
h5: TypographyVariant;
h6: TypographyVariant;
caption: TypographyVariant;

// Add new interface
interface ButtonConfig {
  borderRadius: number;
  minHeight: number;
  paddingHorizontal: number;
  fontSize: string;
  fontWeight: number;
}

// Extend BrandColors
primaryButton: string;
primaryButtonHover: string;
```

### Step 2: Update Constants

Modify `constants.ts` with spec-compliant values:

**Typography** (key changes):
- H1: fontWeight 700→400, lineHeight 1.2→1.22
- H2: fontSize 1.75rem→2rem, fontWeight 700→500
- H3: fontSize 1.375rem→1.5rem, fontWeight 600→400, lineHeight 1.4→1.17
- H4: fontSize 1.125rem→1.25rem, fontWeight 600→500, lineHeight 1.4→1.3
- Add H5: 1rem, 500, 1.3
- Add H6: 0.875rem, 500, 1.3

**Colors**:
- TEXT_COLORS.primary: #222222→#002447
- Add BRAND_COLORS.primaryButton: #0A5EF0
- Add BRAND_COLORS.primaryButtonHover: #0852D1

**Shape**:
- Add SHAPE_CONFIG.borderRadiusButton: 48

### Step 3: Update Theme

Apply constants to MUI theme in `index.ts`:

1. Add h5, h6, caption to typography section
2. Update MuiButton.root with pill border radius and sizing
3. Update MuiButton.containedPrimary with new blue color
4. Update MuiTableCell with explicit font sizes

### Step 4: Verify Tests

Run test suite and update expected values if needed:

```bash
npm test
```

Tests that may need updates:
- Tests checking primary button background color (rgb conversion of #0A5EF0)
- Tests checking text color (rgb conversion of #002447)

## Verification

### Visual Checks

1. **Buttons**: Should be pill-shaped with blue (#0A5EF0) background
2. **Text**: Should use dark navy (#002447) color
3. **Headings**: Should follow progressive size hierarchy
4. **Tables**: Headers should be slightly bolder than body text

### Automated Checks

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Build
npm run build
```

## Quick Reference

### Typography Values (rem to px at 16px base)

| Variant | Size (rem) | Size (px) | Weight | Line Height |
|---------|------------|-----------|--------|-------------|
| H1 | 2.25 | 36 | 400 | 1.22 |
| H2 | 2 | 32 | 500 | 1.3 |
| H3 | 1.5 | 24 | 400 | 1.17 |
| H4 | 1.25 | 20 | 500 | 1.3 |
| H5 | 1 | 16 | 500 | 1.3 |
| H6 | 0.875 | 14 | 500 | 1.3 |
| Body | 1 | 16 | 400 | 1.5 |
| Caption | 0.875 | 14 | 400 | 1.5 |

### Color Codes

| Token | Hex | RGB |
|-------|-----|-----|
| Primary Text | #002447 | rgb(0, 36, 71) |
| Primary Button | #0A5EF0 | rgb(10, 94, 240) |
| Primary Button Hover | #0852D1 | rgb(8, 82, 209) |

### Button Styling

| Property | Value |
|----------|-------|
| Border Radius | 48px |
| Min Height | 48px |
| Horizontal Padding | 24px |
| Font Weight | 400 |
| Font Size | 16px |

## Troubleshooting

### Font not rendering correctly
- Verify Google Fonts link in index.html
- Check browser DevTools for font loading errors
- Clear browser cache

### Button styles not applying
- Check for inline sx overrides on specific buttons
- Verify theme is properly provided via ThemeProvider
- Check component specificity in styled components

### Tests failing on color values
- Convert hex to RGB: `#002447` → `rgb(0, 36, 71)`
- Check computed styles, not raw values
- Use toHaveStyle or getComputedStyle for assertions
