import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { lightTheme, darkTheme } from './theme';
import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';
import './index.css';
import App from './App.tsx';
import { initMockApi } from './api';

// Initialize mock API to intercept fetch requests
initMockApi();

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

/**
 * AppWithTheme - Wrapper component that provides dynamic theme switching
 */
function AppWithTheme() {
  const { mode, systemMode } = useThemeMode();

  // Resolve active mode (system preference or explicit mode)
  const activeMode = mode === 'system' ? systemMode : mode;

  // Select theme based on active mode
  const theme = useMemo(
    () => (activeMode === 'dark' ? darkTheme : lightTheme),
    [activeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AppWithTheme />
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
