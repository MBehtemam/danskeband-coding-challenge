import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" component="header">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <ReportProblemIcon sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 20, sm: 24 } }} />
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            component="h1"
            sx={{ flexGrow: 1 }}
          >
            Incident Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
