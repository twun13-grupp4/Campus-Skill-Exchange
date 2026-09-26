import { Button, Chip, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import mockQuestions from '../data/mockQuestions'

function QuestionDetailPage() {
  const { id } = useParams()
  const question = mockQuestions.find((q) => q._id === id)

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

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/"
        sx={{ mb: 2, textTransform: 'none' }}
      >
        ← Back to all questions
      </Button>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={question.courseTag} size="small" />
        <Chip
          label={isAnswered ? 'Answered' : 'Unanswered'}
          size="small"
          variant="outlined"
          color={isAnswered ? 'success' : 'default'}
        />
      </Stack>

      <Typography component="h1" variant="h4" gutterBottom>
        {question.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Asked by {question.author} ·{' '}
        {new Date(question.createdAt).toLocaleDateString()}
      </Typography>

      <Typography component="p" variant="body1">
        {question.description}
      </Typography>
    </Container>
  )
}
export default QuestionDetailPage
