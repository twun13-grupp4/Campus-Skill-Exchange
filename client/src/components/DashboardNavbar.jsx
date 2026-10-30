import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import Logo from './Logo'
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Stack,
  SvgIcon,
  Toolbar,
  Typography,
  Box,
  Divider,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'

/**
 * Displays the logged-in user's profile and account navigation.
 * Both logout buttons clear the session and return to the homepage.
 * Notifications, profile, and messages are not connected yet.
 */
function DashboardNavbar() {
  // Store the clicked profile button so the menu opens beneath it.
  const [profileAnchor, setProfileAnchor] = useState(null)
  const isProfileOpen = Boolean(profileAnchor)
  // Control whether the sidebar is visible.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { user, endSession } = useAuth()
  const navigate = useNavigate()

  // Build the avatar initials from the logged-in user's name.
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase()

  /** Close the profile menu when dismissed. */
  function closeProfileMenu() {
    setProfileAnchor(null)
  }

  /** Clear the session and return to the public homepage. */
  function handleLogout() {
    setProfileAnchor(null)
    setIsSidebarOpen(false)
    endSession()
    navigate('/', { replace: true })
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
        <Toolbar disableGutters sx={{ minHeight: 76 }}>
          {/* Return to the homepage. */}
          <Logo to="/" />

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ ml: 'auto', alignItems: 'center' }}
          >
            {/* Open the question form from the dashboard navbar. */}
            <Button
              component={RouterLink}
              to="/ask"
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
              Ask a question
            </Button>

            {/* Notification indicator; clicking has no action yet. */}
            <IconButton aria-label="Notifications">
              <SvgIcon>
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </SvgIcon>
            </IconButton>

            {/* Open the profile dropdown beneath the avatar. */}
            <Button
              id="profile-menu-button"
              aria-label={`Open ${user.name}'s profile menu`}
              aria-controls={isProfileOpen ? 'profile-menu' : undefined}
              aria-haspopup="menu"
              aria-expanded={isProfileOpen ? 'true' : undefined}
              onClick={(event) => setProfileAnchor(event.currentTarget)}
              sx={{
                minWidth: 0,
                gap: 1,
                borderRadius: 2,
                color: 'text.secondary',
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#dce5ff',
                  color: '#394867',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>

              <SvgIcon sx={{ fontSize: 18 }}>
                <path
                  d="m7 10 5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </SvgIcon>
            </Button>

            {/* Open the sidebar navigation preview. */}
            <IconButton
              aria-label="Open sidebar"
              aria-controls={isSidebarOpen ? 'dashboard-sidebar' : undefined}
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
            >
              <SvgIcon>
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </SvgIcon>
            </IconButton>
          </Stack>
        </Toolbar>
        {/* Profile menu with account details and logout. */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchor}
          open={isProfileOpen}
          onClose={closeProfileMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                width: 220,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
              },
            },
            list: {
              'aria-labelledby': 'profile-menu-button',
            },
          }}
        >
          <Box role="presentation" sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: 'capitalize' }}
            >
              {user.role}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            component={RouterLink}
            to="/profile"
            onClick={closeProfileMenu}
            sx={{ py: 1.25 }}
          >
            My profile
          </MenuItem>

          <MenuItem sx={{ py: 1.25 }}>Messages</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
            Log out
          </MenuItem>
        </Menu>

        {/* Sidebar navigation; only logout is connected so far. */}
        <Drawer
          anchor="right"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: 290,
                p: 2,
              },
            },
          }}
        >
          <Box
            id="dashboard-sidebar"
            component="nav"
            aria-label="Campus navigation"
          >
            <Stack
              direction="row"
              sx={{
                mb: 3,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Your campus</Typography>

              <IconButton
                aria-label="Close sidebar"
                onClick={() => setIsSidebarOpen(false)}
              >
                <SvgIcon>
                  <path
                    d="m6 6 12 12M6 18 18 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </SvgIcon>
              </IconButton>
            </Stack>

            <List disablePadding>
              <ListItemButton
                selected
                sx={{
                  py: 1.25,
                  '&.Mui-selected': {
                    bgcolor: '#eef0ff',
                  },
                }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>

              <ListItemButton sx={{ py: 1.25 }}>
                <ListItemText primary="Questions" />
              </ListItemButton>

              <ListItemButton sx={{ py: 1.25 }}>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </List>

            <Divider sx={{ my: 2 }} />

            <List disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                onClick={() => setIsSidebarOpen(false)}
                sx={{ py: 1.25 }}
              >
                <ListItemText primary="My profile" />
              </ListItemButton>

              <ListItemButton onClick={handleLogout} sx={{ py: 1.25 }}>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Container>
    </AppBar>
  )
}

export default DashboardNavbar
