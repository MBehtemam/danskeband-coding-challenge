import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssigneeSelect } from '../../../../src/components/incidents/AssigneeSelect';
import type { User } from '../../../../src/api/types';

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

describe('AssigneeSelect', () => {
  const mockOnChange = vi.fn();

  afterEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with correct assignee value', () => {
    render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    expect(select).toBeInTheDocument();
    expect(select).toHaveAccessibleName(/assignee/i);
  });

  it('renders "Unassigned" when value is null', async () => {
    const user = userEvent.setup();
    render(
      <AssigneeSelect
        value={null}
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.click(select);

    const unassignedOption = screen.getByRole('option', { name: /unassigned/i });
    expect(unassignedOption).toBeInTheDocument();
  });

  it('displays all user options from users prop', async () => {
    const user = userEvent.setup();
    render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.click(select);

    expect(screen.getByRole('option', { name: /unassigned/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alice Johnson' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bob Smith' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Charlie Brown' })).toBeInTheDocument();
  });

  it('calls onChange with selected assignee ID', async () => {
    const user = userEvent.setup();
    render(
      <AssigneeSelect
        value={null}
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.click(select);

    const bobOption = screen.getByRole('option', { name: 'Bob Smith' });
    await user.click(bobOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('user-2');
  });

  it('calls onChange with null when unassigned is selected', async () => {
    const user = userEvent.setup();
    render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.click(select);

    const unassignedOption = screen.getByRole('option', { name: /unassigned/i });
    await user.click(unassignedOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('respects disabled prop', () => {
    render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
        disabled
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    expect(select).toHaveAttribute('aria-disabled', 'true');
  });

  it('is not disabled by default', () => {
    render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    expect(select).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('handles empty users array gracefully', async () => {
    const user = userEvent.setup();
    render(
      <AssigneeSelect
        value={null}
        onChange={mockOnChange}
        users={[]}
      />
    );

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.click(select);

    // Should still show "Unassigned" option
    expect(screen.getByRole('option', { name: /unassigned/i })).toBeInTheDocument();
  });

  it('applies fullWidth prop correctly', () => {
    const { container } = render(
      <AssigneeSelect
        value="user-1"
        onChange={mockOnChange}
        users={mockUsers}
        fullWidth
      />
    );

    const formControl = container.querySelector('.MuiFormControl-root');
    expect(formControl).toHaveClass('MuiFormControl-fullWidth');
  });
});
