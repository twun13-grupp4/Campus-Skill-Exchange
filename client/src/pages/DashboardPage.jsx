import { Chip, Stack, Typography } from '@mui/material'
import HomePage from './HomePage'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

/**
 * Displays the logged-in user's welcome message and question listing.
 * Visitors without a session are redirected to login.
 */
function DashboardPage() {
  const { user } = useAuth()

  // Require a logged-in user to display the dashboard.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Use the actual account name in the welcome message.
  const firstName = user.name.trim().split(/\s+/)[0]

  return (
    <HomePage>
      {/* Welcome message and semester label */}
      <Stack
        direction="row"
        sx={{
          mb: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            A campus full of possibilities
          </Typography>

          <Typography
            component="h1"
            sx={{ fontSize: '1.5rem', fontWeight: 700 }}
          >
            Good to see you, {firstName}.
          </Typography>
        </Stack>

        <Chip
          label="Fall semester 2026"
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            borderColor: '#e2e8f0',
            borderRadius: 1.5,
            color: 'text.secondary',
          }}
        />
      </Stack>
    </HomePage>
  )
}

export default DashboardPage
