const questionService = require('../services/questionService')

/**
 * GET /api/questions?school=&program=&course=&status=&search=
 * Hämtar frågor, nyast först. Alla filter är valfria och kombineras (AND).
 */
const getQuestions = async (req, res) => {
  try {
    const { school, program, course, status, search } = req.query
    const questions = await questionService.listQuestions({
      school,
      program,
      course,
      status,
      search,
    })
    res.json(questions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch questions' }) //500 = serverfel
  }
}

/**
 * GET /api/questions/:id
 * Hämtar en enskild fråga med id
 */
const getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestion(req.params.id)

    //ogiltigt id eller ingen fråga med id:t
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json(question)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch question' })
  }
}

/**
 * POST /api/questions
 * Skapar ny fråga. author = inloggade användaren, school = kursens skola
 */
const createQuestion = async (req, res) => {
  try {
    //plocka bara ut de fält vi tillåter, course = id från GET /api/courses
    const { title, description, course } = req.body

    const question = await questionService.createQuestion(
      { title, description, course },
      req.user,
    )

    //kursen finns inte
    if (!question) {
      return res.status(400).json({ message: 'Invalid course' })
    }

    res.status(201).json(question) //201 = skapad
  } catch (error) {
    //fält saknas eller fel format
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message }) //400 = dålig förfrågan
    }

    console.error(error)
    res.status(500).json({ message: 'Could not create question' })
  }
}

module.exports = { getQuestions, getQuestionById, createQuestion }
