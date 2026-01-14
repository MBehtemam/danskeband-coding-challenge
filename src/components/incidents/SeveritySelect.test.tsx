import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeveritySelect, SEVERITY_OPTIONS } from './SeveritySelect';

describe('SeveritySelect', () => {
  describe('rendering', () => {
    it('renders a severity dropdown', () => {
      render(<SeveritySelect value="High" onChange={vi.fn()} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      expect(select).toBeInTheDocument();
    });

    it('displays the current severity value', () => {
      render(<SeveritySelect value="Critical" onChange={vi.fn()} />);

      expect(screen.getByRole('combobox', { name: /severity/i })).toHaveTextContent('Critical');
    });
  });

  describe('options', () => {
    it('displays all four severity options when opened', async () => {
      const user = userEvent.setup();
      render(<SeveritySelect value="High" onChange={vi.fn()} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      await user.click(select);

      // Options have chips with aria-labels like "Severity: Low"
      expect(screen.getByRole('option', { name: /low/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /medium/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /high/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /critical/i })).toBeInTheDocument();
    });

    it('exports SEVERITY_OPTIONS constant with all options', () => {
      expect(SEVERITY_OPTIONS).toEqual(['Low', 'Medium', 'High', 'Critical']);
    });
  });

  describe('interaction', () => {
    it('calls onChange when an option is selected', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SeveritySelect value="High" onChange={onChange} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      await user.click(select);

      // Options have chips with aria-labels like "Severity: Critical"
      const criticalOption = screen.getByRole('option', { name: /critical/i });
      await user.click(criticalOption);

      expect(onChange).toHaveBeenCalledWith('Critical');
    });

    it('calls onChange with correct value when selecting Low', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SeveritySelect value="High" onChange={onChange} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      await user.click(select);

      // Options have chips with aria-labels like "Severity: Low"
      const lowOption = screen.getByRole('option', { name: /low/i });
      await user.click(lowOption);

      expect(onChange).toHaveBeenCalledWith('Low');
    });
  });

  describe('disabled state', () => {
    it('disables the select when disabled prop is true', () => {
      render(<SeveritySelect value="High" onChange={vi.fn()} disabled={true} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      expect(select).toHaveAttribute('aria-disabled', 'true');
    });

    it('is enabled by default', () => {
      render(<SeveritySelect value="High" onChange={vi.fn()} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      expect(select).not.toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('accessibility', () => {
    it('has proper aria-label for accessibility', () => {
      render(<SeveritySelect value="High" onChange={vi.fn()} />);

      const select = screen.getByRole('combobox', { name: /severity/i });
      expect(select).toBeInTheDocument();
    });
  });
});
