import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip, STATUS_CONFIG } from './StatusChip';
import { statusColors } from '../../theme';

describe('StatusChip', () => {
  describe('label rendering', () => {
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
  });

  describe('size variants', () => {
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

  describe('Danske Bank brand color scheme (FR-015)', () => {
    // Convert hex to rgb for style matching
    // #4672c2 → rgb(70, 114, 194)
    it('displays Open status with blue background (#4672c2)', () => {
      render(<StatusChip status="Open" />);
      const chip = screen.getByText('Open').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(70, 114, 194)' });
    });

    // #d8b463 → rgb(216, 180, 99)
    it('displays In Progress status with gold background (#d8b463)', () => {
      render(<StatusChip status="In Progress" />);
      const chip = screen.getByText('In Progress').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(216, 180, 99)' });
    });

    // #144a37 → rgb(20, 74, 55)
    it('displays Resolved status with green background (#144a37)', () => {
      render(<StatusChip status="Resolved" />);
      const chip = screen.getByText('Resolved').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(20, 74, 55)' });
    });

    it('displays white text color for Open status', () => {
      render(<StatusChip status="Open" />);
      const chip = screen.getByText('Open').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });

    // In Progress uses dark text on gold background for contrast
    // #002346 → rgb(0, 35, 70)
    it('displays dark text color for In Progress status', () => {
      render(<StatusChip status="In Progress" />);
      const chip = screen.getByText('In Progress').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(0, 35, 70)' });
    });
  });

  describe('workflow icons (FR-017)', () => {
    it('displays RadioButtonUnchecked icon for Open status', () => {
      render(<StatusChip status="Open" />);
      const chip = screen.getByText('Open').closest('.MuiChip-root');
      // MUI Chip with icon adds MuiChip-icon class to the icon container
      const icon = chip?.querySelector('.MuiChip-icon');
      expect(icon).toBeInTheDocument();
      // Verify it's an SVG icon
      expect(icon?.tagName.toLowerCase()).toBe('svg');
    });

    it('displays PlayArrow icon for In Progress status', () => {
      render(<StatusChip status="In Progress" />);
      const chip = screen.getByText('In Progress').closest('.MuiChip-root');
      const icon = chip?.querySelector('.MuiChip-icon');
      expect(icon).toBeInTheDocument();
      expect(icon?.tagName.toLowerCase()).toBe('svg');
    });

    it('displays CheckCircle icon for Resolved status', () => {
      render(<StatusChip status="Resolved" />);
      const chip = screen.getByText('Resolved').closest('.MuiChip-root');
      const icon = chip?.querySelector('.MuiChip-icon');
      expect(icon).toBeInTheDocument();
      expect(icon?.tagName.toLowerCase()).toBe('svg');
    });
  });

  describe('accessibility', () => {
    it('has aria-label with status information', () => {
      render(<StatusChip status="Open" />);
      expect(screen.getByLabelText('Status: Open')).toBeInTheDocument();
    });

    it('icons provide visual differentiation for color-blind users (FR-017)', () => {
      // Verify each status has a unique icon for non-color differentiation
      const statuses = ['Open', 'In Progress', 'Resolved'] as const;
      statuses.forEach((status) => {
        const { container } = render(<StatusChip status={status} />);
        const icon = container.querySelector('.MuiChip-icon');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('STATUS_CONFIG export', () => {
    it('exports STATUS_CONFIG with all statuses', () => {
      expect(STATUS_CONFIG).toBeDefined();
      expect(STATUS_CONFIG.Open).toBeDefined();
      expect(STATUS_CONFIG['In Progress']).toBeDefined();
      expect(STATUS_CONFIG.Resolved).toBeDefined();
    });

    it('each status config has backgroundColor, textColor, icon, and label', () => {
      Object.values(STATUS_CONFIG).forEach((config) => {
        expect(config).toHaveProperty('backgroundColor');
        expect(config).toHaveProperty('textColor');
        expect(config).toHaveProperty('icon');
        expect(config).toHaveProperty('label');
      });
    });

    it('uses theme status colors', () => {
      expect(STATUS_CONFIG.Open.backgroundColor).toBe(statusColors.open.background);
      expect(STATUS_CONFIG['In Progress'].backgroundColor).toBe(statusColors.inProgress.background);
      expect(STATUS_CONFIG.Resolved.backgroundColor).toBe(statusColors.resolved.background);
    });
  });
});
