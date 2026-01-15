# Quickstart: Danske Bank Visual Design System

**Feature Branch**: `005-danske-brand-theme`
**Date**: 2026-01-14

## Prerequisites

- Node.js 18+
- npm or yarn
- Existing project with MUI v7.3.7 and React 18.3.1

## Implementation Sequence

### Step 1: Add Google Fonts to HTML

Update `index.html` to include Play font with preconnect hints:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Google Fonts: Play -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">

    <title>Team Incident Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 2: Add Danske Bank Logo Asset

1. Download the official logo SVG from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Danske_Bank_logo.svg)
2. Save to `src/assets/danske-bank-logo.svg`

### Step 3: Update Theme Configuration

Replace `src/theme/index.ts` with the complete Danske Bank MUI theme:

```typescript
import { createTheme } from '@mui/material/styles';

// =============================================================================
// DANSKE BANK COLOR TOKENS
// =============================================================================

const colors = {
  // Brand colors (official)
  primary: '#003755',
  primaryDark: '#002640',
  accent: '#009EDC',
  accentDark: '#0088C7',

  // Backgrounds
  background: '#F6F4F2',
  surface: '#FFFFFF',
  onPrimary: '#FFFFFF',

  // Borders (warm Nordic tones)
  border: '#ebece7',
  borderWarm: '#ccc7b4',

  // Text
  textPrimary: '#222222',
  textMuted: '#968d73',
  textOnLight: '#002346',

  // Status colors
  statusOpen: '#4672c2',
  statusInProgress: '#d8b463',
  statusResolved: '#144a37',

  // Severity colors
  severityCritical: '#7d3218',
  severityHigh: '#cd6e42',
  severityMedium: '#d8b463',
  severityLow: '#144a37',
} as const;

// =============================================================================
// MUI THEME CREATION
// =============================================================================

export const theme = createTheme({
  // ---------------------------------------------------------------------------
  // PALETTE
  // ---------------------------------------------------------------------------
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: colors.onPrimary,
    },
    secondary: {
      main: colors.accent,
      dark: colors.accentDark,
      contrastText: colors.onPrimary,
    },
    error: {
      main: colors.severityCritical,
    },
    warning: {
      main: colors.severityHigh,
    },
    info: {
      main: colors.statusOpen,
    },
    success: {
      main: colors.statusResolved,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textMuted,
    },
    divider: colors.border,
  },

  // ---------------------------------------------------------------------------
  // TYPOGRAPHY
  // ---------------------------------------------------------------------------
  typography: {
    fontFamily: '"Play", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },

  // ---------------------------------------------------------------------------
  // SHAPE
  // ---------------------------------------------------------------------------
  shape: {
    borderRadius: 4,
  },

  // ---------------------------------------------------------------------------
  // COMPONENT OVERRIDES
  // ---------------------------------------------------------------------------
  components: {
    // -------------------------------------------------------------------------
    // AppBar - White background with brand text
    // -------------------------------------------------------------------------
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          color: colors.primary,
          boxShadow: `0 1px 0 ${colors.border}`,
        },
      },
    },

    // -------------------------------------------------------------------------
    // Buttons
    // -------------------------------------------------------------------------
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 4,
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          '&:hover': {
            backgroundColor: colors.primaryDark,
          },
        },
        containedSecondary: {
          backgroundColor: colors.accent,
          '&:hover': {
            backgroundColor: colors.accentDark,
          },
        },
        outlinedPrimary: {
          borderColor: colors.primary,
          color: colors.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 55, 85, 0.04)',
            borderColor: colors.primary,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Cards - White with warm border
    // -------------------------------------------------------------------------
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Table - Warm hover states
    // -------------------------------------------------------------------------
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.border,
          },
          '&.Mui-selected': {
            backgroundColor: `rgba(204, 199, 180, 0.2)`,
            '&:hover': {
              backgroundColor: `rgba(204, 199, 180, 0.3)`,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: colors.border,
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.surface,
        },
      },
    },

    // -------------------------------------------------------------------------
    // Inputs - Warm borders
    // -------------------------------------------------------------------------
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.borderWarm,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accent,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.severityCritical,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Links - Brand blue
    // -------------------------------------------------------------------------
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Chips - Maintain font weight
    // -------------------------------------------------------------------------
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    // -------------------------------------------------------------------------
    // Paper - Subtle elevation
    // -------------------------------------------------------------------------
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: colors.border,
        },
      },
    },

    // -------------------------------------------------------------------------
    // CssBaseline - Global styles
    // -------------------------------------------------------------------------
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
        },
      },
    },
  },
});

// =============================================================================
// EXPORTED COLOR CONSTANTS (for use in custom components)
// =============================================================================

export const danskeBankColors = colors;

// Status chip colors (for StatusChip component)
export const statusColors = {
  open: { background: colors.statusOpen, text: colors.onPrimary },
  inProgress: { background: colors.statusInProgress, text: colors.textOnLight },
  resolved: { background: colors.statusResolved, text: colors.onPrimary },
} as const;

// Severity chip colors (for SeverityChip component)
export const severityColors = {
  critical: { background: colors.severityCritical, text: colors.onPrimary },
  high: { background: colors.severityHigh, text: colors.onPrimary },
  medium: { background: colors.severityMedium, text: colors.textOnLight },
  low: { background: colors.severityLow, text: colors.onPrimary },
} as const;
```

### Step 4: Update AppLayout with Logo

Update `src/components/layout/AppLayout.tsx`:

```typescript
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import danskeBankLogo from '../../assets/danske-bank-logo.svg';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" component="header">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box
            component="img"
            src={danskeBankLogo}
            alt="Danske Bank"
            sx={{
              height: { xs: 24, sm: 32 },
              mr: 2,
            }}
          />
          {!isMobile && (
            <Typography variant="body1" component="span" sx={{ flexGrow: 1 }}>
              Incident Dashboard
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
```

### Step 5: Update StatusChip Component

Update `src/components/common/StatusChip.tsx` to use theme colors:

```typescript
import Chip from '@mui/material/Chip';
import { statusColors } from '../../theme';

// ... rest of component using statusColors
```

### Step 6: Update SeverityChip Component

Update `src/components/common/SeverityChip.tsx` to use theme colors:

```typescript
import Chip from '@mui/material/Chip';
import { severityColors } from '../../theme';

// ... rest of component using severityColors
```

### Step 7: Verify Changes

Run the development server:

```bash
npm run dev
```

### Step 8: Run Tests

```bash
npm test
npm run lint
```

## Key Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `index.html` | Modified | Added Google Fonts preconnect and link tags |
| `src/assets/danske-bank-logo.svg` | New | Danske Bank logo asset |
| `src/theme/index.ts` | Modified | Complete Danske Bank MUI theme |
| `src/components/layout/AppLayout.tsx` | Modified | Logo integration, AppBar styling |
| `src/components/common/StatusChip.tsx` | Modified | Use theme status colors |
| `src/components/common/SeverityChip.tsx` | Modified | Use theme severity colors |

## Verification Checklist

### Brand Identity
- [ ] Play font visible in all text elements
- [ ] Danske Bank logo displays on left side of navigation
- [ ] Navigation bar has white background (#FFFFFF)
- [ ] Page background is Pampas (#F6F4F2)

### Color System
- [ ] Primary buttons use Prussian Blue (#003755)
- [ ] Secondary/accent buttons use Cerulean (#009EDC)
- [ ] Borders use warm gray (#ebece7)
- [ ] Text color is Mine Shaft (#222222)

### Status & Severity
- [ ] Open status shows blue (#4672c2)
- [ ] In Progress shows gold (#d8b463) with dark text
- [ ] Resolved shows green (#144a37)
- [ ] Severity colors follow red→orange→gold→green scale

### UX & Accessibility
- [ ] All text/background combinations meet WCAG AA contrast
- [ ] Focus indicators visible on keyboard navigation
- [ ] Table rows have warm hover states
- [ ] No console errors related to font loading

### Responsive
- [ ] Navigation collapses at 960px breakpoint
- [ ] Cards and spacing adapt to screen size
