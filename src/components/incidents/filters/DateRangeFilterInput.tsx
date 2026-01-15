import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type { DateFilterState, DateFilterOperator } from '../../../types/filters';

interface DateRangeFilterInputProps {
  value: DateFilterState;
  onChange: (value: DateFilterState) => void;
}

const OPERATOR_OPTIONS: { value: DateFilterOperator; label: string }[] = [
  { value: 'gt', label: 'After' },
  { value: 'lt', label: 'Before' },
  { value: 'between', label: 'Between' },
];

/**
 * Custom date range filter component with operator dropdown and date picker(s).
 * Supports greater than, less than, and between date comparisons.
 */
export function DateRangeFilterInput({ value, onChange }: DateRangeFilterInputProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate date range when values change
  useEffect(() => {
    if (value.operator === 'between' && value.startDate && value.endDate) {
      const start = dayjs(value.startDate);
      const end = dayjs(value.endDate);
      if (end.isBefore(start)) {
        setValidationError('End date must be after or equal to start date');
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [value]);

  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    const newOperator = event.target.value as DateFilterOperator | '';
    onChange({
      operator: newOperator || null,
      startDate: value.startDate,
      endDate: newOperator === 'between' ? value.endDate : null,
    });
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    onChange({
      ...value,
      startDate: date?.isValid() ? date.format('YYYY-MM-DD') : null,
    });
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    onChange({
      ...value,
      endDate: date?.isValid() ? date.format('YYYY-MM-DD') : null,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 1, minWidth: 220 }}>
      {/* Operator dropdown */}
      <FormControl size="small" fullWidth>
        <InputLabel id="date-filter-operator-label">Filter by</InputLabel>
        <Select
          labelId="date-filter-operator-label"
          id="date-filter-operator"
          value={value.operator ?? ''}
          label="Filter by"
          onChange={handleOperatorChange}
        >
          <MenuItem value="">
            <em>No filter</em>
          </MenuItem>
          {OPERATOR_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Start date picker (shown when operator is selected) */}
      {value.operator && (
        <DatePicker
          label={value.operator === 'between' ? 'Start date' : 'Date'}
          value={value.startDate ? dayjs(value.startDate) : null}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      )}

      {/* End date picker (shown only for 'between' operator) */}
      {value.operator === 'between' && (
        <DatePicker
          label="End date"
          value={value.endDate ? dayjs(value.endDate) : null}
          onChange={handleEndDateChange}
          minDate={value.startDate ? dayjs(value.startDate) : undefined}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              error: !!validationError,
            },
          }}
        />
      )}

      {/* Validation error message */}
      {validationError && (
        <FormHelperText error sx={{ mx: 0 }}>
          {validationError}
        </FormHelperText>
      )}
    </Box>
  );
}

export { OPERATOR_OPTIONS };
