import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import danskeBankLogo from '../../assets/danske-bank-logo.svg';
import { ThemeSwitcher } from './ThemeSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  // Use md breakpoint (960px) for navigation collapse as per spec
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isDeveloperPage = location.pathname === '/developer';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" component="header" sx={{ width: '100%' }}>
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            maxWidth: 'xl',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 }
          }}
        >
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                component="img"
                src={danskeBankLogo}
                alt="Danske Bank"
                sx={{
                  height: { xs: 24, sm: 32 },
                  mr: 2,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }}
              />
            </Box>
            {!isMobile && (
              <Typography variant="body1" component="span" sx={{ flexGrow: 1 }}>
                {isDeveloperPage ? 'Developer Settings' : 'Incident Dashboard'}
              </Typography>
            )}
            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Navigation buttons */}
            {isMobile ? (
              // Mobile: Icon buttons
              isDeveloperPage ? (
                <IconButton
                  component={Link}
                  to="/"
                  color="inherit"
                  aria-label="Back to Dashboard"
                >
                  <HomeIcon />
                </IconButton>
              ) : (
                <IconButton
                  component={Link}
                  to="/developer"
                  color="inherit"
                  aria-label="Developer Settings"
                >
                  <SettingsIcon />
                </IconButton>
              )
            ) : (
              // Desktop: Text buttons
              isDeveloperPage ? (
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  startIcon={<HomeIcon />}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/developer"
                  color="inherit"
                  startIcon={<SettingsIcon />}
                >
                  Developer Settings
                </Button>
              )
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
