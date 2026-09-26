const express = require('express');

const router = express.Router(); 
//skapar router (lista där vi kopplar url:er till funktioner)

const { getQuestions, createQuestion } = require ('../controllers/questionController'); //lånar funktionen

// kör getQuestions om det kommer en GET
router.get('/', getQuestions); 

// kör createQuestion om det kommer en POST
router.post('/', createQuestion);


module.exports = router;