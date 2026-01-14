import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityChip, SEVERITY_CONFIG } from './SeverityChip';

describe('SeverityChip', () => {
  describe('label rendering', () => {
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
  });

  describe('size variants', () => {
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

  describe('urgency color scheme (FR-016)', () => {
    it('displays Low severity with green background (#4CAF50)', () => {
      render(<SeverityChip severity="Low" />);
      const chip = screen.getByText('Low').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(76, 175, 80)' });
    });

    it('displays Medium severity with blue background (#2196F3)', () => {
      render(<SeverityChip severity="Medium" />);
      const chip = screen.getByText('Medium').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(33, 150, 243)' });
    });

    it('displays High severity with orange background (#FF9800)', () => {
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(255, 152, 0)' });
    });

    it('displays Critical severity with red background (#F44336)', () => {
      render(<SeverityChip severity="Critical" />);
      const chip = screen.getByText('Critical').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    });

    it('displays white text color for contrast', () => {
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });
  });

  describe('visual distinction from status chips (FR-014)', () => {
    it('does not use blue colors (reserved for status)', () => {
      // High severity should be orange, not blue
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      // Should NOT be blue (#42A5F5, #1E88E5, #1565C0)
      expect(chip).not.toHaveStyle({ backgroundColor: 'rgb(66, 165, 245)' });
      expect(chip).not.toHaveStyle({ backgroundColor: 'rgb(30, 136, 229)' });
      expect(chip).not.toHaveStyle({ backgroundColor: 'rgb(21, 101, 192)' });
    });

    it('severity chips do not have icons (unlike status chips)', () => {
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      const icon = chip?.querySelector('.MuiChip-icon');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has aria-label with severity information', () => {
      render(<SeverityChip severity="High" />);
      expect(screen.getByLabelText('Severity: High')).toBeInTheDocument();
    });
  });

  describe('SEVERITY_CONFIG export', () => {
    it('exports SEVERITY_CONFIG with all severities', () => {
      expect(SEVERITY_CONFIG).toBeDefined();
      expect(SEVERITY_CONFIG.Low).toBeDefined();
      expect(SEVERITY_CONFIG.Medium).toBeDefined();
      expect(SEVERITY_CONFIG.High).toBeDefined();
      expect(SEVERITY_CONFIG.Critical).toBeDefined();
    });

    it('each severity config has color and label', () => {
      Object.values(SEVERITY_CONFIG).forEach((config) => {
        expect(config).toHaveProperty('color');
        expect(config).toHaveProperty('label');
      });
    });
  });
});
