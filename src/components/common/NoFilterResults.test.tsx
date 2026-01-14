import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoFilterResults } from './NoFilterResults';

describe('NoFilterResults', () => {
  it('renders the default message', () => {
    render(<NoFilterResults onClearFilters={() => {}} />);

    expect(screen.getByText('No matching incidents')).toBeInTheDocument();
    expect(
      screen.getByText('No incidents match your current filters. Try adjusting your search criteria.'),
    ).toBeInTheDocument();
  });

  it('renders clear filters button', () => {
    render(<NoFilterResults onClearFilters={() => {}} />);

    expect(screen.getByRole('button', { name: 'Clear Filters' })).toBeInTheDocument();
  });

  it('calls onClearFilters when button is clicked', () => {
    const handleClear = vi.fn();
    render(<NoFilterResults onClearFilters={handleClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
