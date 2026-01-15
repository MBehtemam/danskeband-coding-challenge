import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ThemeContextProvider } from '../../contexts/ThemeContext';

function renderWithRouter(ui: React.ReactNode, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeContextProvider>
        {ui}
      </ThemeContextProvider>
    </MemoryRouter>
  );
}

describe('AppLayout', () => {
  it('renders children correctly', () => {
    renderWithRouter(
      <AppLayout>
        <div data-testid="child">Test Content</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders header with title on dashboard', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
      { route: '/' }
    );
    expect(screen.getByText('Incident Dashboard')).toBeInTheDocument();
  });

  it('renders header with title on developer page', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
      { route: '/developer' }
    );
    expect(screen.getByText('Developer Settings')).toBeInTheDocument();
  });

  it('renders main element for content', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders header as banner landmark', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows Developer Settings button on dashboard', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
      { route: '/' }
    );
    expect(screen.getByRole('link', { name: /developer settings/i })).toBeInTheDocument();
  });

  it('shows Dashboard button on developer page', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
      { route: '/developer' }
    );
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders theme switcher button', () => {
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });
});
