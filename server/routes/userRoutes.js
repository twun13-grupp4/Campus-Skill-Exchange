const express = require('express')

const router = express.Router() //skapar en router för användar url:er

const {registerUser, loginUser} = require('../controllers/userController') //hämtar funktioner

//kör registerUser om det kommer en POST till /api/users/register
router.post('/register', registerUser)

//kor loginUser om det kommer POST till /api/users/login
router.post('/login', loginUser)

module.exports = router