import { Container, CssBaseline, Typography } from '@mui/material'


function App() {
  return (
    <>
      <CssBaseline />

      <Container component="main" maxWidth="lg" sx ={{ py: 4}}>
        <Typography component="h1" variant="h4" gutterBottom>
          <strong>Campus</strong>SkillExchange
        </Typography>

        <Typography component="p" variant="body1">
          Ask questions, share your knowledge, and learn from other students
        </Typography>
      
      </Container>
    
    </>
    
  )
}

export default App
