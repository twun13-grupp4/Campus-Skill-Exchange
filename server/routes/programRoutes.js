/**
 * Routes for /api/programs (public).
 */
const express = require('express')

const router = express.Router()

const { getPrograms } = require('../controllers/schoolController')

// GET /api/programs?school=<schoolId>
router.get('/', getPrograms)

module.exports = router
