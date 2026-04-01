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
  direction: 'rtl',
  typography: {
    fontFamily: '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Amiri Quran", serif' },
    h2: { fontFamily: '"Amiri Quran", serif' },
    h3: { fontFamily: '"Amiri Quran", serif' },
    h4: { fontFamily: '"Amiri Quran", serif' },
    h5: { fontFamily: '"Tajawal", sans-serif', fontWeight: 800 },
    h6: { fontFamily: '"Tajawal", sans-serif', fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { fontSize: '15px' },
    body2: { fontSize: '13.5px' },
    button: { textTransform: 'none', fontWeight: 700, fontFamily: '"Tajawal", sans-serif' }
  },
  palette: {
    primary: { 
      main: '#064e3b', // emerald-900 (Sidebar, Header text)
      light: '#059669', // emerald-600 (Primary buttons)
      dark: '#022c22', // emerald-950
      contrastText: '#ffffff',
    },
    secondary: { 
      main: '#fbbf24', // amber-400 (Accents, active items)
      light: '#fef3c7', // amber-100
      dark: '#d97706', // amber-600
      contrastText: '#064e3b',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#92400e',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
      dark: '#1e40af',
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
      dark: '#065f46',
    },
    background: { 
      default: '#f8f7f4', // Main background from CSS
      paper: '#ffffff',
    },
    text: { 
      primary: '#1c1917', // stone-900
      secondary: '#78716c', // stone-500
      disabled: '#a8a29e', // stone-400
    },
    divider: '#f5f0ea', // from CSS table border
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8f7f4',
          color: '#1c1917',
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6d3d1",
            borderRadius: "2px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 11,
          padding: '9px 18px',
          fontSize: '13.5px',
          transition: 'all 0.15s ease',
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            backgroundColor: '#059669', // Primary btn custom color
            '&:hover': {
              backgroundColor: '#047857',
            }
          }),
        }),
        sizeSmall: {
          padding: '5px 11px',
          borderRadius: 8,
          fontSize: '12px',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid #f1ede6',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 11,
            backgroundColor: '#fafaf9',
            fontFamily: '"Tajawal", sans-serif',
            fontSize: '13.5px',
            color: '#292524',
            transition: 'all 0.15s ease',
            '& fieldset': {
              border: '1.5px solid #e7e5e4',
              transition: 'all 0.15s ease',
            },
            '&:hover fieldset': {
              borderColor: '#d6d3d1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#059669',
              borderWidth: '1.5px',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            }
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '9px 13px',
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: '9px 13px',
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '13.5px',
          fontWeight: 600,
          color: '#57534e',
          '&.Mui-focused': {
            color: '#059669',
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          fontSize: '13.5px',
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#064e3b',
          '& .MuiTableCell-root': {
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '12.5px',
            padding: '11px 14px',
            whiteSpace: 'nowrap',
            borderBottom: 'none',
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '11px 14px',
          borderBottom: '1px solid #f5f0ea',
          color: '#44403c',
          verticalAlign: 'middle',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            borderBottom: 0,
          },
          '&:hover': {
            backgroundColor: '#fafaf9 !important',
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#064e3b',
          color: '#ffffff',
          borderRight: 'none',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1c1917',
          boxShadow: '0 1px 3px rgba(0,0,0,.04)',
          borderBottom: '1px solid #f1ede6',
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          minWidth: 16,
          height: 16,
          fontSize: 10,
          fontWeight: 700,
          padding: '0 4px',
          backgroundColor: '#ef4444',
        }
      }
    }
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