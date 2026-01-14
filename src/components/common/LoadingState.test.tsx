import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders a loading spinner', () => {
    render(<LoadingState />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders loading text by default', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<LoadingState text="Loading incidents..." />);

    expect(screen.getByText('Loading incidents...')).toBeInTheDocument();
  });
});
