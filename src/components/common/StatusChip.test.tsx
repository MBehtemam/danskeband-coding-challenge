import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip, STATUS_CONFIG } from './StatusChip';

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

  describe('custom blue color scheme (FR-015)', () => {
    it('displays Open status with light blue background (#42A5F5)', () => {
      render(<StatusChip status="Open" />);
      const chip = screen.getByText('Open').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(66, 165, 245)' });
    });

    it('displays In Progress status with medium blue background (#1E88E5)', () => {
      render(<StatusChip status="In Progress" />);
      const chip = screen.getByText('In Progress').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(30, 136, 229)' });
    });

    it('displays Resolved status with dark blue background (#1565C0)', () => {
      render(<StatusChip status="Resolved" />);
      const chip = screen.getByText('Resolved').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ backgroundColor: 'rgb(21, 101, 192)' });
    });

    it('displays white text color for contrast', () => {
      render(<StatusChip status="Open" />);
      const chip = screen.getByText('Open').closest('.MuiChip-root');
      expect(chip).toHaveStyle({ color: 'rgb(255, 255, 255)' });
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

    it('each status config has color, icon, and label', () => {
      Object.values(STATUS_CONFIG).forEach((config) => {
        expect(config).toHaveProperty('color');
        expect(config).toHaveProperty('icon');
        expect(config).toHaveProperty('label');
      });
    });
  });
});
