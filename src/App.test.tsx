import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import App from './App';
import * as useIncidentsHook from './hooks/useIncidents';
import * as useUsersHook from './hooks/useUsers';

vi.mock('./hooks/useIncidents');
vi.mock('./hooks/useUsers');

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renders the incident dashboard', () => {
    vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useIncidentsHook.useIncidents>);
    vi.mocked(useIncidentsHook.useCreateIncident).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useIncidentsHook.useCreateIncident>);
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsersHook.useUsers>);

    renderWithProviders(<App />);

    expect(screen.getByText('Incident Dashboard')).toBeInTheDocument();
  });
});
