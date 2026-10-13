import { Avatar, Button, Chip, CircularProgress, Container, Stack, Paper, Typography, Alert } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getQuestion, getAnswers} from '../api/questions'
import { getErrorMessage } from '../api/client'
import AnswerCard from '../components/AnswerCard'


/**
 * Displays a question's course, status, author, date, and description.
 */
function QuestionDetailPage() {
  const { id } = useParams()

  // Find the question that matches the ID in the page URL.
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  //fetch the question + its answer wherever the id in the URL changes
  useEffect(() => {
    let isActive = true // guard against setting state after this was cleaned up
    setIsLoading(true)
    setLoadError('')

    Promise.all([getQuestion(id), getAnswers(id)])
      .then(([questionData, answerData]) => {
        if(!isActive) return
        setQuestion(questionData)
        setAnswers(answerData)
      })
      .catch((fetchError) => {
        if(!isActive) return
        if (fetchError.response?.status !== 404) {
          setLoadError(getErrorMessage(fetchError))
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

      return () => {
        isActive = false
      }
  }, [id])

  if (isLoading) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 6, textAlign: 'center'}}>
        <CircularProgress/>
      </Container>
    )
  }

  if (loadError) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button component={RouterLink} to="/" sx={{ textTransform: 'none' }}>
          ← Back to all questions
        </Button>
      </Container>
    )
  }
  
  // Show a fallback page if the question does not exist.
  if (!question) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Question not found!
        </Typography>

        <Button component={RouterLink} to="/" sx={{ textTransform: 'none' }}>
          ← Back to all questions
        </Button>

      </Container>
    )
  }

  const isAnswered = question.status === 'answered'

  // author/course are populated objects now, and may be null if deleted
  const authorName = question.author?.name ?? 'Deleted user'
  const courseName = question.course?.name ?? 'Uncategorized'

  // use the first letters of up to two names for authors avatar.
  const authorInitials = authorName
     .trim()
     .split(/\s+/)
     .slice(0, 2)
     .map((name) => name[0])
     .join('')
     .toUpperCase()

  // Display the date in a short format, such as "20 Sept".
  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
    },
  )

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/"
        sx={{ mb: 2, textTransform: 'none' }}
      >
        ← Back to all questions
      </Button>

      <Paper
        component="article"
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          borderColor: '#e2e8f0',
          bgcolor: 'background.paper',
        }}
      >

        {/* Course name and answer status */}
        <Stack
          direction="row"
          sx={{ 
            mb: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
         }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#444ce7', fontWeight: 600 }}
          >
            {courseName}
          </Typography>

          <Chip
            label={isAnswered ? '✓ Answered' : 'Unanswered'}
            size="small"
            sx={{
              borderRadius: 1,
              bgcolor: isAnswered ? '#edf7f0' : '#f1f3f8',
              color: isAnswered ? '#288057' : '#64748b',
              fontSize: '0.75rem',
            }}
          />
        </Stack>

        <Typography 
          component="h1" 
          sx={{
            mb: 3,
            fontSize: '1.875rem',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'text.primary',
            overflowWrap: 'anywhere',
          }}
        >
          {question.title}
        </Typography>

        {/* Author details, aligned vertically with the avatar */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ 
            mb: 3,
            alignItems:'center',
           }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: '#dce5ff',
              color: '#294b8a',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {authorInitials}
          </Avatar>

          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#36558a' }}
          >
            {authorName}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Stack>

        {/* Preserve line breaks in the question description */}
        <Typography
          component="p"
          variant="body1"
          color="text.primary"
          sx={{
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {question.description}
        </Typography>
      </Paper>
      {/* Answers */}
      <Stack spacing={2} sx={{ mt: 4}}>
        <Typography component="h2" variant="h6">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </Typography>
        
        {answers.length === 0 ? (
          <Typography color="text.secondary">
            No answers yet - be the first to help.
          </Typography>
        ) : (
          answers.map((answer) => <AnswerCard key={answer._id} answer={answer}/>)
        )}
      </Stack>
    </Container>
  )
}
export default QuestionDetailPage
