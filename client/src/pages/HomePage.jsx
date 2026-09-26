import { Container, Stack, Typography } from "@mui/material"
import mockQuestions from "../data/mockQuestions"
import QuestionCard from "../components/QuestionCard"

function HomePage() {
    return (
        <Container component="main" maxWidth="lg" sx ={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
               Learn and share with your campus
            </Typography>

            <Typography component="p" variant="body1">
               Ask questions, share your knowledge, and learn from other students
            </Typography>

            <Stack spacing={2} sx={{ mt : 4 }}>
                {mockQuestions.map((question) => (<QuestionCard key={question._id} question={question}/>
            ))}
            </Stack>
      
        </Container>
    )
}

export default HomePage