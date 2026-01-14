import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

interface NoFilterResultsProps {
  onClearFilters: () => void;
}

export function NoFilterResults({ onClearFilters }: NoFilterResultsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <FilterListOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" component="h2" gutterBottom>
        No matching incidents
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        No incidents match your current filters. Try adjusting your search criteria.
      </Typography>
      <Button variant="outlined" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </Box>
  );
}
