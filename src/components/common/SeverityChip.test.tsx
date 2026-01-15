import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityChip, SEVERITY_CONFIG } from './SeverityChip';
import { severityColors } from '../../theme';

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

  describe('Danske Bank brand urgency color scheme (FR-016)', () => {
    // #144a37 → rgb(20, 74, 55)
    it('displays Low severity with green background (#144a37)', () => {
      render(<SeverityChip severity="Low" />);
      const chip = screen.getByText('Low').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(20, 74, 55)' });
    });

    // #d8b463 → rgb(216, 180, 99)
    it('displays Medium severity with gold background (#d8b463)', () => {
      render(<SeverityChip severity="Medium" />);
      const chip = screen.getByText('Medium').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(216, 180, 99)' });
    });

    // #cd6e42 → rgb(205, 110, 66)
    it('displays High severity with orange background (#cd6e42)', () => {
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(205, 110, 66)' });
    });

    // #7d3218 → rgb(125, 50, 24)
    it('displays Critical severity with dark red background (#7d3218)', () => {
      render(<SeverityChip severity="Critical" />);
      const chip = screen.getByText('Critical').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(125, 50, 24)' });
    });

    it('displays white text color for High severity', () => {
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });

    // Medium uses dark text on gold background for contrast
    // #002346 → rgb(0, 35, 70)
    it('displays dark text color for Medium severity', () => {
      render(<SeverityChip severity="Medium" />);
      const chip = screen.getByText('Medium').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(0, 35, 70)' });
    });
  });

  describe('visual distinction from status chips (FR-014)', () => {
    it('does not use blue status colors', () => {
      // High severity should be orange, not blue
      render(<SeverityChip severity="High" />);
      const chip = screen.getByText('High').closest('.MuiChip-root');
      // Should NOT be the status blue colors
      expect(chip).not.toHaveStyle({ backgroundColor: 'rgb(70, 114, 194)' });
      expect(chip).not.toHaveStyle({ backgroundColor: 'rgb(216, 180, 99)' }); // gold is for in progress
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

    it('each severity config has backgroundColor, textColor, and label', () => {
      Object.values(SEVERITY_CONFIG).forEach((config) => {
        expect(config).toHaveProperty('backgroundColor');
        expect(config).toHaveProperty('textColor');
        expect(config).toHaveProperty('label');
      });
    });

    it('uses theme severity colors', () => {
      expect(SEVERITY_CONFIG.Low.backgroundColor).toBe(severityColors.low.background);
      expect(SEVERITY_CONFIG.Medium.backgroundColor).toBe(severityColors.medium.background);
      expect(SEVERITY_CONFIG.High.backgroundColor).toBe(severityColors.high.background);
      expect(SEVERITY_CONFIG.Critical.backgroundColor).toBe(severityColors.critical.background);
    });
  });
});
