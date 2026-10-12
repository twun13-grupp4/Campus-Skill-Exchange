import { Container, Grid, Stack, Typography } from '@mui/material'
import mockQuestions from '../data/mockQuestions'
import QuestionCard from '../components/QuestionCard'
import CategoryFilter from '../components/CategoryFilter'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Learn and share with your campus
      </Typography>

      <Typography component="p" variant="body1">
        Ask questions, share your knowledge, and learn from other students
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 3 }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter />
      </Stack>

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
