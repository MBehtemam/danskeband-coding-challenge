# Data Model: Danske Bank Visual Design System

**Feature Branch**: `005-danske-brand-theme`
**Date**: 2026-01-14

## Overview

This feature defines a design system configuration with no persistent data storage. All entities are compile-time constants and TypeScript type definitions that configure the MUI theme.

## Entities

### 1. BrandColors

**Purpose**: Centralized color palette constants for Danske Bank brand identity.

| Field | Type | Value | Usage |
|-------|------|-------|-------|
| `prussianBlue` | `string` | `#003755` | Primary brand color, navigation, headers, logo |
| `cerulean` | `string` | `#009EDC` | Accent color, primary buttons, interactive highlights |
| `powderBlue` | `string` | `#C3E0EB` | Secondary highlights, selected states |
| `pampas` | `string` | `#F6F4F2` | Page background, content area backgrounds |
| `white` | `string` | `#FFFFFF` | Cards, navigation bar, modal backgrounds |
| `mineShaft` | `string` | `#222222` | Primary text color |
| `lightGray` | `string` | `#DDDDDD` | Borders, dividers, separations |
| `errorRed` | `string` | `#FF6666` | Error states, validation, required indicators |

**Validation Rules**:
- All values must be valid 6-digit hex colors (uppercase)
- Colors are immutable constants (const assertion)

---

### 2. TypographyConfig

**Purpose**: Font family, sizes, and weights configuration.

| Field | Type | Value | Usage |
|-------|------|-------|-------|
| `fontFamily` | `string` | `"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | All text elements |
| `fontWeightRegular` | `number` | `400` | Body text, normal weight |
| `fontWeightBold` | `number` | `700` | Headings, emphasis |
| `baseFontSize` | `number` | `16` | Body text (px) |
| `lineHeight` | `number` | `1.5` | Body text line height |

**Heading Sizes**:

| Level | Size (px) | Weight | Line Height |
|-------|-----------|--------|-------------|
| `h1` | `36` | `700` | `1.2` |
| `h2` | `28` | `700` | `1.3` |
| `h3` | `22` | `600` | `1.4` |
| `h4` | `18` | `600` | `1.4` |
| `body1` | `16` | `400` | `1.5` |
| `body2` | `14` | `400` | `1.5` |
| `caption` | `13` | `400` | `1.4` |

---

### 3. SpacingConfig

**Purpose**: Consistent spacing values following an 8px grid system.

| Token | Value (px) | Usage |
|-------|------------|-------|
| `xs` | `4` | Minimal spacing, icon margins |
| `sm` | `8` | Tight spacing, inline elements |
| `md` | `16` | Standard spacing, component padding |
| `lg` | `24` | Section spacing, card padding |
| `xl` | `32` | Large section gaps |
| `xxl` | `48` | Page-level spacing |

---

### 4. BorderConfig

**Purpose**: Border styles for component edges.

| Field | Type | Value | Usage |
|-------|------|-------|-------|
| `radiusSmall` | `number` | `4` | Buttons, inputs, chips |
| `radiusMedium` | `number` | `8` | Cards, modals, containers |
| `widthThin` | `number` | `1` | Standard borders |
| `colorDefault` | `string` | `#DDDDDD` | Default border color |
| `colorError` | `string` | `#FF6666` | Error state borders |
| `colorFocus` | `string` | `#009EDC` | Focus ring color |

---

### 5. BreakpointConfig

**Purpose**: Responsive design breakpoints.

| Token | Value (px) | Description |
|-------|------------|-------------|
| `xs` | `0` | Extra small (mobile portrait) |
| `sm` | `600` | Small (mobile landscape) |
| `md` | `960` | Medium (tablet) - navigation collapse point |
| `lg` | `1280` | Large (desktop) |
| `xl` | `1920` | Extra large (wide desktop) |

**State Transitions**:
- Below `md` (960px): Navigation collapses to hamburger menu
- Above `md`: Full horizontal navigation displayed

---

### 6. ComponentThemeOverrides

**Purpose**: MUI component-specific style overrides.

#### MuiAppBar
| Property | Value |
|----------|-------|
| `backgroundColor` | `#FFFFFF` |
| `color` | `#003755` |
| `boxShadow` | `0 1px 0 #DDDDDD` |

#### MuiButton (contained, primary)
| Property | Value |
|----------|-------|
| `backgroundColor` | `#009EDC` |
| `color` | `#FFFFFF` |
| `hoverBackgroundColor` | `#0088C7` |
| `borderRadius` | `4px` |
| `fontWeight` | `700` |
| `textTransform` | `none` |

#### MuiButton (outlined, secondary)
| Property | Value |
|----------|-------|
| `backgroundColor` | `transparent` |
| `color` | `#003755` |
| `borderColor` | `#003755` |
| `hoverBackgroundColor` | `rgba(0, 55, 85, 0.04)` |

#### MuiCard
| Property | Value |
|----------|-------|
| `backgroundColor` | `#FFFFFF` |
| `borderColor` | `#DDDDDD` |
| `borderRadius` | `8px` |

#### MuiOutlinedInput
| Property | Value |
|----------|-------|
| `borderColor` | `#DDDDDD` |
| `focusBorderColor` | `#009EDC` |
| `errorBorderColor` | `#FF6666` |

#### MuiLink
| Property | Value |
|----------|-------|
| `color` | `#003755` |
| `textDecoration` | `none` |
| `hoverTextDecoration` | `underline` |

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        MUI Theme                                │
│  createTheme({...})                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  BrandColors    │───▶│  palette         │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ TypographyConfig│───▶│  typography      │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  SpacingConfig  │───▶│  spacing         │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  BorderConfig   │───▶│  shape           │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │BreakpointConfig │───▶│  breakpoints     │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ComponentOverrides│──▶│  components      │                   │
│  └─────────────────┘    └──────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## No Database Storage

This feature does not require database tables or persistent storage. All theme configuration is:
1. Defined as TypeScript constants
2. Compiled into the JavaScript bundle
3. Applied at runtime through MUI's ThemeProvider

The only external asset is the Danske Bank logo SVG file stored in `src/assets/`.
