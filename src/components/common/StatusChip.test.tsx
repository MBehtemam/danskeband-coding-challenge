import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('renders Open status with correct label', () => {
    render(<StatusChip status="Open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders In Progress status with correct label', () => {
    render(<StatusChip status="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders Resolved status with correct label', () => {
    render(<StatusChip status="Resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('applies small size by default', () => {
    render(<StatusChip status="Open" />);
    const chip = screen.getByText('Open').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeSmall');
  });

  it('applies medium size when specified', () => {
    render(<StatusChip status="Open" size="medium" />);
    const chip = screen.getByText('Open').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeMedium');
  });
});
