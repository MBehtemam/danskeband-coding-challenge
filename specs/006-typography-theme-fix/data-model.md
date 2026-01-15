# Data Model: Typography and Theme Fix

**Feature**: 006-typography-theme-fix
**Date**: 2026-01-14

## Overview

This feature modifies theme configuration entities. No database or API changes are required. All changes are to TypeScript type definitions and constant values used by the MUI theme system.

## Entity Definitions

### TypographyVariant

Represents a single typography style definition.

```typescript
interface TypographyVariant {
  fontSize: string;      // rem value, e.g., '2rem'
  fontWeight: number;    // 400 | 500 | 600 | 700
  lineHeight: number;    // unitless ratio, e.g., 1.3
}
```

**Validation Rules**:
- fontSize must be a valid CSS rem/px value
- fontWeight must be 400, 500, 600, or 700
- lineHeight must be between 1.0 and 2.0

### TypographyConfig (MODIFIED)

Extended to include h5, h6, and caption variants.

```typescript
interface TypographyConfig {
  fontFamily: string;
  fontWeightRegular: number;   // 400
  fontWeightMedium: number;    // 500 (NEW - was 600)
  fontWeightBold: number;      // 700
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;       // NEW
  h6: TypographyVariant;       // NEW
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;  // NEW (alias for body2 styling)
}
```

### BrandColors (MODIFIED)

Extended with button-specific colors.

```typescript
interface BrandColors {
  primary: string;           // #003755 (legacy - AppBar, links)
  primaryDark: string;       // #002640
  accent: string;            // #009EDC
  accentDark: string;        // #0088C7
  background: string;        // #FFFFFF
  surface: string;           // #FFFFFF
  onPrimary: string;         // #FFFFFF
  primaryButton: string;     // NEW: #0A5EF0 (button background)
  primaryButtonHover: string; // NEW: #0852d1 (button hover state)
}
```

### TextColors (MODIFIED)

Updated primary text color.

```typescript
interface TextColors {
  primary: string;    // CHANGED: #002447 (was #222222)
  muted: string;      // #968d73
  onLight: string;    // #002346
}
```

### ShapeConfig (MODIFIED)

Extended with button-specific border radius.

```typescript
interface ShapeConfig {
  borderRadiusSmall: number;   // 4 (for inputs, chips)
  borderRadiusMedium: number;  // 8 (for cards)
  borderRadiusButton: number;  // NEW: 48 (pill buttons)
}
```

### ButtonConfig (NEW)

New entity for button-specific styling.

```typescript
interface ButtonConfig {
  borderRadius: number;     // 48
  minHeight: number;        // 48
  paddingHorizontal: number; // 24
  fontSize: string;         // '1rem' (16px)
  fontWeight: number;       // 400
}
```

### TableTypography (NEW)

New entity for table-specific typography.

```typescript
interface TableTypography {
  header: {
    fontSize: string;    // '0.875rem' (14px)
    fontWeight: number;  // 500
  };
  body: {
    fontSize: string;    // '0.875rem' (14px)
    fontWeight: number;  // 400
  };
}
```

## Updated Constants

### TYPOGRAPHY_CONFIG

```typescript
export const TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily:
    '"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,  // Changed from 600
  fontWeightBold: 700,
  h1: { fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.22 },  // Updated
  h2: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.3 },       // Updated
  h3: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.17 },    // Updated
  h4: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.3 },    // Updated
  h5: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.3 },       // NEW
  h6: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.3 },   // NEW
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 }, // NEW
} as const;
```

### BRAND_COLORS

```typescript
export const BRAND_COLORS: BrandColors = {
  primary: '#003755',
  primaryDark: '#002640',
  accent: '#009EDC',
  accentDark: '#0088C7',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  onPrimary: '#FFFFFF',
  primaryButton: '#0A5EF0',      // NEW
  primaryButtonHover: '#0852D1', // NEW (darker shade)
} as const;
```

### TEXT_COLORS

```typescript
export const TEXT_COLORS: TextColors = {
  primary: '#002447',  // Changed from #222222
  muted: '#968d73',
  onLight: '#002346',
} as const;
```

### SHAPE_CONFIG

```typescript
export const SHAPE_CONFIG: ShapeConfig = {
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusButton: 48,  // NEW
} as const;
```

### BUTTON_CONFIG (NEW)

```typescript
export const BUTTON_CONFIG: ButtonConfig = {
  borderRadius: 48,
  minHeight: 48,
  paddingHorizontal: 24,
  fontSize: '1rem',
  fontWeight: 400,
} as const;
```

### TABLE_TYPOGRAPHY (NEW)

```typescript
export const TABLE_TYPOGRAPHY: TableTypography = {
  header: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
} as const;
```

## MUI Theme Mappings

### Typography Section

```typescript
typography: {
  fontFamily: TYPOGRAPHY_CONFIG.fontFamily,
  h1: { ...TYPOGRAPHY_CONFIG.h1, color: TEXT_COLORS.primary },
  h2: { ...TYPOGRAPHY_CONFIG.h2, color: TEXT_COLORS.primary },
  h3: { ...TYPOGRAPHY_CONFIG.h3, color: TEXT_COLORS.primary },
  h4: { ...TYPOGRAPHY_CONFIG.h4, color: TEXT_COLORS.primary },
  h5: { ...TYPOGRAPHY_CONFIG.h5, color: TEXT_COLORS.primary },
  h6: { ...TYPOGRAPHY_CONFIG.h6, color: TEXT_COLORS.primary },
  body1: TYPOGRAPHY_CONFIG.body1,
  body2: TYPOGRAPHY_CONFIG.body2,
  caption: TYPOGRAPHY_CONFIG.caption,
}
```

### Button Overrides

```typescript
MuiButton: {
  styleOverrides: {
    root: {
      textTransform: 'none',
      fontWeight: BUTTON_CONFIG.fontWeight,
      fontSize: BUTTON_CONFIG.fontSize,
      borderRadius: BUTTON_CONFIG.borderRadius,
      minHeight: BUTTON_CONFIG.minHeight,
      paddingLeft: BUTTON_CONFIG.paddingHorizontal,
      paddingRight: BUTTON_CONFIG.paddingHorizontal,
    },
    containedPrimary: {
      backgroundColor: BRAND_COLORS.primaryButton,
      '&:hover': {
        backgroundColor: BRAND_COLORS.primaryButtonHover,
      },
    },
  },
}
```

### Table Cell Overrides

```typescript
MuiTableCell: {
  styleOverrides: {
    root: {
      fontSize: TABLE_TYPOGRAPHY.body.fontSize,
      fontWeight: TABLE_TYPOGRAPHY.body.fontWeight,
      borderBottomColor: BORDER_COLORS.default,
    },
    head: {
      fontSize: TABLE_TYPOGRAPHY.header.fontSize,
      fontWeight: TABLE_TYPOGRAPHY.header.fontWeight,
      backgroundColor: BRAND_COLORS.surface,
    },
  },
}
```

## State Transitions

N/A - Theme configuration is static and has no state transitions.

## Relationships

```
TypographyConfig
├── h1..h6 (TypographyVariant)
├── body1, body2 (TypographyVariant)
└── caption (TypographyVariant)

BrandColors
├── primary, primaryDark (used by AppBar, links)
├── primaryButton, primaryButtonHover (used by MuiButton)
└── accent, accentDark (used by secondary elements)

ShapeConfig
├── borderRadiusSmall (inputs, chips)
├── borderRadiusMedium (cards)
└── borderRadiusButton (buttons)

DanskeBankTheme
├── brand: BrandColors
├── borders: BorderColors
├── text: TextColors
├── typography: TypographyConfig
├── shape: ShapeConfig
└── button: ButtonConfig (NEW)
```
