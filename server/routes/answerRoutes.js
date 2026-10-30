/**
 * Routes for /api/answers.
 * Creating and listing answers lives under /api/questions/:id/answers.
 */
const express = require('express')

const router = express.Router()

const { deleteAnswer } = require('../controllers/answerController')
const { getAnswerAuthor } = require('../services/answerService')
const requireAuth = require('../middleware/requireAuth')
const requireOwnerOrModerator = require('../middleware/requireOwnerOrModerator')

// DELETE /api/answers/:id - author or moderator only
router.delete(
  '/:id',
  requireAuth,
  requireOwnerOrModerator(getAnswerAuthor),
  deleteAnswer,
)

module.exports = router
