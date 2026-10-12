const express = require('express');

const router = express.Router(); 
//skapar router (lista där vi kopplar url:er till funktioner)

const { getQuestions, getQuestionById, createQuestion } = require ('../controllers/questionController'); //hämtar funktionen
const { getAnswersByQuestion } = require('../controllers/answerController')

// kör getQuestions om det kommer en GET
router.get('/', getQuestions); 

// kör getQuestionById om det kommer en GET med id
router.get('/:id', getQuestionById)

router.get('/:id/answers', getAnswersByQuestion)

// kör createQuestion om det kommer en POST
router.post('/', createQuestion);


module.exports = router;