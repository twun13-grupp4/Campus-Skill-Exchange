import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import theme from './theme'
import QuestionDetailPage from './pages/QuestionDetailPage'
import AskQuestionPage from './pages/AskQuestionPage'
import NotFoundPage from './pages/NotFoundPage'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <CssBaseline />
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/questions/:id" element={<QuestionDetailPage />} />
            <Route path="/ask" element={<AskQuestionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
