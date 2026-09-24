import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
        <CssBaseline />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
    </BrowserRouter>

  )
}

export default App
