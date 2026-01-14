import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import danskeBankLogo from '../../assets/danske-bank-logo.svg';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  // Use md breakpoint (960px) for navigation collapse as per spec
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" component="header">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box
            component="img"
            src={danskeBankLogo}
            alt="Danske Bank"
            sx={{
              height: { xs: 24, sm: 32 },
              mr: 2,
            }}
          />
          {!isMobile && (
            <Typography variant="body1" component="span" sx={{ flexGrow: 1 }}>
              Incident Dashboard
            </Typography>
          )}
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
