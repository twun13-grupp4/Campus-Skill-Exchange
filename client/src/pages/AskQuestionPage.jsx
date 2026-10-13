import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Autocomplete,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { getCourses } from '../api/schools' //hämta kurser
import { createQuestion } from '../api/questions' //spara frågan
import { getErrorMessage } from '../api/client' //visar servers fel
import { useAuth } from '../AuthContext' // vem som är inloggad

/**
 * Sida där en inloggad användare ställer en fråga i en kurs.
 * Kurserna hämtas från servern, frågan sparas med POST /api/questions.
 */
function AskQuestionPage() {
  const { user } = useAuth() // den inloggade användaren, null om utloggad
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [course, setCourse] = useState(null) // vald kurs { _id, name, school }
  const [courses, setCourses] = useState([]) // alla kurser från servern
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // hämtar kurserna en gång när sidan laddas
  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((loadError) => setError(getErrorMessage(loadError)))
  }, [])

  /**
   * Skickar frågan till servern och går till den nya frågan,
   * eller visar serverns felmeddelande om något går fel.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // stoppar att sidan laddas om
    setError('')
    setIsSubmitting(true)

    try {
      // bara kursens id skickas, servern tar reda på skolan själv
      const created = await createQuestion({
        title,
        description,
        course: course?._id,
      })
      navigate(`/questions/${created._id}`)
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  // inte inloggad -> visa länk till login i stället för formuläret
  if (!user) {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          You need to log in to ask a question.
        </Alert>
        <Button component={RouterLink} to="/login" variant="contained">
          Log in
        </Button>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Ask a question
      </Typography>

      <Stack
        component="form"
        onSubmit={handleSubmit}
        spacing={2}
        sx={{ mt: 2 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        {/* sökbar kurslista, visar "Kurs – Skola" */}
        <Autocomplete
          options={courses}
          value={course}
          onChange={(_, value) => setCourse(value)}
          getOptionLabel={(option) => `${option.name} – ${option.school.name}`}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField {...params} label="Course" required />
          )}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          required
          fullWidth
        />

        {error && <Alert severity="error">{error}</Alert>}

        {/* avstängd medan frågan skickas, så man inte postar två gånger */}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Posting…' : 'Post question'}
        </Button>
      </Stack>
    </Container>
  )
}

export default AskQuestionPage
