/**
 * Routes for /api/courses (public).
 */
const express = require('express')

const router = express.Router()

const { getCourses } = require('../controllers/schoolController')

// GET /api/courses?school=<schoolId>
router.get('/', getCourses)

module.exports = router
