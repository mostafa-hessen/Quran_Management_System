import { ThemeProvider, createTheme, CssBaseline, alpha } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

// Type extensions for custom colors
declare module '@mui/material/styles' {
  interface Palette {
    stone: Palette['primary'];
    sky: Palette['primary'];
    emerald: Palette['primary'];
    amber: Palette['primary'];
  }
  interface PaletteOptions {
    stone?: PaletteOptions['primary'];
    sky?: PaletteOptions['primary'];
    emerald?: PaletteOptions['primary'];
    amber?: PaletteOptions['primary'];
  }
}

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Cairo", "Inter", "system-ui", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" },
    h2: { fontSize: "1.875rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.025em" },
    h3: { fontSize: "1.5rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.025em" },
    h4: { fontSize: "1.25rem", fontWeight: 600, color: "#111827" },
    h5: { fontSize: "1.125rem", fontWeight: 600, color: "#111827" },
    h6: { fontSize: "1rem", fontWeight: 600, color: "#111827" },
    subtitle1: { fontSize: "1rem", fontWeight: 500, color: "#4B5563" },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, color: "#6B7280" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6, color: "#374151" },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, color: "#6B7280" },
    button: { textTransform: "none", fontWeight: 600, fontSize: "0.875rem" },
    caption: { fontSize: "0.75rem", color: "#9CA3AF" },
  },
  palette: {
    primary: {
      main: "#10B981", // Emerald 600
      light: "#34D399", // Emerald 400
      dark: "#059669", // Emerald 700
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B", // Amber 500
      light: "#FBBF24", // Amber 400
      dark: "#D97706", // Amber 600
      contrastText: "#FFFFFF",
    },
    emerald: {
      main: "#10B981",
      light: "#ECFDF5",
      dark: "#065F46",
    },
    amber: {
      main: "#F59E0B",
      light: "#FFFBEB",
      dark: "#92400E",
    },
    sky: {
      main: "#0EA5E9",
      light: "#F0F9FF",
      dark: "#075985",
    },
    stone: {
      main: "#78716C",
      light: "#F5F5F4",
      dark: "#44403C",
      "50": "#FAFAF9",
      "100": "#F5F5F4",
      "200": "#E7E5E4",
      "300": "#D6D3D1",
      "400": "#A8A29E",
      "500": "#78716C",
      "600": "#57534E",
      "700": "#44403C",
      "800": "#292524",
      "900": "#1C1917",
    } as any,
    background: {
      default: "#F9FAFB", // Subtle gray-blue tint
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827", // Gray 900
      secondary: "#4B5563", // Gray 600
    },
    divider: "#F1F5F9",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F9FAFB",
          backgroundImage: `radial-gradient(at 0% 0%, hsla(160, 84%, 39%, 0.03) 0, transparent 50%), 
                            radial-gradient(at 50% 0%, hsla(199, 89%, 48%, 0.03) 0, transparent 50%)`,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "8px 20px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          fontWeight: 700,
          "&:hover": {
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.12)",
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(to bottom, #10B981, #059669)",
          border: '1px solid #059669',
          "&:hover": {
            background: "linear-gradient(to bottom, #059669, #047857)",
          },
        },
        outlined: {
          borderColor: "#E5E7EB",
          color: "#374151",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            borderColor: "#D1D5DB",
            backgroundColor: "#F9FAFB",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid #F1F5F9",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02), 0 10px 20px -5px rgba(0, 0, 0, 0.03)",
          backgroundColor: "#FFFFFF",
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.02)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#F9FAFB",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#E5E7EB",
            },
            "&:hover fieldset": {
              borderColor: "#D1D5DB",
            },
            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",
              "& fieldset": {
                borderWidth: "2px",
              },
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "#F9FAFB",
            color: "#6B7280",
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #F1F5F9",
            padding: "16px 24px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "20px 24px",
          borderBottom: "1px solid #F1F5F9",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F8FAFC !important",
          },
        },
      },
    },
  },
});

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
