import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
// import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from "stylis-plugin-rtl";


// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Cairo", "Inter", "system-ui", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.02em" },
    h2: { fontSize: "2rem", fontWeight: 700, color: "#1F2937", letterSpacing: "-0.01em" },
    h3: { fontSize: "1.75rem", fontWeight: 700, color: "#1F2937" },
    h4: { fontSize: "1.5rem", fontWeight: 600, color: "#1F2937" },
    h5: { fontSize: "1.25rem", fontWeight: 600, color: "#1F2937" },
    h6: { fontSize: "1rem", fontWeight: 600, color: "#1F2937" },
    subtitle1: { fontSize: "1rem", fontWeight: 500, color: "#6B7280" },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, color: "#6B7280" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6, color: "#1F2937" },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, color: "#6B7280" },
    button: { textTransform: "none", fontWeight: 600, fontSize: "0.875rem" },
    caption: { fontSize: "0.75rem", color: "#9CA3AF" },
  },
  palette: {
    primary: {
      main: "#1F7A63", // Deep Emerald Green
      light: "#3AAFA9", // Soft Teal
      dark: "#145344",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F4A261", // Warm Gold
      light: "#FFC291",
      dark: "#CA7D3E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC", // Off-white/Light Gray
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    error: {
      main: "#E63946",
      light: "#FFEBEC",
    },
    success: {
      main: "#2A9D8F",
      light: "#E6F4F2",
    },
    divider: "#E5E7EB",
  },
  shape: {
    borderRadius: 10,
  },
  // shadows: [
  //   "none",
  //   "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  //   "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  //   "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  //   "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  //   "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  //   "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  //   ...Array(18).fill("none") as any, // Fill the rest to avoid MUI errors
  // ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          color: "#1F2937",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#E5E7EB",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#D1D5DB",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(31, 122, 99, 0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1F7A63 0%, #165646 100%)",
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            background: "rgba(31, 122, 99, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#E5E7EB",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#CBD5E1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1F7A63",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#F8FAFC",
          "& .MuiTableCell-root": {
            color: "#6B7280",
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "16px 24px",
            borderBottom: "1px solid #E5E7EB",
            background: "#F8FAFC",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          borderBottom: "1px solid #F1F5F9",
          color: "#1F2937",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#F9FAFB !important",
          },
          "&.Mui-selected": {
            backgroundColor: "#F1F5F9",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          color: "#1F2937",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          color: "#1F2937",
          boxShadow: "none",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}