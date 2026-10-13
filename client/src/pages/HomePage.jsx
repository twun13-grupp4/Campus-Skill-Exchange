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
  const [categoryFilter, setCategoryFilter] = useState({
    school: null,
    program: null,
    course: null,
  })
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const schoolId = categoryFilter.school?._id
  const programId = categoryFilter.program?._id
  const courseId = categoryFilter.course?._id
  const search = searchQuery.trim()
  const isFiltered = Boolean(schoolId || programId || courseId || search)

  // Load questions through the API when a filter changes,
  // or after the user pauses typing in the search box for 300 ms.
  useEffect(() => {
    let isActive = true

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      setLoadError('')

      try {
        // Filters that are not set are left out of the request,
        // so no filters and an empty search load all questions.
        const data = await getQuestions({
          school: schoolId,
          program: programId,
          course: courseId,
          search: search || undefined,
        })

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

    // Cancel a pending request and ignore outdated responses.
    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }
  }, [schoolId, programId, courseId, search])

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
        <CategoryFilter onChange={setCategoryFilter} />
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

      {/* Distinguish a search or filter without results from an empty list. */}
      {!isLoading && !loadError && questions.length === 0 && (
        <Typography role="status" color="text.secondary" sx={{ mt: 4 }}>
          {isFiltered
            ? 'No questions match your search or filters.'
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
