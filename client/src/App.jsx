import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuestionDetailPage from './pages/QuestionDetailPage'

function App() {
  return (
    <BrowserRouter>
        <CssBaseline />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/question/:id" element={<QuestionDetailPage />} />
        </Routes>
    </BrowserRouter>

  )
}

export default App
