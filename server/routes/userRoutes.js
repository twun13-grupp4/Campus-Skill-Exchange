/**
 * Routes for /api/users: register, login and the logged-in user's profile.
 */
const express = require('express')

const router = express.Router() //skapar en router för användar url:er

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/userController') //hämtar funktioner

const requireAuth = require('../middleware/requireAuth')

//kör registerUser om det kommer en POST till /api/users/register
router.post('/register', registerUser)

//kor loginUser om det kommer POST till /api/users/login
router.post('/login', loginUser)

// Return the current user's profile only when their token is valid.
router.get('/me', requireAuth, getCurrentUser)

// Update the logged-in user's name/school/program.
router.patch('/me', requireAuth, updateCurrentUser)

module.exports = router
