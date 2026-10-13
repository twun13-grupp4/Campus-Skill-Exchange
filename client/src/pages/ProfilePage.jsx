import { Navigate } from "react-router-dom";
import { Chip,  Container, Paper, Stack, SvgIcon, Typography } from "@mui/material";
import { useAuth } from'../AuthContext'

function SchoolIcon(props) {
    return (
        <SvgIcon {...props}>
        <path
            d="M12 3 1 9l11 6 9-4.91V17h2V9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5 13.18v4.72c0 1 3 3 7 3s7-2 7-3v-4.72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </SvgIcon>
    )
}

function MailIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m3 6 9 7 9-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

/**
 * Simple profile page using only data the backend already exposes via
 * /users/me - name, email, role, school, program. No bio/skills/rating/
 * stats yet (not on the API), so those aren't shown instead of faked.
 */
function ProfilePage() {
  const { user } = useAuth()

  // Require a logged-in user to display the profile.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase()

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        variant="outlined"
        sx={{ p: 4, borderRadius: 4, borderColor: '#e2e8f0' }}
      >
        <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Stack
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#dce5ff',
              color: '#294b8a',
              fontSize: '1.5rem',
              fontWeight: 700,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initials}
          </Stack>

          <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>

            <Chip
              label={user.role}
              size="small"
              sx={{
                textTransform: 'capitalize',
                bgcolor: '#eef0ff',
                color: '#394867',
              }}
            />

            <Typography color="text.secondary">{user.program.name}</Typography>
          </Stack>

          <Stack spacing={1.5} sx={{ width: '100%', mt: 1 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography color="text.secondary">{user.school.name}</Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <MailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography color="text.secondary">{user.email}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export default ProfilePage