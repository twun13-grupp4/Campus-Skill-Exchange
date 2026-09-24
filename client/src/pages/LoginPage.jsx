import { Container, Typography } from '@mui/material'

function LoginPage() {
    return (
        <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Log in
            </Typography>

            <Typography component="p" variant="body1" color="text.secondary">
                Welcome back to CampusSkillExchange
            </Typography>

        </Container>
    )
}

export default LoginPage