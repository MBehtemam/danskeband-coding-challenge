import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityChip } from './SeverityChip';

describe('SeverityChip', () => {
  it('renders Low severity with correct label', () => {
    render(<SeverityChip severity="Low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders Medium severity with correct label', () => {
    render(<SeverityChip severity="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders High severity with correct label', () => {
    render(<SeverityChip severity="High" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders Critical severity with correct label', () => {
    render(<SeverityChip severity="Critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('applies small size by default', () => {
    render(<SeverityChip severity="High" />);
    const chip = screen.getByText('High').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeSmall');
  });

  it('applies medium size when specified', () => {
    render(<SeverityChip severity="High" size="medium" />);
    const chip = screen.getByText('High').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeMedium');
  });
});
