import { useState } from 'react'
import  { Link as RouterLink } from 'react-router-dom'
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


const programsBySchool = {
    'School of Engineering': [
        'Computer Science',
        'Industrial Design',
    ],
    'International Business School': [
        'International Management',
        'Marketing Management',
    ],

}


function SignUpPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [program, setProgram] = useState('')
    const [school, setSchool] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const availablePrograms = programsBySchool[school] || []

    const handleSchoolChange = (event) => {
        setSchool(event.target.value)
        setProgram('') // Reset program when school changes
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setSubmitted(true)
    }

    return (
        <Container component="main" maxWidth="sm" sx={{ py: {xs: 4, sm: 8} }}>
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

                    <Stack
                        component="form"
                        onSubmit={handleSubmit}
                        onChange={() => setSubmitted(false)}
                        spacing={2}
                    >
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
                            required
                            fullWidth
                        >
                            <option value="" aria-label="Choose a school" />
                            {Object.keys(programsBySchool).map((schoolName) => (
                                <option key={schoolName} value={schoolName}>
                                    {schoolName}
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
                            disabled={!school}
                            helperText={!school ? 'Please choose a school first' : ''}
                            required
                            fullWidth
                        >
                            <option value="" aria-label="Choose a program" />
                            {availablePrograms.map((programName) => (
                                <option key={programName} value={programName}>
                                    {programName}
                                </option>
                            ))}

                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disableElevation
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                            }}
                        >
                            Create account
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

                        {submitted && (
                            <Alert severity="info">
                                This form is a demo. No account has been created.
                            </Alert>
                        )}
                    </Stack> 

                </Stack>

            </Paper>
        
        </Container>
    )

}

export default SignUpPage