import {
  Alert,
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import theme from './theme'
import QuestionDetailPage from './pages/QuestionDetailPage'
import AskQuestionPage from './pages/AskQuestionPage'
import NotFoundPage from './pages/NotFoundPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'

/**
 * Waits for the saved session to be checked before displaying pages.
 * Connection errors show a retry option instead of assuming logout.
 */
function AppContent() {
  const { isLoading, authError } = useAuth()

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography role="status">Checking your session…</Typography>
      </Container>
    )
  }

  if (authError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">
          Could not restore your session. {authError}
        </Alert>

        {/* Reload the app to run the session check again. */}
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Try again
        </Button>
      </Container>
    )
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/ask" element={<AskQuestionPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

/** Provide the theme, routing, and shared authentication state. */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
