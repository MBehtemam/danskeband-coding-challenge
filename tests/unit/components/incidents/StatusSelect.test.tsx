import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusSelect } from '../../../../src/components/incidents/StatusSelect';
import type { IncidentStatus } from '../../../../src/api/types';

describe('StatusSelect', () => {
  const mockOnChange = vi.fn();

  afterEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with correct status value', () => {
    render(<StatusSelect value="Open" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox', { name: /status/i });
    expect(select).toBeInTheDocument();
    expect(select).toHaveAccessibleName(/status/i);
  });

  it('displays all status options', async () => {
    const user = userEvent.setup();
    render(<StatusSelect value="Open" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox', { name: /status/i });
    await user.click(select);

    // Options are rendered as StatusChips with aria-labels
    expect(screen.getByRole('option', { name: /open/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /resolved/i })).toBeInTheDocument();
  });

  it('calls onChange when status changes', async () => {
    const user = userEvent.setup();
    render(<StatusSelect value="Open" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox', { name: /status/i });
    await user.click(select);

    const resolvedOption = screen.getByRole('option', { name: /resolved/i });
    await user.click(resolvedOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Resolved');
  });

  it('respects disabled prop', () => {
    render(<StatusSelect value="Open" onChange={mockOnChange} disabled />);

    const select = screen.getByRole('combobox', { name: /status/i });
    expect(select).toHaveAttribute('aria-disabled', 'true');
  });

  it('is not disabled by default', () => {
    render(<StatusSelect value="Open" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox', { name: /status/i });
    expect(select).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('handles all status values correctly', async () => {
    const statuses: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

    for (const status of statuses) {
      const { unmount } = render(<StatusSelect value={status} onChange={mockOnChange} />);

      const select = screen.getByRole('combobox', { name: /status/i });
      expect(select).toBeInTheDocument();

      unmount();
    }
  });

  it('applies fullWidth prop correctly', () => {
    const { container } = render(
      <StatusSelect value="Open" onChange={mockOnChange} fullWidth />
    );

    const formControl = container.querySelector('.MuiFormControl-root');
    expect(formControl).toHaveClass('MuiFormControl-fullWidth');
  });
});
