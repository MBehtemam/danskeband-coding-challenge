import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveButton } from './SaveButton';

describe('SaveButton', () => {
  it('renders with default "Save" text', () => {
    render(<SaveButton onClick={vi.fn()} disabled={false} loading={false} />);

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders with custom children text', () => {
    render(
      <SaveButton onClick={vi.fn()} disabled={false} loading={false}>
        Save Changes
      </SaveButton>
    );

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<SaveButton onClick={vi.fn()} disabled={true} loading={false} />);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('is disabled when loading prop is true', () => {
    render(<SaveButton onClick={vi.fn()} disabled={false} loading={true} />);

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<SaveButton onClick={vi.fn()} disabled={false} loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SaveButton onClick={onClick} disabled={false} loading={false} />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(<SaveButton onClick={onClick} disabled={true} loading={false} />);

    // Disabled buttons have pointer-events: none in MUI, so we verify
    // the button is disabled and onClick wasn't called
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();

    // Try to click - should not trigger onClick due to disabled state
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has accessible button label', () => {
    render(<SaveButton onClick={vi.fn()} disabled={false} loading={false} />);

    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toHaveAccessibleName();
  });

  it('uses contained variant when not disabled (visual emphasis)', () => {
    const { container } = render(
      <SaveButton onClick={vi.fn()} disabled={false} loading={false} />
    );

    // MUI adds MuiButton-contained class for contained variant
    expect(container.querySelector('.MuiButton-contained')).toBeInTheDocument();
  });
});
