import { createTheme } from '@mui/material/styles';
import {
  BRAND_COLORS,
  BORDER_COLORS,
  TEXT_COLORS,
  STATUS_COLORS,
  SEVERITY_COLORS,
  TYPOGRAPHY_CONFIG,
  SHAPE_CONFIG,
  BUTTON_CONFIG,
  TABLE_TYPOGRAPHY,
} from './constants';

// =============================================================================
// DANSKE BANK MUI THEME
// =============================================================================

export const theme = createTheme({
  // ---------------------------------------------------------------------------
  // PALETTE (T006)
  // ---------------------------------------------------------------------------
  palette: {
    primary: {
      main: BRAND_COLORS.primary,
      dark: BRAND_COLORS.primaryDark,
      contrastText: BRAND_COLORS.onPrimary,
    },
    secondary: {
      main: BRAND_COLORS.accent,
      dark: BRAND_COLORS.accentDark,
      contrastText: BRAND_COLORS.onPrimary,
    },
    error: {
      main: SEVERITY_COLORS.critical.background,
    },
    warning: {
      main: SEVERITY_COLORS.high.background,
    },
    info: {
      main: STATUS_COLORS.open.background,
    },
    success: {
      main: STATUS_COLORS.resolved.background,
    },
    background: {
      default: BRAND_COLORS.background,
      paper: BRAND_COLORS.surface,
    },
    text: {
      primary: TEXT_COLORS.primary,
      secondary: TEXT_COLORS.muted,
    },
    divider: BORDER_COLORS.default,
  },

  // ---------------------------------------------------------------------------
  // TYPOGRAPHY (T007, T027-T031)
  // ---------------------------------------------------------------------------
  typography: {
    fontFamily: TYPOGRAPHY_CONFIG.fontFamily,
    h1: {
      fontSize: TYPOGRAPHY_CONFIG.h1.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h1.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h1.lineHeight,
      color: TEXT_COLORS.primary,
    },
    h2: {
      fontSize: TYPOGRAPHY_CONFIG.h2.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h2.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h2.lineHeight,
      color: TEXT_COLORS.primary,
    },
    h3: {
      fontSize: TYPOGRAPHY_CONFIG.h3.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h3.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h3.lineHeight,
      color: TEXT_COLORS.primary,
    },
    h4: {
      fontSize: TYPOGRAPHY_CONFIG.h4.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h4.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h4.lineHeight,
      color: TEXT_COLORS.primary,
    },
    h5: {
      fontSize: TYPOGRAPHY_CONFIG.h5.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h5.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h5.lineHeight,
      color: TEXT_COLORS.primary,
    },
    h6: {
      fontSize: TYPOGRAPHY_CONFIG.h6.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.h6.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.h6.lineHeight,
      color: TEXT_COLORS.primary,
    },
    body1: {
      fontSize: TYPOGRAPHY_CONFIG.body1.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.body1.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.body1.lineHeight,
    },
    body2: {
      fontSize: TYPOGRAPHY_CONFIG.body2.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.body2.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.body2.lineHeight,
    },
    caption: {
      fontSize: TYPOGRAPHY_CONFIG.caption.fontSize,
      fontWeight: TYPOGRAPHY_CONFIG.caption.fontWeight,
      lineHeight: TYPOGRAPHY_CONFIG.caption.lineHeight,
    },
  },

  // ---------------------------------------------------------------------------
  // SHAPE
  // ---------------------------------------------------------------------------
  shape: {
    borderRadius: SHAPE_CONFIG.borderRadiusSmall,
  },

  // ---------------------------------------------------------------------------
  // COMPONENT OVERRIDES
  // ---------------------------------------------------------------------------
  components: {
    // -------------------------------------------------------------------------
    // MuiCssBaseline - Global styles (T008)
    // -------------------------------------------------------------------------
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BRAND_COLORS.background,
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiAppBar - White background with brand text (T013)
    // -------------------------------------------------------------------------
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND_COLORS.surface,
          color: BRAND_COLORS.primary,
          boxShadow: `0 1px 0 ${BORDER_COLORS.default}`,
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiButton (T021-T024)
    // -------------------------------------------------------------------------
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
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: BRAND_COLORS.primaryButton,
          '&:hover': {
            backgroundColor: BRAND_COLORS.primaryButtonHover,
          },
        },
        containedSecondary: {
          backgroundColor: BRAND_COLORS.accent,
          borderRadius: BUTTON_CONFIG.borderRadius,
          '&:hover': {
            backgroundColor: BRAND_COLORS.accentDark,
          },
        },
        outlinedPrimary: {
          borderColor: BRAND_COLORS.primary,
          color: BRAND_COLORS.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 55, 85, 0.04)',
            borderColor: BRAND_COLORS.primary,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiLink (T025)
    // -------------------------------------------------------------------------
    MuiLink: {
      styleOverrides: {
        root: {
          color: BRAND_COLORS.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiCard (T017)
    // -------------------------------------------------------------------------
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER_COLORS.default}`,
          borderRadius: SHAPE_CONFIG.borderRadiusMedium,
          boxShadow: 'none',
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiCardContent (T018)
    // -------------------------------------------------------------------------
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
    // MuiPaper (T019)
    // -------------------------------------------------------------------------
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: BORDER_COLORS.default,
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiTableRow (T039)
    // -------------------------------------------------------------------------
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: BORDER_COLORS.default,
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(204, 199, 180, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(204, 199, 180, 0.3)',
            },
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiTableCell (T040)
    // -------------------------------------------------------------------------
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: TABLE_TYPOGRAPHY.body.fontSize,
          fontWeight: TABLE_TYPOGRAPHY.body.fontWeight,
          lineHeight: 1.5,
          borderBottomColor: BORDER_COLORS.default,
        },
        head: {
          fontSize: TABLE_TYPOGRAPHY.header.fontSize,
          fontWeight: TABLE_TYPOGRAPHY.header.fontWeight,
          backgroundColor: BRAND_COLORS.surface,
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiOutlinedInput (T041)
    // -------------------------------------------------------------------------
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER_COLORS.default,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER_COLORS.warm,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_COLORS.accent,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: SEVERITY_COLORS.critical.background,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // MuiChip (T042)
    // -------------------------------------------------------------------------
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

// =============================================================================
// EXPORTED COLOR CONSTANTS (T009)
// =============================================================================

/**
 * Status chip colors (for StatusChip component)
 */
export const statusColors = {
  open: { background: STATUS_COLORS.open.background, text: STATUS_COLORS.open.text },
  inProgress: { background: STATUS_COLORS.inProgress.background, text: STATUS_COLORS.inProgress.text },
  resolved: { background: STATUS_COLORS.resolved.background, text: STATUS_COLORS.resolved.text },
} as const;

/**
 * Severity chip colors (for SeverityChip component)
 */
export const severityColors = {
  critical: { background: SEVERITY_COLORS.critical.background, text: SEVERITY_COLORS.critical.text },
  high: { background: SEVERITY_COLORS.high.background, text: SEVERITY_COLORS.high.text },
  medium: { background: SEVERITY_COLORS.medium.background, text: SEVERITY_COLORS.medium.text },
  low: { background: SEVERITY_COLORS.low.background, text: SEVERITY_COLORS.low.text },
} as const;

/**
 * Complete Danske Bank color palette for custom components
 */
export const danskeBankColors = {
  brand: BRAND_COLORS,
  borders: BORDER_COLORS,
  text: TEXT_COLORS,
  status: STATUS_COLORS,
  severity: SEVERITY_COLORS,
} as const;
