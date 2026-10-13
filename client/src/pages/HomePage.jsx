import { Alert, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
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
  const courseId = categoryFilter.course?._id
  const isFiltered = Boolean(schoolId || courseId)

  useEffect(() => {
    let isActive = true

    getQuestions({school: schoolId, course: courseId})
      .then((data) => {
        if (!isActive) return
        setQuestions(data)
        setLoadError('')
      })
      .catch((fetchError) => {
        if(!isActive) return
        setLoadError(getErrorMessage(fetchError))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

      return () => {
        isActive = false
      }
  }, [schoolId, courseId])

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
        <Stack sx={{ mt: 4, alignItems: 'center'}}>
          <CircularProgress />
        </Stack>
      )}

      {!isLoading && loadError && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {loadError}
        </Alert>
      )}

      {!isLoading && !loadError && questions.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          {isFiltered 
          ? 'No question match this filter.' 
          : 'No questions yet - be the first one to ask one.'}
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
