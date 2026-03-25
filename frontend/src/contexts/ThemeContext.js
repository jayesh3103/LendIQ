import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    // Default to dark theme for an overall darker UI unless user has an explicit preference
    return saved ? JSON.parse(saved) : true;
  });

  

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Keep body class in sync so legacy/global CSS (index.css) dark selectors apply
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-mui-color-scheme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-mui-color-scheme');
    }
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7C93FF', // muted indigo accent
        light: '#B7C6FF',
        dark: '#495BD6',
      },
      secondary: {
        main: '#FFD27D', // elegant warm gold accent
        light: '#FFE8B8',
        dark: '#C79A40',
      },
      background: {
        // stronger dark backgrounds for higher contrast
        default: darkMode ? '#071021' : '#F8F9FA',
        paper: darkMode ? '#0B1724' : '#FFFFFF',
      },
      success: {
        main: '#66BB6A',
      },
      warning: {
        main: '#FFB86B',
      },
      error: {
        main: '#FF6B6B',
      },
      info: {
        main: '#9FA8DA',
      },
      text: {
        // Always provide explicit text colors for both modes to avoid undefined being
        // passed into MUI color helpers (which causes runtime errors).
        primary: darkMode ? '#F8FAFC' : '#071021',
        secondary: darkMode ? '#C6D6E6' : '#41505f',
      }
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 500 },
  body1: { lineHeight: 1.6, color: darkMode ? '#E8F0FF' : '#0B1724' },
  body2: { color: darkMode ? '#AEBFD6' : '#556677' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
  MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: darkMode
              ? '0 12px 40px rgba(3,8,20,0.7)'
              : '0 4px 8px rgba(0,0,0,0.08)',
            borderRadius: 12,
            backgroundImage: darkMode ? 'linear-gradient(180deg, rgba(255,255,255,0.015), transparent)' : 'none',
            border: darkMode ? '1px solid rgba(255,255,255,0.03)' : undefined,
            backdropFilter: darkMode ? 'saturate(120%) blur(6px)' : undefined
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : undefined,
            borderRadius: 10,
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : undefined,
          }),
          input: ({ theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
          })
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : undefined,
          })
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : undefined,
          })
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
          })
        }
      },
      MuiAlert: {
        styleOverrides: {
          standardError: ({ theme }) => ({
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : undefined,
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : undefined,
          }),
          root: ({ theme }) => ({
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
          })
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        variants: [
          {
            props: { variant: 'contained' },
              style: ({ ownerState, theme }) => ({
                background: theme.palette.mode === 'dark' ? 'linear-gradient(90deg, rgba(124,147,255,0.12), rgba(255,210,125,0.06))' : undefined,
                // Use the theme text color (guaranteed) instead of a hard-coded dark color which
                // can produce poor contrast and unexpected values for MUI color helpers.
                color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
              })
          }
        ]
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: darkMode ? 'linear-gradient(180deg, rgba(10,16,28,0.75), rgba(16,22,34,0.75))' : undefined,
            border: darkMode ? '1px solid rgba(255,255,255,0.03)' : undefined,
          }
        }
      },
    },
  });

  // Runtime safeguard: ensure commonly-used palette colors are always defined.
  // This prevents passing `undefined` into MUI color helpers (alpha/decomposeColor).
  try {
    // Provide minimal fallbacks for commonly used keys
    theme.palette = {
      ...theme.palette,
      primary: { ...(theme.palette.primary || {}), main: theme.palette?.primary?.main || '#7C93FF' },
      secondary: { ...(theme.palette.secondary || {}), main: theme.palette?.secondary?.main || '#FFD27D' },
      background: { ...(theme.palette.background || {}), default: theme.palette?.background?.default || (darkMode ? '#071021' : '#F8F9FA'), paper: theme.palette?.background?.paper || (darkMode ? '#0B1724' : '#FFFFFF') },
      text: { ...(theme.palette.text || {}), primary: theme.palette?.text?.primary || (darkMode ? '#F8FAFC' : '#071021'), secondary: theme.palette?.text?.secondary || (darkMode ? '#C6D6E6' : '#41505f') },
    };
  } catch (e) {
    // Non-fatal: log to console for debugging in development
    // eslint-disable-next-line no-console
    console.error('Theme palette safeguard failed', e);
  }

  // Debug output to help trace undefined color issues in the browser console while developing.
  // Remove or guard in production builds if verbose logging is undesirable.
  // eslint-disable-next-line no-console
  console.debug('Theme debug:', {
    mode: theme.palette.mode,
    primary: theme.palette.primary && theme.palette.primary.main,
    textPrimary: theme.palette.text && theme.palette.text.primary,
    textSecondary: theme.palette.text && theme.palette.text.secondary,
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
