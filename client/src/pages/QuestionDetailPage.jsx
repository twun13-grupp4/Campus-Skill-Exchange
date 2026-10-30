import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Paper,
  Typography,
  Alert,
  TextField,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getQuestion,
  getAnswers,
  createAnswer,
  deleteQuestion,
} from '../api/questions'
import { getErrorMessage } from '../api/client'
import AnswerCard from '../components/AnswerCard'
import { useAuth } from '../AuthContext'
import { canDelete } from '../utils/permissions'

/**
 * Reads the id from the URL and remounts QuestionDetailContent whenever it
 * changes, so loading/error/question/answers reset to their initial values
 * for free instead of being reset manually inside an effect.
 */
function QuestionDetailPage() {
  const { id } = useParams()
  return <QuestionDetailContent key={id} id={id} />
}

/**
 * Displays a question's course, status, author, date, and description.
 */
function QuestionDetailContent({ id }) {
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  // Store the answer draft while the user writes.
  const [answerText, setAnswerText] = useState('')
  const { user } = useAuth()

  // Track answer submission separately from loading the question.
  const [isPostingAnswer, setIsPostingAnswer] = useState(false)
  const [answerError, setAnswerError] = useState('')
  const [answerPosted, setAnswerPosted] = useState(false)

  //fetch the question + its answers
  useEffect(() => {
    let isActive = true // guard against setting state after this was cleaned up

    Promise.all([getQuestion(id), getAnswers(id)])
      .then(([questionData, answerData]) => {
        if (!isActive) return
        setQuestion(questionData)
        setAnswers(answerData)
      })
      .catch((fetchError) => {
        if (!isActive) return
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

  /**
   * Saves an answer and adds the returned record to the displayed list.
   * Keeps the draft if submission fails.
   */
  async function handlePostAnswer(event) {
    event.preventDefault()

    if (isPostingAnswer) return

    setAnswerError('')
    setAnswerPosted(false)

    if (!user) {
      setAnswerError('Please log in to post an answer.')
      return
    }

    const description = answerText.trim()

    if (!description) {
      setAnswerError('Please write an answer before posting.')
      return
    }

    setIsPostingAnswer(true)

    try {
      const savedAnswer = await createAnswer(id, description)

      // Match the backend ordering: most upvotes, then oldest first.
      setAnswers((previous) =>
        [...previous, savedAnswer].sort(
          (a, b) =>
            b.upvotes - a.upvotes ||
            new Date(a.createdAt) - new Date(b.createdAt),
        ),
      )

      setAnswerText('')
      setAnswerPosted(true)
    } catch (error) {
      setAnswerError(getErrorMessage(error))
    } finally {
      setIsPostingAnswer(false)
    }
  }

  /** Deletes the question (author or moderator only) and returns home. */
  async function handleDeleteQuestion() {
    if (isDeleting) return
    if (!window.confirm('Delete this question? This cannot be undone.')) return

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteQuestion(id)
      navigate('/', { replace: true })
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <Container
        component="main"
        maxWidth="md"
        sx={{ py: 6, textAlign: 'center' }}
      >
        <CircularProgress />
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

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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

            {canDelete(user, question.author) && (
              <Button
                size="small"
                color="error"
                onClick={handleDeleteQuestion}
                disabled={isDeleting}
                sx={{ textTransform: 'none' }}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            )}
          </Stack>
        </Stack>

        {deleteError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}

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
            alignItems: 'center',
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
      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography component="h2" variant="h6">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </Typography>

        {answers.length === 0 ? (
          <Typography color="text.secondary">
            No answers yet - be the first to help.
          </Typography>
        ) : (
          answers.map((answer) => (
            <AnswerCard
              key={answer._id}
              answer={answer}
              onDelete={(deletedId) =>
                setAnswers((previous) =>
                  previous.filter((item) => item._id !== deletedId),
                )
              }
            />
          ))
        )}
      </Stack>

      {/* Write and submit an answer below the existing answers. */}
      <Paper
        component="form"
        onSubmit={handlePostAnswer}
        variant="outlined"
        sx={{
          mt: 3,
          p: 3.5,
          borderRadius: 3,
          borderColor: '#e2e8f0',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          sx={{ mb: 2.5, fontWeight: 700 }}
        >
          Share what you know
        </Typography>

        <TextField
          id="answer-description"
          label="Your answer"
          value={answerText}
          disabled={!user || isPostingAnswer}
          onChange={(event) => {
            setAnswerText(event.target.value)
            setAnswerError('')
            setAnswerPosted(false)
          }}
          multiline
          rows={5}
          required
          fullWidth
          helperText="Explain your reasoning and keep it constructive."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Guests can read answers, but must log in to post one. */}
        {!user && (
          <Alert
            severity="info"
            sx={{ mt: 2 }}
            action={
              <Button component={RouterLink} to="/login" color="inherit">
                Log in
              </Button>
            }
          >
            Log in to share an answer.
          </Alert>
        )}

        {answerError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {answerError}
          </Alert>
        )}

        {answerPosted && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your answer has been posted.
          </Alert>
        )}

        <Stack direction="row" sx={{ mt: 2.5, justifyContent: 'flex-end' }}>
          {/* Prevent empty answers and repeated clicks while saving. */}
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={!user || isPostingAnswer || !answerText.trim()}
            sx={{
              px: 2.5,
              py: 1.25,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#373ee5',
              '&:hover': {
                bgcolor: '#2c32bd',
              },
            }}
          >
            {isPostingAnswer ? 'Posting…' : 'Post answer'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
export default QuestionDetailPage
