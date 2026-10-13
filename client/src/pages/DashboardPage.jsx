import { Chip, Stack, Typography } from '@mui/material'
import HomePage from './HomePage'

/**
 * Displays a preview of the logged-in homepage using mock user data.
 * Authentication will be connected in a later issue.
 */
function DashboardPage() {
  const user = {
    name: 'Alex Morgan',
  }

  const firstName = user.name.split(' ')[0]

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
