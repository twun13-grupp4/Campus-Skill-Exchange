import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getQuestions } from '../api/questions'
import { getErrorMessage } from '../api/client'
import QuestionCard from '../components/QuestionCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'

/**
 * Displays search, category filters, and question cards.
 * Optional children appear above the homepage content.
 */
function HomePage({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Search through the API after the user pauses typing for 300 ms.
  useEffect(() => {
    let isActive = true

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      setLoadError('')

      try {
        const search = searchQuery.trim()

        // An empty search loads all questions.
        // MongoDB handles matching titles and descriptions.
        const data = await getQuestions(search ? { search } : {})

        if (isActive) {
          setQuestions(data)
        }
      } catch (error) {
        if (isActive) {
          setLoadError(getErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }, 300)

    // Cancel a pending search and ignore outdated responses.
    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }
  }, [searchQuery])

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      {/* Display the dashboard welcome message when provided. */}
      {children}
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

      {isLoading && (
        <Stack sx={{ mt: 4, alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      )}

      {!isLoading && loadError && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {loadError}
        </Alert>
      )}

      {/* Distinguish an unsuccessful search from an empty question list. */}
      {!isLoading && !loadError && questions.length === 0 && (
        <Typography role="status" color="text.secondary" sx={{ mt: 4 }}>
          {searchQuery.trim()
            ? 'No matching questions. Try another word from the title or description.'
            : 'No questions yet — be the first to ask one.'}
        </Typography>
      )}

      {!isLoading && !loadError && questions.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {questions.map((question) => (
            <Grid key={question._id} size={12}>
              <QuestionCard question={question} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default HomePage
