import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../AuthContext'
import { getSchools, getPrograms } from '../api/schools'
import { updateCurrentUser } from '../api/users'
import { getErrorMessage } from '../api/client'

/** Graduation-cap icon, used next to the user's school. */
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

/** Envelope icon, used next to the user's email. */
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
 * Edit form for name/school/program. A separate component from ProfilePage
 * so it's mounted fresh each time editing opens - its state (including the
 * school/program options fetch) starts clean for free, instead of being
 * reset inside an effect tied to an isEditing flag.
 */
function ProfileEditForm({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name)
  const [school, setSchool] = useState(user.school._id)
  const [program, setProgram] = useState(user.program._id)

  const [schools, setSchools] = useState([])
  const [programs, setPrograms] = useState([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Only show programs offered at the selected school.
  const availablePrograms = programs.filter((item) =>
    item.schools.some((offeredAt) => offeredAt._id === school),
  )

  // Load school/program options once, when the form mounts.
  useEffect(() => {
    let ignore = false

    Promise.all([getSchools(), getPrograms()])
      .then(([schoolData, programData]) => {
        if (ignore) return
        setSchools(schoolData)
        setPrograms(programData)
      })
      .catch((error) => {
        if (!ignore) setOptionsError(getErrorMessage(error))
      })
      .finally(() => {
        if (!ignore) setIsLoadingOptions(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  function handleSchoolChange(event) {
    setSchool(event.target.value)
    setProgram('') // the old program may not belong to the new school
  }

  async function handleSave(event) {
    event.preventDefault()

    if (isSaving) return

    setIsSaving(true)
    setSaveError('')

    try {
      const updatedUser = await updateCurrentUser({
        name: name.trim(),
        school,
        program,
      })

      onSave(updatedUser)
    } catch (error) {
      setSaveError(getErrorMessage(error))
      setIsSaving(false)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSave} spacing={2} sx={{ width: '100%' }}>
      {optionsError && (
        <Alert severity="error">
          Could not load schools and programs. {optionsError}
        </Alert>
      )}

      <TextField
        label="Full name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        fullWidth
      />

      <TextField
        label="School"
        select
        slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
        value={school}
        onChange={handleSchoolChange}
        disabled={isLoadingOptions || Boolean(optionsError)}
        required
        fullWidth
      >
        <option value="" aria-label="Choose a school" />
        {schools.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </TextField>

      <TextField
        label="Program"
        select
        slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
        value={program}
        onChange={(event) => setProgram(event.target.value)}
        disabled={!school || isLoadingOptions || Boolean(optionsError)}
        helperText={!school ? 'Please choose a school first' : ''}
        required
        fullWidth
      >
        <option value="" aria-label="Choose a program" />
        {availablePrograms.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </TextField>

      {saveError && <Alert severity="error">{saveError}</Alert>}

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={isSaving || !name.trim() || !school || !program}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>

        <Button
          onClick={onCancel}
          disabled={isSaving}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  )
}

/**
 * Simple profile page using only data the backend already exposes via
 * /users/me - name, email, role, school, program. No bio/skills/rating/
 * stats yet (not on the API). Name, school, and program can be edited;
 * role and email cannot.
 */
function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  // Require a logged-in user to display the profile.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  function handleStartEditing() {
    setSaved(false)
    setIsEditing(true)
  }

  function handleSaved(updatedUser) {
    updateUser(updatedUser)
    setIsEditing(false)
    setSaved(true)
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
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

          {!isEditing ? (
            <>
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

              <Button
                variant="outlined"
                onClick={handleStartEditing}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                Edit profile
              </Button>

              {saved && (
                <Alert severity="success" sx={{ width: '100%' }}>
                  Your profile has been updated.
                </Alert>
              )}
            </>
          ) : (
            <ProfileEditForm
              key={user._id}
              user={user}
              onSave={handleSaved}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default ProfilePage
