import { Alert, Avatar, Button, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { canDelete } from '../utils/permissions'
import { deleteAnswer } from '../api/answers'
import { getErrorMessage } from '../api/client'

/**
 * Displays one answer's author, date, upvotes, and description.
 */
function AnswerCard({ answer, onDelete }) {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const authorName = answer.author?.name ?? 'Deleted user'

  //use first letter of up to two names for the authors avatar.
  const authorInitials = authorName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase()

  // Display the date in a short format such as "20 sept".
  const formattedDate = new Date(answer.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })

  async function handleDelete() {
    if (isDeleting) return
    if (!window.confirm('Delete this answer? This cannot be undone.')) return

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteAnswer(answer._id)
      onDelete?.(answer._id)
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      setIsDeleting(false)
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 3, borderColor: '#e2e8f0' }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 1.5, alignItems: 'center' }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#dce5ff',
            color: '#294b8a',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {authorInitials}
        </Avatar>

        <Typography variant="body2" sx={{ fontWeight: 600, color: '#36558a' }}>
          {authorName}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {formattedDate}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 'auto' }}
        >
          {answer.upvotes} {answer.upvotes === 1 ? 'upvote' : 'upvotes'}
        </Typography>

        {canDelete(user, answer.author) && (
          <Button
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{ textTransform: 'none' }}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </Stack>

      <Typography
        component="p"
        variant="body1"
        color="text.primary"
        sx={{
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        }}
      >
        {answer.description}
      </Typography>

      {deleteError && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {deleteError}
        </Alert>
      )}
    </Paper>
  )
}

export default AnswerCard
