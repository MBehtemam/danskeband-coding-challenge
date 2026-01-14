import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders children correctly', () => {
    render(
      <AppLayout>
        <div data-testid="child">Test Content</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders header with title', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByText('Incident Dashboard')).toBeInTheDocument();
  });

  it('renders main element for content', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders header as banner landmark', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
