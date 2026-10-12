const Question = require('../models/Question') //hämta fråge-modellen
require('../models/User') // registrerar User-modellen så populate('author') funkar
const mongoose = require('mongoose') // för att kolla om ett id är giltigt

/**
 * GET /api/questions
 * Hämtar alla frågor från databasen, nyast först
 */
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find() //hämta alla frågor
      .populate('author', 'name') //byt ut author-id mot användarens nam
      .sort({ createdAt: -1 }) //nyast först

    res.json(questions) //skicka listan till JSON
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
    const { id } = req.params //plockar ut id:n från url:en

    //ogiltigt id-formatl(t.ex "abc") -> finns inte
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Question not found' })
    }
    const question = await Question.findById(id) //leta upp frågan
      .populate('author', 'name')

    //giltigt id men ingen fråga med id:t
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
 * skapar ny fråga och sparar den i database. author = inloggade användaren
 */
const createQuestion = async (req, res) => {
  try {
    //plocka bara ut de fält vi tillåter
    const { title, description, courseTag, school } = req.body

    //skapa och spara frågan i databasem
    const question = await Question.create({
      title,
      description,
      courseTag,
      school,
      author: req.user._id, //inloggade användare
    })

    res.status(201).json(question) //201 = skapad, skicka tillbaka den sparade frågan
  } catch (error) {
    //fält saknas eller fel format
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message }) //400 dålig förfrågan av användaren
    }

    console.error(error)
    res.status(500).json({ message: 'Could not create question' })
  }
}

module.exports = { getQuestions, getQuestionById, createQuestion } //gör funktonen shareble
