const express = require('express')

const router = express.Router()
//skapar router (lista där vi kopplar url:er till funktioner)

const {
  getQuestions,
  getQuestionById,
  createQuestion,
} = require('../controllers/questionController') //hämtar funktionen
const {
  getAnswersByQuestion,
  createAnswer,
} = require('../controllers/answerController')

const requireAuth = require('../middleware/requireAuth') //kollar inlogg

// kör getQuestions om det kommer en GET
router.get('/', getQuestions)

// kör createAnswer om det kommer en POST till /api/questions/:id/answers, men bara om man är inloggad
router.post('/:id/answers', requireAuth, createAnswer)

// kör getQuestionById om det kommer en GET med id
router.get('/:id', getQuestionById)

router.get('/:id/answers', getAnswersByQuestion)

// kör createQuestion om det kommer en POST
router.post('/', requireAuth, createQuestion)

module.exports = router
