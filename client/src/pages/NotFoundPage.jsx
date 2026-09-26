import { Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function NotFoundPage() {
    return (
        <Container component="main" maxWidth="md" sx={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Page not found
            </Typography>

            <Button component={RouterLink} to="/" sx={{ textTransform: 'none' }}>
                ← Back to all questions
            </Button>
        </Container>
    )
}

export default NotFoundPage
