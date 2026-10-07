import { Container, Grid, Typography } from "@mui/material"
import mockQuestions from "../data/mockQuestions"
import QuestionCard from "../components/QuestionCard"
import { useState } from "react"
import SearchBar from "../components/SearchBar"

function HomePage() {
    const [searchQuery, setSearchQuery] = useState("")


    return (
        <Container component="main" maxWidth="lg" sx ={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
               Learn and share with your campus
            </Typography>

            <Typography component="p" variant="body1">
               Ask questions, share your knowledge, and learn from other students
            </Typography>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <Grid container spacing={2} sx={{ mt: 4 }}>
                {mockQuestions.map((question) => (
                    <Grid key={question._id} size={12}>
                        <QuestionCard question={question} />
                    </Grid>
                ))}
            </Grid>

      
        </Container>
    )
}

export default HomePage