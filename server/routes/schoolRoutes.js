/**
 * Routes for /api/schools (public).
 */
const express = require('express')

const router = express.Router()

const { getSchools } = require('../controllers/schoolController')

// GET /api/schools
router.get('/', getSchools)

module.exports = router
