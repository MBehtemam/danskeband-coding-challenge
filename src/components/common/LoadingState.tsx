import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = 'Loading...' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      <CircularProgress size={48} sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
