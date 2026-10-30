const answerService = require('../services/answerService') // all databaslogik för svar ligger här

/**
 * GET /api/questions/:id/answers
 * Hämtar alla svar till en fråga, flest upvotes först.
 */
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await answerService.listAnswers(req.params.id)

    // null = ogiltigt id-format (en tom lista [] betyder bara att ingen har svarat än)
    if (!answers) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json(answers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch answers' })
  }
}

/**
 * POST /api/questions/:id/answers (kräver inloggning)
 * Skapar ett svar på frågan, author = den inloggade användaren.
 */
const createAnswer = async (req, res) => {
  try {
    const { description } = req.body // bara texten tas från body, fråga och author bestäms av servern

    const answer = await answerService.createAnswer(
      req.params.id, // frågans id från url:en
      description,
      req.user, // satt av requireAuth
    )

    // null = frågan finns inte
    if (!answer) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.status(201).json(answer) // 201 = skapad
  } catch (error) {
    // Mongoose kastar ValidationError om description saknas (required i modellen)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    console.error(error)
    res.status(500).json({ message: 'Could not create answer' })
  }
}

/**
 * DELETE /api/answers/:id
 * Removes the answer. Allowed for the author or a moderator (enforced by
 * requireOwnerOrModerator before this runs).
 */
const deleteAnswer = async (req, res) => {
  try {
    await answerService.deleteAnswer(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not delete answer' })
  }
}

module.exports = { getAnswersByQuestion, createAnswer, deleteAnswer }
