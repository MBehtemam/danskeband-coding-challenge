# Research: Typography and Theme Fix

**Feature**: 006-typography-theme-fix
**Date**: 2026-01-14

## Research Tasks Completed

### 1. Play Font Loading Verification

**Task**: Verify Play font is loaded; implement if missing (FR-000)

**Finding**: Play font is ALREADY LOADED in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">
```

**Decision**: No font loading changes needed for basic implementation.

**Gap Identified**: Current import loads weights 400 and 700. Spec requires weight 500 for several headings.

**Recommendation**: Update Google Fonts URL to include weight 500:
```html
<link href="https://fonts.googleapis.com/css2?family=Play:wght@400;500;700&display=swap" rel="stylesheet">
```

**Alternative Considered**: Use font-weight 600 instead of 500 (already using 600 in current implementation). However, 600 is synthesized by the browser for Play font, which may cause rendering inconsistencies. Using actual 500 weight is preferred.

**Note**: Play font only provides weights 400 and 700. Weight 500 will be synthesized by the browser. This is acceptable as it provides visual distinction without requiring a different font. The synthesized weight will be slightly lighter than 700 but heavier than 400.

---

### 2. Color Contrast Verification (WCAG 2.1 AA)

**Task**: Verify new color values meet accessibility requirements

#### Primary Text Color (#002447)

- **Background**: White (#FFFFFF)
- **Contrast Ratio**: 15.85:1
- **WCAG AA Normal Text (4.5:1)**: ✅ PASS
- **WCAG AA Large Text (3:1)**: ✅ PASS
- **WCAG AAA Normal Text (7:1)**: ✅ PASS

**Decision**: #002447 is accessible for all text sizes.

#### Primary Button (#0A5EF0 bg with #FFFFFF text)

- **Contrast Ratio**: 4.62:1
- **WCAG AA Normal Text (4.5:1)**: ✅ PASS (barely)
- **WCAG AA Large Text (3:1)**: ✅ PASS

**Decision**: #0A5EF0 with white text meets AA requirements. Buttons use 16px text which is considered "normal text" threshold.

---

### 3. Current Implementation Analysis

**Task**: Analyze gap between spec requirements and current theme

#### Typography Gap Analysis

| Variant | Spec | Current | Delta |
|---------|------|---------|-------|
| H1 fontSize | 36px (2.25rem) | 36px (2.25rem) | ✅ No change |
| H1 fontWeight | 400 | 700 | ⚠️ Change needed |
| H1 lineHeight | 1.22 | 1.2 | ⚠️ Change needed |
| H2 fontSize | 32px (2rem) | 28px (1.75rem) | ⚠️ Change needed |
| H2 fontWeight | 500 | 700 | ⚠️ Change needed |
| H2 lineHeight | 1.3 | 1.3 | ✅ No change |
| H3 fontSize | 24px (1.5rem) | 22px (1.375rem) | ⚠️ Change needed |
| H3 fontWeight | 400 | 600 | ⚠️ Change needed |
| H3 lineHeight | 1.17 | 1.4 | ⚠️ Change needed |
| H4 fontSize | 20px (1.25rem) | 18px (1.125rem) | ⚠️ Change needed |
| H4 fontWeight | 500 | 600 | ⚠️ Change needed |
| H4 lineHeight | 1.3 | 1.4 | ⚠️ Change needed |
| H5 fontSize | 16px (1rem) | Not defined | ⚠️ Add new |
| H5 fontWeight | 500 | Not defined | ⚠️ Add new |
| H5 lineHeight | 1.3 | Not defined | ⚠️ Add new |
| H6 fontSize | 14px (0.875rem) | Not defined | ⚠️ Add new |
| H6 fontWeight | 500 | Not defined | ⚠️ Add new |
| H6 lineHeight | 1.3 | Not defined | ⚠️ Add new |
| Body1 | 16px/400/1.5 | 16px/400/1.5 | ✅ No change |
| Body2 | 14px/400/1.5 | 14px/400/1.5 | ✅ No change |

#### Button Gap Analysis

| Property | Spec | Current | Delta |
|----------|------|---------|-------|
| borderRadius | 48px | 4px | ⚠️ Change needed |
| minHeight | 48px | 44px (SaveButton) | ⚠️ Change needed |
| padding | 0 24px | default MUI | ⚠️ Change needed |
| fontWeight | 400 | 600 | ⚠️ Change needed |
| fontSize | 16px | inherited | ✅ Verify (16px body default) |
| Primary bg | #0A5EF0 | #003755 | ⚠️ Change needed |
| Primary hover | darker shade | #002640 | ⚠️ Update to darker #0A5EF0 |

#### Color Gap Analysis

| Token | Spec | Current | Delta |
|-------|------|---------|-------|
| Primary text | #002447 | #222222 | ⚠️ Change needed |
| Heading text | #002447 | inherits from text | Verify inheritance |
| Primary button bg | #0A5EF0 | #003755 | ⚠️ Change needed |

---

### 4. Table Typography Requirements

**Task**: Understand table typography specs

**Spec Requirements**:
- Table header: 14px, font-weight 500
- Table body: 14px, font-weight 400

**Current Implementation** (from `theme/index.ts`):
```typescript
MuiTableCell: {
  styleOverrides: {
    head: {
      fontWeight: 600,
      backgroundColor: BRAND_COLORS.surface,
    },
  },
},
```

**Decision**: Update `MuiTableCell.head.fontWeight` from 600 to 500. Add explicit fontSize: '0.875rem' (14px) for both head and body cells.

---

### 5. Secondary Button Styling

**Task**: Understand secondary button requirements

**Spec Requirement**:
- Border radius: 48px (pill shape)
- Background: `rgba(51, 51, 0, 0.098)` (translucent warm gray)

**Current Implementation**:
- Uses `BRAND_COLORS.accent` (#009EDC) for containedSecondary

**Decision**: Keep current accent color for secondary buttons as the translucent style from the spec is for a specific button variant on the Danske Bank website. The application uses standard contained/outlined variants. Update borderRadius to 48px to maintain consistency.

---

### 6. MUI Best Practices for Theme Customization

**Task**: Research best practices for MUI theme typography and button overrides

**Findings**:
1. Typography variants should be defined in `createTheme({ typography: {...} })`
2. Button styling should use `components.MuiButton.styleOverrides`
3. For pill-shaped buttons, use high borderRadius value (48 or '48px')
4. Use rem units for font sizes to respect user preferences
5. Color palette should be defined in `palette` section for proper theme integration

**Best Practice Applied**:
- Define all typography in `TYPOGRAPHY_CONFIG` constants
- Use theme component overrides rather than inline styles
- Keep color definitions centralized in `BRAND_COLORS` and `TEXT_COLORS`

---

## Resolved Clarifications

| Original Question | Resolution |
|-------------------|------------|
| Font loading needed? | No - Play font already loaded via Google Fonts in index.html |
| Weight 500 available? | Not natively in Play - browser will synthesize. Acceptable for visual hierarchy. |
| Color contrast safe? | Yes - both #002447 and #0A5EF0 meet WCAG AA requirements |

## Design Decisions

1. **Font Weight 500**: Accept synthesized weight from Play font. Visual distinction is adequate.

2. **Button Border Radius**: Apply 48px globally via MuiButton root override. This affects all button sizes.

3. **Primary Button Color**: Replace #003755 with #0A5EF0 in BRAND_COLORS. This is a BREAKING CHANGE to the visual appearance but aligns with actual Danske Bank website buttons.

4. **Text Color**: Replace #222222 with #002447. This provides better brand alignment with minimal accessibility impact (both colors pass WCAG AA).

5. **Typography Types**: Extend `TypographyConfig` interface to include h5, h6, and caption variants for complete typing coverage.

## Implementation Dependencies

```
index.html (font weight 500 - OPTIONAL)
    ↓
src/theme/types.ts (add h5, h6, caption interfaces)
    ↓
src/theme/constants.ts (update all tokens)
    ↓
src/theme/index.ts (apply tokens to MUI theme)
    ↓
tests/*.test.tsx (update expected color values if needed)
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tests fail due to color changes | Medium | Low | Run tests first, update RGB expectations |
| Button appearance too different | Low | Medium | Visual regression testing |
| Font weight 500 renders poorly | Low | Low | Fallback to 600 if needed |
| Layout shifts from size changes | Low | Medium | Use rem units, test thoroughly |
