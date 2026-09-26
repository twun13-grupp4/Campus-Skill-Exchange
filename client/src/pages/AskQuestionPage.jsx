import { useState } from 'react'
import { Alert, Button, Container, Stack, TextField, Typography } from '@mui/material'

//titel-fätet
function AskQuestionPage() 
{
    const [title, setTitle] = useState('')
    
    //kurs-fätet
    const [courseTag, setCourseTag] = useState('')

    //beskrivningsfältet
    const [description, setDescription] = useState('')

    //håller koll om formuläret har skickats in
    const [submitted, setSubmitted] = useState(false)

    //stoppar webbläsaren att ladd om vid submit 
    const handleSubmit = (event) => {
    event.preventDefault()

    //mock
    console.log({ title, courseTag, description})

    setSubmitted(true)
}

    return (
        <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Ask a question
            </Typography>

            <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 2 }}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Course"
                    value={courseTag}
                    onChange={(e) => setCourseTag(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    Submit
                </Button>

                {submitted && (
                    // visas bara efter att formuläret skickats in
                    <Alert severity="success">
                        Question submitted (mock only, not saved yet)
                    </Alert>
                )}
            </Stack>
        </Container>
    )
}

export default AskQuestionPage