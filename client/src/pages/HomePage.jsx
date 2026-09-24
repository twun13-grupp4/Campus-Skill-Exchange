import { Container, Typography } from "@mui/material"

function HomePage() {
    return (
        <Container component="main" maxWidth="lg" sx ={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
               Learn and share with your campus
            </Typography>

            <Typography component="p" variant="body1">
               Ask questions, share your knowledge, and learn from other students
            </Typography>
      
        </Container>
    )
}

export default HomePage