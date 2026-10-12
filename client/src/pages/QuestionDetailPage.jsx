import { Avatar, Button, Chip, Container, Stack, Paper, Typography } from '@mui/material'
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

  const authorInitials = question.author
     .trim()
     .split(/\s+/)
     .slice(0, 2)
     .map((name) => name[0])
     .join('')
     .toUpperCase()

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
            {question.courseTag}
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
            {question.author}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Stack>

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
    </Container>
  )
}
export default QuestionDetailPage
