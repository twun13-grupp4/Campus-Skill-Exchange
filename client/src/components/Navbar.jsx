import { AppBar, Box, Button, Container, Toolbar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import DashboardNavbar from './DashboardNavbar'
import { useAuth } from '../AuthContext'
import Logo from './Logo'

/**
 * Top navigation bar.
 * Shows the DashboardNavbar for logged-in users, otherwise the public bar
 * with log in and sign up links.
 */
function Navbar() {
  const { user } = useAuth()

  // Show the account navbar whenever a user is logged in.
  if (user) {
    return <DashboardNavbar />
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 76 } }}>
          {/* Return to the public homepage. */}
          <Logo to="/" />

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              sx={{
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Log in
            </Button>

            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              disableElevation
              sx={{
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#373ee5',
                color: '#ffffff',
                borderRadius: '12px',
                px: 2.5,
                py: 1.25,
                '&:hover': {
                  bgcolor: '#2c32bd',
                },
              }}
            >
              Sign up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
