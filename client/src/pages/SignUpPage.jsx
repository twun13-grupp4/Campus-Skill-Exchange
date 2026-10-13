import { useEffect, useState } from 'react'
import { getSchools, getPrograms } from '../api/schools'
import { getErrorMessage } from '../api/client'
import { register } from '../api/users'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
} from '@mui/material'

function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [program, setProgram] = useState('')
  const [school, setSchool] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  // Track the signup request and show any server error.
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Store the database options and their loading state.
  const [schools, setSchools] = useState([])
  const [programs, setPrograms] = useState([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState('')

  // Only show programs belonging to the selected school.
  const availablePrograms = programs.filter(
    (item) => item.school._id === school,
  )

  // Load dropdown options when the signup page opens.
  useEffect(() => {
    let ignore = false

    async function loadOptions() {
      try {
        const [schoolData, programData] = await Promise.all([
          getSchools(),
          getPrograms(),
        ])

        if (!ignore) {
          setSchools(schoolData)
          setPrograms(programData)
        }
      } catch (error) {
        if (!ignore) {
          setOptionsError(getErrorMessage(error))
        }
      } finally {
        if (!ignore) {
          setIsLoadingOptions(false)
        }
      }
    }

    loadOptions()

    // Ignore responses if the user leaves the page before they arrive.
    return () => {
      ignore = true
    }
  }, [])

  const handleSchoolChange = (event) => {
    setSchool(event.target.value)
    setProgram('') // Reset program when school changes
  }

  /**
   * Creates an account using the selected school and program IDs.
   * The register helper saves the token after a successful response.
   */
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Prevent another submission while saving or after success.
    if (isSubmitting || submitted) return

    setSubmitError('')

    if (!fullName.trim() || !school || !program) {
      setSubmitError('Please enter your name and select a school and program.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
        school,
        program,
      })

      setSubmitted(true)
      setPassword('')
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          borderColor: '#e2e8f0',
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: 2 }}
            >
              MAKE YOURSELF AT HOME
            </Typography>

            <Typography
              component="h1"
              variant="h4"
              sx={{ mt: 1, fontWeight: 700 }}
            >
              Join your campus
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create a profile and bring your skills to the conversation.
            </Typography>
          </Box>

          {/* Explain why the school and program options could not load. */}
          {optionsError && (
            <Alert severity="error">
              Could not load schools and programs. {optionsError}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={2}>
            <TextField
              id="signup-name"
              name="fullName"
              label="Full Name"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              fullWidth
            />

            <TextField
              id="signup-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />

            <TextField
              id="signup-password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                />
              }
              label="Show Password"
            />

            <TextField
              id="signup-school"
              name="school"
              label="School"
              select
              slotProps={{ select: { native: true } }}
              value={school}
              onChange={handleSchoolChange}
              disabled={isLoadingOptions || Boolean(optionsError)}
              helperText={isLoadingOptions ? 'Loading schools…' : ''}
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
              id="signup-program"
              name="program"
              label="Program"
              select
              slotProps={{ select: { native: true } }}
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

            <Button
              type="submit"
              variant="contained"
              size="large"
              disableElevation
              disabled={
                isSubmitting ||
                submitted ||
                isLoadingOptions ||
                Boolean(optionsError) ||
                !school ||
                !program
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Already have an account?{' '}
              </Typography>

              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                Log in
              </Button>
            </Box>

            {/* Show the backend error or confirm successful registration. */}
            {submitError && <Alert severity="error">{submitError}</Alert>}

            {submitted && (
              <Alert severity="success">
                Your account has been created successfully.
              </Alert>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export default SignUpPage
