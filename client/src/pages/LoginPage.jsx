import { useState } from 'react'
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

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)

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
                       YOUR CAMPUS COMMUNITY

                    </Typography>

                    <Typography
                       component="h1"
                       variant="h4"
                       sx={{ mt: 1, fontWeight: 700 }}
                    >
                        Welcome Back

                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Log in to ask questions and share your knowledge.

                    </Typography>
                </Box>

                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                    <TextField
                       id="login-email"
                       name="email"
                       label="Email Address"
                       type="email"
                       autoComplete="username"
                       value={email}
                       onChange={(event) => {
                        setEmail(event.target.value)
                        setSubmitted(false)
                       }}
                       required
                       fullWidth
                    />

                    <TextField
                       id="login-password"
                       name="password"
                       label="Password"
                       type={showPassword ? 'text' : 'password'}
                       autoComplete="current-password"
                       value={password}
                       onChange={(event) => {
                        setPassword(event.target.value)
                        setSubmitted(false)
                       }}
                       required
                       fullWidth
                    />

                    <FormControlLabel
                       control={
                        <Checkbox
                           checked={showPassword}
                           onChange={(event) => 
                            setShowPassword(event.target.checked)
                           }
                        /> 
                       }
                       label="Show Password"
                    />

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
                        Log in
                    </Button>

                    {submitted && (
                        <Alert severity="info">
                            This form is a demo. Login is not connected yet.
                        </Alert>
                    )}
                </Stack>

              </Stack>
            </Paper>
        </Container>
    )
}

export default LoginPage